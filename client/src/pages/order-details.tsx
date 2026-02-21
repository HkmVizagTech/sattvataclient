import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { mockCustomers as initialCustomers, mockMenu, mockOrders } from "@/lib/mockData";
import { 
  CalendarIcon, 
  Trash2, 
  Plus, 
  CreditCard, 
  Truck, 
  User, 
  CheckCircle2, 
  Save,
  MapPin,
  History,
  UserPlus
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  eventDate: z.date({ required_error: "Event date is required" }),
  eventTime: z.string().min(1, "Event time is required"),
  venue: z.string().min(1, "Venue address is required"),
  headcount: z.coerce.number().min(1, "Headcount must be at least 1"),
  status: z.enum(["Draft", "Confirmed", "In-Prep", "Dispatched", "Delivered", "Completed", "Cancelled"]),
  notes: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string().min(1, "Item is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    notes: z.string().optional(),
  })).min(1, "Add at least one menu item"),
  paymentMethod: z.enum(["UPI", "Gateway", "Cash"]),
  paymentAmount: z.coerce.number().min(0),
  paymentReference: z.string().optional(),
  paymentContact: z.string().optional(),
  vehicleNumber: z.string().optional(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const workflowStages = [
  { id: "Draft", label: "Quotation" },
  { id: "Confirmed", label: "Converted" },
  { id: "In-Prep", label: "In Production" },
  { id: "Dispatched", label: "Out for Delivery" },
  { id: "Delivered", label: "Delivered" }
];

export default function OrderDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const order = mockOrders.find(o => o.id === id);
  const isEditMode = !!id;
  const [customers, setCustomers] = useState(initialCustomers);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", company: "" });

  const defaultValues: Partial<OrderFormValues> = order ? {
    customerId: "C-001",
    eventDate: new Date(order.eventDate),
    eventTime: "12:00",
    venue: order.venue,
    headcount: order.headcount,
    status: order.status,
    items: order.items.map(() => ({ menuItemId: "V-001", quantity: 50 })),
    paymentMethod: "UPI",
    paymentAmount: order.totalAmount - order.balanceDue,
  } : {
    status: "Draft" as const,
    items: [{ menuItemId: "", quantity: 10 }],
    paymentMethod: "UPI" as const,
    paymentAmount: 0,
    headcount: 50,
  };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const subtotal = watchedItems.reduce((acc, item) => {
    const menuItem = mockMenu.find(m => m.id === item.menuItemId);
    return acc + (menuItem?.price || 0) * (item.quantity || 0);
  }, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const currentStatus = form.watch("status");

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    const customer = {
      id: `C-${Date.now()}`,
      ...newCustomer,
      totalOrders: 0,
      outstandingBalance: 0
    };
    setCustomers([...customers, customer]);
    form.setValue("customerId", customer.id);
    setIsCustomerDialogOpen(false);
    setNewCustomer({ name: "", phone: "", email: "", company: "" });
    toast({ title: "Customer Added", description: `${customer.name} has been added and selected.` });
  };

  const onSubmit = (data: OrderFormValues) => {
    toast({
      title: isEditMode ? "Order Updated" : "Order Created",
      description: `Order for ${format(data.eventDate, "PPP")} has been saved.`,
    });
    setLocation("/orders");
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? `Managing Order #${id}` : "Create a new catering order"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLocation("/orders")}>Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </div>
      </div>

      <Card className="bg-muted/30 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            {workflowStages.map((stage, index) => {
              const stageIndex = workflowStages.findIndex(s => s.id === currentStatus);
              const isPast = index < stageIndex;
              const isCurrent = index === stageIndex;
              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isPast ? "bg-primary border-primary text-white" : 
                    isCurrent ? "bg-white border-primary text-primary ring-4 ring-primary/20 scale-110" : 
                    "bg-white border-slate-300 text-slate-400"
                  )}>
                    {isPast ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px]",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Delivery Logistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium">Customer</label>
                          <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                            <DialogTrigger asChild>
                              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-primary p-0">
                                <UserPlus className="h-3 w-3 mr-1" /> New Customer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Add New Customer</DialogTitle></DialogHeader>
                              <div className="grid gap-4 py-4">
                                <Input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Full Name" />
                                <Input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="Phone" />
                                <Input value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="Email" />
                                <Input value={newCustomer.company} onChange={e => setNewCustomer({...newCustomer, company: e.target.value})} placeholder="Company" />
                              </div>
                              <DialogFooter><Button type="button" onClick={handleAddCustomer}>Add & Select</Button></DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {customers.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full venue address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Delivery Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="headcount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headcount</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Menu & Items
                  </CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ menuItemId: "", quantity: 10 })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end border-b pb-4 last:border-0">
                      <FormField
                        control={form.control}
                        name={`items.${index}.menuItemId`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Item</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {mockMenu.map(m => (
                                  <SelectItem key={m.id} value={m.id}>{m.name} - ₹{m.price}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Qty</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  
                  <div className="flex justify-end pt-4 flex-col items-end">
                    <div className="text-sm text-muted-foreground">Total: <span className="text-lg font-bold text-primary ml-2">₹{total.toLocaleString()}</span></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="UPI">UPI / GPay</SelectItem>
                              <SelectItem value="Gateway">Razorpay Link</SelectItem>
                              <SelectItem value="Cash">Cash Collection</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <div className="pt-2">
                         <span className={cn("px-2 py-1 rounded text-[10px] font-bold text-white", total - form.watch("paymentAmount") === 0 ? "bg-green-600" : "bg-amber-600")}>
                          {total - form.watch("paymentAmount") === 0 ? "Fully Paid" : "Partial Payment"}
                        </span>
                      </div>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Outstanding</FormLabel>
                      <div className="pt-2 font-bold text-red-600">₹{(total - form.watch("paymentAmount")).toLocaleString()}</div>
                    </FormItem>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2"><History className="h-4 w-4" /> Transaction History</h4>
                    <div className="rounded-md border bg-muted/20 overflow-hidden">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-xs">20 Feb 2026</TableCell>
                            <TableCell className="text-xs font-medium">Advance Received (UPI)</TableCell>
                            <TableCell className="text-xs text-right font-bold text-green-600">₹{form.watch("paymentAmount").toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow className="bg-white">
                            <TableCell colSpan={2} className="text-xs font-bold text-right">Balance Due</TableCell>
                            <TableCell className="text-xs text-right font-bold text-red-600">₹{(total - form.watch("paymentAmount")).toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Status Controls</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {workflowStages.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {currentStatus === "Completed" && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs text-green-800">
                        <p className="font-bold">Order Completed!</p>
                        <p>Feedback request sent to customer via WhatsApp.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
