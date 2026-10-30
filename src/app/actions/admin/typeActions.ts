'use server';

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";
import cloudinary from "@/lib/storage/cloudinary";
import { createTypeSchema, editDetailTypeSchema } from "@/lib/validations/types";
import { redirect } from "next/navigation";

export const createType = async ( _prevState: { success: boolean, message: string; }, formData: FormData ) =>
{
    let uploadImageId: string | undefined;
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
            image: formData.get( 'image' )
        };
        const validation = createTypeSchema.safeParse( val );
        if ( !validation.success )
        {
            return {
                success: false,
                message: validation.error.issues[ 0 ].message ?? 'Please enter the valid name'
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
        uploadImageId = uploadImage.public_id;
        await prisma.types.create( {
            data: {
                name: validation.data.name,
                userId: session.user.id,
                imageId: uploadImage.public_id,
                imageUrl: uploadImage.secure_url
            }
        } );
    } catch ( error )
    {
        if ( uploadImageId )
        {
            await cloudinary.uploader.destroy(
                uploadImageId
            );
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to create Types'
        };
    }
    redirect( '/admin/type' );
};

export const getTypes = async () =>
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
        const result = await prisma.types.findMany( {
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
            message: error instanceof Error ? error.message : 'Unable to fetch data from the data base '
        };
    }
};

export const getDetailType = async ( id: string ) =>
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
        const result = await prisma.types.findFirst( {
            where: {
                id,
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
            message: error instanceof Error ? error.message : 'No Type found with the given id'
        };
    }
};

export const editDetailType = async ( id: string, _prevState: { success: boolean, message: string; }, formData: FormData ) =>
{
    let imageUrl: string | null = null;
    let imageId: string | null = null;
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
            image: formData.get( 'image' )
        };
        const type = await prisma.types.findFirst( {
            where: {
                id,
                userId: session.user.id
            }
        } );
        if ( !type )
        {
            return {
                success: false,
                message: 'No type found for the given id'
            };
        }
        imageUrl = type.imageUrl;
        imageId = type.imageId;
        if ( val.image instanceof File && val.image.size > 0 )
        {
            const imageData = Buffer.from( await val.image.arrayBuffer() ).toString( 'base64' );
            const uploadImage = await cloudinary.uploader.upload(
                `data:${ val.image.type };base64,${ imageData }`,
                {
                    folder: 'sidbites/items',
                    resource_type: 'image'
                }
            );
            imageUrl = uploadImage.secure_url;
            imageId = uploadImage.public_id;
        }
        const validation = editDetailTypeSchema.safeParse( val );
        if ( !validation.success )
        {
            return {
                success: false,
                message: validation.error.issues[ 0 ].message ?? 'Please enter the valid name'
            };
        }
        await prisma.types.update( {
            where: {
                userId: session.user.id,
                id
            },
            data: {
                name: validation.data.name,
                imageId,
                imageUrl
            }
        } );
        if ( imageId !== type.imageId && type.imageId )
        {
            await cloudinary.uploader.destroy( type.imageId );
        }
    } catch ( error )
    {
        if ( imageId )
        {
            await cloudinary.uploader.destroy(
                imageId
            );
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to edit the type'
        };
    }
    redirect( `/admin/type/${ id }` );
};

export const deleteType = async ( id: string ) =>
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
        const type = await prisma.types.findUnique( {
            where: {
                id
            }
        } );
        if ( !type )
        {
            return {
                success: false,
                message: 'No type found for the given id'
            };
        }
        await prisma.types.delete( {
            where: {
                userId: session.user.id,
                id
            }
        } );
        if ( type.imageId )
        {
            await cloudinary.uploader.destroy( type.imageId );
        }
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to delete Type'
        };
    }
    redirect( `/admin/type` );
};
