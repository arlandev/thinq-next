'use server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function submitResolution( ticketId: number, personnelId: number, resolutionNotes: string ) {

    try {
        const resolution = await prisma.ticket.update( { 
            where: { ticket_id: ticketId },
            data: {
                ticket_resolution: resolutionNotes,
                ticket_closedby: personnelId,
                ticket_resolveddate: new Date(),
                ticket_status: "CLOSED",
            }
        } )
        console.log("Resolution submitted successfully:", resolution)
        return resolution
    } catch (error) {
        console.error("Error submitting resolution:", error)
        throw new Error("Failed to submit resolution")
        
    } 
}