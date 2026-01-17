// API service cho thống kê
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface OrderStatistics {
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

export interface ProductStatistics {
    product_id: string;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
    order_count: number;
}

export interface StatisticsResponse {
    status: string;
    data: {
        order_statistics: OrderStatistics;
        product_statistics: ProductStatistics[];
    };
}

export interface DateRange {
    startDate?: string;
    endDate?: string;
}

export async function getStatistics(dateRange?: DateRange): Promise<StatisticsResponse> {
    const token = localStorage.getItem('admin_token');
    const params = new URLSearchParams();

    if (dateRange?.startDate) {
        params.append('startDate', dateRange.startDate);
    }
    if (dateRange?.endDate) {
        params.append('endDate', dateRange.endDate);
    }

    const url = `${API_URL}/orders/statistics/overview${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch statistics');
    }

    return response.json();
}

export async function exportStatistics(dateRange?: DateRange): Promise<void> {
    const token = localStorage.getItem('admin_token');
    const params = new URLSearchParams();

    if (dateRange?.startDate) {
        params.append('startDate', dateRange.startDate);
    }
    if (dateRange?.endDate) {
        params.append('endDate', dateRange.endDate);
    }

    const url = `${API_URL}/orders/statistics/export${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to export statistics');
    }

    // Download file
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'statistics.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
}
