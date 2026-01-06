import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { CartProvider } from "@/components/providers/CartProvider";

import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Lì Xì Tết 2026 - Trao Gửi Yêu Thương",
  description: "Bộ sưu tập bao lì xì độc đáo, thiết kế tỉ mỉ cho năm mới 2026.",
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
