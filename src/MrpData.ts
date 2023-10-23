export interface IProduct {
  idx: number;
  name: string;
  lead_time: number;
  inital_stock: number;
  dependencies: IDependency[];
  target_periode?: number;
  target_stock?: number;
  level?: number;
  minimal_order_quantity: number;
}

export interface IDependency {
  deps_idx: number;
  ratio: number;
}

export interface IPeriodItem {
  idx: number;
  name: string;
  gross_requirement: number;
  stock: number;
  inbound: number;
  order: number;
  isOrderGenerated: boolean;
  isGRGenerated: boolean;
  isInboundGenerated: boolean;
}

export interface IPeriod {
  items: IPeriodItem[];
}

export interface IStockItem {
  idx: number;
  name: string;
  amount: number;
}
