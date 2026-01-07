"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    images: string[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/products`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="py-24 flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <Container>
                <div className="mb-12 text-center">
                    <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">Bộ Sưu Tập 2026</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Tổng hợp các mẫu bao lì xì được thiết kế tỉ mỉ, ép kim sang trọng, mang lại may mắn và tài lộc cho năm mới.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 italic text-gray-400">
                        Chưa có sản phẩm nào được đăng tải.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
                                    <div className="relative aspect-[3/4] bg-gray-100">
                                        <Image
                                            src={product.images?.[0] || 'https://placehold.co/400x600/red/gold.png?text=No+Image'}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-primary-600 font-bold">{formatCurrency(product.price)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

