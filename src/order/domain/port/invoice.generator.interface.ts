import { Order } from "../entity/order.entity";

export interface PdfServiceInterface {
    generateInvoice(order: Order): Promise<any>;
}