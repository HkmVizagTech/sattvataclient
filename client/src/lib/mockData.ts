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
  totalOrders: number;
  outstandingBalance: number;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-7829",
    customerName: "Acme Corp Annual Meet",
    eventDate: "2024-10-25",
    status: "Confirmed",
    totalAmount: 125000,
    balanceDue: 50000,
    items: ["Gourmet Lunch Buffet", "Coffee Station", "Evening Snacks"],
    venue: "Grand Hyatt Conference Hall A",
    headcount: 150
  },
  {
    id: "ORD-7830",
    customerName: "Sarah's Wedding Reception",
    eventDate: "2024-10-28",
    status: "In-Prep",
    totalAmount: 450000,
    balanceDue: 0,
    items: ["Premium Wedding Feast", "Live Pasta Counter", "Dessert Bar"],
    venue: "Green Meadows Resort",
    headcount: 300
  },
  {
    id: "ORD-7831",
    customerName: "TechStart Hackathon",
    eventDate: "2024-11-02",
    status: "Draft",
    totalAmount: 85000,
    balanceDue: 85000,
    items: ["Pizza & Burgers", "Energy Drinks", "Midnight Snacks"],
    venue: "TechStart HQ, 4th Floor",
    headcount: 80
  },
  {
    id: "ORD-7832",
    customerName: "City Hospital Gala",
    eventDate: "2024-11-05",
    status: "Dispatched",
    totalAmount: 210000,
    balanceDue: 20000,
    items: ["Healthy Gourmet Dinner", "Fresh Juices", "Salad Bar"],
    venue: "City Convention Center",
    headcount: 200
  },
  {
    id: "ORD-7833",
    customerName: "Private Birthday Party",
    eventDate: "2024-11-10",
    status: "Completed",
    totalAmount: 45000,
    balanceDue: 0,
    items: ["Kids Menu", "Birthday Cake", "Soft Drinks"],
    venue: "123 Maple Drive",
    headcount: 40
  }
];

export const mockMenu: MenuItem[] = [
  { id: "M-001", name: "Paneer Tikka Masala", category: "Main Course", price: 350, isVeg: true },
  { id: "M-002", name: "Butter Chicken", category: "Main Course", price: 450, isVeg: false },
  { id: "M-003", name: "Dal Makhani", category: "Main Course", price: 280, isVeg: true },
  { id: "M-004", name: "Garlic Naan", category: "Breads", price: 60, isVeg: true },
  { id: "M-005", name: "Jeera Rice", category: "Rice", price: 180, isVeg: true },
  { id: "M-006", name: "Gulab Jamun", category: "Dessert", price: 120, isVeg: true },
  { id: "M-007", name: "Chicken Biryani", category: "Main Course", price: 400, isVeg: false },
  { id: "M-008", name: "Vegetable Spring Rolls", category: "Starters", price: 220, isVeg: true },
];

export const mockCustomers: Customer[] = [
  { id: "C-001", name: "Acme Corp", email: "events@acmecorp.com", phone: "+91 98765 43210", company: "Acme Corp", totalOrders: 12, outstandingBalance: 50000 },
  { id: "C-002", name: "Sarah Jenkins", email: "sarah.j@gmail.com", phone: "+91 98765 12345", totalOrders: 1, outstandingBalance: 0 },
  { id: "C-003", name: "TechStart Inc", email: "admin@techstart.io", phone: "+91 91234 56789", company: "TechStart", totalOrders: 5, outstandingBalance: 85000 },
];

export const mockStats = [
  { title: "Pending Fulfillments", value: "3", change: "+1 today", icon: "Clock" },
  { title: "Payments Pending", value: "₹1.35L", change: "Due this week", icon: "IndianRupee" },
  { title: "Upcoming Events", value: "8", change: "Next 7 days", icon: "Calendar" },
  { title: "Active Quotes", value: "12", change: "4 sent today", icon: "FileText" },
];
