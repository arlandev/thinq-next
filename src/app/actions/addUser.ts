'use server'; 

import { PrismaClient, UserRole, UserStatus, UserType } from '@prisma/client';

const prisma = new PrismaClient();

export async function addUser(email: string, firstname: string, lastname: string, dob: string, role: number, type: number, affiliation: string) {
    console.log("Adding user to database:", email, firstname, lastname, dob, role, type, affiliation);

    let userRole: UserRole;
    switch (role) {
        case 1:
            userRole = UserRole.INQUIRER;
            break;
        case 2:
            userRole = UserRole.DISPATCHER;
            break;
        case 3:
            userRole = UserRole.PERSONNEL;
            break;
        case 4:
            userRole = UserRole.ADMIN;
            break;
        default:
            userRole = UserRole.INQUIRER;
            break;
    }

    let userType: UserType;
    switch (type) {
        case 1:
            userType = UserType.STUDENT;
            break;
        case 2:
            userType = UserType.EMPLOYEE;
            break;
        default:
            userType = UserType.STUDENT;
            break;
    }

    const user = await prisma.user.create({
        data: {
            user_email: email,
            user_firstname: firstname,
            user_lastname: lastname,
            user_dob: new Date(dob),
            user_status: UserStatus.ACTIVE,
            user_password: "password",
            user_role: userRole,
            user_type: userType,
            user_affiliation: "CICS"
        }
    })
    console.log("User added to database:", user);
    return user;
}