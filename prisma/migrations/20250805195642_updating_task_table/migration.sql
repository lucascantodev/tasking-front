/*
  Warnings:

  - Added the required column `description` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "priority" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
