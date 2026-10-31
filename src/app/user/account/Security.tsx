import { signOut, signOutAll } from "@/app/actions/auth/auth-actions";
import { auth } from "@/lib/auth/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import DeleteAccountButton from "./DeleteAccountButton";
import { Laptop, LogOut, ShieldAlert } from "lucide-react";

type Session = typeof auth.$Infer.Session;
function getDeviceName ( userAgent: string | null | undefined )
{
    if ( !userAgent ) return "Unknown device";

    const browser = /Edg\//.test( userAgent ) ? "Edge"
        : /OPR\//.test( userAgent ) ? "Opera"
            : /Chrome\//.test( userAgent ) ? "Chrome"
                : /Firefox\//.test( userAgent ) ? "Firefox"
                    : /Safari\//.test( userAgent ) ? "Safari"
                        : "Unknown browser";
    const platform = /Android/i.test( userAgent ) ? "Android"
        : /iPhone|iPad|iPod/i.test( userAgent ) ? "iOS"
            : /Windows/i.test( userAgent ) ? "Windows"
                : /Macintosh|Mac OS/i.test( userAgent ) ? "macOS"
                    : /Linux/i.test( userAgent ) ? "Linux"
                        : "Unknown platform";
    return `${ browser } on ${ platform }`;
}

export default async function SecurityPassword ( { session }: { session: Session | null; } )
{
    const currentSessionId = session?.session.id;
    let sessions: Awaited<ReturnType<typeof auth.api.listSessions>> = [];
    let sessionIsStale = false;

    if ( session )
    {
        try
        {
            sessions = await auth.api.listSessions( { headers: await headers() } );
        }
        catch ( error )
        {
            if ( error instanceof APIError && error.body?.code === "SESSION_NOT_FRESH" )
            {
                sessionIsStale = true;
            }
            else
            {
                throw error;
            }
        }
    }

    return (
        <div className="space-y-6 p-5 sm:p-6">
            <section aria-labelledby="signed-in-devices-heading" className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 id="signed-in-devices-heading" className="text-sm font-semibold text-gray-900 dark:text-white">Signed-in devices</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Review where your account is currently active.</p>
                    </div>
                    <Laptop size={ 18 } className="shrink-0 text-gray-400" />
                </div>
                { sessionIsStale ? (
                    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                        <p className="text-sm text-amber-900 dark:text-amber-200">
                            For your security, sign in again to view your active devices.
                        </p>
                        <form action={ signOut }>
                            <button type="submit" className="rounded-lg bg-amber-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-800">
                                Sign in again
                            </button>
                        </form>
                    </div>
                ) : sessions.length > 0 ? (
                    <ul className="space-y-2">
                        { sessions.map( ( device ) =>
                        {
                            const isCurrent = device.id === currentSessionId;
                            const status = isCurrent ? "Current device" : "Active";
                            return (
                                <li key={ device.id } className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-950/50 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <Laptop size={ 17 } />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{ getDeviceName( device.userAgent ) }</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{ device.createdAt.toLocaleString() }</p>
                                        </div>
                                    </div>
                                    <span className={ `w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${ isCurrent ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" }` }>
                                        { status }
                                    </span>
                                </li>
                            );
                        } ) }
                    </ul>
                ) : (
                    <p className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
                        No active devices found.
                    </p>
                ) }
            </section>

            <section aria-label="Account session actions" className="space-y-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Session actions</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                    <form action={ signOut }>
                        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                            <LogOut size={ 16 } />
                            Log out
                        </button>
                    </form>
                    <form action={ signOutAll }>
                        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                            <ShieldAlert size={ 16 } />
                            Log out all devices
                        </button>
                    </form>
                    <div className="sm:col-span-2">
                        <DeleteAccountButton />
                    </div>
                </div>
            </section>
        </div>
    );
}