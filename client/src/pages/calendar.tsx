import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { mockOrders } from "@/lib/mockData";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Simple mock implementation to highlight dates with orders
  const ordersByDate = mockOrders.reduce((acc, order) => {
    const dateStr = new Date(order.eventDate).toDateString();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(order);
    return acc;
  }, {} as any);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events Calendar</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage upcoming catering events.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter by Dept
          </Button>
          <Button variant="outline">Month View</Button>
          <Button variant="outline">Week View</Button>
          <Button>Today</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
            />
            
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Confirmed Event</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>In Preparation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                   <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span>Draft / Tentative</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 lg:col-span-9 h-[600px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b py-4">
            <div className="flex items-center gap-2">
              <CardTitle>
                {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
             <div className="divide-y">
                {/* Time slots */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const hour = i + 8; // Start at 8 AM
                  const time = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
                  
                  // Find orders for this day (mock logic just to show something)
                  // In a real app, match the specific date selected
                  const hasOrder = mockOrders.find(o => new Date(o.eventDate).getDate() % 2 === i % 2); // Random matching for visuals

                  return (
                    <div key={i} className="flex min-h-[80px]">
                      <div className="w-20 border-r py-3 px-2 text-xs font-medium text-muted-foreground text-right bg-slate-50/50">
                        {time}
                      </div>
                      <div className="flex-1 p-2 relative group hover:bg-slate-50/30 transition-colors">
                        {/* Placeholder Event Lines */}
                        {i === 2 && (
                          <div className="absolute top-2 left-2 right-2 bottom-2 bg-blue-50 border-l-4 border-blue-500 rounded p-2 cursor-pointer hover:shadow-sm">
                            <div className="font-medium text-sm text-blue-900">Acme Corp Annual Meet</div>
                            <div className="text-xs text-blue-700">150 Pax • Grand Hyatt</div>
                          </div>
                        )}
                         {i === 6 && (
                          <div className="absolute top-2 left-2 right-2 bottom-2 bg-amber-50 border-l-4 border-amber-500 rounded p-2 cursor-pointer hover:shadow-sm">
                            <div className="font-medium text-sm text-amber-900">Purchase Reminder: Sarah's Wedding</div>
                            <div className="text-xs text-amber-700">Check raw materials</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
