export async function DELETE(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params; // ✅ FIX

  try {
    const authHeader = req.headers.get("authorization");

    const res = await fetch(
      `http://localhost:8888/api/v1/cartItems/item/decrease/${productId}`,
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


// export async function DELETE(
//   req: Request,
//   { params }: { params: { productId: string } }
// ) {
//   try {
//     const authHeader = req.headers.get("authorization");

//     const res = await fetch(
//       `http://localhost:8888/api/v1/cartItems/item/decrease/${params.productId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: authHeader || "", 
//         },
//       }
//     );

//     const data = await res.json();

//     return Response.json(data, { status: res.status });
//   } catch {
//     return Response.json(
//       { message: "Failed to decrease item" },
//       { status: 500 }
//     );
//   }
// }

