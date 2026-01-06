import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../../entities/comment.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async create(createCommentDto: CreateCommentDto) {
        const product = await this.productRepository.findOne({
            where: { id: createCommentDto.product_id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const comment = this.commentRepository.create(createCommentDto);
        const savedComment = await this.commentRepository.save(comment);

        return {
            status: 'success',
            data: savedComment,
        };
    }

    async findByProductId(productId: string, page: number = 1, limit: number = 10) {
        const [items, total] = await this.commentRepository.findAndCount({
            where: { product_id: productId, is_hidden: false },
            order: { created_at: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            status: 'success',
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findAll(query?: { productId?: string; search?: string; page?: number; limit?: number }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const queryBuilder = this.commentRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.product', 'product')
            .addSelect('comment.email') // explicitly select hidden email
            .orderBy('comment.created_at', 'DESC')
            .take(limit)
            .skip((page - 1) * limit);

        if (query?.productId) {
            queryBuilder.andWhere('comment.product_id = :productId', { productId: query.productId });
        }

        if (query?.search) {
            queryBuilder.andWhere(
                '(comment.name ILIKE :search OR comment.content ILIKE :search)',
                { search: `%${query.search}%` }
            );
        }

        const [items, total] = await queryBuilder.getManyAndCount();

        return {
            status: 'success',
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async remove(id: string) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) throw new NotFoundException('Bình luận không tồn tại');
        await this.commentRepository.remove(comment);
        return { status: 'success', message: 'Đã xóa bình luận' };
    }

    async toggleVisibility(id: string) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) throw new NotFoundException('Bình luận không tồn tại');
        comment.is_hidden = !comment.is_hidden;
        await this.commentRepository.save(comment);
        return { status: 'success', data: comment };
    }
}
