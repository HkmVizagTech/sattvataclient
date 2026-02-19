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
    id: "ORD-HT-001",
    customerName: "Radha Krishna Temple Feast",
    eventDate: "2024-10-25",
    status: "Confirmed",
    totalAmount: 125000,
    balanceDue: 50000,
    items: ["Satvik Thali", "Kheer Prasad", "Fruit Salad"],
    venue: "Main Temple Hall, ISKCON Chowpatty",
    headcount: 500,
    gstNumber: "27AAACI1234A1Z1"
  },
  {
    id: "ORD-HT-002",
    customerName: "Reliance Satvik Lunch",
    eventDate: "2024-10-28",
    status: "In-Prep",
    totalAmount: 45000,
    balanceDue: 0,
    items: ["Executive Satvik Meal", "Masala Lassi"],
    venue: "Reliance Corporate Park, Ghansoli",
    headcount: 100
  },
  {
    id: "ORD-HT-003",
    customerName: "Sharma Family Wedding",
    eventDate: "2024-11-02",
    status: "Draft",
    totalAmount: 850000,
    balanceDue: 850000,
    items: ["Maha Prasad", "56 Bhog Selection"],
    venue: "The Leela Palace, Udaipur",
    headcount: 2000
  }
];

export const mockMenu: MenuItem[] = [
  { id: "V-001", name: "Paneer Butter Masala (No Onion Garlic)", category: "Main Course", price: 350, isVeg: true },
  { id: "V-002", name: "Satvik Mixed Veg Handi", category: "Main Course", price: 280, isVeg: true },
  { id: "V-003", name: "Dal Maharani (Slow Cooked)", category: "Main Course", price: 250, isVeg: true },
  { id: "V-004", name: "Butter Naan (Whole Wheat, Eggless)", category: "Breads", price: 60, isVeg: true },
  { id: "V-005", name: "Saffron Vegetable Pulao", category: "Rice", price: 220, isVeg: true },
  { id: "V-006", name: "Rabri with Malpua", category: "Dessert", price: 180, isVeg: true },
  { id: "V-007", name: "Kheer Prasad (Rich Rice Pudding)", category: "Dessert", price: 100, isVeg: true },
  { id: "V-008", name: "Crispy Bhindi Jaipuri", category: "Sides", price: 180, isVeg: true },
  { id: "V-009", name: "Aloo Gobhi Adraki", category: "Main Course", price: 240, isVeg: true },
  { id: "V-010", name: "Moong Dal Halwa (Desi Ghee)", category: "Dessert", price: 150, isVeg: true },
];

export const mockCustomers: Customer[] = [
  { id: "C-001", name: "Rajesh Malhotra", email: "rajesh@malhotra.in", phone: "+91 98200 12345", gstNumber: "27AAATI1234A1Z1", totalOrders: 12, outstandingBalance: 50000 },
  { id: "C-002", name: "Priya Sharma", email: "priya.s@gmail.com", phone: "+91 98765 54321", totalOrders: 2, outstandingBalance: 0 },
  { id: "C-003", name: "Amit Goenka", email: "amit@goenkagroup.com", phone: "+91 22 2426 0321", company: "Goenka Group", totalOrders: 45, outstandingBalance: 12000 },
];

export const mockStats = [
  { title: "Pending Fulfillments", value: "8", change: "+3 today", icon: "Clock" },
  { title: "Payments Pending", value: "₹4.85L", change: "Monthly Growth: 12%", icon: "IndianRupee" },
  { title: "Upcoming Events", value: "12", change: "Next 14 days", icon: "Calendar" },
  { title: "Active Quotes", value: "15", change: "5 pending approval", icon: "FileText" },
];
