import UserListWithPagination from "@/components/common/list-users-with-pagination";
import RouteProtection from "@/components/common/route-protection";

function PersonnelAccountsPage() {
  return (
    <RouteProtection requiredRole="admin">
      <UserListWithPagination user_role="PERSONNEL"/>
    </RouteProtection>
  )
}

export default PersonnelAccountsPage;