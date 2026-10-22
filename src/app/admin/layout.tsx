import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/getSession";
import { redirect } from "next/navigation";

export default async function AdminLayout ( { children }: { children: ReactNode; } )
{
    const session = await getSession();
    if ( !session?.user )
    {
        redirect( "/" );
    }
    if ( !session.user.admin )
    {
        redirect( "/" );
    }

    return <>{ children }</>;
}
