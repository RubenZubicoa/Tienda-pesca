export type CheckoutPaymentMethod = 'card' | 'transfer' | 'bizum' | 'paypal';

export type PaymentMethodOption = {
  id: CheckoutPaymentMethod;
  label: string;
  description: string;
};

export const CHECKOUT_PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'card', label: 'Tarjeta de crédito', description: 'Pago seguro con tarjeta' },
  { id: 'transfer', label: 'Transferencia', description: 'Transferencia bancaria' },
  { id: 'bizum', label: 'Bizum', description: 'Pago instantáneo por móvil' },
  { id: 'paypal', label: 'PayPal', description: 'Pago con cuenta PayPal' },
];
