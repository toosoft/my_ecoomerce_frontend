import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import ProductsPage from "./products/page";
// import { Carousel } from "@/components/carousel";

export default function Home() {
  return (
    <div>

      <section className="rounded bg-neutral-100 py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 sm:px-16">

          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Welcome to my Ecommerce
            </h2>

            <p className="text-neutral-600">
              Discover the latest products at best prices
            </p>

            <Button asChild className="rounded-full px-6 py-3 bg-white">
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
          </div>

          <Image
            alt="Banner Image"
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f" //"https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp"
            className="rounded"
            width={400}
            height={200}
          />

        </div>
      </section>

      <section className="py-8">
        {/* <Carousel /> */}
        <ProductsPage></ProductsPage>
      </section>

    </div>
  );
}