"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/hooks/useWishlistStore";

export default function WishlistButton ( {
    itemId,
    initialSaved = false,
    onRemove
}: {
    itemId: string;
    initialSaved?: boolean;
    onRemove?: () => void;
} )
{
    const {
        isSaved: savedInStore,
        isLoading,
        isItemPending,
        itemError,
        toggleWishlist: updateWishlist
    } = useWishlistStore( itemId );
    const isSaved = isLoading ? initialSaved : savedInStore;

    async function toggleWishlist ()
    {
        if ( isLoading || isItemPending )
        {
            return;
        }

        const updated = await updateWishlist( itemId );
        if ( updated && isSaved )
        {
            onRemove?.();
        }
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                type="button"
                aria-label={ isSaved ? "Remove from wishlist" : "Add to wishlist" }
                aria-pressed={ isSaved }
                disabled={ isLoading || isItemPending }
                onClick={ () => void toggleWishlist() }
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-600 shadow-sm transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900/90 dark:text-stone-300 dark:hover:text-rose-400"
            >
                <Heart aria-hidden="true" size={ 17 } fill={ isSaved ? "currentColor" : "none" } className={ isSaved ? "text-rose-600 dark:text-rose-400" : "" } />
            </button>
            { itemError && <p role="alert" className="max-w-32 text-center text-[10px] text-red-600 dark:text-red-400">{ itemError }</p> }
        </div>
    );
}
