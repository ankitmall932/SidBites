"use server";

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";

export const addToCart = async ( id: string, quantity: number ) =>
{
    try
    {
        if ( !Number.isInteger( quantity ) || quantity < 1 )
        {
            return {
                success: false,
                message: 'Quantity must be a positive integer'
            };
        }
        const session = await getSession();
        if ( !session )
        {
            return {
                success: false,
                message: 'Unauthorized'
            };
        }
        return await prisma.$transaction( async ( transaction ) =>
        {
            const item = await transaction.items.findUnique( {
                where: { id },
                select: { stockQuantity: true }
            } );
            if ( !item )
            {
                return {
                    success: false,
                    message: 'Item not found'
                };
            }
            const cart = await transaction.cart.upsert( {
                where: { userId: session.user.id },
                create: { userId: session.user.id },
                update: {}
            } );
            const cartItem = await transaction.cartItem.findUnique( {
                where: {
                    cartId_itemId: {
                        cartId: cart.id,
                        itemId: id
                    }
                },
                select: { quantity: true }
            } );
            if ( ( cartItem?.quantity ?? 0 ) + quantity > item.stockQuantity )
            {
                return {
                    success: false,
                    message: 'No more stock available'
                };
            }

            await transaction.cartItem.upsert( {
                where: {
                    cartId_itemId: {
                        cartId: cart.id,
                        itemId: id
                    }
                },
                create: { cartId: cart.id, itemId: id, quantity },
                update: { quantity: { increment: quantity } }
            } );
            return { success: true };
        } );
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong'
        };
    }
};

export const getCart = async () =>
{
    try
    {
        const session = await getSession();
        if ( !session )
        {
            return {
                success: false,
                message: 'Unauthorized'
            };
        }
        const cart = await prisma.cart.findUnique( {
            where: {
                userId: session.user.id
            },
            include: {
                cartItems: {
                    include: {
                        item: true
                    }
                }
            }
        } );
        const items = cart?.cartItems.map( ( cartItem ) => ( {
            id: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price.toString(),
            amount: cartItem.item.quantity.toString(),
            unit: cartItem.item.unit,
            stockQuantity: cartItem.item.stockQuantity,
            imageUrl: cartItem.item.imageUrl,
            discount: cartItem.item.discount?.toString() ?? null,
            quantity: cartItem.quantity
        } ) ) ?? [];
        return {
            success: true,
            data: items
        };
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong'
        };
    }
};

export const updateCart = async ( id: string, quantity: number ) =>
{
    try
    {
        if ( !Number.isInteger( quantity ) || quantity < 0 )
        {
            return {
                success: false,
                message: 'Quantity must be a non-negative integer'
            };
        }
        const session = await getSession();
        if ( !session )
        {
            return {
                success: false,
                message: 'Unauthorized'
            };
        }
        const cart = await prisma.cart.findUnique( {
            where: {
                userId: session.user.id
            }
        } );
        if ( !cart )
        {
            return {
                success: false,
                message: 'Cart not found'
            };
        }
        if ( quantity > 0 )
        {
            const existingItem = await prisma.cartItem.findUnique( {
                where: {
                    cartId_itemId: {
                        cartId: cart.id,
                        itemId: id
                    }
                },
                include: {
                    item: {
                        select: { stockQuantity: true }
                    }
                }
            } );
            if ( existingItem && quantity > existingItem.quantity && quantity > existingItem.item.stockQuantity )
            {
                return {
                    success: false,
                    message: 'No more stock available'
                };
            }
        }
        if ( quantity === 0 )
        {
            await prisma.cartItem.deleteMany( {
                where: {
                    cartId: cart.id,
                    itemId: id
                }
            } );
            return {
                success: true
            };
        }
        await prisma.cartItem.update( {
            where: {
                cartId_itemId: {
                    cartId: cart.id,
                    itemId: id
                },
            },
            data: {
                quantity
            }
        } );
        return {
            success: true
        };
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong'
        };
    }
};
