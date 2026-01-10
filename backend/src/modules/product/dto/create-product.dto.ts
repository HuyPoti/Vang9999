import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsEnum } from 'class-validator';

// Temporary: Define enum here to avoid import issues
// TODO: Refactor to import from shared location once TypeScript resolves module
export enum StockStatus {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    DISCONTINUED = 'discontinued'
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    story?: string;

    @IsString()
    @IsOptional()
    story_title?: string;

    @IsString()
    @IsOptional()
    story_image?: string;

    @IsOptional()
    is_active?: boolean;

    @IsEnum(StockStatus)
    @IsOptional()
    stock_status?: StockStatus;
}

