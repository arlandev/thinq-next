import RouteProtection from "@/components/common/route-protection";

export default function InquirerTicketDetailsPage() {
  return (
    <RouteProtection requiredRole="inquirer">
      <div>Inquirer Ticket Details Page</div>
    </RouteProtection>
  );
}
  