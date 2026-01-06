import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, IsOptional, ValidateNested, IsArray, IsInt, Min, IsUrl, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    customer_name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsOptional()
    note?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
