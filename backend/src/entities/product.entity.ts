import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Comment } from './comment.entity'; // Will resolve at runtime if circular

import { ColumnNumericTransformer } from '../utils/column-numeric-transformer';
import { StockStatus } from '../modules/product/dto/create-product.dto';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    slug: string;

    @Column()
    name: string;

    @Column('decimal', {
        precision: 10,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @Column('text')
    description: string;

    @Column('jsonb', { default: [] })
    images: string[];

    @Column({ default: true })
    is_active: boolean;

    @Column({
        type: 'enum',
        enum: StockStatus,
        default: StockStatus.IN_STOCK
    })
    stock_status: StockStatus;

    @Column('text', { nullable: true })
    story: string;

    @Column('text', { nullable: true })
    story_title: string;

    @Column('text', { nullable: true })
    story_image: string;

    @Column('jsonb', { default: [] })
    stories: { title: string; content: string; image: string }[];

    @OneToMany(() => Comment, (comment) => comment.product)
    comments: Comment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
