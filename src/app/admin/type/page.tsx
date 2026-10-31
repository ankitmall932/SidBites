import { ArrowUpRight, Layers3, Plus } from "lucide-react";
import Link from "next/link";
import Type from "./Type";

export default function Page ()
{
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-orange-200 bg-linear-to-br from-orange-50 via-white to-amber-100 p-6 shadow-sm dark:border-orange-950 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950/40 sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700 dark:border-orange-900 dark:bg-gray-900/80 dark:text-orange-300">
              <Layers3 size={ 14 } />
              Admin workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
              Manage your types
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
              Organize your menu into clear collections. Select a type to view and manage its items.
            </p>
          </div>
          <Link
            href="/admin/type/create"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            <Plus size={ 18 } strokeWidth={ 2.5 } />
            Add type
            <ArrowUpRight size={ 16 } />
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Your types</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage the collections in your menu.</p>
        </div>
        <Type />
      </section>
    </main>
  );
}
