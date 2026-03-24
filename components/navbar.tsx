"use client";

import Link from "next/link";
// import { useAuth } from "@/app/utils/auth";
import { useCart } from "@/app/context/cartcontext";
import { useAuth } from "@/app/context/authcontext";

export const Navbar = () => {
  const { loggedIn, user, logout } = useAuth();
  // const { cart } = useCart();
  const { activeCart } = useCart();

  console.log("activeCart+");
  console.log(activeCart);

  const totalItems = activeCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // const { isAuthenticated } = useAuth();
  // const activeCart = isAuthenticated ? backendCart : cart;

  // const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">

        {/* LEFT SIDE */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            My Ecommerce
          </Link>
                      {/* <Link href="/products" className="hover:text-blue-600">Products</Link> */}


        </div>

        {/* CENTER SEARCH */}
        <div className="hidden md:flex justify-center flex-1 px-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-6">

          {/* CART */}
          <Link href="/cart" className="relative hover:text-blue-600">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* LOGIN / LOGOUT */}
          {loggedIn ? (
            <div>
            <button
              onClick={logout}
              className=" text-black px-4 py-2 rounded "
            >
              Logout
            </button>
            <Link
                href="/settings"
                className="text-gray-700 hover:text-blue-600"
              >
                {/* Settings */}
              </Link>
              <Link
                href="/orders"
                className=" text-black px-4 py-2 rounded"
              >
                Orders
              </Link>
           
            {/* <Link href="/products" className="hover:text-blue-600">Products</Link> */}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};