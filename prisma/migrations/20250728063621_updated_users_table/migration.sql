/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INQUIRER', 'DISPATCHER', 'PERSONNEL', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STUDENT', 'EMPLOYEE');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_firstname" TEXT NOT NULL,
    "user_lastname" TEXT NOT NULL,
    "user_dob" DATE NOT NULL,
    "user_status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "user_password" TEXT NOT NULL,
    "user_role" "UserRole" NOT NULL,
    "user_type" "UserType" NOT NULL,
    "user_affiliation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");
