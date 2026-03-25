import { API_URL } from "@/lib/api";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params; // ✅ FIX

  try {
    const authHeader = req.headers.get("authorization");

    const res = await fetch(
      `${API_URL}/api/v1/cartItems/item/decrease/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader || "",
        },
      }
    );

    const data = await res.json();

    return Response.json(data, { status: res.status });

  } catch (err) {
    console.error("DELETE API error:", err);

    return Response.json(
      { message: "Failed to remove item" },
      { status: 500 }
    );
  }
}

