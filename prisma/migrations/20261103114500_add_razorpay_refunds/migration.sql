ALTER TYPE "PaymentStatus" ADD VALUE 'REFUND_PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

ALTER TABLE "orders" ADD COLUMN "razorpayRefundId" TEXT;

CREATE UNIQUE INDEX "orders_razorpayRefundId_key" ON "orders"("razorpayRefundId");
