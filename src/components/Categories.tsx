import { getType } from "@/app/actions/publicAction";
import { Layers3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Categories ()
{
    const response = await getType();

    if ( !response.success )
    {
        return (
            <section aria-labelledby="categories-title" className="space-y-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">Find your craving</p>
                    <h2 id="categories-title" className="mt-1 text-2xl font-bold tracking-tight">Explore our categories</h2>
                </div>
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Categories couldn’t be loaded: { response.message }
                </div>
            </section>
        );
    }

    const types = response.data ?? [];

    return (
        <section aria-labelledby="categories-title" className="space-y-4">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">Find your craving</p>
                    <h2 id="categories-title" className="mt-1 text-2xl font-bold tracking-tight">Explore our categories</h2>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800 dark:bg-orange-950/50 dark:text-orange-200">
                    <Layers3 size={ 14 } />
                    { types.length } { types.length === 1 ? "category" : "categories" }
                </span>
            </div>

            { types.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-2 sm:gap-3">
                    { types.map( ( type ) => (
                        <Link href={ `/categories/${ type.id }` }
                            key={ type.id }
                            className="group flex w-18 shrink-0 flex-col items-center gap-2 text-center sm:w-20" >
                            <div className="relative h-14 w-14 overflow-hidden rounded-full bg-linear-to-br from-orange-100 via-amber-50 to-orange-200 ring-1 ring-orange-200 transition group-hover:scale-105 group-hover:ring-orange-400 sm:h-16 sm:w-16 dark:from-stone-800 dark:via-stone-900 dark:to-orange-950 dark:ring-stone-700 dark:group-hover:ring-orange-700">
                                { type.imageUrl && (
                                    <Image
                                        src={ type.imageUrl }
                                        alt=""
                                        fill
                                        sizes="64px"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) }
                            </div>
                            <h3 className="line-clamp-2 min-h-8 w-full text-xs font-medium leading-4 text-stone-800 dark:text-stone-200">{ type.name }</h3>
                        </Link>
                    ) ) }
                </div>
            ) : (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 px-6 py-8 text-center dark:border-stone-700 dark:bg-stone-900/50">
                    <Layers3 size={ 26 } className="text-orange-500 dark:text-orange-300" />
                    <h3 className="mt-3 font-semibold text-stone-900 dark:text-stone-100">Our categories are getting ready</h3>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Please check back soon for something delicious.</p>
                </div>
            ) }
        </section>
    );
}
