import { getAllItems } from "@/app/actions/admin/itemsActions";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgePercent, Boxes, Package } from "lucide-react";

export default async function AllItems ()
{
    const response = await getAllItems();
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
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/40">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    <Package size={ 26 } />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No items yet</h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                    Create a type first, then add your first item to the menu.
                </p>
                <Link
                    href="/admin/type"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                    Choose a type
                    <ArrowUpRight size={ 16 } />
                </Link>
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
                        <Link
                            href={ `/admin/type/${ item.typeId }` }
                            key={ item.id }
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-800"
                        >
                            <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-orange-100 to-amber-50 dark:from-gray-800 dark:to-gray-900">
                                { item.imageUrl ? (
                                    <Image
                                        src={ item.imageUrl }
                                        alt={ `${ item.name } image` }
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 transition group-hover:text-orange-700 dark:text-gray-400 dark:group-hover:text-orange-300">
                                    Open type <ArrowUpRight size={ 13 } />
                                </span>
                            </div>
                        </Link>
                    );
                } ) }
            </div>
        </div>
    );
}
