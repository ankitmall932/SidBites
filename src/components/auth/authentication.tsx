import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Authentication ()
{
    const { isLoaded, isSignedIn } = useUser();
    if ( !isLoaded )
    {
        return (
            <>
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            </>
        );
    }
    if ( isSignedIn )
    {
        return (
            <div className="flex flex-row items-center justify-center gap-5">
                <UserButton />
            </div>
        );
    };
    return (
        <div>
            <Show when="signed-out" >
                <SignInButton >
                    <button className="bg-gray-400 text-white rounded-2xl font-medium text-sm sm:text-base  sm:h-12 px-4 mx-5 sm:px-5 cursor-pointer">
                        Sign In
                    </button>
                </SignInButton>
                <SignUpButton>
                    <button className="bg-black text-white rounded-2xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                    </button>
                </SignUpButton>
            </Show>
        </div>
    );
}
