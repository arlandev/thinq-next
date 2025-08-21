'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deactivateUser(userId: number) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                user_status: "INACTIVE"
            }
        })

        return { success: true, message: "User deactivated successfully" };
    } catch (error) {
        console.error("Error deactivating user:", error);
        return { success: false, message: "Failed to deactivate user" };
    }
}

export async function activateUser(userId: number) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                user_status: "ACTIVE"
            }
        })

        return { success: true, message: "User activated successfully" };
    } catch (error) {
        console.error("Error activating user:", error);
        return { success: false, message: "Failed to activate user" };
    }
}

export async function batchDeactivateUsers(userIds: number[]) {
    try {
        const users = await prisma.user.updateMany({
            where: { id: { in: userIds } },
            data: { user_status: "INACTIVE" }
        })
        return { success: true, message: "Users deactivated successfully" };
    } catch (error) {
        console.error("Error deactivating users:", error);
        return { success: false, message: "Failed to deactivate users" };
    }
}