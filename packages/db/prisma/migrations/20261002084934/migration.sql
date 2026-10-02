/*
  Warnings:

  - You are about to drop the column `parent_folder` on the `folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "folders" DROP COLUMN "parent_folder",
ADD COLUMN     "folder_id" TEXT;
