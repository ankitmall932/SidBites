import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChefHat, Heart, Leaf, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
    title: "About | SidBites",
    description: "Get to know SidBites and discover a more personal way to explore your next meal.",
};

export default function AboutPage ()
{
    return (
        <main className="mx-auto max-w-7xl space-y-20 pb-12 text-stone-900 dark:text-stone-100">
            <section className="relative isolate overflow-hidden rounded-4xl bg-[#24170f] px-6 py-12 text-orange-50 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                <div aria-hidden="true" className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
                <div aria-hidden="true" className="absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="max-w-2xl">
                        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200/20 bg-white/5 px-4 py-2 text-sm font-semibold tracking-wide text-orange-200">
                            <span className="h-2 w-2 rounded-full bg-orange-400" />
                            A little more joy in every bite
                        </p>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Good food brings us <span className="text-orange-400">closer.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-7 text-orange-50/75 sm:text-lg">
                            SidBites makes it easier to find something you love, keep your favourites close, and enjoy the moments that happen around a good meal.
                        </p>
                        <Link
                            href="/menu"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-400 px-6 py-3 font-semibold text-stone-950 transition hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                        >
                            Explore the menu <ArrowRight aria-hidden="true" size={ 18 } />
                        </Link>
                    </div>

                    <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
                        <div aria-hidden="true" className="absolute inset-4 rounded-full border border-orange-100/15" />
                        <div aria-hidden="true" className="absolute inset-10 rounded-full border border-orange-100/10" />
                        <div className="flex h-56 w-56 items-center justify-center rounded-full bg-linear-to-br from-amber-300 via-orange-400 to-orange-700 shadow-[0_24px_100px_rgba(251,146,60,0.28)] sm:h-64 sm:w-64">
                            <ChefHat aria-hidden="true" className="h-28 w-28 text-[#24170f]" strokeWidth={ 1.3 } />
                        </div>
                        <div className="absolute right-0 top-12 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
                            <p className="text-sm font-semibold">Made for food lovers</p>
                            <p className="mt-1 text-xs text-orange-100/70">Find your next favourite</p>
                        </div>
                        <div className="absolute bottom-10 left-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
                            <p className="text-xs uppercase tracking-[0.18em] text-orange-100/60">Discover</p>
                            <p className="mt-1 font-semibold">Save what you love</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">The SidBites idea</p>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your next great bite starts here.</h2>
                </div>
                <div className="space-y-5 text-base leading-8 text-stone-600 dark:text-stone-300">
                    <p>
                        Choosing what to eat should feel exciting, not like another chore. SidBites brings the menu and the little details that make choosing easier into one welcoming place.
                    </p>
                    <p>
                        Browse at your own pace, save the dishes you want to come back to, and use your account to keep your food journey organised. It is a simple idea: make room for more good food and less guesswork.
                    </p>
                </div>
            </section>

            <section aria-labelledby="about-values-title">
                <div className="mb-8 max-w-2xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">What matters to us</p>
                    <h2 id="about-values-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Thoughtful by nature.</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    <article className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                            <UtensilsCrossed aria-hidden="true" size={ 23 } />
                        </span>
                        <h3 className="mt-6 text-xl font-bold">A menu made to explore</h3>
                        <p className="mt-3 leading-7 text-stone-600 dark:text-stone-400">Take your time, find something that sounds just right, and make your next meal your own.</p>
                    </article>
                    <article className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                            <Heart aria-hidden="true" size={ 23 } />
                        </span>
                        <h3 className="mt-6 text-xl font-bold">Your favourites, remembered</h3>
                        <p className="mt-3 leading-7 text-stone-600 dark:text-stone-400">Keep the dishes you love close by saving them to your wishlist for another day.</p>
                    </article>
                    <article className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                            <Leaf aria-hidden="true" size={ 23 } />
                        </span>
                        <h3 className="mt-6 text-xl font-bold">A little more personal</h3>
                        <p className="mt-3 leading-7 text-stone-600 dark:text-stone-400">Sign in to keep your account and orders together in one convenient place.</p>
                    </article>
                </div>
            </section>

            <section className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-orange-50 px-6 py-9 dark:bg-stone-900 sm:px-10 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-800 dark:text-orange-300">Come hungry</p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Let’s find your next favourite.</h2>
                </div>
                <Link
                    href="/menu"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#24170f] px-6 py-3 font-semibold text-white transition hover:bg-orange-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:bg-orange-400 dark:text-stone-950 dark:hover:bg-orange-300"
                >
                    Browse the menu <ArrowRight aria-hidden="true" size={ 18 } />
                </Link>
            </section>
        </main>
    );
}
