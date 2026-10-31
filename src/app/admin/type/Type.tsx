import { getTypes } from "@/app/actions/admin/typeActions";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";

export default async function Type ()
{
  const response = await getTypes();
  if ( !response.success )
  {
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
        Unable to load types: { response.message }
      </div>
    );
  }
  const types = response.data ?? [];
  if ( types.length === 0 )
  {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/40">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
          <Layers3 size={ 26 } />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No types yet</h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          Create your first type to start organizing items on your menu.
        </p>
        <Link
          href="/admin/type/create"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Add your first type
          <ArrowUpRight size={ 16 } />
        </Link>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        { types.length } { types.length === 1 ? "type" : "types" }
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        { types.map( ( type ) => (
          <Link
            href={ `/admin/type/${ type.id }` }
            key={ type.id }
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-800"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-orange-100 to-amber-50 dark:from-gray-800 dark:to-gray-900">
              { type.imageUrl ? (
                <Image
                  src={ type.imageUrl }
                  alt={ `${ type.name } image` }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-orange-500 dark:text-orange-300">
                  <Layers3 size={ 42 } strokeWidth={ 1.5 } />
                </div>
              ) }
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <span className="truncate font-semibold text-gray-900 dark:text-white">{ type.name }</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition group-hover:bg-orange-100 group-hover:text-orange-700 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-orange-950 dark:group-hover:text-orange-300">
                <ArrowUpRight size={ 17 } />
              </span>
            </div>
          </Link>
        ) ) }
      </div>
    </div>
  );
}
