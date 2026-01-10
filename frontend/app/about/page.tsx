"use client";

import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, BookOpen } from "lucide-react";

interface Member {
    id: number;
    name: string;
    role: string;
    image: string;
}

interface ProductStory {
    id: string;
    name: string;
    slug: string;
    image: string;
    story_summary: string;
}

const MEMBERS: Member[] = [
    { id: 1, name: "Mai Thị Hồng Ngọc", role: "Leader", image: "/MaiNgoc.png" },
    { id: 2, name: "Nguyễn Thị Ngọc Mỹ", role: "Member", image: "/NgocMy.png" },
    { id: 3, name: "Phan Kiều Anh Thư", role: "Member", image: "/AnhThu.png" },
    { id: 4, name: "Hà Hồng Thắm", role: "Member", image: "/HongTham.png" },
    { id: 5, name: "Đào Phan Khánh An", role: "Member", image: "/KhanhAn.png" },
    { id: 6, name: "Nguyễn Thị Dung", role: "Member", image: "/DungNguyen.png" },
    { id: 7, name: "Trương Thị Thu Thảo", role: "Member", image: "/ThuThao.png" },
    { id: 8, name: "Trương Thị Quỳnh Nga", role: "Member", image: "/QuynhNga.png" },
    { id: 9, name: "Trần Đức Anh", role: "Member", image: "/DucAnh.png" },
    { id: 10, name: "Nguyễn Gia Huy", role: "Member", image: "/GiaHuy.jpg" },
    { id: 11, name: "Kiều Thị Quỳnh Ly", role: "Member", image: "/LiLi.png" },
];

export default function AboutPage() {
    const [stories, setStories] = useState<ProductStory[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/products`);
                const data = await res.json();
                // We filter products that have a story defined
                const productsWithStories = data
                    .filter((p: any) => p.story)
                    .map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        image: p.story_image || p.images?.[0] || 'https://placehold.co/400x600/red/gold.png?text=Story',
                        story_summary: p.story.substring(0, 100) + "..."
                    }));
                setStories(productsWithStories);
            } catch (err) {
                console.error("Failed to fetch stories", err);
            }
        };
        fetchStories();
    }, []);

    return (
        <div className="py-20 bg-white">
            <Container>
                <div className="max-w-4xl mx-auto space-y-24">
                    {/* Intro Section */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-6">Câu Chuyện Lì Xì 2026</h1>
                            <div className="w-20 h-1 bg-gold-500 mx-auto rounded-full" />
                        </div>

                        <div className="prose prose-lg prose-stone max-w-none text-gray-600 leading-relaxed text-center">
                            <p className="text-xl text-gray-800 font-medium italic">
                                "Lì xì không chỉ là trao đi một tờ tiền, mà là trao đi lời chúc may mắn, sự trân trọng và niềm hy vọng vào một năm mới khởi sắc."
                            </p>
                            <p>
                                Dự án Lì Xì 2026 được thành lập với mong muốn gìn giữ nét văn hóa truyền thống của người Việt thông qua những phong bao lì xì được thiết kế hiện đại, tinh tế. Mỗi sản phẩm là tâm huyết của đội ngũ sáng tạo, gửi gắm những giá trị tinh thần tốt đẹp cho ngày Tết Việt Nam.
                            </p>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="font-display font-bold text-3xl text-gray-900">Đội Ngũ Sáng Lập</h2>
                            <p className="text-gray-500 mt-2">11 con người, 1 niềm đam mê duy nhất: Gìn giữ giá trị Tết Việt.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
                            {MEMBERS.map((member) => (
                                <div key={member.id} className="text-center group">
                                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary-500 transition-colors shadow-sm">
                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm">{member.name}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stories Section */}
                    {stories.length > 0 && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="font-display font-bold text-3xl text-gray-900">Những Câu Chuyện Sản Phẩm</h2>
                                <p className="text-gray-500 mt-2">Khám phá ý nghĩa ẩn sau từng nét vẽ trên phong bao lì xì.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {stories.map((story) => (
                                    <Link
                                        key={story.id}
                                        href={`/stories/${story.slug}`}
                                        className="group bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-24 h-32 flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                                                <Image
                                                    src={story.image}
                                                    alt={story.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="100px"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                                                    Chuyện về: {story.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                    {story.story_summary}
                                                </p>
                                                <span className="text-sm font-bold text-primary-600 flex items-center gap-1">
                                                    Đọc tiếp <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
