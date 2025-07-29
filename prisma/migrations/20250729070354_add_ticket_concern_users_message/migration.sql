-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('NEW', 'OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Concern" (
    "concern_id" SERIAL NOT NULL,
    "concern_title" TEXT NOT NULL,
    "concern_faq" TEXT[],

    CONSTRAINT "Concern_pkey" PRIMARY KEY ("concern_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "ticket_id" SERIAL NOT NULL,
    "ticket_submitteddate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_assigneddate" DATE NOT NULL,
    "inquirer_id" INTEGER NOT NULL,
    "assignee_id" INTEGER,
    "concern_id" INTEGER NOT NULL,
    "ticket_concern" TEXT NOT NULL,
    "ticket_subconcern" TEXT NOT NULL,
    "ticket_details" TEXT NOT NULL,
    "ticket_attachment" TEXT[],
    "ticket_status" "TicketStatus" NOT NULL DEFAULT 'NEW',
    "ticket_resolution" TEXT,
    "ticket_rating" INTEGER,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" SERIAL NOT NULL,
    "message_convoid" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message_senderfname" TEXT NOT NULL,
    "message_senderlname" TEXT NOT NULL,
    "message_content" TEXT[],
    "message_attachment" TEXT[],

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_concern_id_fkey" FOREIGN KEY ("concern_id") REFERENCES "Concern"("concern_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_inquirer_id_fkey" FOREIGN KEY ("inquirer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
