"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { getDiscountedPrice } from "@/lib/utils/pricing";

async function getOrderInput ( transaction: Prisma.TransactionClient, userId: string, addressId: string )
{
    const address = await transaction.address.findFirst( {
        where: { id: addressId, userId, pincode: "273163" }
    } );
    if ( !address )
    {
        throw new Error( "Select a valid delivery address" );
    }

    const cart = await transaction.cart.findUnique( {
        where: { userId },
        include: {
            cartItems: {
                include: { item: true }
            }
        }
    } );
    if ( !cart?.cartItems.length )
    {
        throw new Error( "Your cart is empty" );
    }

    const pricedItems = cart.cartItems.map( ( cartItem ) =>
    {
        const price = getDiscountedPrice(
            cartItem.item.price.toString(),
            cartItem.item.discount?.toString() ?? null
        );
        return {
            cartItem,
            originalPrice: Number( cartItem.item.price.toString() ),
            discountPercent: Number( cartItem.item.discount?.toString() ?? 0 ),
            finalPrice: price.discountedPrice
        };
    } );
    const totalPaise = pricedItems.reduce(
        ( sum, entry ) => sum + Math.round( entry.finalPrice * 100 ) * entry.cartItem.quantity,
        0
    );

    return { address, cart, pricedItems, totalPaise };
}

async function reserveStock ( transaction: Prisma.TransactionClient, pricedItems: Awaited<ReturnType<typeof getOrderInput>>["pricedItems"] )
{
    for ( const { cartItem } of pricedItems )
    {
        const result = await transaction.items.updateMany( {
            where: {
                id: cartItem.itemId,
                stockQuantity: { gte: cartItem.quantity }
            },
            data: {
                stockQuantity: { decrement: cartItem.quantity }
            }
        } );
        if ( result.count !== 1 )
        {
            throw new Error( `Not enough stock available for ${ cartItem.item.name }` );
        }
    }
}

async function createOrderRecord (
    transaction: Prisma.TransactionClient,
    userId: string,
    paymentMethod: "CASH_ON_DELIVERY" | "RAZORPAY",
    paymentStatus: "UNPAID" | "PENDING",
    input: Awaited<ReturnType<typeof getOrderInput>>
)
{
    return transaction.order.create( {
        data: {
            userId,
            addressId: input.address.id,
            houseNumber: input.address.houseNumber,
            addressLine: input.address.addressLine,
            city: input.address.city,
            pincode: input.address.pincode,
            total: ( input.totalPaise / 100 ).toFixed( 2 ),
            paymentMethod,
            paymentStatus,
            items: {
                create: input.pricedItems.map( ( { cartItem, originalPrice, discountPercent, finalPrice } ) => ( {
                    itemId: cartItem.itemId,
                    itemName: cartItem.item.name,
                    amount: cartItem.item.quantity.toString(),
                    unit: cartItem.item.unit,
                    quantity: cartItem.quantity,
                    originalPrice: originalPrice.toFixed( 2 ),
                    discountPercent: discountPercent.toFixed( 2 ),
                    finalPrice: finalPrice.toFixed( 2 ),
                    imageUrl: cartItem.item.imageUrl
                } ) )
            }
        },
        select: {
            id: true,
            total: true
        }
    } );
}

export async function placeCashOnDeliveryOrder ( addressId: string )
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }

        const order = await prisma.$transaction( async ( transaction ) =>
        {
            const input = await getOrderInput( transaction, session.user.id, addressId );
            await reserveStock( transaction, input.pricedItems );
            const createdOrder = await createOrderRecord(
                transaction,
                session.user.id,
                "CASH_ON_DELIVERY",
                "UNPAID",
                input
            );
            await transaction.cartItem.deleteMany( {
                where: { cartId: input.cart.id }
            } );
            return createdOrder;
        } );

        return { success: true as const, orderId: order.id };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to place order"
        };
    }
}

