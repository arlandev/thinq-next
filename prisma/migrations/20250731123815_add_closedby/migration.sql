-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "ticket_closedby" INTEGER,
ADD COLUMN     "ticket_resolveddate" DATE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_closedby_fkey" FOREIGN KEY ("ticket_closedby") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
