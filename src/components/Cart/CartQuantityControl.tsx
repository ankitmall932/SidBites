"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/hooks/useCartStore";
import type { CartProduct } from "@/lib/store/cartStore";

export default function CartQuantityControl ( { item, unavailable = false }: { item: CartProduct; unavailable?: boolean; } )
{
    const { quantity, isLoading, isItemPending, itemError, changeQuantity } = useCartStore( item.id );
    const stockReached = quantity >= item.stockQuantity;
    const removeItem = () => void changeQuantity( item, -quantity );

    return (
        <div className="flex flex-col items-end gap-1">
            { unavailable ? (
                <>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">Out of stock</p>
                    <button
                        type="button"
                        disabled={ isLoading || isItemPending }
                        onClick={ removeItem }
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                        <Trash2 aria-hidden="true" size={ 13 } />
                        Remove from cart
                    </button>
                </>
            ) : (
                <div className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 p-0.5 text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200">
                    { quantity > 0 && (
                        <>
                            <button
                                type="button"
                                aria-label={ `Remove one ${ item.name }` }
                                disabled={ isLoading || isItemPending }
                                onClick={ () => void changeQuantity( item, -1 ) }
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-orange-100 disabled:opacity-50 dark:hover:bg-orange-900"
                            >
                                <Minus aria-hidden="true" size={ 15 } />
                            </button>
                            <span aria-live="polite" className="min-w-5 text-center text-xs font-semibold">{ quantity }</span>
                        </>
                    ) }
                    <button
                        type="button"
                        aria-label={ `Add ${ item.name } to cart` }
                        disabled={ isLoading || isItemPending || stockReached }
                        onClick={ () => void changeQuantity( item, 1 ) }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-orange-100 disabled:opacity-50 dark:hover:bg-orange-900"
                    >
                        <Plus aria-hidden="true" size={ 16 } />
                    </button>
                </div>
            ) }
            { ( itemError || ( stockReached && !unavailable ) ) && (
                <p role="status" className="max-w-40 text-right text-[10px] text-red-600 dark:text-red-400">
                    { itemError ?? "No more stock available" }
                </p>
            ) }
        </div>
    );
}
