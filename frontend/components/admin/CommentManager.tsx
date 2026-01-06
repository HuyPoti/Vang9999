"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Trash2, Eye, EyeOff, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
}

interface Comment {
    id: string;
    product_id: string;
    product?: Product;
    name: string;
    email: string;
    content: string;
    is_hidden: boolean;
    created_at: string;
}

import toast from 'react-hot-toast';

export function CommentManager() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [filterProductId, setFilterProductId] = useState<string>("");
    const [search, setSearch] = useState("");

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const url = new URL(`${apiUrl}/comments`);
            if (filterProductId) {
                url.searchParams.append("productId", filterProductId);
            }
            if (search) {
                url.searchParams.append("search", search);
            }

            const res = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await res.json();
            setComments(result.data);
        } catch (err) {
            console.error("Failed to fetch comments", err);
            toast.error("Không thể tải danh sách bình luận");
        } finally {
            setIsLoading(false);
        }
    }, [filterProductId, search]);

    const fetchProducts = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleVisibility = async (id: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/comments/${id}/toggle`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const updatedComments = comments.map(c =>
                    c.id === id ? { ...c, is_hidden: !c.is_hidden } : c
                );
                setComments(updatedComments);
                const comment = updatedComments.find(c => c.id === id);
                toast.success(comment?.is_hidden ? "Đã ẩn bình luận" : "Đã hiện bình luận");
            }
        } catch (err) {
            toast.error("Lỗi khi cập nhật trạng thái hiển thị");
        }
    };

    const deleteComment = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

        try {
            const token = localStorage.getItem("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/comments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                setComments(comments.filter(c => c.id !== id));
                toast.success("Đã xóa bình luận vĩnh viễn");
            }
        } catch (err) {
            toast.error("Lỗi khi xóa bình luận");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-primary-600" />
                    Quản lý bình luận
                </h2>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm nội dung, tên..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 ring-primary-500 outline-none w-full md:w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 ring-primary-500 outline-none flex-grow md:flex-initial"
                        value={filterProductId}
                        onChange={(e) => setFilterProductId(e.target.value)}
                    >
                        <option value="">Tất cả sản phẩm</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Ngày gửi</th>
                            <th className="px-6 py-4">Người gửi</th>
                            <th className="px-6 py-4">Sản phẩm</th>
                            <th className="px-6 py-4">Nội dung</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                                </td>
                            </tr>
                        ) : comments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                    Chưa có bình luận nào.
                                </td>
                            </tr>
                        ) : (
                            comments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{comment.name}</p>
                                        <p className="text-xs text-gray-500">Email: {comment.email || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 max-w-[150px]">
                                        <p className="text-sm font-medium text-gray-700 truncate" title={comment.product?.name}>
                                            {comment.product?.name || 'Sản phẩm đã xóa'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 max-w-[300px]">
                                        <p className="text-sm text-gray-600 line-clamp-2" title={comment.content}>
                                            {comment.content}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {comment.is_hidden ? (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">Đã ẩn</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Hiển thị</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => toggleVisibility(comment.id)}
                                                className={cn(
                                                    "p-2 rounded-lg transition-colors",
                                                    comment.is_hidden ? "text-gray-400 hover:bg-gray-100" : "text-primary-600 hover:bg-primary-50"
                                                )}
                                                title={comment.is_hidden ? "Hiện bình luận" : "Ẩn bình luận"}
                                            >
                                                {comment.is_hidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => deleteComment(comment.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa vĩnh viễn"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
