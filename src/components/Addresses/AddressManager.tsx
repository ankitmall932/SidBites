"use client";

import { addAddress, deleteAddress } from "@/app/actions/user/addressAction";
import { useState, type FormEvent } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

export type SavedAddress = {
    id: string;
    houseNumber: string;
    addressLine: string;
    city: string;
    pincode: string;
};

export default function AddressManager ( { initialAddresses }: { initialAddresses: SavedAddress[]; } )
{
    const [ addresses, setAddresses ] = useState( initialAddresses );
    const [ isPending, setIsPending ] = useState( false );
    const [ error, setError ] = useState<string | null>( null );
    const [ success, setSuccess ] = useState<string | null>( null );

    async function handleAddAddress ( event: FormEvent<HTMLFormElement> )
    {
        event.preventDefault();
        const form = event.currentTarget;
        setIsPending( true );
        setError( null );
        setSuccess( null );

        const formData = new FormData( form );
        const result = await addAddress( formData );
        if ( result.success )
        {
            setAddresses( ( current ) => [ result.data, ...current ] );
            form.reset();
            setSuccess( "Address saved" );
        } else
        {
            setError( result.message );
        }
        setIsPending( false );
    }

    async function handleDeleteAddress ( address: SavedAddress )
    {
        setIsPending( true );
        setError( null );
        setSuccess( null );
        const result = await deleteAddress( address.id );
        if ( result.success )
        {
            setAddresses( ( current ) => current.filter( ( savedAddress ) => savedAddress.id !== address.id ) );
            setSuccess( "Address deleted" );
        } else
        {
            setError( result.message );
        }
        setIsPending( false );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                        <Plus aria-hidden="true" size={ 19 } />
                    </span>
                    <div>
                        <h2 className="font-semibold">Add a delivery address</h2>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Add house number and street/area</p>
                    </div>
                </div>

                <form onSubmit={ ( event ) => void handleAddAddress( event ) } className="space-y-4">
                    <div>
                        <label htmlFor="houseNumber" className="mb-1.5 block text-sm font-medium">House / building number</label>
                        <input
                            id="houseNumber"
                            name="houseNumber"
                            required
                            maxLength={ 100 }
                            autoComplete="address-line1"
                            placeholder="e.g. House 12, Flat 3B"
                            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-stone-700 dark:bg-stone-950"
                        />
                    </div>
                    <div>
                        <label htmlFor="addressLine" className="mb-1.5 block text-sm font-medium">Street / area / landmark</label>
                        <textarea
                            id="addressLine"
                            name="addressLine"
                            required
                            maxLength={ 300 }
                            autoComplete="address-line2"
                            rows={ 3 }
                            placeholder="Street, locality or nearby landmark"
                            className="w-full resize-y rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-stone-700 dark:bg-stone-950"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="city" className="mb-1.5 block text-sm font-medium">City</label>
                            <input id="city" value="Siswa Bazar" readOnly className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3 py-2.5 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300" />
                        </div>
                        <div>
                            <label htmlFor="pincode" className="mb-1.5 block text-sm font-medium">PIN code</label>
                            <input id="pincode" value="273163" readOnly className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3 py-2.5 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300" />
                        </div>
                    </div>

                    { error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{ error }</p> }
                    { success && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{ success }</p> }
                    <button
                        type="submit"
                        disabled={ isPending }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                    >
                        <Plus aria-hidden="true" size={ 16 } />
                        { isPending ? "Saving..." : "Save address" }
                    </button>
                </form>

                <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    We&apos;re coming soon to nearby areas. Delivery is currently limited to PIN code 273163.
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Saved addresses</h2>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{ addresses.length } saved</span>
                </div>

                { addresses.length > 0 ? addresses.map( ( address ) => (
                    <article key={ address.id } className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                <MapPin aria-hidden="true" size={ 18 } />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-semibold">{ address.houseNumber }</h3>
                                </div>
                                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{ address.addressLine }</p>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{ address.city }, { address.pincode }</p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
                            <button
                                type="button"
                                disabled={ isPending }
                                onClick={ () => void handleDeleteAddress( address ) }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                            >
                                <Trash2 aria-hidden="true" size={ 13 } />
                                Delete
                            </button>
                        </div>
                    </article>
                ) ) : (
                    <div className="rounded-2xl border border-dashed border-stone-300 px-5 py-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
                        No saved addresses yet. Add one to continue with delivery.
                    </div>
                ) }
            </section>
        </div>
    );
}
