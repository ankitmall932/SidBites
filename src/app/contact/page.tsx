
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChefHat, CircleHelp, ClipboardList, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact | SidBites",
    description: "Get help finding your way around SidBites, your menu, account, and orders.",
};

const helpOptions = [
    {
        icon: UtensilsCrossed,
        eyebrow: "THE MENU",
        title: "Looking for something delicious?",
        description: "Browse the menu and find the dish that feels right for today.",
        href: "/menu",
        linkLabel: "Explore the menu",
    },
    {
        icon: ClipboardList,
        eyebrow: "YOUR ORDERS",
        title: "Need to check an order?",
        description: "Sign in to get to your account and keep track of your orders.",
        href: "/auth/login",
        linkLabel: "Sign in to your account",
    },
    {
        icon: CircleHelp,
        eyebrow: "YOUR ACCOUNT",
        title: "Need a hand signing in?",
        description: "Visit the sign-in page to access your account or recover your password.",
        href: "/auth/login",
        linkLabel: "Go to sign in",
    },
];

export default function ContactPage ()
{
    return (
        <main className="mx-auto max-w-7xl space-y-16 pb-12 text-stone-900 dark:text-stone-100">
            <section className="relative isolate overflow-hidden rounded-4xl bg-orange-50 px-6 py-12 dark:bg-stone-900 sm:px-10 sm:py-16 lg:px-16">
                <div aria-hidden="true" className="absolute -right-10 -top-20 -z-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-700/20" />
                <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
                    <div className="max-w-2xl">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-900 dark:border-orange-900 dark:bg-stone-800 dark:text-orange-300">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            We’re here to help
                        </p>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">How can we make things easier?</h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">
                            Whether you’re choosing a meal or finding your way around your account, start with the option that fits what you need.
                        </p>
                    </div>
                    <div className="hidden h-36 w-36 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-orange-500 text-[#24170f] shadow-lg md:flex">
                        <ChefHat aria-hidden="true" size={ 68 } strokeWidth={ 1.4 } />
                    </div>
                </div>
            </section>

            <section aria-labelledby="contact-options-title">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">Choose a starting point</p>
                    <h2 id="contact-options-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What can we help with?</h2>
                </div>
                <div className="grid gap-5 lg:grid-cols-3">
                    { helpOptions.map( ( option ) =>
                    {
                        const Icon = option.icon;

                        return (
                            <article key={ option.eyebrow } className="flex flex-col rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                                    <Icon aria-hidden="true" size={ 22 } />
                                </span>
                                <p className="mt-6 text-xs font-bold tracking-[0.18em] text-orange-700 dark:text-orange-300">{ option.eyebrow }</p>
                                <h3 className="mt-2 text-xl font-bold">{ option.title }</h3>
                                <p className="mt-3 flex-1 leading-7 text-stone-600 dark:text-stone-400">{ option.description }</p>
                                <Link
                                    href={ option.href }
                                    className="mt-7 inline-flex items-center gap-2 font-semibold text-orange-800 transition hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:text-orange-300 dark:hover:text-orange-200"
                                >
                                    { option.linkLabel } <ArrowRight aria-hidden="true" size={ 17 } />
                                </Link>
                            </article>
                        );
                    } ) }
                </div>
            </section>

            <section className="grid gap-8 rounded-4xl border border-stone-200 bg-white p-7 dark:border-stone-800 dark:bg-stone-900 sm:p-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">Still exploring?</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight">A good meal is just a few clicks away.</h2>
                </div>
                <div className="rounded-2xl bg-stone-50 p-6 dark:bg-stone-800">
                    <p className="leading-7 text-stone-600 dark:text-stone-300">
                        Head to the menu to see what’s available, or visit About to learn more about the SidBites experience.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link href="/menu" className="inline-flex items-center gap-2 rounded-full bg-[#24170f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:bg-orange-400 dark:text-stone-950 dark:hover:bg-orange-300">
                            <UtensilsCrossed aria-hidden="true" size={ 16 } /> View menu
                        </Link>
                        <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:border-stone-600 dark:hover:text-orange-300">
                            About SidBites <ArrowRight aria-hidden="true" size={ 16 } />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
