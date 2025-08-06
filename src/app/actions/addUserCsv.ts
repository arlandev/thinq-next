'use server'

import { PrismaClient, UserRole, UserStatus, UserType } from '@prisma/client';

interface User {
    firstname: string;
    lastname: string;
    role: string;
    type: string;
    email: string;
    affiliation: string;
    dob: string;
    status: string;
}

const prisma = new PrismaClient();

function setUserRole(role: number) {
    switch (role) {
        case 1:
            return UserRole.INQUIRER;
        case 2:
            return UserRole.DISPATCHER;
        case 3:
            return UserRole.PERSONNEL;
        default: 
            return UserRole.INQUIRER;
    }
}

function setUserType(type: string) {
    switch (type.toLowerCase()) {
        case "student":
            return UserType.STUDENT;
        case "employee":
            return UserType.EMPLOYEE;
        default:
            return UserType.EMPLOYEE;
    }
}

export async function addUserCsv(csvFileContent: User[], userRole: number) {
    console.log("[ In Server ] CSV File Content: ", csvFileContent);
    console.log("[ In Server ] Number of users to process: ", csvFileContent.length);
    
    try {
        let user_role: UserRole = setUserRole(userRole);
        for (let i = 0; i < csvFileContent.length; i++) {
            const user = csvFileContent[i];
            if (!user) {
                console.log(`[ In Server ] Skipping undefined user at index ${i}`);
                continue;
            }
            console.log(`[ In Server ] Processing user ${i + 1}/${csvFileContent.length}:`, user);
            
            

            const newUser = {
                user_email: user.email,
                user_firstname: user.firstname,
                user_lastname: user.lastname,
                user_dob: new Date(user.dob),
                user_status: UserStatus.ACTIVE,
                user_password: "",
                user_role: user_role,
                user_type: setUserType(user.type),
                user_affiliation: user.affiliation,
            }

            console.log("[ In Server ] Processed user data: ", newUser);
            
            // Add user to database
            const createdUser = await prisma.user.create({
                data: newUser
            });
            
            console.log("[ In Server ] User created successfully: ", createdUser);
        }
        
        console.log("[ In Server ] All users processed successfully");
        return true;
    } catch (error) {
        console.error("[ In Server ] Error adding users from CSV: ", error);
        throw error;
    }
}