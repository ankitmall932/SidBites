/*
  Warnings:

  - You are about to drop the column `image` on the `types` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "types" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "imageUrl" TEXT;
