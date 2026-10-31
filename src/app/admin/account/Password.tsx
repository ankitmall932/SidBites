import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Password ()
{
    const accounts = await auth.api.listUserAccounts( { headers: await headers() } );
    const hasCredentialAccount = accounts.some( ( account ) => account.providerId === "credential" );
    const href = hasCredentialAccount
        ? "/admin/account/change-password"
        : "/admin/account/set-password";
    const label = hasCredentialAccount ? "Change password" : "Set password";

    return (
        <Link href={ href } className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700">
            { label }
        </Link>
    );
}