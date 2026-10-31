'use server';

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";
import cloudinary from "@/lib/storage/cloudinary";
import { createItemSchema } from "@/lib/validations/items";
import { redirect } from "next/navigation";

export const createItem = async ( id: string, _prevState: { success: boolean, message: string; }, formData: FormData ) =>
{
    let imageId: string | undefined;
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
            image: formData.get( 'image' )
        };
        const validation = createItemSchema.safeParse( val );
        if ( !validation.success )
        {
            return {
                success: false,
                message: validation.error.issues[ 0 ].message ?? 'Please enter the correct detail'
            };
        }
        if ( !( val.image instanceof File ) || val.image.size === 0 )
        {
            return {
                success: false,
                message: 'Please select an image'
            };
        }
        if ( val.image.size > 5 * 1024 * 1024 )
        {
            return {
                success: false,
                message: 'Image must be under 5 mb'
            };
        }
        const imageData = Buffer.from( await val.image.arrayBuffer() ).toString( 'base64' );
        const uploadImage = await cloudinary.uploader.upload(
            `data:${ val.image.type };base64,${ imageData }`,
            {
                folder: 'sidbites/items',
                resource_type: 'image'
            }
        );
        imageId = uploadImage.public_id;
        await prisma.items.create( {
            data: {
                name: validation.data.name,
                price: validation.data.price,
                quantity: validation.data.quantity,
                unit: validation.data.unit,
                discount: validation.data.discount,
                stockQuantity: validation.data.stockQuantity,
                userId: session.user.id,
                typeId: id,
                imageId: imageId,
                imageUrl: uploadImage.secure_url
            }
        } );
    } catch ( error )
    {
        if ( imageId )
        {
            await cloudinary.uploader.destroy( imageId );
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to create Items'
        };
    }
    redirect( `/admin/type/${ id }` );
};

export const getItemByType = async ( id: string ) =>
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
        const result = await prisma.items.findMany( {
            where: {
                typeId: id,
                userId: session.user.id
            }
        } );
        return {
            success: true,
            data: result
        };
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to fetch the items from the database'
        };
    }
};

export const getDetailItem = async ( id: string ) =>
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
        const result = await prisma.items.findUnique( {
            where: {
                id
            }
        } );
        if ( !result )
        {
            return {
                success: false,
                message: 'No Item found for the given id'
            };
        }
        return {
            success: true,
            data: result
        };
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong'
        };
    }
};

export const editItem = async ( id: string, _prevState: { success: boolean, message: string; } | undefined, formData: FormData ) =>
{
    let image_url: string | null = null;
    let image_id: string | null = null;
    let typeId: string;
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
        const item = await prisma.items.findUnique( {
            where: {
                id,
                userId: session.user.id
            }
        } );
        if ( !item )
        {
            return {
                success: false,
                message: 'No item found for the given id'
            };
        }
        image_id = item.imageId;
        image_url = item.imageUrl;
        typeId = item.typeId;
        const val = {
            name: formData.get( 'name' ),
            price: formData.get( 'price' ),
            quantity: formData.get( 'quantity' ),
            unit: formData.get( 'unit' ),
            stockQuantity: formData.get( 'stockQuantity' ),
            discount: formData.get( 'discount' ),
            image: formData.get( 'image' )
        };
        const validation = createItemSchema.safeParse( val );
        if ( !validation.success )
        {
            return {
                success: false,
                message: validation.error.issues[ 0 ].message ?? 'Please enter the correct detail'
            };
        }
        if ( val.image instanceof File && val.image.size > 0 )
        {
            const imageData = Buffer.from( await val.image.arrayBuffer() ).toString( 'base64' );
            const uploadData = await cloudinary.uploader.upload(
                `data:${ val.image.type };base64,${ imageData }`,
                {
                    folder: 'sidbites/items',
                    resource_type: 'image'
                }
            );
            image_id = uploadData.public_id;
            image_url = uploadData.secure_url;
        }
        await prisma.items.update( {
            where: {
                id,
                userId: session.user.id
            },
            data: {
                name: validation.data.name,
                price: validation.data.price,
                quantity: validation.data.quantity,
                stockQuantity: validation.data.stockQuantity,
                unit: validation.data.unit,
                discount: validation.data.discount,
                imageId: image_id,
                imageUrl: image_url
            }
        } );
        if ( image_id !== item.imageId && item.imageId )
        {
            await cloudinary.uploader.destroy( item.imageId );
        }
    } catch ( error )
    {
        if ( image_id )
        {
            await cloudinary.uploader.destroy( image_id );
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong'
        };
    }
    redirect( `/admin/type/${ typeId }` );
};

export const deleteItem = async ( id: string ) =>
{
    let typeId: string | undefined;
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
        const item = await prisma.items.findFirst( {
            where: {
                id,
                userId: session.user.id
            }
        } );
        typeId = item?.typeId;
        if ( !item )
        {
            return {
                success: false,
                message: 'No item found for the given id'
            };
        }
        await prisma.items.delete( {
            where: {
                id
            }
        } );
        if ( item.imageId )
        {
            await cloudinary.uploader.destroy( item.imageId );
        }
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong '
        };
    }
    redirect( `/admin/type/${ typeId }` );
};

export const getAllItems = async () =>
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
        const result = await prisma.items.findMany( {
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        } );
        return {
            success: true,
            data: result
        };
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong'
        };
    }
};
