"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
    id: string;
    product_name: string;
    price: number;
    quantity: number;
}

import { Search, Download, Truck, PackageCheck } from "lucide-react";

interface Order {
    id: string;
    customer_name: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
    status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
    total_amount: number;
    created_at: string;
    items: OrderItem[];
}

import toast from 'react-hot-toast';

export function OrderManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (statusFilter) params.append("status", statusFilter);

            const res = await fetch(`${apiUrl}/orders?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await res.json();
            setOrders(result);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            toast.error("Không thể tải danh sách đơn hàng");
        } finally {
            setIsLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const exportToExcel = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (statusFilter) params.append("status", statusFilter);

            const res = await fetch(`${apiUrl}/orders/export?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Xuất file thành công");
        } catch (err) {
            toast.error("Lỗi khi xuất file");
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/orders/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success("Cập nhật trạng thái thành công");
                fetchOrders();
                if (selectedOrder?.id === id) {
                    setSelectedOrder(prev => prev ? { ...prev, status: status as any } : null);
                }
            }
        } catch (err) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">Chờ xử lý</span>;
            case 'confirmed': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Đã xác nhận</span>;
            case 'shipping': return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">Đang giao</span>;
            case 'completed': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Hoàn thành</span>;
            case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Đã hủy</span>;
            default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên, SĐT, email..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 ring-primary-500 outline-none w-full md:w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 ring-primary-500 outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Xuất Excel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Order List */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Ngày đặt</th>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Tổng tiền</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Không tìm thấy đơn hàng nào.
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-primary-50' : ''}`} onClick={() => setSelectedOrder(order)}>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                                        <p className="text-xs text-gray-500">{order.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(order.total_amount)}</td>
                                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
                    {selectedOrder ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng</h3>
                                    <p className="text-xs text-gray-500 mt-1">ID: {selectedOrder.id}</p>
                                </div>
                                {getStatusBadge(selectedOrder.status)}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Tên khách hàng</p>
                                        <p className="font-medium">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Số điện thoại</p>
                                        <p className="font-medium">{selectedOrder.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">{selectedOrder.email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500">Địa chỉ</p>
                                        <p className="font-medium">{selectedOrder.address}</p>
                                    </div>
                                    {selectedOrder.note && (
                                        <div className="col-span-2">
                                            <p className="text-gray-500">Ghi chú</p>
                                            <p className="font-medium italic">"{selectedOrder.note}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm font-bold mb-3">Sản phẩm</p>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <p className="text-gray-700">{item.product_name} <span className="text-gray-400">x{item.quantity}</span></p>
                                                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-lg">
                                        <p>Tổng cộng</p>
                                        <p className="text-primary-600">{formatCurrency(selectedOrder.total_amount)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-4">
                                    {selectedOrder.status === 'pending' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => updateStatus(selectedOrder.id, 'confirmed')}
                                                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Xác nhận
                                            </button>
                                            <button
                                                onClick={() => updateStatus(selectedOrder.id, 'cancelled')}
                                                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                                            >
                                                <XCircle className="w-4 h-4" /> Hủy bỏ
                                            </button>
                                        </div>
                                    )}

                                    {selectedOrder.status === 'confirmed' && (
                                        <button
                                            onClick={() => updateStatus(selectedOrder.id, 'shipping')}
                                            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-sm shadow-purple-100"
                                        >
                                            <Truck className="w-4 h-4" /> Bắt đầu giao hàng
                                        </button>
                                    )}

                                    {selectedOrder.status === 'shipping' && (
                                        <button
                                            onClick={() => updateStatus(selectedOrder.id, 'completed')}
                                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-100"
                                        >
                                            <PackageCheck className="w-4 h-4" /> Hoàn thành đơn hàng
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400">Chọn một đơn hàng để xem chi tiết</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
