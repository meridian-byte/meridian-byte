/*
  Warnings:

  - You are about to drop the column `months` on the `recurring_rules` table. All the data in the column will be lost.
  - You are about to drop the column `weekdays` on the `recurring_rules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "recurring_rule_id" TEXT;

-- AlterTable
ALTER TABLE "recurring_rules" DROP COLUMN "months",
DROP COLUMN "weekdays";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_recurring_rule_id_fkey" FOREIGN KEY ("recurring_rule_id") REFERENCES "recurring_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
