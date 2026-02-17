import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMenu as initialMenu } from "@/lib/mockData";
import { Plus, Search, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function MenuPage() {
  const { toast } = useToast();
  const [menu, setMenu] = useState(initialMenu);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Main Course", price: "", isVeg: true });
  
  const categories = Array.from(new Set(menu.map(item => item.category)));

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item = {
      id: `V-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      price: parseFloat(newItem.price),
      isVeg: newItem.isVeg
    };
    setMenu([...menu, item]);
    setIsAddDialogOpen(false);
    setNewItem({ name: "", category: "Main Course", price: "", isVeg: true });
    toast({ title: "Item Added", description: `${item.name} has been added to the menu.` });
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Manage dishes, pricing, and categories.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Item Name</label>
                <Input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Satvik Malai Kofta" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newItem.category} onValueChange={val => setNewItem({...newItem, category: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Course">Main Course</SelectItem>
                    <SelectItem value="Starters">Starters</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                    <SelectItem value="Breads">Breads</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Sides">Sides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Price (₹)</label>
                <Input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder="0.00" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isVeg" checked={newItem.isVeg} onChange={e => setNewItem({...newItem, isVeg: e.target.checked})} />
                <label htmlFor="isVeg" className="text-sm font-medium">Vegetarian (Satvik)</label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddItem}>Save Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={categories[0]} className="space-y-4">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          <TabsList>
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
          </TabsList>
          
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu..."
              className="pl-9"
            />
          </div>
        </div>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {menu.filter(item => item.category === category).map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="aspect-video bg-slate-100 relative">
                    <img 
                      src={`https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(item.name)}`} 
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                       <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm">
                         <Edit2 className="h-3 w-3" />
                       </Button>
                       <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-sm">
                         <Trash2 className="h-3 w-3" />
                       </Button>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <Badge variant={item.isVeg ? "outline" : "destructive"} className={item.isVeg ? "border-green-200 text-green-700 bg-green-50" : ""}>
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="font-bold text-lg text-primary">₹{item.price}</div>
                    <CardDescription className="text-xs mt-1">
                      {item.category} • ID: {item.id}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
              
               <Card 
                onClick={() => setIsAddDialogOpen(true)}
                className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-muted-foreground h-full min-h-[250px] cursor-pointer hover:bg-slate-50"
               >
                  <Plus className="h-8 w-8 mb-2 opacity-50" />
                  <span className="font-medium">Add New Item</span>
               </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Minimal select component for the dialog if UI kit doesn't have it ready
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@/components/ui/select";
const Select = UISelect;
const SelectContent = UISelectContent;
const SelectItem = UISelectItem;
const SelectTrigger = UISelectTrigger;
const SelectValue = UISelectValue;
