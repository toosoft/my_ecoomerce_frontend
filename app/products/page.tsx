
"use client";

import { useEffect, useState } from "react";
import ProductList from "@/components/product-list";

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

// import ProductList from "@/components/product-list";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


    if (loading) {
      return <p className="text-center mt-10">Loading products...</p>;
    }

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[60vh]">
  //       <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }

  return <ProductList products={products} />;
}

