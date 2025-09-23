'use server';

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();  

export async function readUsers() {
    const users = await prisma.user.findMany();
    return users;
}

export interface PaginationInfo {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
}

export interface PaginatedUsersResponse {
    users: any[];
    pagination: PaginationInfo;
}

export async function getUsersWithPagination(
    page: number = 1,
    pageSize: number = 10,
    role?: UserRole,
    searchQuery?: string
): Promise<PaginatedUsersResponse> {
    try {
        // Build where clause for filtering
        const whereClause: any = {};
        
        if (role) {
            whereClause.user_role = role;
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
        const totalPages = Math.ceil(totalUsers / pageSize);
        const currentPage = Math.max(1, Math.min(page, totalPages));
        const skip = (currentPage - 1) * pageSize;
        const startIndex = skip + 1;
        const endIndex = Math.min(skip + pageSize, totalUsers);

        // Get users with pagination
        const users = await prisma.user.findMany({
            where: whereClause,
            skip: skip,
            take: pageSize,
            orderBy: {
                created_at: 'desc'
            }
        });

        const pagination: PaginationInfo = {
            totalUsers,
            totalPages,
            currentPage,
            pageSize,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
            startIndex,
            endIndex
        };

        return {
            users,
            pagination
        };
    } catch (error) {
        console.error('Error fetching users with pagination:', error);
        throw new Error('Failed to fetch users');
    }
}

export async function getUsersByRole(role: UserRole): Promise<any[]> {
    try {
        const users = await prisma.user.findMany({
            where: {
                user_role: role
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return users;
    } catch (error) {
        console.error(`Error fetching users with role ${role}:`, error);
        throw new Error(`Failed to fetch ${role} users`);
    }
}

export async function getUsersCountByRole(role?: UserRole): Promise<number> {
    try {
        const whereClause = role ? { user_role: role } : {};
        const count = await prisma.user.count({
            where: whereClause
        });
        return count;
    } catch (error) {
        console.error('Error counting users:', error);
        throw new Error('Failed to count users');
    }
}