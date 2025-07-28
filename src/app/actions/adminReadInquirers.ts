'use server';

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();  

export async function readInquirerUsers() {
    const users = await prisma.user.findMany({
        where: {
            user_role: UserRole.INQUIRER,
        },
    });


    return users;
}