import CreateForm from "./CreateForm";

export default async function page ( { params }: { params: Promise<{ id: string; }>; } )
{
    const { id } = await params;
    return (
        <div>
            <CreateForm id={ id } />
        </div>
    );
}
