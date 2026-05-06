import { computed, effect, Injectable, signal } from '@angular/core';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
};

const STORAGE_KEY = 'tienda-pesca.cart.v1';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _items = signal<CartItem[]>(this.load());

  public readonly items = this._items.asReadonly();
  public readonly count = computed(() => this._items().reduce((acc, i) => acc + i.qty, 0));
  public readonly subtotal = computed(() => this._items().reduce((acc, i) => acc + i.price * i.qty, 0));

  constructor() {
    effect(() => {
      const items = this._items();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore storage errors (private mode / quota)
      }
    });
  }

  add(item: Omit<CartItem, 'qty'>, qty = 1) {
    if (!qty || qty < 1) return;
    this._items.update((items) => {
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx === -1) return [...items, { ...item, qty }];
      const copy = items.slice();
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
      return copy;
    });
  }

  setQty(id: string, qty: number) {
    if (!Number.isFinite(qty)) return;
    const next = Math.max(0, Math.floor(qty));
    this._items.update((items) => {
      if (next === 0) return items.filter((i) => i.id !== id);
      return items.map((i) => (i.id === id ? { ...i, qty: next } : i));
    });
  }

  inc(id: string) {
    this._items.update((items) => items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  }

  dec(id: string) {
    this._items.update((items) =>
      items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );
  }

  remove(id: string) {
    this._items.update((items) => items.filter((i) => i.id !== id));
  }

  clear() {
    this._items.set([]);
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((x) => x && typeof x === 'object')
        .map((x: any) => ({
          id: String(x.id ?? ''),
          name: String(x.name ?? ''),
          price: Number(x.price ?? 0),
          imageUrl: String(x.imageUrl ?? ''),
          qty: Number(x.qty ?? 0),
        }))
        .filter((i) => i.id && i.name && Number.isFinite(i.price) && Number.isFinite(i.qty) && i.qty > 0);
    } catch {
      return [];
    }
  }
}

