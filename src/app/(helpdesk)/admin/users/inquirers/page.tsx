// import UserList from "@/components/common/list-users";
import UserListWithPagination from "@/components/common/list-users-with-pagination";

function InquirerAccountsPage() {
  return (
    <UserListWithPagination user_role="INQUIRER"/>
    // <UserList user_role="INQUIRER"/>
  )
}

export default InquirerAccountsPage;