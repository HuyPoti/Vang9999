"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, MessageSquare, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    name: string;
    content: string;
    created_at: string;
}

interface CommentSectionProps {
    productId: string;
}

import toast from 'react-hot-toast';

export function CommentSection({ productId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({ name: "", email: "", content: "" });

    const fetchComments = useCallback(async (pageNum: number) => {
        try {
            setIsLoading(true);
            // Backend URL - in real app use env
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/comments/product/${productId}?page=${pageNum}&limit=5`);
            const result = await res.json();

            if (result.status === "success") {
                setComments(result.data);
                setTotalPages(result.meta.totalPages);
            }
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        if (productId) fetchComments(1);
    }, [productId, fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, product_id: productId }),
            });

            const result = await res.json();

            if (res.ok && result.status === "success") {
                toast.success("Cảm ơn! Bình luận của bạn đang chờ duyệt.");
                setFormData({ name: "", email: "", content: "" });
                // Refresh to see new comment
                fetchComments(1);
                setPage(1);
            } else {
                toast.error(result.message || "Không thể gửi bình luận");
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 border-t border-gray-100 pt-12">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-primary-600" />
                <h2 className="font-display font-bold text-2xl text-gray-900">Bình luận</h2>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        required
                        type="text"
                        placeholder="Tên của bạn *"
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 ring-primary-100 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        required
                        type="email"
                        placeholder="Email (không hiển thị) *"
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 ring-primary-100 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <textarea
                    required
                    rows={3}
                    placeholder="Nội dung bình luận..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 ring-primary-100 outline-none mb-4 resize-none"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center gap-2 disabled:bg-gray-400"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Gửi bình luận
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : comments.length > 0 ? (
                    <>
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-900">{comment.name}</h4>
                                        <span className="text-xs text-gray-400">
                                            {format(new Date(comment.created_at), "HH:mm, dd/MM/yyyy", { locale: vi })}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setPage(i + 1);
                                            fetchComments(i + 1);
                                        }}
                                        className={cn(
                                            "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                                            page === i + 1 ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-400 py-8 italic">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                )}
            </div>
        </div>
    );
}
