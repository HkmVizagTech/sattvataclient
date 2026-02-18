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
import { Separator } from "@/components/ui/separator";
import { mockCustomers, mockMenu } from "@/lib/mockData";
import { FileText, Trash2, Plus, Send, Save, ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";

const quoteSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  validUntil: z.string().min(1, "Expiry date is required"),
  status: z.enum(["Draft", "Sent", "Accepted", "Rejected"]),
  notes: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string().min(1, "Item is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  })).min(1, "Add at least one item"),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export default function QuoteDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = !!id;

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      status: "Draft",
      validUntil: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      items: [{ menuItemId: "", quantity: 10 }],
    },
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
  const total = subtotal * 1.05;

  const onSubmit = (data: QuoteFormValues) => {
    toast({ title: isEditMode ? "Quote Updated" : "Quote Created", description: "Your estimate has been saved." });
    setLocation("/quotes");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/quotes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Quote" : "New Quote"}</h1>
          <p className="text-muted-foreground">Provide a professional Satvik catering estimate.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Estimate Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {mockCustomers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Menu Items</CardTitle>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {mockMenu.map(m => <SelectItem key={m.id} value={m.id}>{m.name} (₹{m.price})</SelectItem>)}
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
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Tax (5%)</span><span>₹{(subtotal * 0.05).toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg text-primary"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={form.handleSubmit(onSubmit)}><Save className="mr-2 h-4 w-4" /> Save Draft</Button>
                <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"><Send className="mr-2 h-4 w-4" /> Send via WhatsApp</Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
