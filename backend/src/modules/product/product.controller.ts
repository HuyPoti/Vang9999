import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe, Query, Inject
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { I_STORAGE_SERVICE } from '../../common/interfaces/storage.interface';
import type { IStorageService } from '../../common/interfaces/storage.interface';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        @Inject(I_STORAGE_SERVICE)
        private readonly storageService: IStorageService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm' })
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

    @Get('unique-details')
    @ApiOperation({ summary: 'Lấy các lựa chọn hình ảnh và câu chuyện duy nhất' })
    getUniqueDetails() {
        return this.productService.getUniqueDetails();
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Lấy chi tiết sản phẩm theo slug hoặc ID' })
    findOne(@Param('slug') slug: string) {
        // Check if slug is actually UUID
        if (slug.length === 36) {
            return this.productService.findOne(slug);
        }
        return this.productService.findOneBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Tạo sản phẩm mới (Yêu cầu Token)' })
    create(@Body() createProductDto: CreateProductDto) {
        console.log('Creating Product Payload:', JSON.stringify(createProductDto, null, 2));
        return this.productService.create(createProductDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cập nhật sản phẩm (Yêu cầu Token)' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
        console.log('Updating Product Payload:', id, JSON.stringify(updateProductDto, null, 2));
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Xóa sản phẩm (Yêu cầu Token)' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.remove(id);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload hình ảnh sản phẩm (Yêu cầu Token)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const result = await this.storageService.uploadFile(file);
        return {
            status: 'success',
            data: {
                url: result.url,
                public_id: result.public_id,
            },
        };
    }
}
