/*
  Warnings:

  - You are about to drop the column `profile_id` on the `calendars` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `links` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `recurring_rules` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `task_lists` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `workspaces` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspace_id` to the `folders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "calendars" DROP CONSTRAINT "calendars_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "recurring_rules" DROP CONSTRAINT "recurring_rules_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "reminders" DROP CONSTRAINT "reminders_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "task_lists" DROP CONSTRAINT "task_lists_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_profile_id_fkey";

-- DropIndex
DROP INDEX "profiles_email_key";

-- AlterTable
ALTER TABLE "calendars" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "profile_id",
ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "links" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "email",
DROP COLUMN "role",
DROP COLUMN "timezone",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "recurring_rules" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "reminders" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "task_lists" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "profile_id";

-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "profile_id",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user_code" TEXT NOT NULL,
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "user_id" TEXT NOT NULL,
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "otp" TEXT,
    "timezone" TEXT,
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccountToSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AccountToSession_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_code_key" ON "users"("user_code");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE INDEX "_AccountToSession_B_index" ON "_AccountToSession"("B");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_account_id_key" ON "profiles"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_name_key" ON "profiles"("user_name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToSession" ADD CONSTRAINT "_AccountToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToSession" ADD CONSTRAINT "_AccountToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
