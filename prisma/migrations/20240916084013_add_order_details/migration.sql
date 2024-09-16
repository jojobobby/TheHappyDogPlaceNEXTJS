/*
  Warnings:

  - Added the required column `customerEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "billingAddress" JSONB,
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL,
ADD COLUMN     "paymentTransactionId" TEXT,
ADD COLUMN     "shippingAddress" JSONB NOT NULL;
