'use server';

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";
import { createItemSchema } from "@/lib/validations/items";
import { redirect } from "next/navigation";

export const createItem = async ( id: string, _prevState: { success: boolean, message: string; }, formData: FormData ) =>
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
        const val = {
            name: formData.get( 'name' ),
            price: formData.get( 'price' ),
            quantity: formData.get( 'quantity' ),
            unit: formData.get( 'unit' ),
            stockQuantity: formData.get( 'stockQuantity' ),
            discount: formData.get( 'discount' ),
        };
        const validation = createItemSchema.safeParse( val );
        if ( !validation.success )
        {
            return {
                success: false,
                message: validation.error.issues[ 0 ].message ?? 'Please enter the correct detail'
            };
        }
        await prisma.items.create( {
            data: {
                name: validation.data.name,
                price: validation.data.price,
                quantity: validation.data.quantity,
                unit: validation.data.unit,
                discount: validation.data.discount,
                stockQuantity: validation.data.stockQuantity,
                userId: session.user.id,
                typeId: id
            }
        } );
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to create Items'
        };
    }
    redirect( `/admin/type/${ id }` );
};