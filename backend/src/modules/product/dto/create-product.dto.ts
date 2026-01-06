import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
}
