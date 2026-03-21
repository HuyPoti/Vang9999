import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Temporary: Define enum here to avoid import issues
// TODO: Refactor to import from shared location once TypeScript resolves module
export enum StockStatus {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    DISCONTINUED = 'discontinued'
}

export class CreateProductDto {
    @ApiProperty({ example: 'Bao lì xì rồng vàng', description: 'Tên sản phẩm' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'bao-li-xi-rong-vang', description: 'Slug duy nhất' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 15000, description: 'Giá tiền' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 'Thiết kế tinh xảo...', description: 'Mô tả sản phẩm' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ type: [String], description: 'Danh sách URL hình ảnh' })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiPropertyOptional({ example: 'Truyền thống', description: 'Danh mục' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Nội dung câu chuyện sản phẩm' })
    @IsString()
    @IsOptional()
    story?: string;

    @ApiPropertyOptional({ description: 'Tiêu đề câu chuyện' })
    @IsString()
    @IsOptional()
    story_title?: string;

    @ApiPropertyOptional({ description: 'URL ảnh minh họa câu chuyện' })
    @IsString()
    @IsOptional()
    story_image?: string;

    @ApiPropertyOptional({ type: [Object], description: 'Danh sách chi tiết các câu chuyện' })
    @IsArray()
    @IsOptional()
    stories?: any[];

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    is_active?: boolean;

    @ApiPropertyOptional({ enum: StockStatus, default: StockStatus.IN_STOCK })
    @IsEnum(StockStatus)
    @IsOptional()
    stock_status?: StockStatus;
}

