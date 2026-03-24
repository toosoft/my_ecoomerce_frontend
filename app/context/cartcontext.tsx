"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authcontext";

type CartItem = {
  productId: number;
  quantity: number;
  unitPrice?: number;
};

type CartContextType = {
  cart: CartItem[];
  backendCart: CartItem[];
  activeCart: CartItem[];
  addToCart: (id: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => void;
  fetchBackendCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [backendCart, setBackendCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const activeCart = isAuthenticated ? backendCart : cart;

  // 🔹 Load LOCAL cart
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // 🔹 Save LOCAL cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔥 FETCH BACKEND CART
  const fetchBackendCart = async () => {
    if (!isAuthenticated || !token) return;

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBackendCart(data.data?.items || []);
    } catch (err) {
      console.error("Backend cart failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AUTO FETCH WHEN LOGGED IN
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    }
  }, [isAuthenticated]);

  // 🔥 ADD TO CART
  async function addToCart(productId: number) {
    // 🟢 NOT LOGGED IN → LOCAL
    if (!isAuthenticated || !token) {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === productId);

        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { productId, quantity: 1 }];
      });
      return;
    }

    // 🔵 LOGGED IN → API CALL
    try {
      // ⚡ optimistic update
      setBackendCart((prev) => {
        const existing = prev.find((item) => item.productId === productId);

        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { productId, quantity: 1 }];
      });

      //increase item quantity 
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
                body: JSON.stringify({
                  items: [
              {
                productId: productId,
                quantity: 1, // 
              }
            ]}),
        // body: JSON.stringify({
        //   items: {
        //     productId,
        //     quantity: 1,
        //   },
        // }),
      });



          // { items: [ { productId: 3, quantity: 1 } ] } cart page
        // [ { productId: 2, quantity: 1 } ] list page

      // if (!res.ok) throw new Error("Failed to add to cart");
      if (!res.ok) {
  const errorText = await res.text();
  console.error("Backend error:", errorText);
  throw new Error("Failed to add to cart");
}

      await fetchBackendCart(); // 🔄 sync with backend
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  }

  const removeFromCart = async (productId: number) => {
  if (!isAuthenticated) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    return;
  }

  // 🔥 OPTIMISTIC UPDATE (correct)
      setBackendCart((prev) =>
        prev
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );

      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to remove item");

      } catch (err) {
        console.error("Remove failed:", err);

        // 🔁 rollback if failed
        fetchBackendCart();
      }
    };
  // // 🔥 REMOVE FROM CART
  // async function removeFromCart(productId: number) {
  //   if (!isAuthenticated || !token) {
  //     setCart((prev) =>
  //       prev.filter((item) => item.productId !== productId)
  //     );
  //     return;
  //   }

  //   try {
  //     // ⚡ optimistic update
  //     setBackendCart((prev) =>
  //       prev.filter((item) => item.productId !== productId)
  //     );

  //     const res = await fetch(`/api/cart/${productId}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!res.ok) throw new Error("Failed to remove item");

  //     await fetchBackendCart();
  //   } catch (error) {
  //     console.error("Remove failed:", error);
  //   }
  // }

  function clearCart() {
    setCart([]);
    setBackendCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        backendCart,
        activeCart,
        addToCart,
        removeFromCart,
        clearCart,
        fetchBackendCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}


// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./authcontext"; // 👈 IMPORTANT

// type CartItem = {
//   productId: number;
//   quantity: number;
// };

// type CartContextType = {
//   cart: CartItem[];
//   backendCart: CartItem[];
//   activeCart: CartItem[];
//   addToCart: (id: number) => void;
//   removeFromCart: (id: number) => void;
//   clearCart: () => void;
//   fetchBackendCart: () => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {

//   const { isAuthenticated, token } = useAuth(); // 👈 AUTH

//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [backendCart, setBackendCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   // 🧠 ACTIVE CART SWITCH
//   const activeCart = isAuthenticated ? backendCart : cart;

//   // 🔹 Load LOCAL cart
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCart(JSON.parse(storedCart));
//     }
//   }, []);

//   // 🔹 Save LOCAL cart
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // 🔥 FETCH BACKEND CART (MOCK FOR NOW)
//   const fetchBackendCart = async () => {
//     if (!isAuthenticated) return;

//     setLoading(true);

//     try {
//             const res = await fetch("/api/cart", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       // console.log("data.data.items");
//       // console.log(data.data.items);

//       setBackendCart(data.data.items || []);
//       // // 🧪 MOCK (replace later with API)
//       // const mockData = {
//       //   items: [
//       //     { productId: 1, quantity: 2 },
//       //     { productId: 2, quantity: 1 },
//       //   ],
//       // };

//       // console.log("🧪 BACKEND CART:", mockData);

//       // setBackendCart(mockData.items || []);

//     } catch (err) {
//       console.error("Backend cart failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 AUTO FETCH WHEN LOGGED IN
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchBackendCart();
//     }
//   }, [isAuthenticated]);

//   // 🔹 LOCAL CART FUNCTIONS
//   function addToCart(productId: number) {


//     if (isAuthenticated) {
//       setBackendCart((prev) => {
//         const existing = prev.find((item) => item.productId === productId);

//         if (existing) {
//           return prev.map((item) =>
//             item.productId === productId
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           );
//         }

//         return [...prev, { productId, quantity: 1 }];
//       });

//       return;
//     }

//     setCart((prev) => {
//       const existing = prev.find((item) => item.productId === productId);

//       if (existing) {
//         return prev.map((item) =>
//           item.productId === productId
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }

//       return [...prev, { productId, quantity: 1 }];
//     });
//   }

//   function removeFromCart(productId: number) {

//     // if (isAuthenticated) {
//     //   console.log("⚠️ Remove from backend cart (not implemented yet)");
//     //   return;
//     // }
//     if (isAuthenticated) {
//       setBackendCart((prev) =>
//         prev.filter((item) => item.productId !== productId)
//       );
//       return;
//     }

//     setCart((prev) =>
//       prev.filter((item) => item.productId !== productId)
//     );
//   }

//   function clearCart() {
//     setCart([]);
//     setBackendCart([]);
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         backendCart,
//         activeCart, // 👈 THIS IS KEY
//         addToCart,
//         removeFromCart,
//         clearCart,
//         fetchBackendCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error("useCart must be used inside CartProvider");
//   }

//   return context;
// }




// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type CartItem = {
//   productId: number;
//   quantity: number;
// };

// type CartContextType = {
//   cart: CartItem[];
//   addToCart: (id: number) => void;
//   removeFromCart: (id: number) => void;
//   clearCart: () => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {

//   const [cart, setCart] = useState<CartItem[]>([]);

//   // Load cart from localStorage
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");

//     if (storedCart) {
//       setCart(JSON.parse(storedCart));
//     }
//   }, []);

//   // Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   function addToCart(productId: number) {

//     setCart((prev) => {

//       const existing = prev.find((item) => item.productId === productId);

//       if (existing) {
//         return prev.map((item) =>
//           item.productId === productId
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }

//       return [...prev, { productId, quantity: 1 }];
//     });
//   }

//   function removeFromCart(productId: number) {
//     setCart((prev) =>
//       prev.filter((item) => item.productId !== productId)
//     );
//   }

//   function clearCart() {
//     setCart([]);
//   }

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error("useCart must be used inside CartProvider");
//   }

//   return context;
// }
