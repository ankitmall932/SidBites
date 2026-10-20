import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";


export async function socialLogin ( provider: 'google' | 'github' )
{
    const authClient = createAuthClient();
    await authClient.signIn.social( {
        provider,
        callbackURL: '/'
    } );
    redirect( '/' );
}