import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
  ) {}

  async findAll(query?: { search?: string; activeOnly?: boolean }) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.created_at', 'DESC');

    if (query?.activeOnly !== undefined) {
      queryBuilder.andWhere('product.is_active = :isActive', {
        isActive: query.activeOnly,
      });
    }

    if (query?.search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  async findOneBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug, is_active: true },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const existing = await this.productRepository.findOne({
      where: { slug: createProductDto.slug },
    });
    if (existing) throw new ConflictException('Slug đã tồn tại');

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existing = await this.productRepository.findOne({
        where: { slug: updateProductDto.slug },
      });
      if (existing) throw new ConflictException('Slug đã tồn tại');
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }

  async getUniqueDetails() {
    // Query to fetch specific fields from all products
    const products = await this.productRepository.find({
      select: ['images', 'story', 'story_title', 'story_image', 'stories'],
    });

    // 1. Extract and flatten unique images
    const allImages = products.flatMap((p) => p.images || []);
    const uniqueImages = Array.from(new Set(allImages)).filter(Boolean);

    // 2. Extract unique stories
    // We consider a story unique based on title + content
    const storiesMap = new Map<
      string,
      { title: string; content: string; image: string }
    >();

    products.forEach((p) => {
      // Legacy single story
      if (p.story || p.story_title) {
        const key = `${p.story_title || ''}|${p.story || ''}`;
        if (!storiesMap.has(key)) {
          storiesMap.set(key, {
            title: p.story_title || '',
            content: p.story || '',
            image: p.story_image || '',
          });
        }
      }

      // New multiple stories
      if (p.stories && Array.isArray(p.stories)) {
        p.stories.forEach((s) => {
          const key = `${s.title || ''}|${s.content || ''}`;
          if (!storiesMap.has(key)) {
            storiesMap.set(key, {
              title: s.title || '',
              content: s.content || '',
              image: s.image || '',
            });
          }
        });
      }
    });

    const uniqueStories = Array.from(storiesMap.values());

    return {
      images: uniqueImages,
      stories: uniqueStories,
    };
  }
}
