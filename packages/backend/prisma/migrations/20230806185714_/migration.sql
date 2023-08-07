/*
  Warnings:

  - You are about to drop the column `nanoUSDC` on the `MarketTrade` table. All the data in the column will be lost.
  - Added the required column `microUSDC` to the `MarketTrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarketTrade" DROP COLUMN "nanoUSDC",
ADD COLUMN     "microUSDC" BIGINT NOT NULL;
