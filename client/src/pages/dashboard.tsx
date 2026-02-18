import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockStats, mockOrders } from "@/lib/mockData";
import { 
  Clock, 
  IndianRupee, 
  Calendar as CalendarIcon, 
  FileText, 
  ArrowUpRight, 
  MoreHorizontal,
  Plus,
  Truck,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const iconMap: any = {
  Clock: Clock,
  IndianRupee: IndianRupee,
  Calendar: CalendarIcon,
  FileText: FileText,
};

const routeMap: any = {
  "Pending Fulfillments": "/kitchen",
  "Payments Pending": "/payments",
  "Upcoming Events": "/calendar",
  "Active Quotes": "/quotes",
};

const revenueData = [
  { name: "Mon", total: 12000 },
  { name: "Tue", total: 18000 },
  { name: "Wed", total: 25000 },
  { name: "Thu", total: 15000 },
  { name: "Fri", total: 45000 },
  { name: "Sat", total: 55000 },
  { name: "Sun", total: 35000 },
];

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

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, John. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/quotes/new">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              New Quote
            </Button>
          </Link>
          <Link href="/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, i) => {
          const Icon = iconMap[stat.icon];
          const href = routeMap[stat.title];
          return (
            <Link key={i} href={href}>
              <Card className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {stat.change} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                You have 3 orders needing attention today.
              </CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xs">
                      {order.customerName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{order.id}</span>
                        <span>•</span>
                        <span>{order.eventDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <div className="text-sm font-medium w-24 text-right">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-amber-900">Purchase Reminder</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Check raw material availability for "Sarah's Wedding" (3 days away).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-blue-900">Dispatch Pending</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Assign vehicle for "City Hospital Gala" (Tomorrow).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
