export type UserType = {
  id: number;
  name: string;
  email: string;
  totalSpent?: number;
  orderCount?: number;
};

export type ProductType = {
  id: number;
  name: string;
  price: number;
  stock?: number;
  status?: string;
  soldQuantity?: number;
  revenue?: number;
};

export type OrderItem = {
  productId: number;
  quantity: number;
  price: number | string;
  name: string;
};

export type OrderType = {
  id: number;
  full_name: string;
  payment_method: string;
  total: number | string;
  timestamp: string;
  items: OrderItem[];
};

export type SalesData = {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
};
