-- CreateTable
CREATE TABLE "subconcern" (
    "subconcern_id" SERIAL NOT NULL,
    "subconcern_title" TEXT NOT NULL,
    "concern_id" INTEGER,

    CONSTRAINT "subconcern_pkey" PRIMARY KEY ("subconcern_id")
);

-- AddForeignKey
ALTER TABLE "subconcern" ADD CONSTRAINT "subconcern_concern_id_fkey" FOREIGN KEY ("concern_id") REFERENCES "Concern"("concern_id") ON DELETE SET NULL ON UPDATE CASCADE;
