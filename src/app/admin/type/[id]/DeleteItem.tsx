'use client';

import { deleteItem } from "@/app/actions/admin/itemsActions";
import { Trash2 } from "lucide-react";

export default function DeleteItem ( { id }: { id: string; } )
{
    const handleDelete = () =>
    {
        const confirm = window.confirm( 'Are you sure want to delete the item? The action cannot be undone.' );
        if ( confirm )
        {
            void deleteItem( id );
        }
    };
    return (
        <div>
            <Trash2 onClick={ handleDelete } size={ 30 } className="p-2 rounded-full bg-red-500  hover:cursor-pointer" />
        </div>
    );
}
