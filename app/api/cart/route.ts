import { API_URL } from "@/lib/api";

// app/api/cart/route.ts
export async function GET(req: Request) {

  const authHeader = req.headers.get("authorization");

  console.log(authHeader);

  const res = await fetch(`${API_URL}/api/v1/carts/user-cart`, {
    headers: {
      Authorization: authHeader || "",
    },
  });

  const data = await res.json();
  console.log(data);

  return Response.json(data);
}



export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(body);

    const authHeader = req.headers.get("authorization");
        console.log('authHeader');

    console.log(authHeader);

    const res = await fetch(`${API_URL}/api/v1/cartItems/items/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body.items),
    });


    const data = await res.json();
    console.log(data);

    return Response.json(data, { status: res.status });

  } catch {
    return Response.json({ message: "Cart merge failed" }, { status: 500 });
  }
}
