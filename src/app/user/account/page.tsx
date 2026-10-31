import { getSession } from "@/lib/auth/getSession";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";
import BasicPart from "./Basic";
import SecurityPassword from "./Security";

export default async function Account ()
{
    const session = await getSession();

    return (
        <main className="mx-auto w-full max-w-7xl space-y-8">
            <header className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-100 p-6 shadow-sm dark:border-orange-950 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950/40 sm:p-9">
                <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
                <div className="relative">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700 dark:border-orange-900 dark:bg-gray-900/80 dark:text-orange-300">
                        <UserRound size={ 14 } />
                        Account settings
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">Your account</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
                        Update your profile, manage your password, and review where you are signed in.
                    </p>
                </div>
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <section aria-labelledby="profile-heading" className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                            <UserRound size={ 19 } />
                        </span>
                        <div>
                            <h2 id="profile-heading" className="font-semibold text-gray-900 dark:text-white">Profile information</h2>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Your name and sign-in email</p>
                        </div>
                    </div>
                    <BasicPart session={ session } />
                </section>

                <section aria-labelledby="security-heading" className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <ShieldCheck size={ 19 } />
                        </span>
                        <div>
                            <h2 id="security-heading" className="font-semibold text-gray-900 dark:text-white">Security &amp; devices</h2>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Password and active sessions</p>
                        </div>
                        <KeyRound className="ml-auto text-gray-400" size={ 18 } />
                    </div>
                    <SecurityPassword session={ session } />
                </section>
            </div>
        </main>
    );
}
