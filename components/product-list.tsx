"use client";

import { useCart } from "@/app/context/cartcontext";
import { API_URL } from "@/lib/api";
import Link from "next/link";

type Image = {
  imageId: number;
  imageName: string;
  downloadUrl: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  description: string;
  images: Image[];
  inventory: number;
  category: {
    id: number;
    name: string;
  };
};

type ProductListProps = {
  products: Product[];
};


export default function ProductList({ products }: ProductListProps) {

  const { addToCart } = useCart();


  return (
  <div className="max-w-7xl mx-auto px-6 py-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
        >
          {/* Fixed size image container */}
          <Link href={`/products/${product.id}`}>
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={
                  product.images?.[0]
                    ? `${API_URL}${product.images[0].downloadUrl}`
                    : "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg" //"https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Content area with top border separator */}
          <div className="p-4 space-y-2 border-t border-gray-200 flex-grow">
            <h2 className="text-lg font-semibold line-clamp-1">
              {product.name}
            </h2>

            <p className="text-sm text-gray-500">
              {product.brand}
            </p>

            <p className="text-xl font-bold text-blue-600">
              ${product.price}
            </p>

            <button
              onClick={() => addToCart(product.id)}
              className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

