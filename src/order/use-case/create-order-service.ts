import { Order, OrderDTO, OrderItemDTO } from "../domain/entity/order.entity";
import OrderRepository from "../infrastructure/order.repository";

export default class CreateOrderService {
    constructor(private readonly orderRepository: OrderRepository) { }

    async createOrder(createOrderDto: OrderDTO): Promise<Order> {
        const order = new Order(
            createOrderDto.customerName,
            createOrderDto.orderItems,
            createOrderDto.invoiceAddress
        );
        return this.orderRepository.save(order);
    }

}