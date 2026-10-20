
import { getSession } from "@/lib/auth/getSession";
import SignIn from "./SignIn";
import { redirect } from "next/navigation";


export default async function Login ()
{
    const session = await getSession();
    if ( session )
    {
        redirect( '/' );
    }
    return (
        <>
            <div>
                <SignIn />
            </div>
        </>
    );
}