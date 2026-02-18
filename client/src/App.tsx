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
import CustomerDetails from "@/pages/customer-details";
import Quotes from "@/pages/quotes";
import QuoteDetails from "@/pages/quote-details";
import Payments from "@/pages/payments";
import Kitchen from "@/pages/kitchen";
import InvoicePage from "@/pages/invoice";
import Settings from "@/pages/settings";
import { Layout } from "@/components/layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/orders" component={Orders} />
        <Route path="/orders/new" component={OrderDetails} />
        <Route path="/orders/:id" component={OrderDetails} />
        <Route path="/orders/:id/invoice" component={InvoicePage} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/customers" component={Customers} />
        <Route path="/customers/:id" component={CustomerDetails} />
        <Route path="/quotes" component={Quotes} />
        <Route path="/quotes/new" component={QuoteDetails} />
        <Route path="/quotes/:id" component={QuoteDetails} />
        <Route path="/payments" component={Payments} />
        <Route path="/kitchen" component={Kitchen} />
        <Route path="/settings" component={Settings} />
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
