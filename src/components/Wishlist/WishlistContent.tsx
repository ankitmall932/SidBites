"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { useState } from "react";
import CartQuantityControl from "@/components/Cart/CartQuantityControl";
import DiscountedPrice from "@/components/DiscountedPrice";
import WishlistButton from "@/components/Wishlist/WishlistButton";
import type { CartProduct } from "@/lib/store/cartStore";

type WishlistProduct = CartProduct;

export default function WishlistContent ( { initialItems }: { initialItems: WishlistProduct[]; } )
{
    const [ items, setItems ] = useState( initialItems );

    return items.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            { items.map( ( item ) => (
                <article key={ item.id } className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-orange-800">
                    <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-orange-100 to-amber-50 dark:from-stone-800 dark:to-stone-900">
                        { item.imageUrl ? (
                            <Image
                                src={ item.imageUrl }
                                alt={ item.name }
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-cover transition duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-orange-500 dark:text-orange-300">
                                <Package size={ 26 } strokeWidth={ 1.5 } />
                            </div>
                        ) }
                        { item.discount && Number( item.discount ) > 0 && (
                            <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-orange-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                <span aria-hidden="true">%</span>
                                { item.discount }% off
                            </span>
                        ) }
                        <div className="absolute right-1.5 top-1.5">
                            <WishlistButton
                                itemId={ item.id }
                                initialSaved
                                onRemove={ () => setItems( ( current ) => current.filter( ( savedItem ) => savedItem.id !== item.id ) ) }
                            />
                        </div>
                    </div>
                    <div className="space-y-1 p-2">
                        <h2 className="truncate text-xs font-semibold sm:text-sm">{ item.name }</h2>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">{ item.amount } { item.unit }</p>
                        <div className="flex items-center justify-between gap-1 pt-0.5">
                            <DiscountedPrice
                                price={ item.price }
                                discount={ item.discount }
                                className="text-xs font-bold text-orange-700 dark:text-orange-300"
                            />
                            <CartQuantityControl item={ item } />
                        </div>
                    </div>
                </article>
            ) ) }
        </div>
    ) : (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 px-6 py-10 text-center dark:border-stone-700 dark:bg-stone-900/50">
            <Heart aria-hidden="true" className="text-rose-500 dark:text-rose-300" size={ 30 } />
            <h2 className="mt-3 font-semibold">Your wishlist is empty</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Save items from the menu to find them here.</p>
            <Link href="/menu" className="mt-4 rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                Browse menu
            </Link>
        </div>
    );
}
