"use server";

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";

async function requireAdmin ()
{
    const session = await getSession();
    if ( !session?.user?.admin )
    {
        throw new Error( "Unauthorized" );
    }
    return session;
}

export async function getAdminCustomers ()
{
    try
    {
        await requireAdmin();
        const users = await prisma.user.findMany( {
            where: { admin: false },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true,
                        addresses: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        } );
        return {
            success: true as const,
            data: users.map( ( user ) => ( {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                createdAt: user.createdAt.toISOString(),
                orderCount: user._count.orders,
                addressCount: user._count.addresses
            } ) )
        };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to load customers"
        };
    }
}

export async function getAdminOrders ()
{
    try
    {
        await requireAdmin();
        const orders = await prisma.order.findMany( {
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                items: true
            },
            orderBy: { createdAt: "desc" }
        } );
        return {
            success: true as const,
            data: orders.map( ( order ) => ( {
                id: order.id,
                status: order.status,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                total: order.total.toString(),
                createdAt: order.createdAt.toISOString(),
                address: {
                    houseNumber: order.houseNumber,
                    addressLine: order.addressLine,
                    city: order.city,
                    pincode: order.pincode
                },
                customer: order.user,
                items: order.items.map( ( item ) => ( {
                    name: item.itemName,
                    quantity: item.quantity,
                    amount: item.amount,
                    unit: item.unit,
                    finalPrice: item.finalPrice.toString()
                } ) )
            } ) )
        };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to load orders"
        };
    }
}

export async function getAdminDashboardData ()
{
    try
    {
        await requireAdmin();

        const now = new Date();
        const indiaTime = new Date( now.getTime() + 330 * 60 * 1000 );
        const todayStart = new Date( Date.UTC(
            indiaTime.getUTCFullYear(),
            indiaTime.getUTCMonth(),
            indiaTime.getUTCDate()
        ) - 330 * 60 * 1000 );
        const tomorrowStart = new Date( todayStart.getTime() + 24 * 60 * 60 * 1000 );
        const todayFilter = { createdAt: { gte: todayStart, lt: tomorrowStart } };

        const [ earnings, pendingOrders, preparingOrders, cancelledOrders, recentOrders, lowStockItems ] = await Promise.all( [
            prisma.order.aggregate( {
                where: { ...todayFilter, status: { not: "CANCELLED" } },
                _sum: { total: true }
            } ),
            prisma.order.count( { where: { ...todayFilter, status: "PENDING" } } ),
            prisma.order.count( { where: { ...todayFilter, status: "PREPARING" } } ),
            prisma.order.count( { where: { ...todayFilter, status: "CANCELLED" } } ),
            prisma.order.findMany( {
                take: 10,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    status: true,
                    total: true,
                    createdAt: true,
                    user: { select: { name: true } },
                    items: { select: { itemName: true, quantity: true } }
                }
            } ),
            prisma.items.findMany( {
                where: { stockQuantity: { lt: 5 } },
                orderBy: { stockQuantity: "asc" },
                select: {
                    id: true,
                    name: true,
                    stockQuantity: true,
                    unit: true
                }
            } )
        ] );

        return {
            success: true as const,
            data: {
                todayEarnings: earnings._sum.total?.toString() ?? "0",
                pendingOrders,
                preparingOrders,
                cancelledOrders,
                recentOrders: recentOrders.map( ( order ) => ( {
                    id: order.id,
                    status: order.status,
                    total: order.total.toString(),
                    createdAt: order.createdAt.toISOString(),
                    customerName: order.user.name,
                    items: order.items.map( ( item ) => ( {
                        name: item.itemName,
                        quantity: item.quantity
                    } ) )
                } ) ),
                lowStockItems
            }
        };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to load dashboard"
        };
    }
}

const nextOrderStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING: "PREPARING",
    PREPARING: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED"
};

export async function advanceOrderStatus ( orderId: string )
{
    try
    {
        await requireAdmin();
        await prisma.$transaction( async ( transaction: Prisma.TransactionClient ) =>
        {
            const order = await transaction.order.findUnique( {
                where: { id: orderId },
                select: { status: true }
            } );
            if ( !order )
            {
                throw new Error( "Order not found" );
            }
            const nextStatus = nextOrderStatus[ order.status ];
            if ( !nextStatus )
            {
                throw new Error( "This order cannot be advanced further" );
            }
            const result = await transaction.order.updateMany( {
                where: { id: orderId, status: order.status },
                data: { status: nextStatus }
            } );
            if ( result.count !== 1 )
            {
                throw new Error( "Order status changed. Refresh and try again." );
            }
            return nextStatus;
        } );

        return { success: true as const };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to update order"
        };
    }
}

export async function cancelOrderByAdmin ( orderId: string )
{
    try
    {
        await requireAdmin();
        await prisma.$transaction( async ( transaction ) =>
        {
            const order = await transaction.order.findUnique( {
                where: { id: orderId },
                select: { status: true }
            } );
            if ( !order )
            {
                throw new Error( "Order not found" );
            }
            if ( order.status === "DELIVERED" || order.status === "CANCELLED" )
            {
                throw new Error( "This order can no longer be cancelled" );
            }

            const result = await transaction.order.updateMany( {
                where: { id: orderId, status: order.status },
                data: { status: "CANCELLED" }
            } );
            if ( result.count !== 1 )
            {
                throw new Error( "Order status changed. Refresh and try again." );
            }

            const orderItems = await transaction.orderItem.findMany( {
                where: { orderId },
                select: { itemId: true, quantity: true }
            } );
            for ( const item of orderItems )
            {
                if ( item.itemId )
                {
                    await transaction.items.update( {
                        where: { id: item.itemId },
                        data: { stockQuantity: { increment: item.quantity } }
                    } );
                }
            }
        } );

        return { success: true as const };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to cancel order"
        };
    }
}
