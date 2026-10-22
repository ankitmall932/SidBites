import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/getSession";
import { redirect } from "next/navigation";

export default async function UserLayout ( { children }: { children: ReactNode; } )
{
    const session = await getSession();

    if ( session?.user.admin )
    {
        redirect( "/admin/dashboard" );
    }

    return <>{ children }</>;
}
