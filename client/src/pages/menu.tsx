import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMenu } from "@/lib/mockData";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MenuPage() {
  const categories = Array.from(new Set(mockMenu.map(item => item.category)));

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Manage dishes, pricing, and categories.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
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
              {mockMenu.filter(item => item.category === category).map((item) => (
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
              
              {/* Add New Card Placeholder */}
               <Card className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-muted-foreground h-full min-h-[250px] cursor-pointer hover:bg-slate-50">
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
