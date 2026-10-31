import { getDetailItem } from "@/app/actions/admin/itemsActions";
import EditForm from "./EditForm";

export default async function page ( { params }: { params: Promise<{ id: string; }>; } )
{
    const { id } = await params;
    const response = await getDetailItem( id );
    if ( !response.success || !response.data )
    {
        return <p>{ response.message }</p>;
    }
    return (
        <div>
            <EditForm id={ id } name={ response.data.name } price={ response.data.price.toString() } quantity={ response.data.quantity.toString() } unit={ response.data.unit.toString() } stockQuantity={ response.data.stockQuantity.toString() } discount={ response.data.discount?.toString() } image={ response.data.imageUrl } />
        </div>
    );
}
