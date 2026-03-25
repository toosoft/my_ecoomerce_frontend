// export async function GET(req, { params }) {

import { API_URL } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(req: NextRequest, 
  // { params }: { params: Params }
  context: { params: Promise<{ id: string }> }
) {


  try {

    const { id } = await context.params;

    const res = await fetch(`${API_URL}/api/v1/products/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await res.json();

    return Response.json(data);

  } catch (error) {

    return Response.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );

  }

}