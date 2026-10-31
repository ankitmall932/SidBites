import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Link2, MapPin, Phone, ShoppingBag, Truck, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
    title: "About SidBites | Food Delivery",
    description: "Get to know SidBites: good food, easy ordering, and the comfort of enjoying a meal at home.",
};

const values = [
    {
        icon: UtensilsCrossed,
        title: "Food worth looking forward to",
        description: "A menu for finding something that fits your mood, your appetite, and your next meal.",
    },
    {
        icon: Heart,
        title: "Made with care",
        description: "We want every SidBites order to feel like a thoughtful little treat in your day.",
    },
    {
        icon: Truck,
        title: "From us to your place",
        description: "Enjoy the ease of getting a good meal delivered instead of stepping out.",
    },
];

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
                            <Truck aria-hidden="true" size={ 16 } />
                            Your neighbourhood food delivery restaurant
                        </p>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Good food, right where <span className="text-orange-400">you are.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-7 text-orange-50/75 sm:text-lg">
                            SidBites brings together the joy of a satisfying meal and the comfort of enjoying it at home. Browse, choose what you’re craving, and get in touch to order.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/menu"
                                className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-6 py-3 font-semibold text-stone-950 transition hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                            >
                                Explore the menu <ArrowRight aria-hidden="true" size={ 18 } />
                            </Link>
                            <a
                                href="tel:+919305617987"
                                className="inline-flex items-center gap-2 rounded-full border border-orange-100/20 px-5 py-3 font-semibold text-orange-100 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                            >
                                <Phone aria-hidden="true" size={ 17 } />
                                Call SidBites
                            </a>
                        </div>
                    </div>

                    <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
                        <div aria-hidden="true" className="absolute inset-4 rounded-full border border-orange-100/15" />
                        <div aria-hidden="true" className="absolute inset-10 rounded-full border border-orange-100/10" />
                        <div className="flex h-56 w-56 items-center justify-center rounded-full bg-linear-to-br from-amber-300 via-orange-400 to-orange-700 shadow-[0_24px_100px_rgba(251,146,60,0.28)] sm:h-64 sm:w-64">
                            <Truck aria-hidden="true" className="h-28 w-28 text-[#24170f]" strokeWidth={ 1.3 } />
                        </div>
                        <div className="absolute right-0 top-12 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
                            <p className="text-sm font-semibold">A good meal, made easy</p>
                            <p className="mt-1 text-xs text-orange-100/70">Your place, your pace</p>
                        </div>
                        <a href="https://www.instagram.com/ankit_mall_932" target="_blank" rel="noreferrer" className="absolute bottom-10 left-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md transition hover:bg-white/15">
                            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-orange-100/60">
                                <Link2 size={ 14 } /> Follow us
                            </p>
                            <p className="mt-1 font-semibold">@ankit_mall_932</p>
                        </a>
                    </div>
                </div>
            </section>

            <section className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">The SidBites idea</p>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your cravings deserve an easy answer.</h2>
                </div>
                <div className="space-y-5 text-base leading-8 text-stone-600 dark:text-stone-300">
                    <p>
                        We believe choosing a meal should be the fun part of the day. SidBites is a delivery restaurant built around making it simple to discover a dish and enjoy it from the comfort of home.
                    </p>
                    <p>
                        Whether it’s a quick bite or a meal to share, we’re here to help you find something you’ll look forward to. Check out the menu and reach out to us for help with your order.
                    </p>
                    <p className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-medium leading-6 text-orange-950 dark:bg-orange-950/40 dark:text-orange-100">
                        <MapPin className="shrink-0" size={ 18 } />
                        Delivery availability depends on your location—contact us to check.
                    </p>
                </div>
            </section>

            <section aria-labelledby="about-values-title">
                <div className="mb-8 max-w-2xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">Why SidBites</p>
                    <h2 id="about-values-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A little more joy in every bite.</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    { values.map( ( value ) =>
                    {
                        const Icon = value.icon;
                        return (
                            <article key={ value.title } className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                                    <Icon aria-hidden="true" size={ 23 } />
                                </span>
                                <h3 className="mt-6 text-xl font-bold">{ value.title }</h3>
                                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-400">{ value.description }</p>
                            </article>
                        );
                    } ) }
                </div>
            </section>

            <section className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-orange-50 px-6 py-9 dark:bg-stone-900 sm:px-10 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-800 dark:text-orange-300">Let’s make it a meal</p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Pick your favourite. We’re one call away.</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 rounded-full bg-[#24170f] px-6 py-3 font-semibold text-white transition hover:bg-orange-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:bg-orange-400 dark:text-stone-950 dark:hover:bg-orange-300"
                    >
                        <ShoppingBag aria-hidden="true" size={ 17 } />
                        Browse the menu
                    </Link>
                    <a href="tel:+919305617987" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-3 font-semibold transition hover:border-orange-500 hover:text-orange-800 dark:border-stone-600 dark:hover:text-orange-300">
                        <Phone aria-hidden="true" size={ 17 } />
                        Call us
                    </a>
                </div>
            </section>
        </main>
    );
}
