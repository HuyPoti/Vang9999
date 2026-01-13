"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useCart } from '@/components/providers/CartProvider';
import Image from 'next/image';

export const Header = () => {
    const { totalItems } = useCart();
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
            <Container>
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                            <Image
                                src="/Gold_9999.jpg"
                                alt="Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="font-display font-bold text-2xl text-gray-900">Lộc bếp Việt</span>
                    </Link>

                    {/* Nav - Desktop */}
                    <nav className="hidden md:flex gap-8">
                        <Link href="/products" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Sản phẩm</Link>
                        <Link href="/about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Về chúng tôi</Link>
                        <Link href="/contact" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Liên hệ</Link>
                    </nav>

                    {/* Cart & Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                            <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-primary-600" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                </div>
            </Container>
        </header>
    );
};
