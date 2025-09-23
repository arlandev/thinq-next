'use server';

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
}

export interface PaginationParams {
    page: number;
    pageSize: number;
    role?: UserRole;
    searchQuery?: string;
    status?: string;
}

export async function calculatePagination(
    totalItems: number,
    currentPage: number,
    pageSize: number
): Promise<PaginationInfo> {
    const totalPages = Math.ceil(totalItems / pageSize);
    const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
    const skip = (validCurrentPage - 1) * pageSize;
    const startIndex = totalItems > 0 ? skip + 1 : 0;
    const endIndex = Math.min(skip + pageSize, totalItems);

    return {
        totalItems,
        totalPages,
        currentPage: validCurrentPage,
        pageSize,
        hasNextPage: validCurrentPage < totalPages,
        hasPreviousPage: validCurrentPage > 1,
        startIndex,
        endIndex
    };
}

export async function getPaginationForUsers(params: PaginationParams): Promise<{
    users: any[];
    pagination: PaginationInfo;
}> {
    try {
        const { page, pageSize, role, searchQuery, status } = params;

        // Build where clause for filtering
        const whereClause: any = {};
        
        if (role) {
            whereClause.user_role = role;
        }
        
        if (status) {
            whereClause.user_status = status;
        }
        
        if (searchQuery) {
            whereClause.OR = [
                { user_email: { contains: searchQuery, mode: 'insensitive' } },
                { user_firstname: { contains: searchQuery, mode: 'insensitive' } },
                { user_lastname: { contains: searchQuery, mode: 'insensitive' } },
                { user_affiliation: { contains: searchQuery, mode: 'insensitive' } },
                { user_type: { contains: searchQuery, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const totalUsers = await prisma.user.count({
            where: whereClause
        });

        // Calculate pagination info
        const pagination = await calculatePagination(totalUsers, page, pageSize);

        // Get users with pagination
        const users = await prisma.user.findMany({
            where: whereClause,
            skip: (pagination.currentPage - 1) * pageSize,
            take: pageSize,
            orderBy: {
                created_at: 'desc'
            }
        });

        return {
            users,
            pagination
        };
    } catch (error) {
        console.error('Error fetching users with pagination:', error);
        throw new Error('Failed to fetch users');
    }
}

export async function getPaginationForTickets(params: {
    page: number;
    pageSize: number;
    status?: string;
    concern?: string;
    assigneeId?: number;
    inquirerId?: number;
}): Promise<{
    tickets: any[];
    pagination: PaginationInfo;
}> {
    try {
        const { page, pageSize, status, concern, assigneeId, inquirerId } = params;

        // Build where clause for filtering
        const whereClause: any = {};
        
        if (status) {
            whereClause.ticket_status = status;
        }
        
        if (concern) {
            whereClause.ticket_concern = concern;
        }
        
        if (assigneeId) {
            whereClause.assignee_id = assigneeId;
        }
        
        if (inquirerId) {
            whereClause.inquirer_id = inquirerId;
        }

        // Get total count for pagination
        const totalTickets = await prisma.ticket.count({
            where: whereClause
        });

        // Calculate pagination info
        const pagination = await calculatePagination(totalTickets, page, pageSize);

        // Get tickets with pagination
        const tickets = await prisma.ticket.findMany({
            where: whereClause,
            skip: (pagination.currentPage - 1) * pageSize,
            take: pageSize,
            include: {
                inquirer: true,
                assignee: true,
                concern: true,
                closedby: true
            },
            orderBy: {
                ticket_submitteddate: 'desc'
            }
        });

        return {
            tickets,
            pagination
        };
    } catch (error) {
        console.error('Error fetching tickets with pagination:', error);
        throw new Error('Failed to fetch tickets');
    }
}

export async function generatePageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): Promise<number[]> {
    const pages: number[] = [];
    
    if (totalPages <= maxVisible) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Calculate start and end of visible range
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        // Adjust start if end is at the limit
        if (end === totalPages) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    }
    
    return pages;
}
