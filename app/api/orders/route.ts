import { API_URL } from "@/lib/api";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  console.log(authHeader);

  try {
    const res = await fetch(`${API_URL}/api/v1/orders/user-orders`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    const data = await res.json();
    console.log("Orders API response:", data);

    return Response.json(data);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}