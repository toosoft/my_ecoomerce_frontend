"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    title: "Latest Sneakers",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    title: "Wireless Headphones",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    title: "Travel Backpacks",
  },
];

export const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">

      <div className="relative h-96 w-full overflow-hidden rounded-lg">
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          className="object-cover"
        />
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded"
      >
        ◀
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded"
      >
        ▶
      </button>

    </div>
  );
};