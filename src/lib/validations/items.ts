import z from "zod";
import { Unit } from "@/generated/prisma/enums";

export const createItemSchema = z.object( {
    name: z.string().trim().min( 2, 'Item name must be at least 2 characters' ),
    price: z.coerce.number().gte( 1, 'Price must be at least 1' ),
    quantity: z.coerce.number().positive( 'Quantity must be greater than 0' ),
    unit: z.enum( Unit ),
    discount: z.coerce.number().nonnegative( 'Discount cannot be negative' ),
    stockQuantity: z.coerce.number().int().nonnegative( 'Stock must be a whole number and cannot be negative' ),
} );