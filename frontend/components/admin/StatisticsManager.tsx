"use client";

import { useEffect, useState } from "react";
import { getStatistics, exportStatistics, OrderStatistics, ProductStatistics, DateRange } from "@/lib/statistics.service";
import { BarChart3, Package, ShoppingCart, TrendingUp, DollarSign, Download, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';

export function StatisticsManager() {
    const [orderStats, setOrderStats] = useState<OrderStatistics | null>(null);
    const [productStats, setProductStats] = useState<ProductStatistics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);

    // Date range state
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        // Set default date range: last 30 days
        const end = new Date();
        const start = subDays(end, 30);
        setStartDate(format(start, 'yyyy-MM-dd'));
        setEndDate(format(end, 'yyyy-MM-dd'));
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            loadStatistics();
        }
    }, [startDate, endDate]);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const dateRange: DateRange = {
                startDate: startDate ? new Date(startDate).toISOString() : undefined,
                endDate: endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
            };
            const response = await getStatistics(dateRange);
            setOrderStats(response.data.order_statistics);
            setProductStats(response.data.product_statistics);
        } catch (err) {
            setError('Không thể tải thống kê');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const dateRange: DateRange = {
                startDate: startDate ? new Date(startDate).toISOString() : undefined,
                endDate: endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
            };
            await exportStatistics(dateRange);
        } catch (err) {
            alert('Không thể export thống kê');
            console.error(err);
        } finally {
            setExporting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
                {error}
            </div>
        );
    }

    if (!orderStats) return null;

    return (
        <div className="space-y-6">
            {/* Header with filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary-600" />
                    Thống kê
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-sm outline-none"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-sm outline-none"
                        />
                    </div>

                    <button
                        onClick={loadStatistics}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
                    >
                        Làm mới
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {exporting ? 'Đang xuất...' : 'Xuất Excel'}
                    </button>
                </div>
            </div>

            {/* Tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Tổng đơn hàng</p>
                            <p className="text-4xl font-bold">{orderStats.total_orders}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl">
                            <ShoppingCart className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-1">Tổng doanh thu</p>
                            <p className="text-3xl font-bold">{formatCurrency(orderStats.total_revenue)}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Biểu đồ doanh thu theo ngày */}
            {orderStats.daily_revenue && orderStats.daily_revenue.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        Doanh thu theo ngày
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={orderStats.daily_revenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                            />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                labelFormatter={(label) => format(new Date(label), 'dd/MM/yyyy')}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Doanh thu"
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Thống kê theo trạng thái */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    Đơn hàng theo trạng thái
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <p className="text-yellow-600 text-xs font-medium mb-1">Chờ xác nhận</p>
                        <p className="text-2xl font-bold text-yellow-700">{orderStats.status_breakdown.pending}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-blue-600 text-xs font-medium mb-1">Đã xác nhận</p>
                        <p className="text-2xl font-bold text-blue-700">{orderStats.status_breakdown.confirmed}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <p className="text-purple-600 text-xs font-medium mb-1">Đang giao</p>
                        <p className="text-2xl font-bold text-purple-700">{orderStats.status_breakdown.shipping}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <p className="text-green-600 text-xs font-medium mb-1">Hoàn thành</p>
                        <p className="text-2xl font-bold text-green-700">{orderStats.status_breakdown.completed}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <p className="text-red-600 text-xs font-medium mb-1">Đã hủy</p>
                        <p className="text-2xl font-bold text-red-700">{orderStats.status_breakdown.cancelled}</p>
                    </div>
                </div>
            </div>

            {/* Thống kê theo sản phẩm */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-600" />
                    Top sản phẩm bán chạy
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sản phẩm</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Số lượng bán</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Số đơn</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productStats.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                productStats.map((product, index) => (
                                    <tr key={product.product_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.product_name}</td>
                                        <td className="py-3 px-4 text-sm text-right text-gray-700">{product.total_quantity}</td>
                                        <td className="py-3 px-4 text-sm text-right text-gray-700">{product.order_count}</td>
                                        <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">
                                            {formatCurrency(product.total_revenue)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
