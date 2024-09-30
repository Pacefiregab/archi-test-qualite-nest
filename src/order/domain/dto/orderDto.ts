// create-order.dto.ts
import { IsNotEmpty, IsString, ValidateNested, ArrayMaxSize, Min, IsInt, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class OrderItemDTO {
    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsInt()
    quantity: number;

    @IsInt()
    price: number;
}

export class OrderDTO {
    @IsString()
    id?: string;

    @IsNotEmpty()
    @IsString()
    customerName: string;

    @IsNotEmpty()
    @IsString()
    shippingAddress: string;

    @IsNotEmpty()
    @IsString()
    invoiceAddress: string;

    @ValidateNested({ each: true })
    @ArrayMaxSize(5, { message: 'Cannot order more than 5 items' })
    @Type(() => OrderItemDTO)
    orderItems: OrderItemDTO[];
}

export enum OrderStatus {
    PENDING = 'Pending',
    PAID = 'Paid',
}
