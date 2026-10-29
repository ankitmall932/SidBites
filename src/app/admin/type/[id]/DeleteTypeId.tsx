'use client';

import { deleteType } from "@/app/actions/admin/typeActions";
import { Trash } from "lucide-react";

export default function DeleteTypeId ( { id }: { id: string; } )
{
    const handleDelete = () =>
    {
        const confirm = window.confirm( 'Are you sure want to delete the type ??' );
        if ( confirm )
        {
            void deleteType( id );
        }
    };
    return (
        <div>
            <button className="cursor-pointer" onClick={ handleDelete }><Trash /></button>
        </div>
    );
}
