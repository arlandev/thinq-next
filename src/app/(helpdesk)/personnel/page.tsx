import NavBar from "@/components/common/navbar";
import WelcomeText from "@/components/common/welcome-text";
import PageLayout from "@/components/common/page-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

function PersonnelHomePage() {
  return (
    <PageLayout navbar={<NavBar navBarLink="/inbox" navBarLinkName="Inbox" />}>
      {/* Welcome Section */}
      <WelcomeText firstName="Test" lastName="Test" />

      {/* Respondent Desk Title */}
      <div className="text-center text-3xl font-bold mb-10">
        RESPONDENT DESK
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8 flex-grow">
        {/* Left Column */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          {/* Pending Count Box */}
          <div className="bg-black rounded-xl py-6 text-center">
            <div className="text-white">
              <div className="font-black text-5xl mb-2">3</div>
              <div className="font-bold">Pending</div>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="space-y-4">
            <div className="font-medium">FILTER BY STATUS</div>
            <div className="space-y-2">
              <Button className="w-full">ALL</Button>
              <Button className="w-full">NEW</Button>
              <Button className="w-full">OPEN</Button>
              <Button className="w-full">CLOSED</Button>
            </div>
          </div>
        </div>

        {/* Right Column - Table */}
        <div className="flex-grow flex flex-col">
          <div className="bg-white rounded-lg shadow-xl flex-grow flex flex-col">
            <div className="flex flex-col h-full">
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="h-full">
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">
                      <Button className="font-bold">{"..."}</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">
                      <Button className="font-bold">{"..."}</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">
                      <Button className="font-bold">{"..."}</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default PersonnelHomePage;
