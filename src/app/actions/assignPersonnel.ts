'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function assignPersonnel(assigneeUserId: number, inquiryId: number) {
    try {
        const assigned = await prisma.ticket.update({
            where: { ticket_id: inquiryId },
            data: { assignee_id: assigneeUserId }
        })
        return { success: true, message: "Personnel assigned successfully", data: assigned }
    } catch (error) {
        console.error("Error assigning personnel:", error)
        return { success: false, message: "Failed to assign personnel", data: null }
    }
    
}