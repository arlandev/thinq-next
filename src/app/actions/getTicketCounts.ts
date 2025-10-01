'use server';

import { db } from "@/server/db";

export interface TicketCounts {
  total: number;
  new: number;
  open: number;
  closed: number;
  newAndOpen: number;
}

export async function getTicketCounts(userType: string, statusFilters: string[] = [], searchQuery?: string) {
  try {
    // Build where clause for filtering
    const whereClause: any = {
      inquirer: {
        user_type: userType
      }
    };

    // Add search functionality
    if (searchQuery) {
      whereClause.OR = [
        { reference_number: { contains: searchQuery, mode: 'insensitive' } },
        { ticket_concern: { contains: searchQuery, mode: 'insensitive' } },
        { ticket_subconcern: { contains: searchQuery, mode: 'insensitive' } },
        { ticket_details: { contains: searchQuery, mode: 'insensitive' } },
        { inquirer: { user_firstname: { contains: searchQuery, mode: 'insensitive' } } },
        { inquirer: { user_lastname: { contains: searchQuery, mode: 'insensitive' } } },
        { inquirer: { user_email: { contains: searchQuery, mode: 'insensitive' } } },
        { assignee: { user_firstname: { contains: searchQuery, mode: 'insensitive' } } },
        { assignee: { user_lastname: { contains: searchQuery, mode: 'insensitive' } } }
      ];
    }

    // Get counts for each status
    const [total, newCount, openCount, closedCount] = await Promise.all([
      db.ticket.count({ 
        where: whereClause 
      }),
      db.ticket.count({ 
        where: { 
          ...whereClause, 
          ticket_status: 'NEW' 
        } 
      }),
      db.ticket.count({ 
        where: { 
          ...whereClause, 
          ticket_status: 'OPEN' 
        } 
      }),
      db.ticket.count({ 
        where: { 
          ...whereClause, 
          ticket_status: 'CLOSED' 
        } 
      })
    ]);

    return {
      total,
      new: newCount,
      open: openCount,
      closed: closedCount,
      newAndOpen: newCount + openCount
    };
  } catch (error) {
    console.error('Error fetching ticket counts:', error);
    throw new Error('Failed to fetch ticket counts');
  }
}
