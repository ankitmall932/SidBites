import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export default async function Password ()
{
    const accounts = await auth.api.listUserAccounts( { headers: await headers() } );
    const hasCredentialAccount = accounts.some( ( account ) => account.providerId === "credential" );
    const href = hasCredentialAccount
        ? "/user/account/change-password"
        : "/user/account/set-password";
    const label = hasCredentialAccount ? "Change password" : "Set password";

    return (
        <Link href={ href } className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700">
            <KeyRound size={ 16 } />
            { label }
        </Link>
    );
}