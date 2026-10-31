import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Link2, Mail, MapPin, MessageCircle, Phone, Truck, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact SidBites | Order Food Delivery",
    description: "Contact SidBites to ask about delivery, place an order, or get help with your meal.",
};

const contacts = [
    {
        icon: Phone,
        label: "Call us",
        detail: "9305617987",
        helper: "Call SidBites about an order or delivery.",
        href: "tel:+919305617987",
        action: "Call now",
    },
    {
        icon: MessageCircle,
        label: "WhatsApp",
        detail: "9305617987",
        helper: "Message us about your order or delivery location.",
        href: "https://wa.me/919305617987",
        action: "Chat on WhatsApp",
    },
    {
        icon: Mail,
        label: "Email",
        detail: "ankitmall932@gmail.com",
        helper: "Send us your questions and feedback.",
        href: "mailto:ankitmall932@gmail.com",
        action: "Send an email",
    },
    {
        icon: Link2,
        label: "Instagram",
        detail: "@ankit_mall_932",
        helper: "Follow SidBites and keep up with us.",
        href: "https://www.instagram.com/ankit_mall_932",
        action: "Visit Instagram",
    },
];

export default function ContactPage ()
{
    return (
        <main className="mx-auto max-w-7xl space-y-14 pb-12 text-stone-900 dark:text-stone-100">
            <section className="relative isolate overflow-hidden rounded-4xl bg-[#24170f] px-6 py-12 text-orange-50 sm:px-10 sm:py-16 lg:px-16">
                <div aria-hidden="true" className="absolute -right-10 -top-20 -z-10 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
                <div aria-hidden="true" className="absolute -bottom-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
                    <div className="max-w-2xl">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-orange-200">
                            <Truck aria-hidden="true" size={ 16 } />
                            SidBites delivery restaurant
                        </p>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Craving something? Let’s talk.</h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-orange-50/75 sm:text-lg">
                            Call or message us to ask about delivery availability, place an order, or get help choosing something from the menu.
                        </p>
                    </div>
                    <div className="hidden h-36 w-36 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-orange-500 text-[#24170f] shadow-lg md:flex">
                        <UtensilsCrossed aria-hidden="true" size={ 60 } strokeWidth={ 1.4 } />
                    </div>
                </div>
            </section>

            <section aria-labelledby="contact-options-title">
                <div className="mb-7">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">We’re just a message away</p>
                    <h2 id="contact-options-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Get in touch with SidBites</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    { contacts.map( ( contact ) =>
                    {
                        const Icon = contact.icon;
                        const isExternal = contact.href.startsWith( "https://" );
                        return (
                            <article key={ contact.label } className="flex flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 sm:p-7">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                                    <Icon aria-hidden="true" size={ 22 } />
                                </span>
                                <p className="mt-5 text-sm font-semibold text-stone-500 dark:text-stone-400">{ contact.label }</p>
                                <h3 className="mt-1 break-all text-xl font-bold">{ contact.detail }</h3>
                                <p className="mt-2 flex-1 leading-7 text-stone-600 dark:text-stone-400">{ contact.helper }</p>
                                <a
                                    href={ contact.href }
                                    target={ isExternal ? "_blank" : undefined }
                                    rel={ isExternal ? "noreferrer" : undefined }
                                    className="mt-5 inline-flex w-fit items-center gap-2 font-semibold text-orange-800 transition hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:text-orange-300 dark:hover:text-orange-200"
                                >
                                    { contact.action } <ArrowRight aria-hidden="true" size={ 17 } />
                                </a>
                            </article>
                        );
                    } ) }
                </div>
            </section>

            <section className="grid gap-6 rounded-4xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-950 dark:bg-stone-900 sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-orange-800 dark:text-orange-300">
                        <MapPin aria-hidden="true" size={ 16 } />
                        Not sure if we deliver to you?
                    </p>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Ask us about your location.</h2>
                    <p className="mt-2 max-w-2xl leading-7 text-stone-600 dark:text-stone-300">
                        Delivery availability can vary by area. Give us a call or send a WhatsApp message and we’ll help you check.
                    </p>
                </div>
                <a href="https://wa.me/919305617987" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#24170f] px-6 py-3 font-semibold text-white transition hover:bg-orange-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 dark:bg-orange-400 dark:text-stone-950 dark:hover:bg-orange-300">
                    <MessageCircle aria-hidden="true" size={ 18 } />
                    Message us
                </a>
            </section>

            <section className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center sm:p-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">Ready to choose?</p>
                    <h2 className="mt-2 text-2xl font-bold">Find your next favourite on the menu.</h2>
                </div>
                <Link href="/menu" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700">
                    Explore menu <ArrowRight aria-hidden="true" size={ 18 } />
                </Link>
            </section>
        </main>
    );
}
