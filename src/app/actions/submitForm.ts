'use server';

import { PrismaClient } from "@prisma/client";

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

    const newTicket = await prisma.ticket.create({
        data: {
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