-- AlterTable
ALTER TABLE "calendars" ADD COLUMN     "folder_id" TEXT;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "folder_id" TEXT;

-- AlterTable
ALTER TABLE "task_lists" ADD COLUMN     "folder_id" TEXT;

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_lists" ADD CONSTRAINT "task_lists_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
