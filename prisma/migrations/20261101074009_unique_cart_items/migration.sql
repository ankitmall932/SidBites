/*
  Warnings:

  - A unique constraint covering the columns `[cartId]` on the table `cartItems` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `cartItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cartItems_cartId_key" ON "cartItems"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cartItems_itemId_key" ON "cartItems"("itemId");
