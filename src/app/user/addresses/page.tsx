import { getAddresses } from "@/app/actions/user/addressAction";
import AddressManager from "@/components/Addresses/AddressManager";
import { MapPin } from "lucide-react";

export default async function AddressesPage ()
{
    const response = await getAddresses();

    if ( !response.success )
    {
        return (
            <main className="mx-auto max-w-7xl">
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load addresses: { response.message }
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl space-y-6 text-stone-900 dark:text-stone-100">
            <header>
                <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">
                    <MapPin aria-hidden="true" size={ 14 } />
                    Delivery details
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Your addresses</h1>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Save multiple addresses for a faster checkout.</p>
            </header>
            <AddressManager initialAddresses={ response.data } />
        </main>
    );
}
