import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/lib/mockData";
import { Plus, Search, Filter, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    "Draft": "bg-slate-100 text-slate-600 border-slate-200",
    "Confirmed": "bg-blue-50 text-blue-600 border-blue-200",
    "In-Prep": "bg-amber-50 text-amber-600 border-amber-200",
    "Dispatched": "bg-purple-50 text-purple-600 border-purple-200",
    "Delivered": "bg-indigo-50 text-indigo-600 border-indigo-200",
    "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
    "Cancelled": "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status] || styles["Draft"])}>
      {status}
    </span>
  );
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Catering Orders</h1>
          <p className="text-muted-foreground mt-1">Satvik Seva Management for ISKCON.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Report
          </Button>
          <Link href="/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Seva Order
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Total (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50/50">
                      <TableCell className="font-medium text-primary">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.eventDate}</TableCell>
                      <TableCell>₹{order.totalAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                        <Link href={`/orders/${order.id}/invoice`}>
                          <Button variant="ghost" size="sm" className="text-primary">
                            <FileText className="h-4 w-4 mr-1" /> Invoice
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
