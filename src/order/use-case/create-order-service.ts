import { BadRequestException } from "@nestjs/common";
import { Order, OrderDTO, OrderItemDTO } from "../domain/entity/order.entity";
import { OrderItem } from "../domain/entity/order-item.entity";
import { randomUUID } from "crypto";

export default class CreateOrderService {

    async createOrder(createOrderDto: OrderDTO): Promise<string> {
        const order = new Order(
            createOrderDto.customerName,
            createOrderDto.orderItems,
            createOrderDto.invoiceAddress
        );

        
        return 'OK';
    }

}