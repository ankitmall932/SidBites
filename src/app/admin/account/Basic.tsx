import { auth } from "@/lib/auth/auth";

import Link from "next/link";
import Password from "./Password";
import Image from "next/image";
import { Mail, UserRound } from "lucide-react";


type Session = typeof auth.$Infer.Session;
export default function BasicPart ( { session }: { session: Session | null; } )
{
    const image = session?.user?.image;
    const userName = session?.user.name?.[ 0 ]?.toUpperCase() ?? "U";
    return (
        <div className="flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-4 pb-5">
                { image ? (
                    <Image src={ image } alt="Account avatar" width={ 64 } height={ 64 } className="h-16 w-16 rounded-2xl object-cover ring-4 ring-orange-50 dark:ring-orange-950/50" />
                ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-bold text-white shadow-sm">
                        { userName }
                    </span>
                ) }
                <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-gray-900 dark:text-white">{ session?.user.name }</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Administrator account</p>
                </div>
            </div>

            <dl className="divide-y divide-gray-100 rounded-xl border border-gray-100 dark:divide-gray-800 dark:border-gray-800">
                <div className="flex items-start gap-3 p-4">
                    <UserRound size={ 17 } className="mt-0.5 shrink-0 text-gray-400" />
                    <div className="min-w-0">
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                        <dd className="mt-1 break-words text-sm font-medium text-gray-900 dark:text-white">{ session?.user.name || "Not set" }</dd>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4">
                    <Mail size={ 17 } className="mt-0.5 shrink-0 text-gray-400" />
                    <div className="min-w-0">
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                        <dd className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white">{ session?.user.email || "Not set" }</dd>
                    </div>
                </div>
            </dl>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link href="/admin/account/edit-name" className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 dark:border-gray-700 dark:text-gray-200 dark:hover:border-orange-900 dark:hover:bg-orange-950/30 dark:hover:text-orange-200">
                    Edit name
                </Link>
                <Password />
            </div>
        </div>
    );
}