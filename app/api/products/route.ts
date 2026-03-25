import { API_URL } from "@/lib/api";

export async function GET() {
  try {

    const res = await fetch(`${API_URL}/api/v1/products/all`);

    
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    return Response.json(data);

  } catch (error) {
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
