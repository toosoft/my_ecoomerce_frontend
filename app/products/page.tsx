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

export default async function ProductsPage() {

  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  const response = await res.json();
  const products: Product[] = response.data;

  return (
    <ProductList products={products} />
  );
}