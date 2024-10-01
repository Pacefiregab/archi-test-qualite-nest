import { BadRequestException } from "@nestjs/common";
import { Order, OrderDTO, OrderStatus } from "../domain/entity/order.entity";
import { OrderItem } from "../domain/entity/order-item.entity";
import OrderRepository from "../infrastructure/order.repository";

export default class PayOrderService {
    constructor(private readonly orderRepository: OrderRepository) { }

    async payOrder(order: OrderDTO): Promise<Order> {
        const orderEntity = await this.orderRepository.findById(order.id);
        if (!orderEntity) {
            throw new Error('Order ID is required');
        }
        orderEntity.pay()
        return this.orderRepository.save(orderEntity);
    }
}