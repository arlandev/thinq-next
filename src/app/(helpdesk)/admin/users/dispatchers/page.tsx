import UserListWithPagination from "@/components/common/list-users-with-pagination";
import RouteProtection from "@/components/common/route-protection";

function DispatcherAccountsPage() {
  return (
    <RouteProtection requiredRole="admin">
      <UserListWithPagination user_role="DISPATCHER"/>
    </RouteProtection>
  )
}

export default DispatcherAccountsPage;