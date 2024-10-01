import { BadRequestException } from "@nestjs/common";
import { OrderDTO, OrderItemDTO } from "../domain/dto/orderDto";
import { Order } from "../domain/entity/order.entity";
import { OrderItem } from "../domain/entity/order-item.entity";
import { randomUUID } from "crypto";

export default class CreateOrderService {

    async createOrder(createOrderDto: OrderDTO): Promise<string> {
        const orderItemsEntity: OrderItem[] = createOrderDto.orderItems.map(item => ({
            id: randomUUID(),
            price: item.price,
            productName: item.productName,
            quantity: item.quantity,
            order: null
        }));
        const order = Order.newOrder(
            createOrderDto.customerName,
            orderItemsEntity,
            createOrderDto.invoiceAddress
        );

        if (order.totalItems() > Order.MAX_ORDER_ITEMS) {
            throw new BadRequestException('Cannot order more than 5 items');
        }

        if (order.itemTotalPrice() < Order.MIN_ORDER_PRICE) {
            throw new BadRequestException('Total price must be at least 10 euros');
        }
        return 'OK';
    }

}