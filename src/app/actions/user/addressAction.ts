"use server";

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/db/prisma";

export async function getAddresses ()
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }

        const addresses = await prisma.address.findMany( {
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                houseNumber: true,
                addressLine: true,
                city: true,
                pincode: true
            }
        } );
        return { success: true as const, data: addresses };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to load addresses"
        };
    }
}

export async function addAddress ( formData: FormData )
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }

        const houseNumber = formData.get( "houseNumber" );
        const addressLine = formData.get( "addressLine" );
        if ( typeof houseNumber !== "string" || !houseNumber.trim() || houseNumber.trim().length > 100 )
        {
            return { success: false as const, message: "Enter a valid house or building number" };
        }
        if ( typeof addressLine !== "string" || !addressLine.trim() || addressLine.trim().length > 300 )
        {
            return { success: false as const, message: "Enter a valid area or street address" };
        }

        const createdAddress = await prisma.address.create( {
            data: {
                userId: session.user.id,
                houseNumber: houseNumber.trim(),
                addressLine: addressLine.trim(),
                city: "Siswa Bazar",
                pincode: "273163"
            },
            select: {
                id: true,
                houseNumber: true,
                addressLine: true,
                city: true,
                pincode: true
            }
        } );

        return { success: true as const, data: createdAddress };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to save address"
        };
    }
}

export async function deleteAddress ( addressId: string )
{
    try
    {
        const session = await getSession();
        if ( !session?.user )
        {
            return { success: false as const, message: "Unauthorized" };
        }

        const address = await prisma.address.findFirst( {
            where: { id: addressId, userId: session.user.id },
            select: { id: true }
        } );
        if ( !address )
        {
            throw new Error( "Address not found" );
        }

        await prisma.address.delete( { where: { id: address.id } } );

        return { success: true as const };
    } catch ( error )
    {
        return {
            success: false as const,
            message: error instanceof Error ? error.message : "Unable to delete address"
        };
    }
}
