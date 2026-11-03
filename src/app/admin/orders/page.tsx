import { getAdminOrders } from "@/app/actions/admin/customerOrderActions";
import OrderManager from "@/components/Admin/OrderManager";
import { ClipboardList } from "lucide-react";

export default async function AdminOrdersPage ()
{
    const response = await getAdminOrders();
    if ( !response.success )
    {
        return (
            <main className="mx-auto max-w-7xl">
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load orders: { response.message }
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl space-y-5 text-stone-900 dark:text-stone-100">
            <header className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    <ClipboardList aria-hidden="true" size={ 21 } />
                </span>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">Admin</p>
                    <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                </div>
                <span className="ml-auto rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold dark:bg-stone-800">
                    { response.data.length } total
                </span>
            </header>
            <OrderManager initialOrders={ response.data } />
        </main>
    );
}
