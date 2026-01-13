"use client";

import { useState, useEffect, use } from "react";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { CommentSection } from "@/components/product/CommentSection";
import { Loader2, ArrowLeft, BookOpen } from "lucide-react";

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    stock_status?: 'in_stock' | 'out_of_stock' | 'discontinued';
    story?: string;
    story_title?: string;
    story_image?: string;
    stories?: { title: string; content: string; image: string }[];
}

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = use(paramsPromise);
    const { slug } = params;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/products/${slug}`, {
                    cache: 'no-store',
                    next: { revalidate: 0 }
                } as any);
                if (!res.ok) throw new Error("Sản phẩm không tồn tại");
                const data = await res.json();
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                }
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Không tìm thấy sản phẩm"}</h2>
                <Link href="/products" className="text-primary-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="py-12 bg-white">
            <Container>
                <div className="flex flex-col md:flex-row gap-12 mb-16">
                    {/* Image Gallery */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                            <Image
                                src={activeImage || 'https://placehold.co/800x1200/red/gold.png?text=No+Image'}
                                alt={product.name}
                                fill
                                className="object-cover animate-fade-in"
                                priority
                                quality={100}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={cn(
                                            "relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all",
                                            activeImage === img ? "ring-2 ring-primary-500 shadow-md scale-95" : "hover:ring-2 ring-gray-200"
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx}`}
                                            fill
                                            className="object-cover"
                                            quality={80}
                                            sizes="120px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2">
                        <div className="mb-2 text-gold-600 font-bold uppercase tracking-wider text-sm">Bộ Sưu Tập 2026</div>
                        <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">{product.name}</h1>

                        {/* Stock Status Badges */}
                        <div className="flex gap-2 mb-4">
                            {product.stock_status === 'out_of_stock' && (
                                <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold uppercase">
                                    Hết hàng
                                </span>
                            )}
                            {product.stock_status === 'discontinued' && (
                                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold uppercase">
                                    Ngừng kinh doanh
                                </span>
                            )}
                        </div>

                        <div className="text-3xl text-primary-600 font-bold mb-8">{formatCurrency(product.price)}</div>

                        <div className="prose prose-stone mb-10 text-gray-600 whitespace-pre-wrap">
                            <p>{product.description}</p>
                        </div>

                        {/* Story CTA - Enhanced UI */}
                        {((product.stories && product.stories.length > 0) || product.story || product.story_title) && (
                            <div className="space-y-6 mb-10">
                                {/* Combine legacy story into array if new stories missing */}
                                {(() => {
                                    const displayStories = product.stories?.length ? product.stories : (
                                        (product.story || product.story_title) ? [{
                                            title: product.story_title || "",
                                            content: product.story || "",
                                            image: product.story_image || "",
                                            slug: product.slug // Pass slug for link construction if needed
                                        }] : []
                                    );

                                    return displayStories.map((story, idx) => (
                                        <div key={idx} className="p-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100 relative overflow-hidden group">
                                            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500">
                                                <BookOpen className="w-32 h-32 text-primary-600" />
                                            </div>
                                            <div className="relative z-10">
                                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                    <span className="p-1.5 bg-primary-100 text-primary-600 rounded-lg">
                                                        <BookOpen className="w-4 h-4" />
                                                    </span>
                                                    {story.title || "Giai thoại về sản phẩm"}
                                                </h4>
                                                {story.content && (
                                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 italic">
                                                        "{story.content.substring(0, 150)}..."
                                                    </p>
                                                )}
                                                <Link
                                                    href={`/stories/${product.slug}?idx=${idx}`} // Add index to URL to target specific story
                                                    className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm hover:text-primary-700 transition-colors"
                                                >
                                                    Khám phá câu chuyện <span className="text-xl">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-8 mb-8">
                            <AddToCartButton product={product as any} stockStatus={product.stock_status} />
                        </div>

                        <div className="flex gap-4 text-sm text-gray-500">
                            <span>Đặt trên 50 cái sẽ giao hàng tận nơi. Đặt dưới 50 cái sẽ giao hàng tại Trường Đại học Sư phạm TP. Hồ Chí Minh.</span>
                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                <CommentSection productId={product.id} />
            </Container>
        </div>
    );
}

