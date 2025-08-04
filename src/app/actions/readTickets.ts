'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function readTickets() {
    const tickets = await prisma.ticket.findMany({
        include: {
            inquirer: true,
            assignee: true,
        }
    });

    return tickets;
}