import { getDetailType } from "@/app/actions/admin/typeActions";
import { Edit, Plus } from "lucide-react";
import Link from "next/link";
import DeleteTypeId from "./DeleteTypeId";
import TypeItems from "./TypeItems";

export default async function page ( { params }: { params: Promise<{ id: string; }>; } )
{
    const { id } = await params;
    const response = await getDetailType( id );
    if ( !response.success || !response.data )
    {
        return <p>{ response.message ?? 'No Type Found ' }</p>;
    }
    return (
        <div className="flex flex-col gap-10">
            <div className="flex gap-5 justify-center items-center border border-gray-400 bg-gray-200 p-2 rounded-2xl dark:bg-gray-800 dark:text-white dark:border-white">
                <h1 className="text-2xl font-semibold">{ response.data.name }</h1>
                <Link href={ `/admin/type/${ id }/edit-type` }>
                    <Edit />
                </Link>
                <DeleteTypeId id={ id } />
            </div>
            <TypeItems id={ id } />
            <div className="fixed bottom-20 sm:right-20 right-10">
                <Link href={ `/admin/type/${ id }/create-item` }>
                    <Plus className="bg-blue-500 p-3 text-white rounded-xl hover:scale-105 active:scale-95 duration-200 " size={ 56 } color="white" strokeWidth={ 2.5 } />
                </Link>
            </div>
        </div>
    );
}
