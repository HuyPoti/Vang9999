import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { CartProvider } from "@/components/providers/CartProvider";

import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  metadataBase: new URL("https://li-xi-2026.vercel.app"),
  title: "Lì Xì Tết 2026 - Trao Gửi Yêu Thương | Lộc bếp Việt",
  description: "Bộ sưu tập bao lì xì độc đáo, thiết kế tỉ mỉ cho năm mới 2026. Mang may mắn và tài lộc đến mọi nhà.",
  keywords: ["lì xì 2026", "bao lì xì tết", "lộc bếp việt", "quà tặng tết"],
  authors: [{ name: "Lộc bếp Việt Team" }],
  openGraph: {
    title: "Lì Xì Tết 2026 - Lộc bếp Việt",
    description: "Bộ sưu tập bao lì xì độc quyền 2026. Thiết kế tinh tế, chất liệu cao cấp.",
    url: "https://li-xi-2026.vercel.app", // Đây là link giả định, user có thể đổi sau
    siteName: "Lộc bếp Việt",
    images: [
      {
        url: "/tet2026new.png",
        width: 1200,
        height: 630,
        alt: "Lì Xì Tết 2026",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lì Xì Tết 2026 - Lộc bếp Việt",
    description: "Bao lì xì ẩm thực Việt cho năm mới 2026.",
    images: ["/tet2026new.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={cn(inter.variable, playfair.variable, "font-sans min-h-screen flex flex-col")}>
        <Toaster position="top-right" />
        <CartProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
