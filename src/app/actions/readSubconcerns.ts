'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function readSubconcerns() {
    const subconcerns = await prisma.subconcern.findMany({
        include: {
            concern: true
        }
    });

    return subconcerns;
}