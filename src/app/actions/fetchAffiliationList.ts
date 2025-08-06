'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchAffiliationList() {
    const affiliationList = await prisma.affiliation.findMany();
    return affiliationList;
}