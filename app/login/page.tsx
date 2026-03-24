"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/utils/auth";
import { useAuth } from "@/app/context/authcontext"; 

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("login data");
      console.log(data);
      console.log(data.data);

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // const expiryTime = Date.now() + data.data.expiresIn * 1000;
      const expiryTime = Date.now() + 60 * 60 * 1000;
      login("izu", data.data.token, expiryTime);

      console.log(data.data.token);

      // 🔥 Sync guest cart to backend
      const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log(guestCart);

      if (guestCart.length > 0) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.data.token}`,
            },
            body: JSON.stringify({
              items: guestCart,
            }),
          });

          localStorage.removeItem("cart");

        } catch (err) {
          console.error("Cart sync failed", err);
        }
      }

      router.push("/");
      

    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}