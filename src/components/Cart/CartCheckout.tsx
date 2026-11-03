"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banknote, CreditCard, MapPin, Package, ShoppingCart } from "lucide-react";
import CartQuantityControl from "@/components/Cart/CartQuantityControl";
import DiscountedPrice from "@/components/DiscountedPrice";
import { placeCashOnDeliveryOrder, createRazorpayOrder, verifyRazorpayPayment, cancelPendingRazorpayOrder } from "@/app/actions/user/orderActions";
import { useCartStore } from "@/lib/hooks/useCartStore";

type Address = {
    id: string;
    houseNumber: string;
    addressLine: string;
    city: string;
    pincode: string;
};

type RazorpaySuccess = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
};

type RazorpayOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: { name: string; email: string; };
    theme: { color: string; };
    handler: ( response: RazorpaySuccess ) => void;
    modal: { ondismiss: () => void; };
};

type RazorpayInstance = {
    open: () => void;
    on: ( event: "payment.failed", callback: ( response: { error?: { description?: string; }; } ) => void ) => void;
};

declare global
{
    interface Window
    {
        Razorpay?: new ( options: RazorpayOptions ) => RazorpayInstance;
    }
}

async function loadRazorpay ()
{
    if ( window.Razorpay )
    {
        return;
    }

    await new Promise<void>( ( resolve, reject ) =>
    {
        const script = document.createElement( "script" );
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject( new Error( "Unable to load Razorpay checkout" ) );
        document.body.appendChild( script );
    } );
}

