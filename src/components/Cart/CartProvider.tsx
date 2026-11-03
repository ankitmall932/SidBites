"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import type { StoreApi } from "zustand";
import { createCartStore, type CartState } from "@/lib/store/cartStore";

export const CartStoreContext = createContext<StoreApi<CartState> | null>( null );

export function CartProvider ( { children, userId }: { children: ReactNode; userId: string | null; } )
{
    const [ store ] = useState( () => createCartStore( userId ) );

    useEffect( () =>
    {
        void store.getState().loadCart();
    }, [ store ] );

    return <CartStoreContext.Provider value={ store }>{ children }</CartStoreContext.Provider>;
}
