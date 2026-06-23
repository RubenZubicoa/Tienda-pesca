export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productName: string;
  qty: number;
  price: number;
}

export interface Order {
  uuid: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}
