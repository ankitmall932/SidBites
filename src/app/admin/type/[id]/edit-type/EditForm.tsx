'use client';
import { editDetailType } from "@/app/actions/admin/typeActions";
import Link from "next/link";
import { useActionState } from "react";


const inputClass = "w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-600 dark:focus:ring-orange-950";
export default function EditForm ( { id, name }: { id: string, name: string; } )
{
    const taskId = id;
    const editWithId = editDetailType.bind( null, taskId );
    const [ state, formAction, isPending ] = useActionState( editWithId, { success: false, message: '' } );
    return (
        <div className="h-full w-full flex justify-center items-center ">
            <form action={ formAction } className="mx-auto my-8 w-full max-w-lg space-y-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                <div>
                    <h1 className="text-2xl font-semibold">Add Type</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter the type details below.</p>
                </div>
                { state.message && (
                    <p role={ state.success ? 'status' : 'alert' } className={ state.success ? 'text-sm text-green-700' : 'text-sm text-red-700' }>
                        { state.message }
                    </p>
                ) }
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
                        <input id="name" className={ inputClass } name="name" type="text" defaultValue={ name } minLength={ 2 } required />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <Link href={ `/admin/type` } className="text-sm text-gray-600 hover:underline dark:text-gray-300">
                            Cancel
                        </Link>
                        <button className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={ isPending }>
                            { isPending ? 'Saving…' : 'Save item' }
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
