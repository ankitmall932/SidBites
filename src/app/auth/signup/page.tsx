
import { getSession } from "@/lib/auth/getSession";
import SignUp from "./SignUp";
import { redirect } from "next/navigation";

export default async function SignupPage ()
{
    const session = await getSession();
    if ( session )
    {
        redirect( '/user/dashboard' );
    }
    return (
        <div>
            <SignUp />
        </div>
    );
}