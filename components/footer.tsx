import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">My Ecommerce</h2>
          <p className="text-sm">
            Your trusted online store for quality products at great prices.
            Shop confidently with secure checkout and fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/cart">Cart</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            {/* <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/shipping">Shipping Info</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/faq">FAQ</Link></li> */}
            <li><Link href="">Contact Us</Link></li>
            <li><Link href="">Shipping Info</Link></li>
            <li><Link href="">Returns</Link></li>
            <li><Link href="">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-4">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 rounded-l bg-gray-800 border border-gray-700 text-sm"
            />

            <button className="bg-blue-600 px-4 py-2 text-white text-sm rounded-r hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-6 text-sm">
        © {new Date().getFullYear()} My Ecommerce. All rights reserved.
      </div>
    </footer>
  );
};