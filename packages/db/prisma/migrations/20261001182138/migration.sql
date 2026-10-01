-- DropForeignKey
ALTER TABLE "calendars" DROP CONSTRAINT "calendars_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_from_id_fkey";

-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_to_id_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "task_lists" DROP CONSTRAINT "task_lists_folder_id_fkey";

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_lists" ADD CONSTRAINT "task_lists_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
