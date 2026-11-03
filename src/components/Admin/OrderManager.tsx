"use client";

import { advanceOrderStatus, cancelOrderByAdmin } from "@/app/actions/admin/customerOrderActions";
import { useState } from "react";
import { Ban, ChevronRight, Package } from "lucide-react";

type AdminOrder = {
    id: string;
    status: "PENDING" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
    paymentMethod: "CASH_ON_DELIVERY" | "RAZORPAY";
    paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED";
    total: string;
    createdAt: string;
    address: { houseNumber: string; addressLine: string; city: string; pincode: string; };
    customer: { id: string; name: string; email: string; };
    items: { name: string; quantity: number; amount: string; unit: string; finalPrice: string; }[];
};

const statusLabels: Record<AdminOrder["status"], string> = {
    PENDING: "Pending",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled"
};

const nextStatus: Partial<Record<AdminOrder["status"], { label: string; next: AdminOrder["status"]; }>> = {
    PENDING: { label: "Start preparing", next: "PREPARING" },
    PREPARING: { label: "Out for delivery", next: "OUT_FOR_DELIVERY" },
    OUT_FOR_DELIVERY: { label: "Mark delivered", next: "DELIVERED" }
};

export default function OrderManager ( { initialOrders }: { initialOrders: AdminOrder[]; } )
{
    const [ orders, setOrders ] = useState( initialOrders );
    const [ pendingId, setPendingId ] = useState<string | null>( null );
    const [ error, setError ] = useState<string | null>( null );

    async function advance ( order: AdminOrder )
    {
        setPendingId( order.id );
        setError( null );
        const result = await advanceOrderStatus( order.id );
        if ( result.success )
        {
            const next = nextStatus[ order.status ]?.next;
            if ( next )
            {
                setOrders( ( current ) => current.map( ( entry ) => entry.id === order.id ? { ...entry, status: next } : entry ) );
            }
        } else
        {
            setError( result.message );
        }
        setPendingId( null );
    }

    async function cancel ( order: AdminOrder )
    {
        setPendingId( order.id );
        setError( null );
        const result = await cancelOrderByAdmin( order.id );
        if ( result.success )
        {
            setOrders( ( current ) => current.map( ( entry ) => entry.id === order.id ? { ...entry, status: "CANCELLED" } : entry ) );
        } else
        {
            setError( result.message );
        }
        setPendingId( null );
    }

    return (
        <div className="space-y-4">
            { error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    { error }
                </p>
            ) }
            { orders.length > 0 ? orders.map( ( order ) =>
            {
                const next = nextStatus[ order.status ];
                const isPending = pendingId === order.id;
                return (
                    <article key={ order.id } className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
                        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 px-4 py-4 dark:border-stone-800 sm:px-5">
                            <div>
                                <p className="font-semibold">{ order.customer.name }</p>
                                <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-300">{ order.customer.email }</p>
                                <p className="mt-1 font-mono text-xs text-stone-500 dark:text-stone-400">Order #{ order.id.slice( 0, 8 ).toUpperCase() }</p>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                    { new Date( order.createdAt ).toLocaleString( "en-IN", { dateStyle: "medium", timeStyle: "short" } ) }
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={ `rounded-full px-3 py-1 text-xs font-semibold ${ order.status === "CANCELLED" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" : order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300" }` }>
                                    { statusLabels[ order.status ] }
                                </span>
                                { next && (
                                    <button
                                        type="button"
                                        disabled={ isPending }
                                        onClick={ () => void advance( order ) }
                                        className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        <ChevronRight aria-hidden="true" size={ 14 } />
                                        { next.label }
                                    </button>
                                ) }
                                { order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                                    <button
                                        type="button"
                                        disabled={ isPending }
                                        onClick={ () => void cancel( order ) }
                                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                                    >
                                        <Ban aria-hidden="true" size={ 14 } />
                                        Cancel
                                    </button>
                                ) }
                            </div>
                        </header>
                        <div className="grid gap-5 px-4 py-4 sm:grid-cols-[1fr_auto] sm:px-5">
                            <div>
                                <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">Items</h2>
                                <div className="space-y-2">
                                    { order.items.map( ( item, index ) => (
                                        <div key={ `${ order.id }-${ index }` } className="flex items-center justify-between gap-3 text-sm">
                                            <span className="inline-flex min-w-0 items-center gap-2">
                                                <Package aria-hidden="true" className="shrink-0 text-orange-600 dark:text-orange-300" size={ 15 } />
                                                <span className="truncate">{ item.name } <span className="text-stone-500">× { item.quantity }</span></span>
                                            </span>
                                            <span className="shrink-0 font-medium">₹{ ( Number( item.finalPrice ) * item.quantity ).toFixed( 2 ) }</span>
                                        </div>
                                    ) ) }
                                </div>
                            </div>
                            <div className="space-y-2 text-sm sm:min-w-56">
                                <p className="font-bold">Total: ₹{ Number( order.total ).toFixed( 2 ) }</p>
                                <p className="text-xs text-stone-600 dark:text-stone-300">
                                    { order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on delivery" : "Razorpay" } · { order.paymentStatus }
                                </p>
                                <address className="text-xs not-italic leading-5 text-stone-600 dark:text-stone-300">
                                    { order.address.houseNumber }, { order.address.addressLine }<br />
                                    { order.address.city}, { order.address.pincode }
                                </address>
                                { order.status === "CANCELLED" && order.paymentStatus === "PAID" && (
                                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                                        Online payment was captured. Refund must be handled separately in Razorpay.
                                    </p>
                                ) }
                            </div>
                        </div>
                    </article>
                );
            } ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
                    No orders have been placed yet.
                </div>
            ) }
        </div>
    );
}
