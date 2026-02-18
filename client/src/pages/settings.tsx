import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smartphone, Palette, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your Satvik catering operations and integrations.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Branding & Profile</CardTitle>
            <CardDescription>Configure how your business appears on invoices and quotes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Business Name</Label><Input defaultValue="ISKCON Catering Services" /></div>
              <div className="space-y-2"><Label>GSTIN</Label><Input defaultValue="07AAATI1234A1Z1" /></div>
              <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input defaultValue="Hare Krishna Hill, East of Kailash, New Delhi" /></div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> Integrations</CardTitle>
            <CardDescription>Connect with third-party APIs for payments and messaging.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium flex items-center gap-2">Razorpay Gateway <Badge variant="secondary" className="text-[10px] h-4">Connected</Badge></div>
                <div className="text-sm text-muted-foreground">Process UPI and online payments automatically.</div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium flex items-center gap-2">Gupshup WhatsApp API <Badge variant="secondary" className="text-[10px] h-4">Connected</Badge></div>
                <div className="text-sm text-muted-foreground">Send automated order updates and payment links.</div>
              </div>
              <Button variant="outline" size="sm">Templates</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</CardTitle>
            <CardDescription>Choose when you and your customers get notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label>Customer Order Confirmations</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Kitchen Prep Reminders (24h prior)</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Payment Due Alerts</Label><Switch defaultChecked /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
