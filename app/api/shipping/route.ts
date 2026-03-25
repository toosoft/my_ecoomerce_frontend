// app/api/shipping-addresses/route.ts
import { API_URL } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  try {
    const res = await fetch(`${API_URL}/api/v1/shipping-addresses`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch shipping addresses", err);
    return NextResponse.json(
      { error: "Failed to fetch shipping addresses", data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const body = await req.json();

  try {
    const res = await fetch(`${API_URL}/api/v1/shipping-addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Failed to create shipping address", err);
    return NextResponse.json(
      { error: "Failed to create shipping address" },
      { status: 500 }
    );
  }
}

// // app/api/shipping-addresses/[id]/route.ts
// import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");

  try {
    const res = await fetch(`${API_URL}/api/v1/shipping-addresses/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader || "",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Failed to delete shipping address", err);
    return NextResponse.json(
      { error: "Failed to delete shipping address" },
      { status: 500 }
    );
  }
}