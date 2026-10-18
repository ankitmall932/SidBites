'use client';


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeButton from "./Theme/Button";

export default function Navbar ()
{
    const [ menuOpen, setMenuOpen ] = useState( false );
    return (
        <div className="relative flex min-h-15 w-full items-center justify-between rounded-2xl borders border-white/30 bg-white/40 px-4 shadow-[0_0_25px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:px-5">
            <Link href={ "/" } aria-label="SidBites">
                <Image src="/SidLogo.png" width={ 120 } height={ 40 } alt="TaskHub" className="object-contain" />
            </Link>
            <div className="hidden items-center gap-5 lg:flex">
                <ThemeButton />
                Login
            </div>
            <div className=" lg:hidden flex flex-row">
                <ThemeButton />
                <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black" aria-label={ menuOpen ? "Close navigation menu" : "Open navigation menu" } aria-expanded={ menuOpen } aria-controls="mobile-navigation" onClick={ () => setMenuOpen( !menuOpen ) } >
                    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        { menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        ) }
                    </svg>
                </button>
            </div>
            { menuOpen && (
                <div id="mobile-navigation" className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 flex flex-col gap-2 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-xl backdrop-blur-2xl lg:hidden">
                    <div>Login</div>
                </div>
            ) }
        </div>
    );
}
