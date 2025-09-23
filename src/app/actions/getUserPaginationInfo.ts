'use server';

import { PrismaClient, UserRole } from "@prisma/client";
import { calculatePagination } from "./paginationUtils";

const prisma = new PrismaClient();

export interface UserPaginationInfo {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
    usersPerPage: number;
}

export async function getUserPaginationInfo(
    role?: UserRole,
    pageSize: number = 10
): Promise<UserPaginationInfo> {
    try {
        // Build where clause for filtering
        const whereClause = role ? { user_role: role } : {};

        // Get total count for the specified role
        const totalUsers = await prisma.user.count({
            where: whereClause
        });

        // Calculate pagination info for page 1
        const pagination = calculatePagination(totalUsers, 1, pageSize);

        return {
            totalUsers,
            totalPages: pagination.totalPages,
            currentPage: pagination.currentPage,
            pageSize: pagination.pageSize,
            hasNextPage: pagination.hasNextPage,
            hasPreviousPage: pagination.hasPreviousPage,
            startIndex: pagination.startIndex,
            endIndex: pagination.endIndex,
            usersPerPage: pageSize
        };
    } catch (error) {
        console.error('Error getting user pagination info:', error);
        throw new Error('Failed to get pagination information');
    }
}

export async function getUsersByRoleWithPagination(
    role: UserRole,
    page: number = 1,
    pageSize: number = 10
): Promise<{
    users: any[];
    pagination: UserPaginationInfo;
}> {
    try {
        const whereClause = { user_role: role };

        // Get total count
        const totalUsers = await prisma.user.count({
            where: whereClause
        });

        // Calculate pagination
        const pagination = calculatePagination(totalUsers, page, pageSize);

        // Get users for the current page
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
            pagination: {
                totalUsers,
                totalPages: pagination.totalPages,
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
                hasNextPage: pagination.hasNextPage,
                hasPreviousPage: pagination.hasPreviousPage,
                startIndex: pagination.startIndex,
                endIndex: pagination.endIndex,
                usersPerPage: pageSize
            }
        };
    } catch (error) {
        console.error(`Error fetching users with role ${role}:`, error);
        throw new Error(`Failed to fetch ${role} users`);
    }
}

export async function getPaginationSummary(): Promise<{
    totalUsers: number;
    usersByRole: Record<UserRole, number>;
    recommendedPageSize: number;
}> {
    try {
        // Get total users count
        const totalUsers = await prisma.user.count();

        // Get count by role
        const usersByRole: Record<UserRole, number> = {
            INQUIRER: 0,
            DISPATCHER: 0,
            PERSONNEL: 0,
            ADMIN: 0
        };

        for (const role of Object.values(UserRole)) {
            usersByRole[role] = await prisma.user.count({
                where: { user_role: role }
            });
        }

        // Calculate recommended page size based on total users
        let recommendedPageSize = 10;
        if (totalUsers > 100) {
            recommendedPageSize = 20;
        } else if (totalUsers > 500) {
            recommendedPageSize = 25;
        } else if (totalUsers > 1000) {
            recommendedPageSize = 50;
        }

        return {
            totalUsers,
            usersByRole,
            recommendedPageSize
        };
    } catch (error) {
        console.error('Error getting pagination summary:', error);
        throw new Error('Failed to get pagination summary');
    }
}
