import { Order, OrderDTO, OrderStatus } from "../domain/entity/order.entity";
import OrderRepository from "../infrastructure/order.repository";

export default class GetDeliveryAdressService {

    constructor(private readonly orderRepository: OrderRepository) { }

    async setDelivery(order: OrderDTO): Promise<Order> {
        const orderEntity = await this.orderRepository.findById(order.id);
        if (!orderEntity) {
            throw new Error('Order ID is required');
        }

        orderEntity.setDelivery(order.shippingAddress);
        return this.orderRepository.save(orderEntity);
    }
}