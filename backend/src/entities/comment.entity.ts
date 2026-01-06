import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './product.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index() // User asked for Index comments.product_id
    product_id: string;

    @ManyToOne(() => Product, (product) => product.comments)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    name: string;

    @Column({ select: false }) // Hide email by default
    email: string;

    @Column('text')
    content: string;

    @Column({ default: false })
    is_hidden: boolean;

    @CreateDateColumn()
    created_at: Date;
}
