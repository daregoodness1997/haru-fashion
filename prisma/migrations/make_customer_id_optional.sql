-- AlterTable: Make customerId optional in orders table
-- This allows guest checkout without user account

-- Drop the existing foreign key constraint
ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_customerId_fkey";

-- Make customerId nullable
ALTER TABLE "orders" ALTER COLUMN "customerId" DROP NOT NULL;

-- Recreate the foreign key constraint with ON DELETE SET NULL
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" 
  FOREIGN KEY ("customerId") 
  REFERENCES "users"("id") 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;

-- Update the index to handle null values
DROP INDEX IF EXISTS "orders_customerId_idx";
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId") WHERE "customerId" IS NOT NULL;