async function releaseOnlineReservation ( orderId: string, userId: string )
{
    await prisma.$transaction( async ( transaction ) =>
    {
        const result = await transaction.order.updateMany( {
            where: {
                id: orderId,
                userId,
                paymentMethod: "RAZORPAY",
                paymentStatus: "PENDING",
                status: "PENDING"
            },
            data: {
                status: "CANCELLED",
                paymentStatus: "FAILED"
            }
        } );
        if ( result.count !== 1 )
        {
            return;
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
}

export async function createRazorpayOrder ( addressId: string )
{
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if ( !keyId || !keySecret )
    {
        return { success: false as const, message: "Online payment is not configured yet" };
    }

    let orderId: string | null = null;
    let userId: string | null = null;
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }
        userId = session.user.id;

        const order = await prisma.$transaction( async ( transaction ) =>
        {
            const input = await getOrderInput( transaction, session.user.id, addressId );
            await reserveStock( transaction, input.pricedItems );
            return createOrderRecord( transaction, session.user.id, "RAZORPAY", "PENDING", input );
        } );
        orderId = order.id;
        const amount = Math.round( Number( order.total.toString() ) * 100 );
        const response = await fetch( "https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                Authorization: `Basic ${ Buffer.from( `${ keyId }:${ keySecret }` ).toString( "base64" ) }`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {
                amount,
                currency: "INR",
                receipt: order.id,
                notes: { appOrderId: order.id }
            } )
        } );
        const result: unknown = await response.json();
        if ( !response.ok || !result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string" )
        {
            const message = result && typeof result === "object" && "error" in result
                && result.error && typeof result.error === "object"
                && "description" in result.error && typeof result.error.description === "string"
                ? result.error.description
                : "Unable to start online payment";
            throw new Error( message );
        }

        await prisma.order.update( {
            where: { id: order.id },
            data: { razorpayOrderId: result.id }
        } );
        return {
            success: true as const,
            keyId,
            orderId: order.id,
            razorpayOrderId: result.id,
            amount,
            name: session.user.name,
            email: session.user.email
        };
    } catch ( error )
    {
        if ( orderId )
        {
            await releaseOnlineReservation( orderId, userId ?? "" );
        }
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to start online payment"
        };
    }
}

export async function verifyRazorpayPayment (
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
)
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if ( !keySecret )
        {
            return { success: false as const, message: "Online payment is not configured yet" };
        }
        const order = await prisma.order.findFirst( {
            where: {
                id: orderId,
                userId: session.user.id,
                razorpayOrderId,
                paymentMethod: "RAZORPAY",
                paymentStatus: "PENDING",
                status: "PENDING"
            },
            select: { id: true }
        } );
        if ( !order )
        {
            return { success: false as const, message: "This payment is no longer active" };
        }

        const expectedSignature = createHmac( "sha256", keySecret )
            .update( `${ razorpayOrderId }|${ razorpayPaymentId }` )
            .digest();
        const receivedSignature = Buffer.from( razorpaySignature, "hex" );
        if ( receivedSignature.length !== expectedSignature.length || !timingSafeEqual( expectedSignature, receivedSignature ) )
        {
            return { success: false as const, message: "Payment verification failed" };
        }

        await prisma.$transaction( async ( transaction ) =>
        {
            const updated = await transaction.order.updateMany( {
                where: {
                    id: order.id,
                    userId: session.user.id,
                    razorpayOrderId,
                    paymentStatus: "PENDING",
                    status: "PENDING"
                },
                data: {
                    razorpayPaymentId,
                    paymentStatus: "PAID"
                }
            } );
            if ( updated.count !== 1 )
            {
                throw new Error( "This payment has already been processed or cancelled" );
            }

            await transaction.cartItem.deleteMany( {
                where: { cart: { userId: session.user.id } }
            } );
        } );

        return { success: true as const, orderId: order.id };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to verify payment"
        };
    }
}

export async function cancelPendingRazorpayOrder ( orderId: string )
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }
        await releaseOnlineReservation( orderId, session.user.id );
        return { success: true as const };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to cancel payment"
        };
    }
}

export async function getMyOrders ()
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }
        const orders = await prisma.order.findMany( {
            where: { userId: session.user.id },
            include: { items: true },
            orderBy: { createdAt: "desc" }
        } );
        return {
            success: true as const,
            data: orders.map( ( order ) => ( {
                id: order.id,
                total: order.total.toString(),
                status: order.status,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt.toISOString(),
                houseNumber: order.houseNumber,
                addressLine: order.addressLine,
                city: order.city,
                pincode: order.pincode,
                items: order.items.map( ( item ) => ( {
                    itemName: item.itemName,
                    amount: item.amount,
                    unit: item.unit,
                    quantity: item.quantity,
                    originalPrice: item.originalPrice.toString(),
                    discountPercent: item.discountPercent.toString(),
                    finalPrice: item.finalPrice.toString(),
                    imageUrl: item.imageUrl
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
