// import UserList from "@/components/common/list-users";
import UserListWithPagination from "@/components/common/list-users-with-pagination";
import RouteProtection from "@/components/common/route-protection";

function InquirerAccountsPage() {
  return (
    <RouteProtection requiredRole="admin">
      <UserListWithPagination user_role="INQUIRER"/>
      {/* <UserList user_role="INQUIRER"/> */}
    </RouteProtection>
  )
}

export default InquirerAccountsPage;