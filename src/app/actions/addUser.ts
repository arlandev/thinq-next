'use server'; 

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addUser(username: string, password: string, role: string) {
    console.log("Adding user to database:", username, password, role);
    const user = await prisma.user.create({
        data: {
            username,
            password,
            role
        }
    })
    console.log("User added to database:", user);
    return user;
}