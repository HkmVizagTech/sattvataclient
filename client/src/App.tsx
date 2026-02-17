import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Orders from "@/pages/orders";
import OrderDetails from "@/pages/order-details";
import CalendarPage from "@/pages/calendar";
import MenuPage from "@/pages/menu";
import Customers from "@/pages/customers";
import Quotes from "@/pages/quotes";
import Payments from "@/pages/payments";
import Kitchen from "@/pages/kitchen";
import { Layout } from "@/components/layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/orders" component={Orders} />
        <Route path="/orders/new" component={OrderDetails} />
        <Route path="/orders/:id" component={OrderDetails} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/customers" component={Customers} />
        <Route path="/quotes" component={Quotes} />
        <Route path="/payments" component={Payments} />
        <Route path="/kitchen" component={Kitchen} />
        
        {/* Placeholder routes */}
        <Route path="/settings" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
