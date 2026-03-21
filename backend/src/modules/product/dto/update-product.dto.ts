import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiPropertyOptional({ type: [Object], description: 'Cập nhật danh sách câu chuyện' })
    @IsArray()
    @IsOptional()
    stories?: any[];
}
