import { getMyOrders } from "@/app/actions/user/orderActions";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

const statusLabels = {
    PENDING: "Pending",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled"
};

export default async function OrdersPage ( { searchParams }: { searchParams: Promise<{ placed?: string; }>; } )
{
    const [ response, params ] = await Promise.all( [ getMyOrders(), searchParams ] );
    if ( !response.success )
    {
        return (
            <main className="mx-auto max-w-5xl">
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load orders: { response.message }
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl space-y-5 text-stone-900 dark:text-stone-100">
            <header>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">SidBites</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">Your orders</h1>
            </header>
            { params.placed === "1" && (
                <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                    Your order was placed successfully.
                </p>
            ) }

            { response.data.length > 0 ? (
                <div className="space-y-4">
                    { response.data.map( ( order ) => (
                        <article key={ order.id } className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
                            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-4 dark:border-stone-800 sm:px-5">
                                <div>
                                    <p className="text-xs text-stone-500 dark:text-stone-400">Order #{ order.id.slice( 0, 8 ).toUpperCase() }</p>
                                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                        { new Date( order.createdAt ).toLocaleString( "en-IN", { dateStyle: "medium", timeStyle: "short" } ) }
                                    </p>
                                </div>
                                <span className={ `rounded-full px-3 py-1 text-xs font-semibold ${ order.status === "CANCELLED" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" : order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300" }` }>
                                    { statusLabels[ order.status ] }
                                </span>
                            </header>
                            <div className="space-y-3 px-4 py-4 sm:px-5">
                                { order.items.map( ( item, index ) => (
                                    <div key={ `${ order.id }-${ index }` } className="flex items-start justify-between gap-3 text-sm">
                                        <div>
                                            <p className="font-medium">{ item.itemName }</p>
                                            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{ item.quantity } × { item.amount } { item.unit }</p>
                                        </div>
                                        <p className="shrink-0 font-semibold">₹{ ( Number( item.finalPrice ) * item.quantity ).toFixed( 2 ) }</p>
                                    </div>
                                ) ) }
                            </div>
                            <footer className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 px-4 py-3 text-sm dark:bg-stone-800/60 sm:px-5">
                                <div className="text-xs text-stone-600 dark:text-stone-300">
                                    <p>{ order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on delivery" : "Razorpay" } · { order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus === "UNPAID" ? "Pay on delivery" : order.paymentStatus }</p>
                                    <p className="mt-1">{ order.houseNumber }, { order.addressLine }, { order.city } { order.pincode }</p>
                                </div>
                                <p className="font-bold">Total: ₹{ Number( order.total ).toFixed( 2 ) }</p>
                            </footer>
                        </article>
                    ) ) }
                </div>
            ) : (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 px-6 py-10 text-center dark:border-stone-700 dark:bg-stone-900/50">
                    <Package aria-hidden="true" className="text-orange-500 dark:text-orange-300" size={ 30 } />
                    <h2 className="mt-3 font-semibold">No orders yet</h2>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Your placed orders will show up here.</p>
                    <Link href="/menu" className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                        <ShoppingBag aria-hidden="true" size={ 16 } />
                        Browse menu
                    </Link>
                </div>
            ) }
        </main>
    );
}
