export interface IProduct {
    idx: number;
    name: string;
    lead_time: number;
    dependencis: IDependency[];
    target_periode?: number;
    target_stock?: number;
}

export interface IDependency {
    deps_idx: number;
    ratio: number;
}