import { API_URL } from "@/lib/api";
import { NextResponse } from "next/server";

// ==========================
// GET → Fetch Cart
// ==========================
export async function GET(req: Request) {
  try {
    // 1. Get token from request headers (sent from frontend)
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 2. Call Spring Boot (user will be resolved from token)
    const res = await fetch(
      `${API_URL}/api/v1/carts/user-cart`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        cache: "no-store", // always get fresh cart
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch cart");
    }

    const data = await res.json();

    console.log("Cart fetched:", data);

    return NextResponse.json(data);

  } catch (error) {
    console.error("GET /checkout error:", error);

    return NextResponse.json(
      { error: "Failed to fetch checkout data" },
      { status: 500 }
    );
  }
}


// ==========================
// POST → Checkout
// ==========================
export async function POST(req: Request) {
  try {
    // 1. Get token
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 2. Get frontend data
    const body = await req.json();
    const { form, cartItems } = body;

    console.log("=== CHECKOUT ===");
    console.log("Form:", form);
    console.log("Cart:", cartItems);

    // 3. Send to Spring Boot (user comes from token)
    const res = await fetch(
      `${API_URL}/api/v1/orders/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          phone: form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to place order");
    }

    const data = await res.json();

    console.log("Checkout response:", data);

    return NextResponse.json(data);

  } catch (error) {
    console.error("POST /checkout error:", error);

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
