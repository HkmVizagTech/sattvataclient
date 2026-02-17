import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, FileText } from "lucide-react";

const mockPayments = [
  { id: "PAY-9001", orderId: "ORD-7829", amount: 50000, method: "UPI", date: "2024-10-20", status: "Succeeded", reference: "UTR-123456789" },
  { id: "PAY-9002", orderId: "ORD-7830", amount: 150000, method: "Gateway", date: "2024-10-22", status: "Succeeded", reference: "RAZOR-PAY-ID-55" },
  { id: "PAY-9003", orderId: "ORD-7833", amount: 45000, method: "Cash", date: "2024-10-24", status: "Succeeded", reference: "Recv: John Doe" },
];

export default function Payments() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments Ledger</h1>
          <p className="text-muted-foreground mt-1">Track all incoming payments and generate invoices.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((pay) => (
                <TableRow key={pay.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-mono text-xs">{pay.id}</TableCell>
                  <TableCell className="font-medium text-primary">{pay.orderId}</TableCell>
                  <TableCell>{pay.date}</TableCell>
                  <TableCell>{pay.method}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{pay.reference}</TableCell>
                  <TableCell className="font-bold">₹{pay.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-green-700 bg-green-50 ring-1 ring-inset ring-green-600/20">
                      {pay.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
