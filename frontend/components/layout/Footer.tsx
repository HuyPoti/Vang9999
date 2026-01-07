"use client";
import { Container } from '@/components/ui/Container';
import { usePathname } from 'next/navigation';

export const Footer = () => {
    const pathname = usePathname();
    if (pathname.startsWith('/admin')) return null;
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-display font-bold text-2xl text-white mb-4">Lì Xì 2026</h3>
                        <p className="text-sm leading-relaxed max-w-xs text-gray-400">
                            Mang những phong bao lì xì đẹp nhất, ý nghĩa nhất đến gia đình bạn trong dịp Tết này. Trao gửi yêu thương, kết nối sum vầy.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Liên kết</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/products" className="hover:text-primary-400 transition-colors">Sản phẩm</a></li>
                            <li><a href="/contact" className="hover:text-primary-400 transition-colors">Chính sách vận chuyển</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Liên hệ</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Hotline: 0909 999 999</li>
                            <li>Email: cskh@lixi2025.com</li>
                            <li>Địa chỉ: TP. Hồ Chí Minh, Việt Nam</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
                    © 2025 Lì Xì Project. Made with ❤️.
                </div>
            </Container>
        </footer>
    );
};
