import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async findAll(query?: { search?: string; activeOnly?: boolean }) {
        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .orderBy('product.created_at', 'DESC');

        if (query?.activeOnly !== undefined) {
            queryBuilder.andWhere('product.is_active = :isActive', { isActive: query.activeOnly });
        }

        if (query?.search) {
            queryBuilder.andWhere('product.name ILIKE :search', { search: `%${query.search}%` });
        }

        return queryBuilder.getMany();
    }

    async findOne(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
        return product;
    }

    async findOneBySlug(slug: string) {
        const product = await this.productRepository.findOne({ where: { slug, is_active: true } });
        if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
        return product;
    }

    async create(createProductDto: CreateProductDto) {
        const existing = await this.productRepository.findOne({ where: { slug: createProductDto.slug } });
        if (existing) throw new ConflictException('Slug đã tồn tại');

        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);

        if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
            const existing = await this.productRepository.findOne({ where: { slug: updateProductDto.slug } });
            if (existing) throw new ConflictException('Slug đã tồn tại');
        }

        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

    async remove(id: string) {
        const product = await this.findOne(id);
        return this.productRepository.remove(product);
    }
}
