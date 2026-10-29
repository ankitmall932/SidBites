'use server';

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";
import { createTypeSchema, editDetailTypeSchema } from "@/lib/validations/types";
import { redirect } from "next/navigation";

export const createType = async ( _prevState: { success: boolean, message: string; }, formData: FormData ) =>
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
            name: formData.get( 'name' )
        };
        const validation = createTypeSchema.safeParse( val );
        if ( !validation.success )
        {
            return {
                success: false,
                message: validation.error.issues[ 0 ].message ?? 'Please enter the valid name'
            };
        }
        await prisma.types.create( {
            data: {
                name: validation.data.name,
                userId: session.user.id
            }
        } );
    } catch ( error )
    {
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
            name: formData.get( 'name' )
        };
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
                name: validation.data.name
            }
        } );
    } catch ( error )
    {
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
        await prisma.types.delete( {
            where: {
                userId: session.user.id,
                id
            }
        } );
    } catch ( error )
    {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to delete Type'
        };
    }
    redirect( `/admin/type` );
};
