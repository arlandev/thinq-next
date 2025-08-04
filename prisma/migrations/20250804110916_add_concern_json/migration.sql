/*
  Warnings:

  - The `concern_faq` column on the `Concern` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Concern" DROP COLUMN "concern_faq",
ADD COLUMN     "concern_faq" JSONB[];
