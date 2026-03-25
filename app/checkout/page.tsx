"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

type CartItem = {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
};

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: "card" | "cod";
};

export default function CheckoutPage() {
  const { loggedIn, isTokenValid, logout, token } = useAuth(); // 👈 get token here
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    paymentMethod: "card",
  });

  // ==========================
  // Fetch Cart (AUTH REQUIRED)
  // ==========================
  useEffect(() => {
    if (!loggedIn || !isTokenValid()) {
      router.push("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch("/api/checkout", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ from context
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch cart");
        }

        const items = data.data?.items || [];

        if (items.length === 0) {
          router.push("/cart");
          return;
        }

        setCartItems(items);

      } catch (err: any) {
        setError(err.message || "Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [loggedIn, isTokenValid, token, router]);

  // ==========================
  // Helpers
  // ==========================
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================
  // Submit Checkout
  // ==========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ from context
        },
        body: JSON.stringify({ form, cartItems }),
      });

      const data = await res.json();
      console.log("Checkout response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      alert("Order placed successfully!");
      // router.push("/");
      window.location.href = window.location.origin + "/";


    } catch (err: any) {
      alert(err.message || "Failed to place order");
    }
  };

  // ==========================
  // UI STATES
  // ==========================
  if (loading) {
    return <p className="text-center mt-10">Loading checkout...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  // ==========================
  // UI
  // ==========================
  return (
    <div className="container mx-auto p-4">
      {/* <button onClick={logout} className="text-red-500 mb-4">
        Logout
      </button> */}

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <h2 className="text-xl font-semibold mt-4 mb-2">Payment Method</h2>

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {/* <option value="card">Card Payment</option> */}
            <option value="card">Transfer Later</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mt-4"
          >
            Place Order
          </button>
        </form>

        {/* ================= SUMMARY ================= */}
        <div className="border p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between border-b py-2">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.unitPrice * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold mt-4 text-lg">
            <span>Total</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>

          <Link
            href="/cart"
            className="block text-center mt-4 text-blue-600 underline"
          >
            Back to Cart
          </Link>
        </div>

      </div>
    </div>
  );
}
