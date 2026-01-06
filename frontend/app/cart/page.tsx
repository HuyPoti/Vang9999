"use client";

import { Container } from "@/components/ui/Container";
import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="py-20">
                <Container className="text-center">
                    <div className="mb-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🛒</span>
                        </div>
                        <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">Giỏ hàng trống</h1>
                        <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
                            <ArrowRight className="w-4 h-4" /> Tiếp tục mua sắm
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50 min-h-[60vh]">
            <Container>
                <h1 className="font-display font-bold text-3xl text-gray-900 mb-8">Giỏ Hàng Của Bạn</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-grow space-y-4">
                        {items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-primary-600 font-semibold mb-2">{formatCurrency(item.price)}</p>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-medium text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <p className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Tổng quan đơn hàng</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>Miễn phí</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                                    <span>Tổng tiền</span>
                                    <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-center font-bold rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-95"
                            >
                                Tiến Hành Thanh Toán
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
