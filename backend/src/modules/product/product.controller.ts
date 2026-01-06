import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe, Query
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @Get()
    findAll(@Query('search') search?: string, @Query('activeOnly') activeOnly?: string) {
        let activeOnlyValue: boolean | undefined = true;
        if (activeOnly === 'all') activeOnlyValue = undefined;
        else if (activeOnly === 'false') activeOnlyValue = false;
        else if (activeOnly === 'true') activeOnlyValue = true;

        return this.productService.findAll({
            search,
            activeOnly: activeOnlyValue
        });
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        // Check if slug is actually UUID
        if (slug.length === 36) {
            return this.productService.findOne(slug);
        }
        return this.productService.findOneBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.remove(id);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const result = await this.cloudinaryService.uploadFile(file);
        return {
            status: 'success',
            data: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        };
    }
}
