import { getItemByType } from "@/app/actions/admin/itemsActions";
import { BadgePercent, Boxes, Edit, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteItem from "./DeleteItem";

export default async function TypeItems ( { id }: { id: string; } )
{
    const response = await getItemByType( id );
    if ( !response.success )
    {
        return (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                Unable to load items: { response.message }
            </div>
        );
    }

    const items = response.data ?? [];
    if ( items.length === 0 )
    {
        return (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-900/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    <Package size={ 24 } />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white">No items in this type yet</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add an item to start building this collection.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                { items.length } { items.length === 1 ? "item" : "items" }
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                { items.map( ( item ) =>
                {
                    const isOutOfStock = item.stockQuantity <= 0;
                    const isLowStock = !isOutOfStock && item.stockQuantity <= 5;

                    return (
                        <article
                            key={ item.id }
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-800"
                        >
                            <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-orange-100 to-amber-50 dark:from-gray-800 dark:to-gray-900">
                                { item.imageUrl ? (
                                    <Image
                                        src={ item.imageUrl }
                                        alt={ `${ item.name } image` }
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-orange-500 dark:text-orange-300">
                                        <Package size={ 32 } strokeWidth={ 1.5 } />
                                    </div>
                                ) }
                                { item.discount && item.discount.toNumber() > 0 ? (
                                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-orange-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
                                        <BadgePercent size={ 12 } />
                                        { item.discount.toString() }% off
                                    </span>
                                ) : null }
                            </div>

                            <div className="space-y-2.5 p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{ item.name }</h3>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            { item.quantity.toString() } { item.unit }
                                        </p>
                                    </div>
                                    <span className="shrink-0 rounded-md bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                                        Rs. { item.price.toString() }
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs dark:border-gray-800">
                                    <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                        <Boxes size={ 14 } />
                                        Stock
                                    </span>
                                    <span className={ `font-medium ${ isOutOfStock ? "text-red-600 dark:text-red-400" : isLowStock ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400" }` }>
                                        { isOutOfStock ? "Out of stock" : `${ item.stockQuantity.toString() } ${ item.unit }${ isLowStock ? " · Low" : "" }` }
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-800">
                                    <Link
                                        href={ `/admin/items/${ item.id }/edit-items` }
                                        aria-label={ `Edit ${ item.name }` }
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-gray-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                                    >
                                        <Edit size={ 16 } />
                                    </Link>
                                    <DeleteItem id={ item.id } />
                                </div>
                            </div>
                        </article>
                    );
                } ) }
            </div>
        </div>
    );
}
