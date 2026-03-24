"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert(data.message || "Registered successfully!");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full border p-2 rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}