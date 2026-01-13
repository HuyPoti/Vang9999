"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/products`);
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Show only first 4
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-900 to-primary-700">
          <Image src="/tet2026new.png" alt="Logo" fill className="object-cover" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        </div>

        <Container className="relative z-10 text-center">

          <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 animate-fade-in inline-block">
            Lộc bếp Việt <br />
            <span className="text-gold-300 block mt-4">Bao lì xì ẩm thực Việt</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up opacity-90">
            Bộ sưu tập bao lì xì độc quyền 2026. Thiết kế tinh tế, chất liệu cao cấp, mang may mắn đến mọi nhà.
          </p>
          <div className="flex justify-center gap-4 animate-slide-up delay-100">
            <Link href="/products" className="px-8 py-3 bg-gold-400 hover:bg-gold-500 text-primary-950 font-bold rounded-full transition-all hover:shadow-lg hover:-translate-y-1">
              Xem Bộ Sưu Tập
            </Link>
            <Link href="/about" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-sm transition-all">
              Tìm Hiểu Thêm
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">Sản Phẩm Nổi Bật</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full" />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 italic">
              Đang cập nhật sản phẩm nổi bật...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm transition-all group-hover:shadow-xl group-hover:-translate-y-2">
                    <Image
                      src={product.images?.[0] || 'https://placehold.co/400x600/red/gold.png?text=Lì+Xì'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="w-full py-3 bg-white text-gray-900 text-center font-bold rounded-xl shadow-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        Xem chi tiết
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                  <p className="text-primary-600 font-bold">{formatCurrency(product.price)}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:underline">
              Xem tất cả sản phẩm <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}


