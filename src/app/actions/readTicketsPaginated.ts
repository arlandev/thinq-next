'use server';

import { getPaginationForTickets } from './paginationUtils';

export interface TicketPaginationParams {
    page: number;
    pageSize: number;
    userType: string;
    statusFilters: string[];
    searchQuery?: string;
}

export async function readTicketsPaginated(params: TicketPaginationParams) {
    try {
        const { tickets, pagination } = await getPaginationForTickets({
            page: params.page,
            pageSize: params.pageSize,
            userType: params.userType,
            statusFilters: params.statusFilters,
            searchQuery: params.searchQuery
        });

        return {
            tickets,
            pagination
        };
    } catch (error) {
        console.error('Error fetching paginated tickets:', error);
        throw new Error('Failed to fetch tickets');
    }
}
