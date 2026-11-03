-- Drop the per-column constraints so a cart can contain multiple items
-- and an item can appear in multiple carts.
DROP INDEX "cartItems_cartId_key";
DROP INDEX "cartItems_itemId_key";

CREATE UNIQUE INDEX "cartItems_cartId_itemId_key" ON "cartItems"("cartId", "itemId");
