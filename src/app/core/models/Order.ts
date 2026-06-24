import { ProductWithQuantity } from "./Product";

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productName: string;
  qty: number;
  price: number;
}

export type OrderDB = {
  _id: string;
  username: string;
  address: string;
  phone: string;
  email: string;
  products: ProductWithQuantity[];
  status: OrderStatus;
  createdAt: string;
  total: number;
  updatedAt?: number;
  isDeleted?: boolean;
}

export interface Order {
  uuid: string;
  username: string;
  address: string;
  phone: string;
  email: string;
  products: ProductWithQuantity[];
  status: OrderStatus;
  createdAt: string;
  total: number;
}

export type AddOrder = Omit<Order, 'uuid' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateOrder = Omit<Order, 'uuid' | 'createdAt' | 'updatedAt'>;

export function mapOrderDBToOrder(orderDB: OrderDB): Order {
  return {
    uuid: orderDB._id,
    username: orderDB.username,
    address: orderDB.address,
    phone: orderDB.phone,
    email: orderDB.email,
    products: orderDB.products,
    status: orderDB.status,
    createdAt: orderDB.createdAt,
    total: orderDB.total,
  }
}
