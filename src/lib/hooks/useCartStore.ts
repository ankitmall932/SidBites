"use client";

import { useContext } from "react";
import { useStore } from "zustand";
import { CartStoreContext } from "@/components/Cart/CartProvider";
import { getDiscountedPrice } from "@/lib/utils/pricing";

export function useCartStore ( itemId?: string )
{
    const store = useContext( CartStoreContext );
    if ( !store )
    {
        throw new Error( "useCartStore must be used within a CartProvider" );
    }

    const state = useStore( store );
    const item = state.items.find( ( cartItem ) => cartItem.id === itemId );
    const itemCount = state.items.reduce( ( total, item ) => total + item.quantity, 0 );
    const total = state.items.reduce(
        ( sum, item ) => sum + getDiscountedPrice( item.price, item.discount ).discountedPrice * item.quantity,
        0
    );

    return {
        ...state,
        itemCount,
        total,
        quantity: item?.quantity ?? 0,
        isItemPending: itemId ? state.pendingItemIds.includes( itemId ) : false,
        itemError: state.errorItemId === itemId ? state.error : null
    };
}
