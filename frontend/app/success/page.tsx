import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    return (
        <div className="py-20 bg-gray-50 min-h-[60vh] flex items-center justify-center">
            <Container className="text-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle className="w-12 h-12" />
                    </div>

                    <h1 className="font-display font-bold text-3xl text-gray-900 mb-4">Đặt Hàng Thành Công!</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Cảm ơn bạn đã tin tưởng lựa chọn Lì Xì 2026. <br />
                        Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
                    </p>

                    <div className="space-y-3">
                        <Link href="/products" className="block w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors">
                            Tiếp tục mua hàng
                        </Link>
                        <Link href="/" className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}
