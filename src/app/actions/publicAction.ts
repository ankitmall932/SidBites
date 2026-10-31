import { prisma } from "@/lib/db/prisma";

export const getType = async () =>
{
    try
    {
        const result = await prisma.types.findMany( {
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


export const getAllItems = async () =>
{
    try
    {
        const result = await prisma.items.findMany( {
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