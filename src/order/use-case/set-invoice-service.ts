import { Order, OrderDTO, OrderStatus } from "../domain/entity/order.entity";
import OrderRepository from "../infrastructure/order.repository";

export default class SetInvoiceService {


    constructor(private readonly orderRepository: OrderRepository) { }

    async setInvoice(order: OrderDTO): Promise<Order> {
        const orderEntity = await this.orderRepository.findById(order.id);
        if (!orderEntity) {
            throw new Error('Order ID is required');
        }

        orderEntity.setInvoice(order.invoiceAddress);
        return this.orderRepository.save(orderEntity);
    }
}