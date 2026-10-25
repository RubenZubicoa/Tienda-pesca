export type ShippingCostItemDB = {
  company: string;
  cost: number;
};

export type ShippingCostDB = {
  _id: string;
  zone: string;
  costList: ShippingCostItemDB[];
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
};

export type ShippingCostItem = {
  company: string;
  cost: number;
};

export type ShippingCost = {
  uuid: string;
  zone: string;
  costs: ShippingCostItem[];
};

export function mapShippingCostDBToShippingCost(item: ShippingCostDB): ShippingCost {
  return {
    uuid: item._id,
    zone: item.zone?.trim() || 'Zona',
    costs: (item.costList ?? [])
      .filter((entry) => entry && typeof entry.cost === 'number')
      .map((entry) => ({
        company: entry.company?.trim() || 'Servicio',
        cost: entry.cost,
      })),
  };
}