export default function CartCheckout ( { addresses, addressError }: { addresses: Address[]; addressError: string | null; } )
{
    const router = useRouter();
    const { items, isLoading, error, total, clearAfterOrder } = useCartStore();
    const [ step, setStep ] = useState<"cart" | "address" | "payment">( "cart" );
    const [ selectedAddressId, setSelectedAddressId ] = useState( "" );
    const [ isPending, setIsPending ] = useState( false );
    const [ checkoutError, setCheckoutError ] = useState<string | null>( null );
    const hasUnavailableItems = items.some( ( item ) => item.stockQuantity <= 0 || item.quantity > item.stockQuantity );

    function finishOrder ()
    {
        clearAfterOrder();
        router.push( "/user/orders?placed=1" );
        router.refresh();
    }

    async function placeCodOrder ()
    {
        setIsPending( true );
        setCheckoutError( null );
        const result = await placeCashOnDeliveryOrder( selectedAddressId );
        if ( result.success )
        {
            finishOrder();
        } else
        {
            setCheckoutError( result.message );
            setIsPending( false );
        }
    }

    async function payOnline ()
    {
        setIsPending( true );
        setCheckoutError( null );
        const result = await createRazorpayOrder( selectedAddressId );
        if ( !result.success )
        {
            setCheckoutError( result.message );
            setIsPending( false );
            return;
        }

        try
        {
            await loadRazorpay();
            if ( !window.Razorpay )
            {
                throw new Error( "Razorpay checkout did not initialize" );
            }
            let paymentHandled = false;
            const checkout = new window.Razorpay( {
                key: result.keyId,
                amount: result.amount,
                currency: "INR",
                name: "SidBites",
                description: "Food order payment",
                order_id: result.razorpayOrderId,
                prefill: { name: result.name ?? "", email: result.email ?? "" },
                theme: { color: "#ea580c" },
                handler: ( payment ) =>
                {
                    paymentHandled = true;
                    void ( async () =>
                    {
                        const verification = await verifyRazorpayPayment(
                            result.orderId,
                            payment.razorpay_order_id,
                            payment.razorpay_payment_id,
                            payment.razorpay_signature
                        );
                        if ( verification.success )
                        {
                            finishOrder();
                        } else
                        {
                            setCheckoutError( verification.message );
                            setIsPending( false );
                        }
                    } )();
                },
                modal: {
                    ondismiss: () =>
                    {
                        if ( !paymentHandled )
                        {
                            void cancelPendingRazorpayOrder( result.orderId );
                            setCheckoutError( "Payment cancelled. Your cart is unchanged." );
                            setIsPending( false );
                        }
                    }
                }
            } );
            checkout.on( "payment.failed", ( response ) =>
            {
                paymentHandled = true;
                void cancelPendingRazorpayOrder( result.orderId );
                setCheckoutError( response.error?.description ?? "Payment failed. Please try again." );
                setIsPending( false );
            } );
            checkout.open();
        } catch ( error )
        {
            await cancelPendingRazorpayOrder( result.orderId );
            setCheckoutError( error instanceof Error ? error.message : "Unable to start online payment" );
            setIsPending( false );
        }
    }

    return (
        <main className="mx-auto max-w-4xl space-y-5 text-stone-900 dark:text-stone-100">
            <div className="flex items-center gap-3">
                <ShoppingCart aria-hidden="true" className="text-orange-600 dark:text-orange-300" size={ 25 } />
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">SidBites</p>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Your cart</h1>
                </div>
            </div>

            { error && !items.length && (
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load your cart: { error }
                </div>
            ) }

            { isLoading ? (
                <p role="status" className="rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
                    Loading your cart…
                </p>
            ) : items.length > 0 ? (
                <>
                    <div className="space-y-3">
                        { items.map( ( item ) => (
                            <article key={ item.id } className={ `flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:gap-4 sm:p-4 ${ item.stockQuantity <= 0 ? "opacity-60" : "" }` }>
                                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 text-orange-500 dark:bg-stone-800 dark:text-orange-300">
                                    { item.imageUrl ? (
                                        <Image src={ item.imageUrl } alt={ item.name } fill sizes="64px" className="object-cover" />
                                    ) : (
                                        <Package aria-hidden="true" size={ 24 } />
                                    ) }
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="truncate text-sm font-semibold sm:text-base">{ item.name }</h2>
                                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                        { item.amount } { item.unit } · <DiscountedPrice price={ item.price } discount={ item.discount } /> each
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
                                        Subtotal: <DiscountedPrice price={ item.price } discount={ item.discount } quantity={ item.quantity } />
                                    </p>
                                </div>
                                <CartQuantityControl item={ item } unavailable={ item.stockQuantity <= 0 } />
                            </article>
                        ) ) }
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-4 font-semibold dark:bg-stone-800">
                        <span>Total</span>
                        <span className="text-orange-700 dark:text-orange-300">₹{ total.toFixed( 2 ) }</span>
                    </div>

                    { step === "cart" && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                disabled={ hasUnavailableItems }
                                onClick={ () => { setStep( "address" ); setCheckoutError( null ); } }
                                className="rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Order now
                            </button>
                        </div>
                    ) }

                    { hasUnavailableItems && (
                        <p role="alert" className="text-right text-sm text-red-600 dark:text-red-400">
                            Please remove unavailable items or adjust quantities before ordering.
                        </p>
                    ) }

                    { step === "address" && (
                        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 sm:p-5">
                            <div>
                                <h2 className="font-semibold">Select delivery address</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Choose where you want this order delivered.</p>
                            </div>
                            { addresses.length > 0 ? (
                                <div className="space-y-2">
                                    { addresses.map( ( address ) => (
                                        <label key={ address.id } className={ `flex cursor-pointer gap-3 rounded-xl border p-3 transition ${ selectedAddressId === address.id ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30" : "border-stone-200 dark:border-stone-700" }` }>
                                            <input
                                                type="radio"
                                                name="deliveryAddress"
                                                value={ address.id }
                                                checked={ selectedAddressId === address.id }
                                                onChange={ () => setSelectedAddressId( address.id ) }
                                                className="mt-1 accent-orange-600"
                                            />
                                            <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-300" size={ 17 } />
                                            <span className="min-w-0 text-sm">
                                                <span className="font-semibold">{ address.houseNumber }</span>
                                                <span className="mt-1 block text-stone-600 dark:text-stone-300">{ address.addressLine }</span>
                                                <span className="mt-0.5 block text-xs text-stone-500 dark:text-stone-400">{ address.city }, { address.pincode }</span>
                                            </span>
                                        </label>
                                    ) ) }
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-600 dark:border-stone-700 dark:text-stone-300">
                                    { addressError ?? "Add a delivery address before placing your order." }
                                </div>
                            ) }
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <Link href="/user/addresses" className="text-sm font-semibold text-orange-700 underline underline-offset-4 dark:text-orange-300">
                                    Manage addresses
                                </Link>
                                { selectedAddressId && (
                                    <button
                                        type="button"
                                        onClick={ () => { setStep( "payment" ); setCheckoutError( null ); } }
                                        className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                                    >
                                        Order now
                                    </button>
                                ) }
                            </div>
                        </section>
                    ) }

                    { step === "payment" && (
                        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 sm:p-5">
                            <div>
                                <h2 className="font-semibold">Choose payment method</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                    Deliver to { addresses.find( ( address ) => address.id === selectedAddressId )?.houseNumber } · { addresses.find( ( address ) => address.id === selectedAddressId )?.addressLine }
                                </p>
                            </div>
                            { checkoutError && (
                                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                                    { checkoutError }
                                </p>
                            ) }
                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    disabled={ isPending }
                                    onClick={ () => void placeCodOrder() }
                                    className="flex min-h-24 items-center gap-3 rounded-xl border border-stone-200 p-4 text-left transition hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 dark:border-stone-700 dark:hover:bg-orange-950/30"
                                >
                                    <Banknote aria-hidden="true" className="text-emerald-600 dark:text-emerald-400" size={ 24 } />
                                    <span>
                                        <span className="block font-semibold">Cash on delivery</span>
                                        <span className="mt-1 block text-xs text-stone-500 dark:text-stone-400">Place order and pay when it arrives</span>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    disabled={ isPending }
                                    onClick={ () => void payOnline() }
                                    className="flex min-h-24 items-center gap-3 rounded-xl border border-stone-200 p-4 text-left transition hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 dark:border-stone-700 dark:hover:bg-orange-950/30"
                                >
                                    <CreditCard aria-hidden="true" className="text-orange-600 dark:text-orange-300" size={ 24 } />
                                    <span>
                                        <span className="block font-semibold">Pay online</span>
                                        <span className="mt-1 block text-xs text-stone-500 dark:text-stone-400">Secure payment with Razorpay · ₹{ total.toFixed( 2 ) }</span>
                                    </span>
                                </button>
                            </div>
                            { isPending && <p role="status" className="text-center text-sm text-stone-500 dark:text-stone-400">Processing your order…</p> }
                            <button type="button" disabled={ isPending } onClick={ () => setStep( "address" ) } className="text-sm font-semibold text-orange-700 underline underline-offset-4 disabled:opacity-50 dark:text-orange-300">
                                Back to address
                            </button>
                        </section>
                    ) }
                </>
            ) : !error ? (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 px-6 py-10 text-center dark:border-stone-700 dark:bg-stone-900/50">
                    <Package aria-hidden="true" className="text-orange-500 dark:text-orange-300" size={ 30 } />
                    <h2 className="mt-3 font-semibold">Your cart is empty</h2>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Add something delicious from the menu.</p>
                    <Link href="/menu" className="mt-4 rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                        Browse menu
                    </Link>
                </div>
            ) : null }
        </main>
    );
}
