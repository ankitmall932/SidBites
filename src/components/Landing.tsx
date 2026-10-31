import Link from "next/link";
import
{
    ArrowRight,
    Link2,
    MapPin,
    Phone,
    ShoppingBag,
    Sparkles,
    Truck,
    UtensilsCrossed,
} from "lucide-react";
import Categories from "./Categories";

const highlights = [
    {
        icon: UtensilsCrossed,
        title: "Something for every craving",
        description: "Explore the SidBites menu and pick a meal that hits the spot.",
    },
    {
        icon: ShoppingBag,
        title: "Made for easy ordering",
        description: "Found your favourite? Get in touch with us and we’ll help with your order.",
    },
    {
        icon: Truck,
        title: "Enjoy it at your place",
        description: "SidBites is all about bringing a good meal closer to home.",
    },
];

export default function Landing ()
{
    return (
        <main className="mx-auto max-w-7xl space-y-20 pb-12 text-stone-900 dark:text-stone-100">
            <section className="relative isolate overflow-hidden rounded-4xl bg-[#24170f] px-6 py-5 text-orange-50 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                <div aria-hidden="true" className="absolute -right-20 -top-32 -z-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
                <div aria-hidden="true" className="absolute -bottom-48 left-1/4 -z-10 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-orange-100/15 bg-white/5 px-4 py-2 text-sm font-semibold tracking-wide text-orange-200">
                            <Sparkles aria-hidden="true" size={ 16 } />
                            SidBites · Food delivered with a smile
                        </p>
                        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Your cravings.
                            <br />
                            <span className="text-orange-400">Our kitchen.</span>
                            <br />
                            Delivered.
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-7 text-orange-50/75 sm:text-lg">
                            Good food should fit your day. Explore the SidBites menu, find your next favourite, and get in touch to enjoy it at home.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
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
                                Call to order
                            </a>
                        </div>
                        <a href="#discover" className="mt-10 inline-flex items-center gap-2 text-sm text-orange-100/60 transition hover:text-orange-100">
                            Discover SidBites <ArrowRight aria-hidden="true" size={ 16 } />
                        </a>
                    </div>

                    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
                        <div aria-hidden="true" className="absolute inset-2 rounded-full border border-orange-100/10" />
                        <div aria-hidden="true" className="absolute inset-9 rounded-full border border-orange-100/10" />
                        <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-linear-to-br from-amber-200 via-orange-400 to-orange-700 shadow-[0_24px_100px_rgba(251,146,60,0.28)] sm:h-72 sm:w-72">
                            <div aria-hidden="true" className="absolute inset-5 rounded-full border border-white/40" />
                            <span aria-hidden="true" className="drop-shadow-md" style={ { fontSize: "7rem", lineHeight: 1 } }>🍽️</span>
                            <span aria-hidden="true" className="absolute right-8 top-12 text-3xl">✦</span>
                            <span aria-hidden="true" className="absolute bottom-12 left-9 text-2xl">✦</span>
                        </div>
                        <div className="absolute right-0 top-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400 text-stone-950">
                                <Truck aria-hidden="true" size={ 21 } />
                            </span>
                            <div>
                                <p className="text-sm font-semibold">Your meal, your place</p>
                                <p className="mt-0.5 text-xs text-orange-100/70">A little joy delivered</p>
                            </div>
                        </div>
                        <a href="https://www.instagram.com/ankit_mall_932" target="_blank" rel="noreferrer" className="absolute bottom-8 left-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md transition hover:bg-white/15">
                            <Link2 aria-hidden="true" className="text-orange-300" size={ 20 } />
                            <div>
                                <p className="text-xs uppercase tracking-[0.16em] text-orange-100/60">Follow along</p>
                                <p className="mt-0.5 font-semibold">@ankit_mall_932</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <section>
                <div>
                    <Categories />
                </div>
            </section>

            <section id="discover" aria-labelledby="discover-title" className="scroll-mt-28">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">The SidBites experience</p>
                        <h2 id="discover-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good food, made easy.</h2>
                    </div>
                    <Link href="/menu" className="inline-flex items-center gap-2 font-semibold text-orange-800 transition hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200">
                        Browse the menu <ArrowRight aria-hidden="true" size={ 17 } />
                    </Link>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    { highlights.map( ( highlight ) =>
                    {
                        const Icon = highlight.icon;
                        return (
                            <article key={ highlight.title } className="flex flex-col rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                                    <Icon aria-hidden="true" size={ 22 } />
                                </span>
                                <h3 className="mt-6 text-xl font-bold">{ highlight.title }</h3>
                                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-400">{ highlight.description }</p>
                            </article>
                        );
                    } ) }
                </div>
            </section>

            <section className="grid gap-8 overflow-hidden rounded-4xl bg-orange-50 p-7 dark:bg-stone-900 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
                <div className="max-w-2xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-800 dark:text-orange-300">Ready when you are</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Make tonight a little more delicious.</h2>
                    <p className="mt-4 leading-7 text-stone-600 dark:text-stone-300">Take a look at the menu, then call us and we’ll help you with your order.</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                        <MapPin size={ 16 } className="text-orange-700 dark:text-orange-300" />
                        Delivery availability may vary by location.
                    </p>
                </div>
                <Link
                    href="/contact"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#24170f] px-6 py-3 font-semibold text-white transition hover:bg-orange-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:bg-orange-400 dark:text-stone-950 dark:hover:bg-orange-300"
                >
                    Get in touch <ArrowRight aria-hidden="true" size={ 18 } />
                </Link>
            </section>
        </main>
    );
}
