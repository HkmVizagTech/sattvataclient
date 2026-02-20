import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, Send, Check, ArrowUpRight, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const mockQuotes = [
  { id: "QT-1001", customer: "TechStart Inc", date: "2024-10-20", amount: 85000, status: "Sent", validUntil: "2024-10-27" },
  { id: "QT-1002", customer: "Private Birthday", date: "2024-10-21", amount: 45000, status: "Draft", validUntil: "2024-10-28" },
  { id: "QT-1003", customer: "Acme Corp", date: "2024-10-18", amount: 125000, status: "Accepted", validUntil: "2024-10-25" },
];

export default function Quotes() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  const handleConvert = (id: string) => {
    toast({
      title: "Quotation Converted",
      description: `Quote ${id} has been successfully converted into an active Order.`,
    });
    setLocation(`/orders/ORD-HT-${id.split('-').pop()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Quotations</h1>
          <p className="text-muted-foreground mt-1">Orders must be created by converting approved quotes.</p>
        </div>
        <Link href="/quotes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Quotation
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-primary">Recent Estimates</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search quotes..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Quote ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQuotes.map((quote) => (
                <TableRow key={quote.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold text-primary">
                    <Link href={`/quotes/${quote.id}`} className="flex items-center gap-2 hover:underline">
                      {quote.id}
                      <ArrowUpRight className="h-3 w-3 opacity-50" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{quote.customer}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{quote.validUntil}</TableCell>
                  <TableCell className="font-bold">₹{quote.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={quote.status === "Accepted" ? "default" : "outline"} className={
                      quote.status === "Accepted" ? "bg-green-600" : 
                      quote.status === "Sent" ? "text-blue-600 border-blue-200" : ""
                    }>
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {quote.status === "Accepted" ? (
                        <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5" onClick={() => handleConvert(quote.id)}>
                          <ShoppingCart className="h-3.5 w-3.5" /> Convert to Order
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "WhatsApp Sent", description: "Quotation link has been shared with client." })}>
                          <Send className="h-3.5 w-3.5 mr-1" /> Share
                        </Button>
                      )}
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
