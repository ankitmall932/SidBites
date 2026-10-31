import { getItemById } from "@/app/actions/publicAction";
import { BadgePercent, Package } from "lucide-react";
import Image from "next/image";

export default async function CategoryPage ( { params }: { params: Promise<{ id: string; }>; } )
{
    const { id } = await params;
    const response = await getItemById( id );

    if ( !response.success )
    {
        return (
            <main className="mx-auto max-w-7xl">
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load items: { response.message }
                </div>
            </main>
        );
    }

    const items = response.data ?? [];

    return (
        <main className="mx-auto max-w-6xl space-y-4 text-stone-900 dark:text-stone-100">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">Category</p>
                    <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Items in this category</h1>
                </div>
                <p className="shrink-0 text-xs text-stone-600 dark:text-stone-400">
                    { items.length } { items.length === 1 ? "item" : "items" }
                </p>
            </div>

            { items.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    { items.map( ( item ) => (
                        <article key={ item.id } className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-orange-800">
                            <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-orange-100 to-amber-50 dark:from-stone-800 dark:to-stone-900">
                                { item.imageUrl ? (
                                    <Image
                                        src={ item.imageUrl }
                                        alt={ item.name }
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-orange-500 dark:text-orange-300">
                                        <Package size={ 26 } strokeWidth={ 1.5 } />
                                    </div>
                                ) }
                                { item.discount && item.discount.toNumber() > 0 ? (
                                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-orange-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                        <BadgePercent size={ 10 } />
                                        { item.discount.toString() }% off
                                    </span>
                                ) : null }
                            </div>
                            <div className="space-y-0.5 p-2">
                                <h2 className="truncate text-xs font-semibold sm:text-sm">{ item.name }</h2>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                    { item.quantity.toString() } { item.unit }
                                </p>
                                <p className="pt-0.5 text-xs font-bold text-orange-700 dark:text-orange-300">₹{ item.price.toString() }</p>
                            </div>
                        </article>
                    ) ) }
                </div>
            ) : (
                <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 px-6 py-10 text-center dark:border-stone-700 dark:bg-stone-900/50">
                    <Package size={ 28 } className="text-orange-500 dark:text-orange-300" />
                    <h2 className="mt-3 font-semibold">No items in this category yet</h2>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Please check back soon for something delicious.</p>
                </div>
            ) }
        </main>
    );
}
