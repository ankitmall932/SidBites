"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/actions/auth/auth-actions";

export default function DeleteAccountButton ()
{
    const [ isDeleting, setIsDeleting ] = useState( false );
    const [ error, setError ] = useState<string | null>( null );

    async function handleDelete ()
    {
        const confirmed = window.confirm(
            "Deleting your account is permanent. Your account and associated data will be deleted, and this action cannot be undone. Do you want to continue?"
        );
        if ( !confirmed ) return;

        setIsDeleting( true );
        setError( null );
        try
        {
            const result = await deleteAccount();
            if ( result && !result.success )
            {
                setError( result.message );
                setIsDeleting( false );
            }
        }
        catch ( error )
        {
            setError( error instanceof Error ? error.message : "Unable to delete account." );
            setIsDeleting( false );
        }
    }

    return (
        <>
            <button
                onClick={ handleDelete }
                type="button"
                disabled={ isDeleting }
                className="w-full rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
            >
                { isDeleting ? "Deleting..." : "Delete Account" }
            </button>
            { error && <p role="alert" className="mt-2 w-full text-center text-sm text-red-600 dark:text-red-400">{ error }</p> }
        </>
    );
}