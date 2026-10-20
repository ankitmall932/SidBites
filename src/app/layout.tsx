import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/Theme/theme-provider";
import { getSession } from "@/lib/auth/getSession";

const geistSans = Geist( {
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
} );

const geistMono = Geist_Mono( {
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
} );

export const metadata: Metadata = {
  title: "SidBites",
  description: "SidBites web for food delivery ",
};

export default async function RootLayout ( { children }: LayoutProps<"/"> )
{
  const session = await getSession();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={ `${ geistSans.variable } ${ geistMono.variable } h-full antialiased` }
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <div className="fixed  top-4  sm:px-10 px-2 w-full">
            <Navbar session={ session } />
          </div>
          <div className="sm:px-10 px-2 pt-25 h-full w-full pb-10 flex-1">
            { children }
          </div>
          <div className="pb-5 sm:px-10 px-2 w-full">
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
