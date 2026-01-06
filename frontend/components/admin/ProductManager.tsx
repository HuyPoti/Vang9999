"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Upload, Loader2, X, Search, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    images: string[];
    is_active: boolean;
    story?: string;
    story_title?: string;
    story_image?: string;
}

export function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: 0,
        description: "",
        images: [] as string[],
        story: "",
        story_title: "",
        story_image: ""
    });

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (activeFilter === "all") {
                params.append("activeOnly", "all");
            } else {
                params.append("activeOnly", activeFilter === "active" ? "true" : "false");
            }

            const res = await fetch(`${apiUrl}/products?${params.toString()}`);
            const result = await res.json();
            setProducts(result);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setIsLoading(false);
        }
    }, [search, activeFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem("admin_token");
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
            setIsSubmitting(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/products/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: uploadFormData
            });

            const result = await res.json();
            if (res.ok && result.status === "success") {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, result.data.url]
                }));
                toast.success("Tải ảnh lên thành công");
            }
        } catch (err) {
            toast.error("Lỗi khi upload ảnh");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("admin_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        try {
            const method = editingProduct ? "PATCH" : "POST";
            const url = editingProduct
                ? `${apiUrl}/products/${editingProduct.id}`
                : `${apiUrl}/products`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingProduct ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công");
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData({ name: "", slug: "", price: 0, description: "", images: [], story: "", story_title: "", story_image: "" });
                fetchProducts();
            } else {
                const error = await res.json();
                toast.error(error.message || "Có lỗi xảy ra");
            }
        } catch (err) {
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleProductStatus = async (id: string, currentStatus: boolean) => {
        const action = currentStatus ? "ngừng kinh doanh" : "tiếp tục kinh doanh";
        if (!confirm(`Bạn có chắc chắn muốn ${action} sản phẩm này?`)) return;

        const token = localStorage.getItem("admin_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        try {
            const res = await fetch(`${apiUrl}/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !currentStatus })
            });

            if (res.ok) {
                toast.success(`Đã cập nhật trạng thái kinh doanh`);
                fetchProducts();
            }
        } catch (err) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug,
            price: product.price,
            description: product.description || "",
            images: product.images || [],
            story: product.story || "",
            story_title: product.story_title || "",
            story_image: product.story_image || ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên sản phẩm..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 ring-primary-500 outline-none w-full md:w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 ring-primary-500 outline-none"
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                    >
                        <option value="all">Tất cả sản phẩm</option>
                        <option value="active">Đang kinh doanh</option>
                        <option value="inactive">Đã ngừng</option>
                    </select>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({ name: "", slug: "", price: 0, description: "", images: [], story: "", story_title: "", story_image: "" });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-sm"
                    >
                        <Plus className="w-5 h-5" /> Thêm sản phẩm
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Ảnh</th>
                            <th className="px-6 py-4">Tên sản phẩm</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Giá</th>
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
                        ) : products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="relative w-12 h-16 bg-gray-100 rounded-md overflow-hidden">
                                        {product.images?.[0] ? (
                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">N/A</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{product.slug}</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{formatCurrency(product.price)}</td>
                                <td className="px-6 py-4">
                                    {product.is_active ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Đang bán</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">Ngừng bán</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => toggleProductStatus(product.id, product.is_active)}
                                        className={`p-2 rounded-lg transition-colors ${product.is_active ? 'text-gray-400 hover:bg-gray-100' : 'text-primary-600 hover:bg-primary-50'}`}
                                        title={product.is_active ? "Ngừng kinh doanh" : "Kinh doanh lại"}
                                    >
                                        {product.is_active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Tên sản phẩm *</label>
                                    <input
                                        required type="text"
                                        className="w-full px-4 py-2 border rounded-xl"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Slug *</label>
                                    <input
                                        required type="text"
                                        className="w-full px-4 py-2 border rounded-xl"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Giá *</label>
                                <input
                                    required type="number"
                                    className="w-full px-4 py-2 border rounded-xl"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Mô tả sản phẩm</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-xl resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Tiêu đề câu chuyện (Story Title)</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Sự tích Rồng Vàng may mắn"
                                    className="w-full px-4 py-2 border rounded-xl"
                                    value={formData.story_title}
                                    onChange={(e) => setFormData({ ...formData, story_title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Nội dung câu chuyện (Story Content)</label>
                                <textarea
                                    rows={5}
                                    placeholder="Kể về ý nghĩa, nguồn cảm hứng thiết kế..."
                                    className="w-full px-4 py-2 border rounded-xl resize-none"
                                    value={formData.story}
                                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Ảnh đại diện câu chuyện (URL)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Để trống để dùng ảnh sản phẩm đầu tiên"
                                        className="flex-grow px-4 py-2 border rounded-xl"
                                        value={formData.story_image}
                                        onChange={(e) => setFormData({ ...formData, story_image: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Hình ảnh</label>
                                <div className="grid grid-cols-4 gap-4 mb-2">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                                            <Image src={img} alt="Preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center justify-center cursor-pointer text-gray-400">
                                        <Upload className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] font-bold uppercase">Upload</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>
                        </form>

                        <div className="p-6 border-t border-gray-100 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-grow py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-grow py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editingProduct ? "Cập nhật" : "Tạo sản phẩm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
