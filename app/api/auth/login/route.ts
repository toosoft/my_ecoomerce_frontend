export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:8888/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("login route");
    console.log(data);

    if (!res.ok) {
      return Response.json(
        { message: data.message || "Login failed" },
        { status: res.status }
      );
    }

    return Response.json(data);

  } catch (error) {
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}