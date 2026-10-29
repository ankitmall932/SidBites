'use client'

import { createType } from "@/app/actions/admin/typeActions"
import Link from "next/link"
import { useActionState } from "react"

export default function Create ()
{
    const [ state, formAction, isPending ] = useActionState( createType, { success: false, message: '' } )
    return (
        <div className="h-full w-full flex justify-center items-center ">
            <form action={ formAction } className="h-full w-120 flex flex-col gap-5 justify-center py-10 items-center border border-gray-200 dark:border-white rounded-2xl px-2">
                <h1 className="pb-5 sm:text-4xl text-2xl font-semibold">Please Create New Type</h1>
                { state.message && (
                    <p role={ state.success ? 'status' : 'alert' } className={ state.success ? 'text-green-700' : 'text-red-700' } >
                        { state.message }
                    </p>
                ) }
                <input className="p-3 w-full h-full border border-gray-400 dark:border-white rounded-2xl" type="text" placeholder="Please Enter the Type" name='name' required />
                <button className={ `bg-sky-500 p-2 rounded-xl text-white font-semibold w-fit cursor-pointer hover:scale-105 active:scale-95 ${ isPending && 'opacity-50 cursor-not-allowed' }` } type="submit" disabled={ isPending } >
                    { isPending ? 'Creating....' : 'Create' }
                </button>
                <div className="h-full w-full px-5">
                    <Link href={ '/admin/type' } className="text-sky-700 underline">Back to Types</Link>
                </div>
            </form>
        </div>
    )
}
