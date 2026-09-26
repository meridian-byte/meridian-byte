/*
  Warnings:

  - The values [QUARTERLY,SEMI_ANNUALLY] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Frequency_new" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY');
ALTER TABLE "recurring_rules" ALTER COLUMN "frequency" TYPE "Frequency_new" USING ("frequency"::text::"Frequency_new");
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
ALTER TYPE "Frequency_new" RENAME TO "Frequency";
DROP TYPE "public"."Frequency_old";
COMMIT;
