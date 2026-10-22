import Landing from "@/components/Landing";
import { getSession } from "@/lib/auth/getSession";
import { redirect } from "next/navigation";

export default async function Home ()
{
  const session = await getSession();
  if ( session?.user.admin )
  {
    redirect( "/admin/dashboard" );
  }

  return (
    <div>
      <Landing />
    </div>
  );
}
