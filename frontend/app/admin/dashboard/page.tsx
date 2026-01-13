"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LayoutDashboard, ShoppingBag, ListOrdered, LogOut, User, MessageSquare } from "lucide-react";
import { ProductManager } from "@/components/admin/ProductManager";
import { OrderManager } from "@/components/admin/OrderManager";
import { CommentManager } from "@/components/admin/CommentManager";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Tab = "products" | "orders" | "comments";

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState<Tab>("products");
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
        } else {
            setIsAdmin(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
    };

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-display text-xl font-black text-primary-600">
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
                    </div>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                            activeTab === "products" ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        <ShoppingBag className="w-5 h-5" /> Sản phẩm
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                            activeTab === "orders" ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        <ListOrdered className="w-5 h-5" /> Đơn hàng
                    </button>
                    <button
                        onClick={() => setActiveTab("comments")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                            activeTab === "comments" ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        <MessageSquare className="w-5 h-5" /> Bình luận
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow">
                <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-gray-400" />
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">Admin</p>
                            <p className="text-xs text-gray-500">Quản trị viên</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Container>
                        {activeTab === "products" && <ProductManager />}
                        {activeTab === "orders" && <OrderManager />}
                        {activeTab === "comments" && <CommentManager />}
                    </Container>
                </div>
            </main>
        </div>
    );
}
