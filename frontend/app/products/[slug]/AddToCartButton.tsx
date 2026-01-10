"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag, Plus, Minus, Loader2, AlertCircle } from "lucide-react";

interface Product {
    id: number | string;
    slug: string;
    name: string;
    price: number;
    image: string;
}

export function AddToCartButton({
    product,
    stockStatus
}: {
    product: Product;
    stockStatus?: 'in_stock' | 'out_of_stock' | 'discontinued';
}) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const isOutOfStock = stockStatus === 'out_of_stock' || stockStatus === 'discontinued';

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        setIsAdding(true);
        setTimeout(() => {
            addToCart({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: (product as any).images?.[0] || (product as any).image || ""
            }, quantity);
            setIsAdding(false);
        }, 300);
    };

    return (
        <div className="space-y-6">
            {isOutOfStock && (
                <div className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        {stockStatus === 'discontinued'
                            ? 'Sản phẩm này đã ngừng kinh doanh'
                            : 'Sản phẩm tạm thời hết hàng. Vui lòng quay lại sau!'}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50/50">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isOutOfStock}
                        className="p-3 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={isOutOfStock}
                        className="p-3 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || isOutOfStock}
                    className="flex-grow sm:flex-grow-0 w-full sm:px-12 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isAdding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <ShoppingBag className="w-5 h-5" />
                    )}
                    <span>
                        {isOutOfStock
                            ? (stockStatus === 'discontinued' ? 'Ngừng kinh doanh' : 'Hết hàng')
                            : (isAdding ? "Đang thêm..." : "Thêm vào Giỏ Hàng")
                        }
                    </span>
                </button>
            </div>
        </div>
    );
}
