// export async function GET(req, { params }) {

import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {


  try {

    const { id } = await params;

    const res = await fetch(`http://localhost:8888/api/v1/products/${id}`);

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