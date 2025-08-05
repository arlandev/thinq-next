'use server';

import { PrismaClient } from "@prisma/client";
import { generateUniqueReferenceNumber } from "@/lib/utils";

const prisma = new PrismaClient();

interface FormDataObject {
  name: string;
  email: string;
  role: string;
  affiliation: string;
  concern: string;
  subconcern: string;
  details: string;
}

export const submitForm = async (formData: FormDataObject) => {
    const { concern, details, email, role, subconcern } = formData;

    console.log(concern, details, email, role, subconcern);
    const userId = 3;
    const concernId = 1;

    // Get existing reference numbers to ensure uniqueness
    const existingTickets = await prisma.ticket.findMany({
        select: { reference_number: true }
    });
    // Filter out null values and only keep valid reference numbers
    const existingReferenceNumbers = existingTickets
        .map(ticket => ticket.reference_number)
        .filter((ref): ref is string => ref !== null && ref !== undefined && ref !== '');

    // Generate unique reference number
    const referenceNumber = generateUniqueReferenceNumber(existingReferenceNumbers);

    const newTicket = await prisma.ticket.create({
        data: {
            reference_number: referenceNumber,
            inquirer_id: userId,
            concern_id: concernId,
            ticket_concern: concern,
            ticket_details: details,
            ticket_subconcern: subconcern,
            ticket_attachment: []
        }
    })

    console.log(newTicket);
    return newTicket;

//   const newForm = await prisma.form.create({
//     data: { name, email, message },
//   });
};