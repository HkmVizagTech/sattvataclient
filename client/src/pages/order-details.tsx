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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { mockCustomers as initialCustomers, mockMenu } from "@/lib/mockData";
import { CalendarIcon, Trash2, Plus, CreditCard, Truck, User, CheckCircle2, AlertCircle, UserPlus, Save } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

// --- Schema Definition ---
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
  // Payment Section
  paymentMethod: z.enum(["UPI", "Gateway", "Cash"]),
  paymentAmount: z.coerce.number().min(0),
  paymentReference: z.string().optional(), // UTR or Cash Collector Name
  paymentContact: z.string().optional(), // Cash Collector Phone
  // Dispatch Section
  vehicleNumber: z.string().optional(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function OrderDetails() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = !!id;
  const [customers, setCustomers] = useState(initialCustomers);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", company: "" });

  // Mock initial data if editing (simplified for prototype)
  const defaultValues: Partial<OrderFormValues> = {
    status: "Draft",
    items: [{ menuItemId: "", quantity: 10 }],
    paymentMethod: "UPI",
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

  // Calculate totals
  const watchedItems = form.watch("items");
  const subtotal = watchedItems.reduce((acc, item) => {
    const menuItem = mockMenu.find(m => m.id === item.menuItemId);
    return acc + (menuItem?.price || 0) * (item.quantity || 0);
  }, 0);
  const tax = subtotal * 0.05; // 5% GST mock
  const total = subtotal + tax;

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
    console.log("Form Data:", data);
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
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Order" : "New Order"}</h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? `Managing Order #${id}` : "Create a new catering order"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLocation("/orders")}>Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)}><Save className="mr-2 h-4 w-4" /> Save Order</Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Main Order Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Event Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between items-center">
                          Customer
                          <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                            <DialogTrigger asChild>
                              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-primary flex items-center gap-1 hover:underline p-0">
                                <UserPlus className="h-3 w-3" /> New Customer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <label className="text-sm font-medium">Full Name</label>
                                  <Input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="e.g. Rahul Sharma" />
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-medium">Phone</label>
                                  <Input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="+91..." />
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-medium">Email (Optional)</label>
                                  <Input value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="rahul@example.com" />
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-medium">Company (Optional)</label>
                                  <Input value={newCustomer.company} onChange={e => setNewCustomer({...newCustomer, company: e.target.value})} placeholder="Company Name" />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" onClick={handleAddCustomer}>Add & Select</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name} ({c.company || 'Personal'})</SelectItem>
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
                        <FormLabel>Venue Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Grand Hyatt Hall A" {...field} />
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
                        <FormLabel>Event Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="eventTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
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
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 2. Menu Selection Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Menu Selection
                  </CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ menuItemId: "", quantity: 10 })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end border-b pb-4 last:border-0 last:pb-0">
                      <FormField
                        control={form.control}
                        name={`items.${index}.menuItemId`}
                        render={({ field }) => (
                          <FormItem className="flex-1 w-full">
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Item</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select item" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockMenu.map(m => (
                                  <SelectItem key={m.id} value={m.id}>
                                    {m.name} - ₹{m.price} ({m.isVeg ? 'Veg' : 'Non-Veg'})
                                  </SelectItem>
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
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex justify-end pt-4 space-y-1 flex-col items-end border-t mt-4">
                    <div className="flex justify-between w-48 text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between w-48 text-sm">
                      <span className="text-muted-foreground">GST (5%):</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between w-48 font-bold text-lg mt-2">
                      <span>Total:</span>
                      <span className="text-primary">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Dispatch Details (Collapsible/Optional) */}
               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" /> Dispatch Logistics
                  </CardTitle>
                  <CardDescription>Vehicle and driver assignment (Optional for Draft)</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle No.</FormLabel>
                        <FormControl>
                          <Input placeholder="MH-12-AB-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="driverName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="driverPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+91..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Sidebar-style Actions */}
            <div className="space-y-6">
              
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="In-Prep">In-Prep</SelectItem>
                            <SelectItem value="Dispatched">Dispatched</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                    <p className="font-semibold mb-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Auto-Actions
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Kitchen notified 24h prior</li>
                      <li>Payment reminders sent automatically</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collect via</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UPI">UPI (Manual)</SelectItem>
                            <SelectItem value="Gateway">Payment Link (Gateway)</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Collect Now</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                         <FormDescription className="text-xs">
                          Suggested: 50% Advance (₹{(total * 0.5).toFixed(0)})
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("paymentMethod") === "UPI" && (
                    <FormField
                      control={form.control}
                      name="paymentReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI Transaction ID (UTR)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter 12-digit UTR" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {form.watch("paymentMethod") === "Cash" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="paymentReference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collector Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Received by..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="paymentContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collector Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+91..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {form.watch("paymentMethod") === "Gateway" && (
                     <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-xs text-blue-800 flex items-start gap-2">
                       <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                       <p>A payment link will be generated and sent to the customer via WhatsApp/SMS upon saving.</p>
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
