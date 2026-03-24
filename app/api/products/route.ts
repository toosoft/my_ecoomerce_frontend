export async function GET() {
  try {

    const res = await fetch("http://localhost:8888/api/v1/products/all");

    
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
