-- CreateEnum
CREATE TYPE "ApplicableTo" AS ENUM ('ALL', 'EMPLOYEE', 'STUDENT');

-- AlterTable
ALTER TABLE "Concern" ADD COLUMN     "applicable_to" "ApplicableTo" NOT NULL DEFAULT 'ALL';
