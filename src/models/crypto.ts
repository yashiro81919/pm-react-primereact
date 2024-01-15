import { Cmc } from "./cmc";

export interface Crypto extends Cmc {
    quantity: number;
    remark?: string;
}