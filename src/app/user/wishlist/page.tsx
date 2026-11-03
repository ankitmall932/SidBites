import { getWishlist } from "@/app/actions/user/wishlistAction";
import WishlistContent from "@/components/Wishlist/WishlistContent";

export default async function WishlistPage ()
{
    const response = await getWishlist();

    if ( !response.success )
    {
        return (
            <main className="mx-auto max-w-7xl">
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    Unable to load your wishlist: { response.message }
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl space-y-4 text-stone-900 dark:text-stone-100">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-300">Saved for later</p>
                    <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Your wishlist</h1>
                </div>
                <p className="shrink-0 text-xs text-stone-600 dark:text-stone-400">
                    { response.data.length } { response.data.length === 1 ? "item" : "items" }
                </p>
            </div>
            <WishlistContent initialItems={ response.data } />
        </main>
    );
}
