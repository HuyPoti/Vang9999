export interface Story {
    title: string;
    content: string;
    image?: string;
}

export enum StockStatus {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    DISCONTINUED = 'discontinued'
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description?: string;
    images?: string[];
    category?: string;
    story?: string;
    story_title?: string;
    story_image?: string;
    stories?: Story[];
    is_active: boolean;
    stock_status: StockStatus;
    created_at?: string;
    updated_at?: string;
}
