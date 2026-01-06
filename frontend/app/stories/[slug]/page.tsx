"use client";

import { useState, useEffect, use } from "react";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";

interface ProductStory {
    id: string;
    slug: string;
    name: string;
    story: string;
    story_title: string;
    story_image: string;
    images: string[];
}

export default function StoryDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = use(paramsPromise);
    const { slug } = params;

    const [product, setProduct] = useState<ProductStory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/products/${slug}`);
                if (!res.ok) throw new Error("Sản phẩm không tồn tại");
                const data = await res.json();
                if (!data.story) throw new Error("Sản phẩm này chưa có câu chuyện riêng");
                setProduct(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="py-24 flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Không tìm thấy câu chuyện"}</h2>
                <Link href="/about" className="text-primary-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang Giới thiệu
                </Link>
            </div>
        );
    }

    return (
        <div className="py-12 bg-white">
            <Container>
                <Link href="/about" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang Giới thiệu
                </Link>

                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-primary-600 font-bold uppercase tracking-wider text-sm">Chuyện về {product.name}</h2>
                        <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 leading-tight">
                            {product.story_title || `Sự tích ${product.name}`}
                        </h1>
                        <div className="w-20 h-1 bg-gold-500 mx-auto mt-6 rounded-full" />
                    </div>

                    {/* Centered Image - Matching Product Detail Aspect Ratio */}
                    <div className="relative aspect-[3/4] w-full md:w-3/4 mx-auto bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-2xl mb-12">
                        <Image
                            src={product.story_image || product.images?.[0] || 'https://placehold.co/800x1200/red/gold.png?text=Story'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                            quality={100}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="space-y-12">
                        <div className="prose prose-lg prose-stone max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-justify">
                            {product.story}
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                                <div className="text-center sm:text-left">
                                    <p className="text-gray-500 text-sm mb-1 uppercase tracking-wide font-bold">Bạn có cảm hứng từ câu chuyện này?</p>
                                    <h4 className="font-bold text-xl text-gray-900">Sở hữu ngay mẫu {product.name}</h4>
                                </div>
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="px-10 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <ShoppingBag className="w-5 h-5" /> Mua Sản Phẩm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
