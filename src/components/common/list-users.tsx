import { TableCell, TableRow } from "@/components/ui/table";
import EditDialog from "./edit-dialog";
import DeactivateButton from "./deactivate-button";

interface User{
    id: number;
    user_email: string;
    user_firstname: string;
    user_lastname: string;
    user_role: string;
    user_type: string;
    user_affiliation: string;
    user_status: string;
}

interface UserListProps{
    users:User[];
    user_role: string;
}

export default function UserList({users, user_role}:UserListProps) {
    return (
        <>
            {users.filter((user: User) => user.user_role===user_role).map((user: User) => (
                <TableRow key={user.id}>
                    <TableCell>
                        <EditDialog user={{
                            id: user.id,
                            name: `${user.user_firstname} ${user.user_lastname}`,
                            email: user.user_email,
                        }} />
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                        <TableCell>{user.user_email}</TableCell>
                        <TableCell>{user.user_firstname}</TableCell>
                        <TableCell>{user.user_lastname}</TableCell>
                        <TableCell>{user.user_type}</TableCell>
                        <TableCell>{user.user_affiliation}</TableCell>
                        <TableCell>{user.user_status}</TableCell>
                        <TableCell className="text-right">
                        <DeactivateButton
                            disable={user.user_status === "INACTIVE"}
                            inquirerName={`${user.user_firstname} ${user.user_lastname}`}
                            inquirerEmail={user.user_email}
                        />
                        </TableCell>
                </TableRow>
            ))}
        </>
    );
}
