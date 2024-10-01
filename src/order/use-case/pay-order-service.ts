import { BadRequestException } from "@nestjs/common";
import { Order, OrderDTO, OrderStatus } from "../domain/entity/order.entity";
import { OrderItem } from "../domain/entity/order-item.entity";

export default class PayOrderService {



    async payOrder(orderDto: OrderDTO): Promise<string> {
        if (!orderDto || !orderDto.id) {
            throw new BadRequestException('Order ID is required');
        }
        const orderToUpdate: Order = this.getFakeExisitngOrder(orderDto);
        orderToUpdate.pay();
        return 'Paid';
    }

    getFakeExisitngOrder(orderDto: OrderDTO): Order {
        return new Order(orderDto.customerName, orderDto.orderItems, orderDto.invoiceAddress);
    }

}