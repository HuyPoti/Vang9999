import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsArray()
    @IsOptional()
    stories?: any[];
}
