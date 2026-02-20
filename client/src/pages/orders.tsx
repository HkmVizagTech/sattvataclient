import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/lib/mockData";
import { Search, Download, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Draft": "bg-slate-100 text-slate-600 border-slate-200",
    "Confirmed": "bg-blue-50 text-blue-600 border-blue-200",
    "In-Prep": "bg-amber-50 text-amber-600 border-amber-200",
    "Dispatched": "bg-purple-50 text-purple-600 border-purple-200",
    "Delivered": "bg-indigo-50 text-indigo-600 border-indigo-200",
    "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
    "Cancelled": "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap", styles[status] || styles["Draft"])}>
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
          <h1 className="text-3xl font-bold tracking-tight text-primary">Order Operations</h1>
          <p className="text-muted-foreground mt-1">Manage active caterings converted from quotes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Link href="/quotes">
            <Button variant="secondary" className="gap-2">
              <ArrowRight className="h-4 w-4" /> 
              Convert from Quote
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="all">Active Orders</TabsTrigger>
                <TabsTrigger value="completed">Archive</TabsTrigger>
              </TabsList>
            </Tabs>
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
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead>Customer / Venue</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold text-primary">{order.id}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{order.venue}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{order.eventDate}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs font-bold">₹{order.totalAmount.toLocaleString()}</p>
                      {order.balanceDue > 0 ? (
                        <p className="text-[10px] text-red-600 font-bold">Due: ₹{order.balanceDue.toLocaleString()}</p>
                      ) : (
                        <Badge variant="secondary" className="text-[9px] bg-green-50 text-green-700 h-4">PAID</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </Link>
                      <Link href={`/orders/${order.id}/invoice`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><FileText className="h-4 w-4" /></Button>
                      </Link>
                    </div>
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

function Badge({ children, variant, className }: any) {
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", className)}>
      {children}
    </span>
  );
}
