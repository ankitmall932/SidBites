"use server";

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";

export async function getWishlist ()
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }

        const wishlist = await prisma.wishlist.findUnique( {
            where: { userId: session.user.id },
            include: {
                wishlistItems: {
                    include: { item: true },
                    orderBy: { createdAt: "desc" }
                }
            }
        } );

        return {
            success: true as const,
            data: wishlist?.wishlistItems.map( ( { item } ) => ( {
                id: item.id,
                name: item.name,
                price: item.price.toString(),
                amount: item.quantity.toString(),
                unit: item.unit,
                stockQuantity: item.stockQuantity,
                imageUrl: item.imageUrl,
                discount: item.discount?.toString() ?? null
            } ) ) ?? []
        };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to load wishlist"
        };
    }
}

export async function getWishlistItemIds ()
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: true as const, data: [] as string[] };
        }

        const wishlist = await prisma.wishlist.findUnique( {
            where: { userId: session.user.id },
            select: {
                wishlistItems: {
                    select: { itemId: true }
                }
            }
        } );

        return {
            success: true as const,
            data: wishlist?.wishlistItems.map( ( item ) => item.itemId ) ?? []
        };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to load wishlist"
        };
    }
}

export async function addToWishlist ( itemId: string )
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Please sign in to save wishlist items" };
        }

        const item = await prisma.items.findUnique( {
            where: { id: itemId },
            select: { id: true }
        } );
        if ( !item )
        {
            return { success: false as const, message: "Item not found" };
        }

        const wishlist = await prisma.wishlist.upsert( {
            where: { userId: session.user.id },
            create: { userId: session.user.id },
            update: {}
        } );
        await prisma.wishlistItem.upsert( {
            where: {
                wishlistId_itemId: {
                    wishlistId: wishlist.id,
                    itemId
                }
            },
            create: {
                wishlistId: wishlist.id,
                itemId
            },
            update: {}
        } );

        return { success: true as const };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to save wishlist item"
        };
    }
}

export async function removeFromWishlist ( itemId: string )
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }

        const wishlist = await prisma.wishlist.findUnique( {
            where: { userId: session.user.id },
            select: { id: true }
        } );
        if ( wishlist )
        {
            await prisma.wishlistItem.deleteMany( {
                where: {
                    wishlistId: wishlist.id,
                    itemId
                }
            } );
        }

        return { success: true as const };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to remove wishlist item"
        };
    }
}
