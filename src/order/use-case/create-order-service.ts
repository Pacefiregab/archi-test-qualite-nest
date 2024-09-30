import { BadRequestException } from "@nestjs/common";
import { OrderDTO, OrderItemDTO } from "../domain/dto/orderDto";
import { Order } from "../domain/entity/order.entity";

export default class CreateOrderService {

    async createOrder(createOrderDto: OrderDTO): Promise<string> {
        const { orderItems } = createOrderDto;

        let totalPrice = this.itemTotalPrice(orderItems);

        if (this.totalItems(orderItems) > Order.MAX_ORDER_ITEMS) {
            throw new BadRequestException('Cannot order more than 5 items');
        }

        if (totalPrice < Order.MIN_ORDER_PRICE) {
            throw new BadRequestException('Total price must be at least 10 euros');
        }
        return 'OK';
    }

    private itemTotalPrice(orderItems: OrderItemDTO[]): number {
        return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    private totalItems(orderItems: OrderItemDTO[]): number {
        return orderItems.reduce((total, item) => total + item.quantity, 0);
    }
}