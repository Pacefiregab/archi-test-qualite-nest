import { Order, OrderDTO } from "../domain/entity/order.entity";
import OrderRepository from "../infrastructure/order.repository";

export default class CancelOrderService {
    constructor(private readonly orderRepository: OrderRepository) { }

    async cancelOrder(order: OrderDTO): Promise<Order> {
        const orderEntity = await this.orderRepository.findById(order.id);
        if (!orderEntity) {
            throw new Error('Order ID is required');
        }

        orderEntity.cancel(order.cancelationReason);

        return orderEntity;
    }
}