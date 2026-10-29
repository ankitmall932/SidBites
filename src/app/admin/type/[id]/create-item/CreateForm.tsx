'use client';

import { createItem } from "@/app/actions/admin/itemsActions";
import Link from "next/link";
import { useActionState } from "react";

const inputClass = "w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-600 dark:focus:ring-orange-950";

export default function CreateForm ( { id }: { id: string; } )
{
    const createWithId = createItem.bind( null, id );
    const [ state, formAction, isPending ] = useActionState( createWithId, { success: false, message: '' } );
    return (
        <form action={ formAction } className="mx-auto my-8 w-full max-w-lg space-y-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div>
                <h1 className="text-2xl font-semibold">Add item</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter the item details below.</p>
            </div>
            { state.message && (
                <p role={ state.success ? 'status' : 'alert' } className={ state.success ? 'text-sm text-green-700' : 'text-sm text-red-700' }>
                    { state.message }
                </p>
            ) }
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
                    <input id="name" className={ inputClass } name="name" type="text" placeholder="Item name" minLength={ 2 } required />
                </div>
                <div>
                    <div>
                        <label htmlFor="price" className="mb-1 block text-sm font-medium">Price (₹)</label>
                        <input id="price" className={ inputClass } name="price" type="number" min="1" step="0.01" placeholder="0.00" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="mb-1 block text-sm font-medium">Quantity</label>
                        <input id="quantity" className={ inputClass } name="quantity" type="number" min="0.01" step="any" placeholder="1" required />
                    </div>
                    <div>
                        <label htmlFor="unit" className="mb-1 block text-sm font-medium">Unit</label>
                        <select id="unit" className={ inputClass } name="unit" defaultValue="PIECE" required>
                            <option value="PIECE">Piece</option>
                            <option value="FULL">Full</option>
                            <option value="HALF">Half</option>
                            <option value="KG">Kg</option>
                            <option value="G">Gram</option>
                            <option value="L">Litre</option>
                            <option value="ML">Ml</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="stockQuantity" className="mb-1 block text-sm font-medium">StockQuantity</label>
                        <input id="stockQuantity" className={ inputClass } name="stockQuantity" type="number" min="0" step="1" defaultValue="0" required />
                    </div>
                    <div>
                        <label htmlFor="discount" className="mb-1 block text-sm font-medium">Discount </label>
                        <input id="discount" className={ inputClass } name="discount" type="number" min="0" step="0.01" defaultValue="0" required />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2">
                <Link href={ `/admin/type/${ id }` } className="text-sm text-gray-600 hover:underline dark:text-gray-300">
                    Cancel
                </Link>
                <button className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={ isPending }>
                    { isPending ? 'Saving…' : 'Save item' }
                </button>
            </div>
        </form>
    );
}
