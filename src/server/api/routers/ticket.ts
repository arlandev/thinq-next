import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        concern: z.string().min(1),
        subconcern: z.string().min(1),
        details: z.string().min(1),
        name: z.string().min(1),
        email: z.string().email(),
        role: z.string().min(1),
        affiliation: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { concern, details, email, role, subconcern, name, affiliation } = input;

      // Use hardcoded values for now
      const userId = 3;
      const concernId = 1;

      const newTicket = await ctx.db.ticket.create({
        data: {
          inquirer_id: userId,
          concern_id: concernId,
          ticket_concern: concern,
          ticket_details: details,
          ticket_subconcern: subconcern,
          ticket_attachment: [],
        },
      });

      return newTicket;
    }),
}); 