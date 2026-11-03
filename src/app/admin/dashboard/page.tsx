import { getAdminDashboardData } from "@/app/actions/admin/customerOrderActions";
import { AlertTriangle, ArrowRight, Ban, ChefHat, ClipboardList, IndianRupee, Package, Timer } from "lucide-react";
import Link from "next/link";

const currency = new Intl.NumberFormat( "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
} );

function getStatusStyle ( status: string )
{
    switch ( status )
    {
        case "PENDING":
            return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
        case "PREPARING":
            return "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300";
        case "OUT_FOR_DELIVERY":
            return "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300";
        case "DELIVERED":
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
        default:
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
    }
}

function formatStatus ( status: string )
{
    return status.replaceAll( "_", " " ).toLowerCase().replace( /^\w/, ( letter ) => letter.toUpperCase() );
}

export default async function AdminDashboardPage ()
{
    const response = await getAdminDashboardData();

    if ( !response.success )
    {
        return (
            <main className="mx-auto max-w-7xl">
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load dashboard: { response.message }
                </div>
            </main>
        );
    }

    const { data } = response;
    const metrics = [
        { label: "Today's earnings", value: currency.format( Number( data.todayEarnings ) ), Icon: IndianRupee, color: "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950" },
        { label: "Preparing today", value: data.preparingOrders, Icon: ChefHat, color: "text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950" },
        { label: "Pending today", value: data.pendingOrders, Icon: Timer, color: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950" },
        { label: "Cancelled today", value: data.cancelledOrders, Icon: Ban, color: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950" }
    ];

    return (
        <main className="mx-auto max-w-7xl space-y-6 text-stone-900 dark:text-stone-100">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">Admin workspace</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Today&apos;s business and inventory at a glance.</p>
            </header>

            <section aria-label="Today's order summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                { metrics.map( ( metric ) => (
                    <article key={ metric.label } className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{ metric.label }</p>
                                <p className="mt-3 text-2xl font-bold tracking-tight">{ metric.value }</p>
                            </div>
                            <span className={ `flex h-11 w-11 items-center justify-center rounded-xl ${ metric.color }` }>
                                <metric.Icon aria-hidden="true" size={ 21 } />
                            </span>
                        </div>
                    </article>
                ) ) }
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 dark:border-stone-800">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                <ClipboardList aria-hidden="true" size={ 19 } />
                            </span>
                            <div>
                                <h2 className="font-semibold">Recent orders</h2>
                                <p className="text-xs text-stone-500 dark:text-stone-400">Latest 10 orders</p>
                            </div>
                        </div>
                        <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-800 dark:text-orange-300">
                            All orders <ArrowRight aria-hidden="true" size={ 15 } />
                        </Link>
                    </div>

                    { data.recentOrders.length > 0 ? (
                        <div className="divide-y divide-stone-100 dark:divide-stone-800">
                            { data.recentOrders.map( ( order ) => (
                                <article key={ order.id } className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">{ order.customerName }</p>
                                            <span className={ `rounded-full px-2.5 py-1 text-[11px] font-semibold ${ getStatusStyle( order.status ) }` }>
                                                { formatStatus( order.status ) }
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-stone-500 dark:text-stone-400">
                                            { order.items.map( ( item ) => `${ item.name } × ${ item.quantity }` ).join( ", " ) || "No item details" }
                                        </p>
                                        <p className="mt-1 font-mono text-[11px] text-stone-400">#{ order.id.slice( 0, 8 ) }</p>
                                    </div>
                                    <div className="shrink-0 sm:text-right">
                                        <p className="font-semibold">{ currency.format( Number( order.total ) ) }</p>
                                        <time dateTime={ order.createdAt } className="text-xs text-stone-500 dark:text-stone-400">
                                            { new Date( order.createdAt ).toLocaleString( "en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                day: "numeric",
                                                month: "short",
                                                hour: "numeric",
                                                minute: "2-digit"
                                            } ) }
                                        </time>
                                    </div>
                                </article>
                            ) ) }
                        </div>
                    ) : (
                        <p className="px-5 py-10 text-center text-sm text-stone-500 dark:text-stone-400">No orders yet.</p>
                    ) }
                </section>

                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 dark:border-stone-800">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                <AlertTriangle aria-hidden="true" size={ 19 } />
                            </span>
                            <div>
                                <h2 className="font-semibold">Stock alerts</h2>
                                <p className="text-xs text-stone-500 dark:text-stone-400">Items with fewer than 5 in stock</p>
                            </div>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            { data.lowStockItems.length }
                        </span>
                    </div>

                    { data.lowStockItems.length > 0 ? (
                        <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                            { data.lowStockItems.map( ( item ) => (
                                <li key={ item.id } className="flex items-center justify-between gap-3 px-5 py-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className={ `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ item.stockQuantity === 0 ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" }` }>
                                            <Package aria-hidden="true" size={ 17 } />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">{ item.name }</p>
                                            <p className={ `text-xs ${ item.stockQuantity === 0 ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300" }` }>
                                                { item.stockQuantity === 0 ? "Out of stock" : `${ item.stockQuantity } ${ item.unit.toLowerCase() } left` }
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={ `/admin/items/${ item.id }/edit-items` }
                                        aria-label={ `Edit ${ item.name }` }
                                        className="shrink-0 rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-700 dark:border-stone-700 dark:text-stone-200 dark:hover:text-orange-300">
                                        Edit
                                    </Link>
                                </li>
                            ) ) }
                        </ul>
                    ) : (
                        <div className="px-5 py-10 text-center">
                            <Package aria-hidden="true" className="mx-auto text-emerald-600 dark:text-emerald-400" size={ 26 } />
                            <p className="mt-2 text-sm font-medium">All items are well stocked.</p>
                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">No items below 5 in stock.</p>
                        </div>
                    ) }
                </section>
            </div>
        </main>
    );
}
