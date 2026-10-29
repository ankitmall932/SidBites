import { getTypes } from "@/app/actions/admin/typeActions";
import Image from "next/image";
import Link from "next/link";

export default async function Type ()
{
  const response = await getTypes();
  if ( !response.success )
  {
    return <p>{ response.message }</p>;
  }
  const types = response.data ?? [];
  if ( types.length === 0 )
  {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <h1>No Types Found</h1>
      </div>
    );
  }
  return (
    <div className="p-2 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
      { types.map( ( type ) => (
        <Link href={ `/admin/type/${ type.id }` } key={ type.id } className="p-3 h-full w-full justify-center items-center flex flex-col gap-2 font-semibold border border-gray-700 dark:border-white rounded-2xl">
          <div className="flex items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            { type.imageUrl && (
              <Image src={ type.imageUrl } alt={ `${ type.name } image` } width={ 100 } height={ 100 } className="h-20 w-20 object-cover" sizes="(max-width: 768px) 80px, 100px" />
            ) }
          </div>
          <span>{ type.name }</span>
        </Link>
      ) ) }
    </div>
  );
}
