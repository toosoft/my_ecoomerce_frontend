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

export default async function ProductPage(
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const res = await fetch(`http://localhost:3000/api/products/${id}`);

  const response = await res.json();

  const product: Product = response.data;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="grid md:grid-cols-2 gap-10">

        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg p-4">

          <img
            src={
              product.images?.[0]
                ? `http://localhost:8888${product.images[0].downloadUrl}`
                : "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            }
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg"
          />

        </div>

        {/* Product Details */}
        <div className="space-y-4">

          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500">
            Brand: {product.brand}
          </p>

          <p className="text-2xl font-bold text-blue-600">
            ${product.price}
          </p>

          <p className="text-gray-600">
            {product.description}
          </p>

          <p className="text-sm text-gray-500">
            Stock: {product.inventory}
          </p>

          <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}