"use client";

import { useContext } from "react";
import { useStore } from "zustand";
import { WishlistStoreContext } from "@/components/Wishlist/WishlistProvider";

export function useWishlistStore ( itemId?: string )
{
    const store = useContext( WishlistStoreContext );
    if ( !store )
    {
        throw new Error( "useWishlistStore must be used within a WishlistProvider" );
    }

    const state = useStore( store );
    return {
        ...state,
        itemCount: state.itemIds.length,
        isSaved: itemId ? state.itemIds.includes( itemId ) : false,
        isItemPending: itemId ? state.pendingItemIds.includes( itemId ) : false,
        itemError: state.errorItemId === itemId ? state.error : null
    };
}
