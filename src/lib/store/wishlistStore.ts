import { getWishlistItemIds, addToWishlist, removeFromWishlist } from "@/app/actions/user/wishlistAction";
import { createStore } from "zustand";

export type WishlistState = {
    itemIds: string[];
    isLoading: boolean;
    pendingItemIds: string[];
    errorItemId: string | null;
    error: string | null;
    loadWishlist: () => Promise<void>;
    toggleWishlist: ( itemId: string ) => Promise<boolean>;
};

export function createWishlistStore ( userId: string | null )
{
    return createStore<WishlistState>()( ( set, get ) => ( {
        itemIds: [],
        isLoading: Boolean( userId ),
        pendingItemIds: [],
        errorItemId: null,
        error: null,
        loadWishlist: async () =>
        {
            if ( !userId || !get().isLoading )
            {
                return;
            }

            try
            {
                const result = await getWishlistItemIds();
                if ( !result.success )
                {
                    set( { error: result.message } );
                    return;
                }
                set( { itemIds: result.data, error: null } );
            } catch ( error )
            {
                set( {
                    error: error instanceof Error ? error.message : "Unable to load wishlist"
                } );
            } finally
            {
                set( { isLoading: false } );
            }
        },
        toggleWishlist: async ( itemId ) =>
        {
            if ( get().pendingItemIds.includes( itemId ) )
            {
                return false;
            }

            const previousIds = get().itemIds;
            const isSaved = previousIds.includes( itemId );
            set( ( state ) => ( {
                itemIds: isSaved
                    ? state.itemIds.filter( ( id ) => id !== itemId )
                    : [ ...state.itemIds, itemId ],
                pendingItemIds: [ ...state.pendingItemIds, itemId ],
                errorItemId: null,
                error: null
            } ) );

            try
            {
                const result = isSaved
                    ? await removeFromWishlist( itemId )
                    : await addToWishlist( itemId );
                if ( !result.success )
                {
                    throw new Error( result.message );
                }
                return true;
            } catch ( error )
            {
                set( {
                    itemIds: previousIds,
                    errorItemId: itemId,
                    error: error instanceof Error ? error.message : "Unable to update wishlist"
                } );
                return false;
            } finally
            {
                set( ( state ) => ( {
                    pendingItemIds: state.pendingItemIds.filter( ( id ) => id !== itemId )
                } ) );
            }
        }
    } ) );
}
