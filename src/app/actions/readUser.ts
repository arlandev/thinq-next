'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function readUser(user_email: string, user_password: string) {
    const user = await prisma.user.findFirst({
        where: { 
            user_email: user_email, 
            user_password: user_password 
        },
    });

    return user;
}