import { getAdminCustomers } from "@/app/actions/admin/customerOrderActions";
import Image from "next/image";
import { Users } from "lucide-react";

export default async function CustomersPage ()
{
    const response = await getAdminCustomers();
    if ( !response.success )
    {
        return (
            <main className="mx-auto max-w-7xl">
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load customers: { response.message }
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl space-y-5 text-stone-900 dark:text-stone-100">
            <header className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    <Users aria-hidden="true" size={ 21 } />
                </span>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">Admin</p>
                    <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                </div>
                <span className="ml-auto rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold dark:bg-stone-800">
                    { response.data.length } total
                </span>
            </header>

            { response.data.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500 dark:bg-stone-800/70 dark:text-stone-400">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Customer</th>
                                <th className="px-4 py-3 font-semibold">Email status</th>
                                <th className="px-4 py-3 font-semibold">Joined</th>
                                <th className="px-4 py-3 font-semibold">Orders</th>
                                <th className="px-4 py-3 font-semibold">Saved addresses</th>
                                <th className="px-4 py-3 font-semibold">User ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            { response.data.map( ( customer ) => (
                                <tr key={ customer.id } className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            { customer.image ? (
                                                <Image src={ customer.image } alt="" width={ 36 } height={ 36 } className="h-9 w-9 rounded-full object-cover" />
                                            ) : (
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                                                    { customer.name[ 0 ]?.toUpperCase() ?? "U" }
                                                </span>
                                            ) }
                                            <div>
                                                <p className="font-semibold">{ customer.name }</p>
                                                <p className="text-xs text-stone-500 dark:text-stone-400">{ customer.email }</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={ `rounded-full px-2.5 py-1 text-xs font-medium ${ customer.emailVerified ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" }` }>
                                            { customer.emailVerified ? "Verified" : "Unverified" }
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-stone-600 dark:text-stone-300">
                                        { new Date( customer.createdAt ).toLocaleDateString( "en-IN", { dateStyle: "medium" } ) }
                                    </td>
                                    <td className="px-4 py-3 font-medium">{ customer.orderCount }</td>
                                    <td className="px-4 py-3 font-medium">{ customer.addressCount }</td>
                                    <td className="px-4 py-3 font-mono text-xs text-stone-500 dark:text-stone-400">{ customer.id }</td>
                                </tr>
                            ) ) }
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
                    No customer accounts found.
                </div>
            ) }
        </main>
    );
}
