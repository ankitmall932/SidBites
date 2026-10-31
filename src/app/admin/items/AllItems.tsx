import { getAllItems } from "@/app/actions/admin/itemsActions";
import Image from "next/image";
import Link from "next/link";

export default async function AllItems ()
{
    const response = await getAllItems();
    if ( !response.success )
    {
        return <p>{ response.message }</p>;
    }
    const items = response.data ?? [];
    if ( items.length === 0 )
    {
        return (
            <div >
                <h1>No Items found</h1>
            </div>
        );
    }
    return (
        <div className="h-full w-full grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
            { items.map( ( e ) => (
                <div key={ e.id } className="h-full w-full border border-gray-200  flex flex-col rounded-2xl gap-2 shadow">
                    { e.imageUrl && <Image src={ e.imageUrl } alt="Image" height={ 50 } width={ 150 } className="rounded-t-2xl object-cover h-35 w-full" /> }
                    <div className="flex flex-col gap-1 pb-2 px-5">
                        <h1 className="font-semibold">{ e.name }</h1>
                        <div className="flex flex-row justify-between items-center text-xs font-semibold">
                            <span>Rs. { e.price.toString() }</span><span >{ e.quantity.toString() } { e.unit }</span>
                        </div>
                        <div className="flex flex-row justify-between items-center text-xs font-semibold">
                            <span>InStock</span><span >{ e.stockQuantity.toString() } { e.unit }</span>
                        </div>
                        <div className="flex flex-row justify-between items-center text-xs font-semibold">
                            <span>Discount</span><span >{ e.discount?.toString() } % </span>
                        </div>
                        <div className="flex flex-row justify-between mt-2 items-center text-xs font-semibold">
                            <Link href={ `/admin/type/${ e.typeId }` } className="p-2 rounded-2xl bg-blue-500 w-full text-center">View More</Link>
                        </div>
                    </div>
                </div>
            ) )
            }
        </div >
    );
}
