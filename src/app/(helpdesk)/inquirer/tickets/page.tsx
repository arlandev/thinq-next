import RouteProtection from "@/components/common/route-protection";

export default function InquirerTicketsPage() {
  return (
    <RouteProtection requiredRole="inquirer">
      <div>Inquirer Tickets Page</div>
    </RouteProtection>
  );
}
