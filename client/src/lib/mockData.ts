export interface Order {
  id: string;
  customerName: string;
  eventDate: string;
  status: 'Draft' | 'Confirmed' | 'In-Prep' | 'Dispatched' | 'Delivered' | 'Completed' | 'Cancelled';
  totalAmount: number;
  balanceDue: number;
  items: string[];
  venue: string;
  headcount: number;
  gstNumber?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  gstNumber?: string;
  totalOrders: number;
  outstandingBalance: number;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-ISK-001",
    customerName: "Radha Krishna Temple Feast",
    eventDate: "2024-10-25",
    status: "Confirmed",
    totalAmount: 125000,
    balanceDue: 50000,
    items: ["Satvik Thali", "Kheer Prasad", "Fruit Salad"],
    venue: "ISKCON Temple Hall",
    headcount: 500,
    gstNumber: "27AAACI1234A1Z1"
  },
  {
    id: "ORD-ISK-002",
    customerName: "Govinda's Corporate Lunch",
    eventDate: "2024-10-28",
    status: "In-Prep",
    totalAmount: 45000,
    balanceDue: 0,
    items: ["Executive Satvik Meal", "Lassi"],
    venue: "Reliance Corporate Park",
    headcount: 100
  },
  {
    id: "ORD-ISK-003",
    customerName: "Janmashtami Celebration",
    eventDate: "2024-11-02",
    status: "Draft",
    totalAmount: 850000,
    balanceDue: 850000,
    items: ["Maha Prasad", "56 Bhog Selection"],
    venue: "Main Altar Area",
    headcount: 2000
  }
];

export const mockMenu: MenuItem[] = [
  { id: "V-001", name: "Paneer Butter Masala (No Onion Garlic)", category: "Main Course", price: 350, isVeg: true },
  { id: "V-002", name: "Satvik Mixed Veg", category: "Main Course", price: 280, isVeg: true },
  { id: "V-003", name: "Dal Maharani", category: "Main Course", price: 250, isVeg: true },
  { id: "V-004", name: "Butter Naan (Eggless)", category: "Breads", price: 60, isVeg: true },
  { id: "V-005", name: "Saffron Pulao", category: "Rice", price: 220, isVeg: true },
  { id: "V-006", name: "Rabri with Malpua", category: "Dessert", price: 180, isVeg: true },
  { id: "V-007", name: "Kheer Prasad", category: "Dessert", price: 100, isVeg: true },
  { id: "V-008", name: "Crispy Bhindi Fry", category: "Sides", price: 180, isVeg: true },
];

export const mockCustomers: Customer[] = [
  { id: "C-001", name: "ISKCON Pune", email: "pune@iskcon.org", phone: "+91 20 2426 0321", gstNumber: "27AAATI1234A1Z1", totalOrders: 45, outstandingBalance: 50000 },
  { id: "C-002", name: "Govind Das", email: "govind@gmail.com", phone: "+91 98765 12345", totalOrders: 2, outstandingBalance: 0 },
];

export const mockStats = [
  { title: "Prasad Fulfillments", value: "8", change: "+3 today", icon: "Clock" },
  { title: "Revenue (Incl. GST)", value: "₹4.85L", change: "Monthly Growth: 12%", icon: "IndianRupee" },
  { title: "Upcoming Festivals", value: "3", change: "Next 14 days", icon: "Calendar" },
  { title: "Active Quotes", value: "15", change: "5 pending approval", icon: "FileText" },
];
