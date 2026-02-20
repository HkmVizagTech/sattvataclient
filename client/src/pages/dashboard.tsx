import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockStats, mockOrders } from "@/lib/mockData";
import { 
  Clock, 
  IndianRupee, 
  Calendar, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  ChevronRight,
  Package,
  Truck,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isTomorrow, isAfter, addDays, isBefore, parseISO } from "date-fns";

export default function Dashboard() {
  const today = new Date("2026-02-20"); // Fixed reference today for mock data
  const tomorrow = addDays(today, 1);
  const nextWeekEnd = addDays(today, 8);

  const todayOrders = mockOrders.filter(o => isToday(parseISO(o.eventDate)));
  const tomorrowOrders = mockOrders.filter(o => isTomorrow(parseISO(o.eventDate)));
  const nextWeekOrders = mockOrders.filter(o => {
    const d = parseISO(o.eventDate);
    return isAfter(d, tomorrow) && isBefore(d, nextWeekEnd);
  });

  const OrderStrip = ({ order }: { order: any }) => (
    <Link href={`/orders/${order.id}`}>
      <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary transition-all cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {order.id.split('-').pop()}
          </div>
          <div>
            <p className="font-bold text-sm group-hover:text-primary transition-colors">{order.customerName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Package className="h-3 w-3" /> {order.items.length} items • ₹{order.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">{order.status}</Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Operations Hub</h1>
          <p className="text-muted-foreground mt-2 text-lg">Hare Krishna! Welcome to The Higher Taste central management.</p>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-bold">{format(today, "EEEE, MMMM do")}</p>
          <Badge className="bg-green-600">System Live</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, i) => (
          <Link key={i} href={stat.title.includes('Orders') ? '/orders' : stat.title.includes('Quote') ? '/quotes' : '/payments'}>
            <Card className="hover:shadow-lg transition-all border-none shadow-sm cursor-pointer group bg-gradient-to-br from-card to-secondary/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  {stat.icon === "Clock" && <Clock size={18} />}
                  {stat.icon === "IndianRupee" && <IndianRupee size={18} />}
                  {stat.icon === "Calendar" && <Calendar size={18} />}
                  {stat.icon === "FileText" && <FileText size={18} />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp size={12} className="text-green-500" /> {stat.change}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Section */}
        <Card className="border-l-4 border-l-primary shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Today's Orders
              </CardTitle>
              <CardDescription>{format(today, "MMM d")}</CardDescription>
            </div>
            <Badge className="bg-primary text-white">{todayOrders.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayOrders.length > 0 ? todayOrders.map(o => <OrderStrip key={o.id} order={o} />) : (
              <div className="text-center py-8 text-muted-foreground italic text-sm border rounded-lg bg-muted/20">No orders for today</div>
            )}
            <Link href="/orders">
              <Button variant="ghost" className="w-full mt-2 text-xs text-primary font-bold group">
                View All Today's Work <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tomorrow's Section */}
        <Card className="border-l-4 border-l-amber-500 shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-500" /> Tomorrow's Prep
              </CardTitle>
              <CardDescription>{format(tomorrow, "MMM d")}</CardDescription>
            </div>
            <Badge className="bg-amber-500 text-white">{tomorrowOrders.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {tomorrowOrders.length > 0 ? tomorrowOrders.map(o => <OrderStrip key={o.id} order={o} />) : (
              <div className="text-center py-8 text-muted-foreground italic text-sm border rounded-lg bg-muted/20">Clean slate for tomorrow</div>
            )}
             <Link href="/kitchen">
              <Button variant="ghost" className="w-full mt-2 text-xs text-amber-600 font-bold group">
                Check Kitchen Schedule <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Next Week's Section */}
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" /> Next Week Forecast
              </CardTitle>
              <CardDescription>{format(addDays(tomorrow, 1), "MMM d")} - {format(nextWeekEnd, "MMM d")}</CardDescription>
            </div>
            <Badge className="bg-blue-500 text-white">{nextWeekOrders.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
             {nextWeekOrders.length > 0 ? nextWeekOrders.map(o => <OrderStrip key={o.id} order={o} />) : (
              <div className="text-center py-8 text-muted-foreground italic text-sm border rounded-lg bg-muted/20">No large events confirmed yet</div>
            )}
            <Link href="/calendar">
              <Button variant="ghost" className="w-full mt-2 text-xs text-blue-600 font-bold group">
                Open Full Calendar <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// Internal Button component since we can't import everything in one turn
function Button({ children, variant, className, onClick }: any) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variants: any = {
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  return <button className={cn(base, variants[variant], className)} onClick={onClick}>{children}</button>;
}
