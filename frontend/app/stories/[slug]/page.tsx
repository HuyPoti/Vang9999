import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product, Story } from "@/src/types/product";
import { Metadata } from "next";
import { StoryDetailClient } from "./StoryDetailClient";

async function fetchProduct(slug: string): Promise<Product | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${apiUrl}/products/${slug}`, {
            next: { revalidate: 86400 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Fetch product failed:", error);
        return null;
    }
}

function getTargetStory(data: Product, storyIndex: number): Story | null {
    if (data.stories && data.stories.length > 0) {
        return data.stories[storyIndex] || data.stories[0];
    } else if (data.story || data.story_title) {
        return {
            title: data.story_title || `Sự tích ${data.name}`,
            content: data.story || "",
            image: data.story_image
        };
    }
    return null;
}

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ idx?: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const { idx } = await searchParams;
    const storyIndex = idx ? parseInt(idx) : 0;
    const product = await fetchProduct(slug);

    if (!product) return { title: "Không tìm thấy câu chuyện | Lộc bếp Việt" };

    const story = getTargetStory(product, storyIndex);
    if (!story) return { title: `${product.name} | Lộc bếp Việt` };

    return {
        title: `${story.title} | Lộc bếp Việt`,
        description: story.content.substring(0, 160),
        openGraph: {
            title: story.title,
            description: story.content.substring(0, 200),
            images: [
                {
                    url: story.image || product.images?.[0] || "/tet2026new.png",
                    width: 800,
                    height: 600,
                    alt: story.title,
                },
            ],
        },
    };
}

export default async function StoryDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ idx?: string }>;
}) {
    const { slug } = await params;
    const { idx } = await searchParams;
    const storyIndex = idx ? parseInt(idx) : 0;
    const product = await fetchProduct(slug);

    if (!product) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tồn tại</h2>
                <Link href="/about" className="text-primary-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang Giới thiệu
                </Link>
            </div>
        );
    }

    const currentStory = getTargetStory(product, storyIndex);

    if (!currentStory) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm này chưa có câu chuyện riêng</h2>
                <Link href="/about" className="text-primary-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang Giới thiệu
                </Link>
            </div>
        );
    }

    return <StoryDetailClient product={product} currentStory={currentStory} />;
}
