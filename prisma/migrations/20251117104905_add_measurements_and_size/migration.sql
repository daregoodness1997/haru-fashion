-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "size" TEXT,
ADD COLUMN     "useMeasurements" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "additionalNotes" TEXT,
ADD COLUMN     "chest" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "hips" TEXT,
ADD COLUMN     "inseam" TEXT,
ADD COLUMN     "neckSize" TEXT,
ADD COLUMN     "outseam" TEXT,
ADD COLUMN     "shoulderWidth" TEXT,
ADD COLUMN     "sleeveLength" TEXT,
ADD COLUMN     "waist" TEXT,
ADD COLUMN     "weight" TEXT;
