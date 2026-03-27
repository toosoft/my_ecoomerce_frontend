
"use client";

import Link from "next/link";
import { useCart } from "../context/cartcontext";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

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

type CartItem = {
  productId: number;
  quantity: number;
};

export default function CartPage() {

  // ✅ ONLY USE CONTEXT (NO DUPLICATION)
  const { activeCart, addToCart, removeFromCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // 🔹 Match products with cart
  const cartProducts = products.filter(product =>
    activeCart.some(item => item.productId === product.id)
  );

  const getQuantity = (productId: number) => {
    return activeCart.find(item => item.productId === productId)?.quantity ?? 1;
  };

  // 🔹 Total calculation
  const total = cartProducts.reduce((sum, product) => {
    const qty = getQuantity(product.id);
    return sum + product.price * qty;
  }, 0);

  // 🔥 USE CONTEXT FUNCTIONS (IMPORTANT)
  const handleAdd = (productId: number) => {
    addToCart(productId);
  };

  const handleReduce = (productId: number) => {
    removeFromCart(productId);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartProducts.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (

        <div className="space-y-6">

          {cartProducts.map(product => {

            const quantity = getQuantity(product.id);

            return (

              <div
                key={product.id}
                className="flex flex-col md:flex-row items-center justify-between border p-4 rounded-lg"
              >

                {/* Product Info */}
                <div className="flex items-center gap-4">

                  <img
                    src={
                      product.images?.[0]
                        ? `${API_URL}${product.images[0].downloadUrl}`
                        : "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                    }
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div>
                    <h2 className="font-semibold">{product.name}</h2>
                    <p className="text-gray-500">${product.price}</p>
                  </div>

                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">

                  <button
                    onClick={() => handleReduce(product.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="font-semibold">
                    {quantity}
                  </span>

                  <button
                    onClick={() => handleAdd(product.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>

                  {/* <button
                    onClick={() => handleRemove(product.id)}
                    className="text-red-500 ml-4"
                  >
                    Remove
                  </button> */}

                </div>

              </div>
            );

          })}

          {/* Total */}
          <div className="text-right text-xl font-bold">
            Total: ${total}
          </div>

          <div className="hidden md:flex space-x-6 text-gray-700">
            {/* <Link href="/checkout" className="hover:text-blue-600">
              Checkout
            </Link> */}
            <Link
              href="/checkout"
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
            >
              Checkout
            </Link>
          </div>

        </div>

      )}

    </div>
  );
}

