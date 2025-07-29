'use server';

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();  

export async function readInquirerUsers() {
    const users = await prisma.user.findMany({
        where: {
            user_role: UserRole.INQUIRER,
        },
    });

    const usersWithTickets = await prisma.user.findMany({
        where: {
            user_role: UserRole.INQUIRER,
            submitted_tickets: {    
                some: {} // at least one ticket
            }
        },
        include: {
            submitted_tickets: true
        }
    });

    console.log("Users with submitted tickets:", usersWithTickets);

    return users;
}