"use server";

import { API_URL } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Backend JSON parse error:", err);
      return NextResponse.json({ message: "Invalid response from backend" }, { status: 500 });
    }

    if (!res.ok) {
      console.error("Backend returned error:", data);
      return NextResponse.json({ message: data.message || "Registration failed" }, { status: res.status });
    }

    return NextResponse.json({ message: data.message, data: data.data });
  } catch (err: any) {
    console.error("Next.js API route error:", err);
    return NextResponse.json({ message: err.message || "Registration failed" }, { status: 500 });
  }
}
