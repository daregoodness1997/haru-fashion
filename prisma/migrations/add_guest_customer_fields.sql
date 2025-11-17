-- Add guest customer fields to orders table
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customerName" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customerEmail" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customerPhone" TEXT;
