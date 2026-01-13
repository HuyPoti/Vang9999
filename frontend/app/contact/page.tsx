import { Container } from "@/components/ui/Container";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
    title: "Liên hệ - Lì Xì 2026",
};

export default function ContactPage() {
    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
                        <p className="text-gray-500">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900">Điện thoại</h3>
                            <p className="text-gray-600">Hỗ trợ 24/7 qua hotline 0961686427</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900">Email</h3>
                            <p className="text-gray-600">maingoc230903@gmail.com</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900">Địa chỉ</h3>
                            <p className="text-gray-600">Trường Đại học Sư phạm TP.HCM</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900">Vận chuyển</h3>
                            <p className="text-gray-600">Giao hàng tại 280 An Dương Vương, Phường Chợ Quán, TP.HCM (liên hệ nếu muốn giao hàng tại địa chỉ khác)</p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
