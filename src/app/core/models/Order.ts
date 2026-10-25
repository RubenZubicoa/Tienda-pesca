export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productName: string;
  qty: number;
  price: number;
}

export type OrderDB = {
  _id: string;
  dni: string;
  name: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  products: {uuid: string; productName: string; qty: number; price: number}[];
  status: OrderStatus;
  createdAt: string;
  shippingCost: number;
  updatedAt?: number;
  isDeleted?: boolean;
}

export interface Order {
  uuid: string;
  dni: string;
  name: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  products: {uuid: string; productName: string; qty: number; price: number}[];
  status: OrderStatus;
  createdAt: string;
  shippingCost: number;
}

export type AddOrder = Omit<Order, 'uuid' | 'createdAt' | 'updatedAt' | 'status'> & {
  paymentMethod?: string;
};
export type UpdateOrder = Omit<Order, 'uuid' | 'createdAt' | 'updatedAt'>;

export function mapOrderDBToOrder(orderDB: OrderDB): Order {
  return {
    uuid: orderDB._id,
    dni: orderDB.dni,
    name: orderDB.name,
    lastName: orderDB.lastName,
    address: orderDB.address,
    phone: orderDB.phone,
    email: orderDB.email,
    products: orderDB.products,
    status: orderDB.status,
    createdAt: orderDB.createdAt,
    shippingCost: typeof orderDB.shippingCost === 'number' ? orderDB.shippingCost : 0,
  }
}

export function getOrderSubtotal(order: Pick<Order, 'products'>): number {
  return (order.products ?? []).reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getOrderTotal(order: Pick<Order, 'products' | 'shippingCost'>): number {
  const shippingCost = typeof order.shippingCost === 'number' ? order.shippingCost : 0;
  return getOrderSubtotal(order) + shippingCost;
}
