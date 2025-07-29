'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();  

export async function readUsers() {
    const users = await prisma.user.findMany();
    return users;
}