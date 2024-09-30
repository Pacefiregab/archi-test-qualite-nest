// create-order.dto.ts
import { IsNotEmpty, IsString, ValidateNested, ArrayMaxSize, Min, IsInt, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDTO {
    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsInt()
    @Max(5, { message: 'Quantity must be at most 5' })
    quantity: number;

    @IsInt()
    @Min(10, { message: 'Price must be at least 10 euro' })
    price: number;
}

export class CreateOrderDTO {
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
