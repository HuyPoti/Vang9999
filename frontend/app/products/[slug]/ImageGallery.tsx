"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ImageGallery({
  images,
  initial,
}: {
  images?: string[];
  initial?: string;
}) {
  const [active, setActive] = useState(initial || (images && images[0]) || "");

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
        <Image
          src={"https://placehold.co/800x1200/red/gold.png?text=No+Image"}
          alt="no-image"
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
        <Image
          src={active}
          alt="active"
          fill
          className="object-cover animate-fade-in"
          priority
          quality={100}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(img)}
              className={cn(
                "relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all",
                active === img
                  ? "ring-2 ring-primary-500 shadow-md scale-95"
                  : "hover:ring-2 ring-gray-200",
              )}
            >
              <Image
                src={img}
                alt={`thumb-${idx}`}
                fill
                className="object-cover"
                quality={80}
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
