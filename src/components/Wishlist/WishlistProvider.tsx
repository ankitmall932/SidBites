"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import type { StoreApi } from "zustand";
import { createWishlistStore, type WishlistState } from "@/lib/store/wishlistStore";

export const WishlistStoreContext = createContext<StoreApi<WishlistState> | null>( null );

export function WishlistProvider ( { children, userId }: { children: ReactNode; userId: string | null; } )
{
    const [ store ] = useState( () => createWishlistStore( userId ) );

    useEffect( () =>
    {
        void store.getState().loadWishlist();
    }, [ store ] );

    return <WishlistStoreContext.Provider value={ store }>{ children }</WishlistStoreContext.Provider>;
}
