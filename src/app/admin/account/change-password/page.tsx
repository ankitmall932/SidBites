import ChangePasswordForm from "@/app/user/account/change-password/ChangePasswordForm";
import Link from "next/link";

export default function ChangePasswordPage ()
{
    return (
        <main className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-2xl bg-white text-black dark:bg-gray-900 dark:text-white p-6 shadow-lg">
            <h1 className="text-2xl font-semibold">Change password</h1>
            <ChangePasswordForm />
            <Link href="/admin/account" className="w-fit text-sky-700 underline">
                Back to account
            </Link>
        </main>
    );
}