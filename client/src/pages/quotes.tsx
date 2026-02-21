import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, Send, Check, ArrowUpRight, ShoppingCart, Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface Quote {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
  validUntil: string;
}

const mockQuotes: Quote[] = [
  { id: "QT-1001", customer: "TechStart Inc", date: "2024-10-20", amount: 85000, status: "Sent", validUntil: "2024-10-27" },
  { id: "QT-1002", customer: "Private Birthday", date: "2024-10-21", amount: 45000, status: "Draft", validUntil: "2024-10-28" },
  { id: "QT-1003", customer: "Acme Corp", date: "2024-10-18", amount: 125000, status: "Accepted", validUntil: "2024-10-25" },
];

export default function Quotes() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [conversionData, setConversionData] = useState({ date: "", venue: "", headcount: "" });

  const handleConvert = () => {
    if (!conversionData.date || !conversionData.venue || !conversionData.headcount || !selectedQuote) {
      toast({ title: "Missing Information", description: "Please fill in all required delivery details.", variant: "destructive" });
      return;
    }
    toast({
      title: "Quotation Converted",
      description: `Quote ${selectedQuote.id} has been successfully converted into an active Order.`,
    });
    setSelectedQuote(null);
    setLocation(`/orders/ORD-HT-${selectedQuote.id.split('-').pop()}`);
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
                        <Dialog open={selectedQuote?.id === quote.id} onOpenChange={(open) => !open && setSelectedQuote(null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5" onClick={() => setSelectedQuote(quote)}>
                              <ShoppingCart className="h-3.5 w-3.5" /> Convert
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Convert Quote to Order</DialogTitle>
                              <DialogDescription>Please provide delivery details for Quote {quote.id}.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4" /> Delivery Date</label>
                                <Input type="date" value={conversionData.date} onChange={e => setConversionData({...conversionData, date: e.target.value})} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery Address</label>
                                <Input value={conversionData.venue} onChange={e => setConversionData({...conversionData, venue: e.target.value})} placeholder="Full Venue Address" />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4" /> Guest Count</label>
                                <Input type="number" value={conversionData.headcount} onChange={e => setConversionData({...conversionData, headcount: e.target.value})} placeholder="Estimated Headcount" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedQuote(null)}>Cancel</Button>
                              <Button onClick={handleConvert}>Create Order</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
