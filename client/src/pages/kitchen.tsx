import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/lib/mockData";
import { Clock, CheckCircle2, AlertTriangle, ChefHat } from "lucide-react";

export default function Kitchen() {
  // Filter for orders that are relevant to kitchen (Confirmed, In-Prep)
  const kitchenOrders = mockOrders.filter(o => ["Confirmed", "In-Prep"].includes(o.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" /> Kitchen Display System
          </h1>
          <p className="text-muted-foreground mt-1">Live view of upcoming food preparation tasks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-green-50 text-green-700 border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
            Live
          </Badge>
          <div className="text-sm font-medium text-muted-foreground">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kitchenOrders.map((order) => (
          <Card key={order.id} className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="font-mono">{order.eventDate}</Badge>
                <Badge className={order.status === "In-Prep" ? "bg-amber-500" : "bg-blue-500"}>
                  {order.status}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{order.customerName}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Due: 12:00 PM (Mock Time)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-md">
                   <div className="text-sm font-medium text-muted-foreground mb-2">Menu Items ({order.items.length})</div>
                   <ul className="space-y-1">
                     {order.items.map((item, idx) => (
                       <li key={idx} className="text-sm flex items-start gap-2">
                         <span className="text-slate-400">•</span>
                         <span>{item}</span>
                       </li>
                     ))}
                   </ul>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                   <span className="text-muted-foreground">Headcount:</span>
                   <span className="font-bold">{order.headcount} Pax</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full" variant={order.status === "In-Prep" ? "default" : "secondary"}>
                {order.status === "In-Prep" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Ready for Dispatch
                  </>
                ) : (
                  "Start Preparation"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Empty State / Next Day Placeholder */}
        <Card className="border-dashed flex flex-col items-center justify-center p-6 text-muted-foreground min-h-[300px] bg-slate-50/50">
           <AlertTriangle className="h-10 w-10 mb-2 opacity-20" />
           <p>No more immediate orders for today.</p>
           <Button variant="link" className="mt-2">View Tomorrow's Prep</Button>
        </Card>
      </div>
    </div>
  );
}
