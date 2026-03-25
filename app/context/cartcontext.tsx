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
      });


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

