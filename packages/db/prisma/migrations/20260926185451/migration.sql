-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "event_id" TEXT,
ALTER COLUMN "task_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
