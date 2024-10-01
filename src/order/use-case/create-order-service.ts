import { BadRequestException } from "@nestjs/common";
import { Order, OrderDTO, OrderItemDTO } from "../domain/entity/order.entity";
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

        
        return 'OK';
    }

}