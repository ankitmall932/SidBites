import Link from "next/link";
import Type from "./Type";
import { Plus } from "lucide-react";

export default function page ()
{
  return (
    <>
      <div>
        <Type />
      </div>
      <div className="fixed bottom-20 sm:right-20 right-10">
        <Link href={ `/admin/type/create` }>
          <Plus className="bg-blue-500 p-3 text-white rounded-xl hover:scale-105 active:scale-95 duration-200 " size={ 56 } color="white" strokeWidth={ 2.5 } />
        </Link>
      </div>
    </>
  )
}