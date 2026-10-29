import { getDetailType } from "@/app/actions/admin/typeActions";
import EditForm from "./EditForm";

export default async function page ( { params }: { params: Promise<{ id: string; }>; } )
{
    const { id } = await params;
    const response = await getDetailType( id );
    if ( !response.success || !response.data )
    {
        return <p>{ response.message ?? 'No Type Found ' }</p>;
    }
    return (
        <div>
            <EditForm id={ id } name={ response.data.name } />
        </div>
    );
}
