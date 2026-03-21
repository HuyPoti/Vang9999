"use client";

import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Product, Story } from "@/src/types/product";

interface StoryDetailClientProps {
    product: Product;
    currentStory: Story;
}

export function StoryDetailClient({ product, currentStory }: StoryDetailClientProps) {
    return (
        <div className="py-12 bg-white">
            <Container>
                <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang Giới thiệu
                </Link>

                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-primary-600 font-bold uppercase tracking-wider text-sm">Chuyện về {product.name}</h2>
                        <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 leading-tight">
                            {currentStory.title}
                        </h1>
                        <div className="w-20 h-1 bg-gold-500 mx-auto mt-6 rounded-full" />
                    </div>

                    {/* Centered Image */}
                    <div className="relative aspect-[3/4] w-full md:w-3/4 mx-auto bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-2xl mb-12">
                        <Image
                            src={currentStory.image || product.images?.[0] || 'https://placehold.co/800x1200/red/gold.png?text=Story'}
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
                            {currentStory.content}
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
