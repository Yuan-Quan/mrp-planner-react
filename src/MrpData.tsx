export interface IProduct {
    idx: number;
    name: string;
    lead_time: number;
    dependencis: IProduct[];
    target_periode?: number;
    target_stock?: number;
}