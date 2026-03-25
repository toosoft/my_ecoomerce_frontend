"use client";

import Link from "next/link";
import { useAuth } from "../context/authcontext";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

type Image = {
  imageId: number;
  imageName: string;
  downloadUrl: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  description: string;
  images: Image[];
  inventory: number;
  category: {
    id: number;
    name: string;
  };
};

type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
};

type Order = {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 🔹 Fetch orders
  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Orders data:", data);
      
      setOrders(data.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 🔹 Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔹 Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">My Orders</h1>
        <p className="mb-4">Please log in to view your orders.</p>
        <Link 
          href="/login" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {formatDate(order.orderDate)}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-lg">${order.totalAmount.toFixed(2)}</span>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {selectedOrder?.id === order.id ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>

              {/* Order Items (Conditional) */}
              {selectedOrder?.id === order.id && (
                <div className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        {item.product?.images?.[0] && (
                          <img
                            src={`${API_URL}${item.product.images[0].downloadUrl}`}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold">
                            {item.product?.name || `Product #${item.productId}`}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mt-2 md:mt-0">
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Summary */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total:</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}