/*
  Warnings:

  - You are about to drop the column `amount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `payments` table. All the data in the column will be lost.
  - Added the required column `grossAmount` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "amount",
DROP COLUMN "createdAt",
ADD COLUMN     "grossAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "transactionTime" TIMESTAMP(3);
