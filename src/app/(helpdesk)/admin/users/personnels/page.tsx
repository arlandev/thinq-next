import UserListWithPagination from "@/components/common/list-users-with-pagination";

function PersonnelAccountsPage() {
  return (
    <UserListWithPagination user_role="PERSONNEL"/>
  )
}

export default PersonnelAccountsPage;