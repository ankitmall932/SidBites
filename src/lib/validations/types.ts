import z from "zod";

export const createTypeSchema = z.object( {
    name: z.string().min( 2, 'Type should be more than two words' )
} );

export const editDetailTypeSchema = z.object( {
    name: z.string().min( 2, 'Type should be more than two words' )
} );