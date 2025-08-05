'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function readConcerns() {
    const concerns = await prisma.concern.findMany();

    return concerns;
}