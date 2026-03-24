import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
}

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product.id}`}>
      <Card>
        {product.images && product.images[0] && (
          <div className="relative h-80 w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500 ease-in-out"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardContent>{product.description}</CardContent>
        </CardHeader>
      </Card>
    </Link>
  );
};