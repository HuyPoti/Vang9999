// DTO cho response thống kê đơn hàng
export class OrderStatisticsDto {
    total_orders: number;
    total_revenue: number;
    status_breakdown: {
        pending: number;
        confirmed: number;
        shipping: number;
        completed: number;
        cancelled: number;
    };
    daily_revenue: { date: string; revenue: number }[];
}

export class ProductStatisticsDto {
    product_id: string;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
    order_count: number;
}

export class StatisticsResponseDto {
    order_statistics: OrderStatisticsDto;
    product_statistics: ProductStatisticsDto[];
}
