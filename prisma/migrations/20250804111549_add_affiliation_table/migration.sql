-- CreateTable
CREATE TABLE "affiliation" (
    "affiliation_id" SERIAL NOT NULL,
    "affiliation_name" TEXT NOT NULL,
    "affiliation_abbreviation" TEXT NOT NULL,

    CONSTRAINT "affiliation_pkey" PRIMARY KEY ("affiliation_id")
);
