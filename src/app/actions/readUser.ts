'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function readUser(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { username, password },
    });

    return user;
}