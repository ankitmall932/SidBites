import { addToCart, getCart, updateCart } from "@/app/actions/user/cartAction";
import { createStore } from "zustand";

export type CartProduct = {
    id: string;
    name: string;
    price: string;
    amount: string;
    unit: string;
    stockQuantity: number;
    imageUrl: string | null;
    discount: string | null;
};

export type CartEntry = CartProduct & {
    quantity: number;
};

export type CartState = {
    items: CartEntry[];
    isLoading: boolean;
    error: string | null;
    errorItemId: string | null;
    pendingItemIds: string[];
    loadCart: () => Promise<void>;
    changeQuantity: ( item: CartProduct, change: number ) => Promise<void>;
    clearAfterOrder: () => void;
};

export function createCartStore ( userId: string | null )
{
    return createStore<CartState>()( ( set, get ) => ( {
        items: [],
        isLoading: Boolean( userId ),
        error: null,
        errorItemId: null,
        pendingItemIds: [],
        clearAfterOrder: () => set( { items: [], error: null, errorItemId: null } ),
        loadCart: async () =>
        {
            if ( !userId || !get().isLoading )
            {
                return;
            }

            try
            {
                const result = await getCart();
                if ( !result.success )
                {
                    set( { error: result.message } );
                    return;
                }
                set( { items: result.data, error: null } );
            } catch ( error )
            {
                set( {
                    error: error instanceof Error ? error.message : "Unable to load your cart"
                } );
            } finally
            {
                set( { isLoading: false } );
            }
        },
        changeQuantity: async ( item, change ) =>
        {
            if ( get().pendingItemIds.includes( item.id ) )
            {
                return;
            }

            const previousItems = get().items;
            const previousItem = previousItems.find( ( entry ) => entry.id === item.id ) ?? null;
            const quantity = ( previousItem?.quantity ?? 0 ) + change;
            if ( !Number.isInteger( change ) || change === 0 || quantity < 0 || ( change < 0 && !previousItem ) )
            {
                return;
            }
            if ( change > 0 && quantity > item.stockQuantity )
            {
                set( {
                    error: "No more stock available",
                    errorItemId: item.id
                } );
                return;
            }

            set( ( state ) => ( {
                items: state.items
                    .filter( ( entry ) => entry.id !== item.id )
                    .concat( quantity > 0
                        ? [ { ...previousItem, ...item, quantity } ]
                        : [] ),
                pendingItemIds: [ ...state.pendingItemIds, item.id ],
                error: null,
                errorItemId: null
            } ) );

            try
            {
                const result = change === 1
                    ? await addToCart( item.id, 1 )
                    : await updateCart( item.id, quantity );
                if ( !result.success )
                {
                    throw new Error( result.message );
                }
            } catch ( error )
            {
                set( {
                    items: previousItems,
                    error: error instanceof Error ? error.message : "Unable to update your cart",
                    errorItemId: item.id
                } );
            } finally
            {
                set( ( state ) => ( {
                    pendingItemIds: state.pendingItemIds.filter( ( id ) => id !== item.id )
                } ) );
            }
        }
    } ) );
}
