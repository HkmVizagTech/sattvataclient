import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, Send, Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const mockQuotes = [
  { id: "QT-1001", customer: "TechStart Inc", date: "2024-10-20", amount: 85000, status: "Sent", validUntil: "2024-10-27" },
  { id: "QT-1002", customer: "Private Birthday", date: "2024-10-21", amount: 45000, status: "Draft", validUntil: "2024-10-28" },
  { id: "QT-1003", customer: "Acme Corp", date: "2024-10-18", amount: 125000, status: "Accepted", validUntil: "2024-10-25" },
];

export default function Quotes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground mt-1">Create and manage estimates for potential events.</p>
        </div>
        <Link href="/quotes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Quote
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Quotes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search quotes..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQuotes.map((quote) => (
                <TableRow key={quote.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-primary">
                    <Link href={`/quotes/${quote.id}`} className="flex items-center gap-2 hover:underline">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {quote.id}
                      <ArrowUpRight className="h-3 w-3 opacity-50" />
                    </Link>
                  </TableCell>
                  <TableCell>{quote.customer}</TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell>{quote.validUntil}</TableCell>
                  <TableCell>₹{quote.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={quote.status === "Accepted" ? "default" : "outline"} className={
                      quote.status === "Accepted" ? "bg-green-600 hover:bg-green-700" : 
                      quote.status === "Sent" ? "text-blue-600 border-blue-200 bg-blue-50" : ""
                    }>
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {quote.status === "Draft" && (
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Send className="h-3 w-3 mr-1" /> Send
                      </Button>
                    )}
                    {quote.status === "Sent" && (
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                        <Check className="h-3 w-3 mr-1" /> Convert
                      </Button>
                    )}
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
