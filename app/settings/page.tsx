// // app/settings/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/app/context/authcontext";
// import Image from "next/image";
// import { Pencil, Trash2, Plus, Save, X, Upload } from "lucide-react";
// import Link from "next/link";

// type ImageType = {
//   imageId: number;
//   imageName: string;
//   downloadUrl: string;
// };

// type Product = {
//   id: number;
//   name: string;
//   price: number;
//   brand: string;
//   description: string;
//   images: ImageType[];
//   inventory: number;
//   category: {
//     id: number;
//     name: string;
//   };
// };

// type Category = {
//   id: number;
//   name: string;
// };

// type EditableProduct = Product & {
//   isEditing?: boolean;
// };

// export default function SettingsPage() {
//   const { isAuthenticated, token } = useAuth();
//   const [products, setProducts] = useState<EditableProduct[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);

//   // New product form state
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     price: "",
//     brand: "",
//     description: "",
//     inventory: "",
//     categoryId: "",
//     imageFile: null as File | null,
//     imagePreview: "",
//   });

//   // Fetch products and categories
//   useEffect(() => {
//     if (!isAuthenticated) return;
//     fetchProducts();
//     fetchCategories();
//   }, [isAuthenticated]);

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("/api/products", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setProducts(data.data || []);
//     } catch (err) {
//       setError("Failed to fetch products");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("/api/categories");
//       const data = await res.json();
//       setCategories(data.data || []);
//     } catch (err) {
//       console.error("Failed to fetch categories", err);
//     }
//   };

//   // Handle product update
//   const handleUpdateProduct = async (productId: number, updatedData: Partial<Product>) => {
//     setSaving(true);
//     try {
//       const res = await fetch(`/api/products/${productId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (!res.ok) throw new Error("Failed to update product");

//       // Refresh products
//       await fetchProducts();
//       setEditingId(null);
//     } catch (err) {
//       setError("Failed to update product");
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Handle product deletion
//   const handleDeleteProduct = async (productId: number) => {
//     if (!confirm("Are you sure you want to delete this product?")) return;

//     try {
//       const res = await fetch(`/api/products/${productId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to delete product");

//       // Remove from local state
//       setProducts(products.filter(p => p.id !== productId));
//     } catch (err) {
//       setError("Failed to delete product");
//       console.error(err);
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = async (productId: number, file: File) => {
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await fetch(`/api/products/${productId}/images`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Failed to upload image");

//       // Refresh products
//       await fetchProducts();
//     } catch (err) {
//       setError("Failed to upload image");
//       console.error(err);
//     }
//   };

//   // Handle image deletion
//   const handleDeleteImage = async (productId: number, imageId: number) => {
//     if (!confirm("Are you sure you want to delete this image?")) return;

//     try {
//       const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to delete image");

//       // Refresh products
//       await fetchProducts();
//     } catch (err) {
//       setError("Failed to delete image");
//       console.error(err);
//     }
//   };

//   // Handle add new product
//   const handleAddProduct = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       // First create the product
//       const productRes = await fetch("/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: newProduct.name,
//           price: parseFloat(newProduct.price),
//           brand: newProduct.brand,
//           description: newProduct.description,
//           inventory: parseInt(newProduct.inventory),
//           categoryId: parseInt(newProduct.categoryId),
//         }),
//       });

//       if (!productRes.ok) throw new Error("Failed to create product");

//       const productData = await productRes.json();
//       const newProductId = productData.data.id;

//       // Then upload image if exists
//       if (newProduct.imageFile) {
//         const formData = new FormData();
//         formData.append("image", newProduct.imageFile);

//         await fetch(`/api/products/${newProductId}/images`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         });
//       }

//       // Reset form and refresh products
//       setNewProduct({
//         name: "",
//         price: "",
//         brand: "",
//         description: "",
//         inventory: "",
//         categoryId: "",
//         imageFile: null,
//         imagePreview: "",
//       });
//       setShowAddForm(false);
//       await fetchProducts();
//     } catch (err) {
//       setError("Failed to add product");
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setNewProduct({
//         ...newProduct,
//         imageFile: file,
//         imagePreview: URL.createObjectURL(file),
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-10">
//         <p className="text-center">Loading settings...</p>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="container mx-auto px-4 py-10 text-center">
//         <h1 className="text-3xl font-bold mb-4">Settings</h1>
//         <p className="mb-4">Please log in to manage products.</p>
//         <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded">
//           Login
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-10">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Product Management</h1>
//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           <Plus size={20} />
//           Add New Product
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Add New Product Form */}
//       {showAddForm && (
//         <div className="bg-gray-50 border rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
//           <form onSubmit={handleAddProduct} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="Product Name"
//                 value={newProduct.name}
//                 onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                 className="border p-2 rounded"
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={newProduct.price}
//                 onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//                 className="border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Brand"
//                 value={newProduct.brand}
//                 onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
//                 className="border p-2 rounded"
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Inventory"
//                 value={newProduct.inventory}
//                 onChange={(e) => setNewProduct({ ...newProduct, inventory: e.target.value })}
//                 className="border p-2 rounded"
//                 required
//               />
//               <select
//                 value={newProduct.categoryId}
//                 onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
//                 className="border p-2 rounded"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//               <div className="relative">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="border p-2 rounded w-full"
//                 />
//                 {newProduct.imagePreview && (
//                   <div className="mt-2 relative h-20 w-20">
//                     <Image
//                       src={newProduct.imagePreview}
//                       alt="Preview"
//                       fill
//                       className="object-cover rounded"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//             <textarea
//               placeholder="Description"
//               value={newProduct.description}
//               onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//               className="border p-2 rounded w-full"
//               rows={3}
//               required
//             />
//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
//               >
//                 {saving ? "Saving..." : "Save Product"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowAddForm(false)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <ProductCard
//             key={product.id}
//             product={product}
//             categories={categories}
//             isEditing={editingId === product.id}
//             onEdit={() => setEditingId(product.id)}
//             onSave={(updatedData) => handleUpdateProduct(product.id, updatedData)}
//             onCancel={() => setEditingId(null)}
//             onDelete={() => handleDeleteProduct(product.id)}
//             onImageUpload={(file) => handleImageUpload(product.id, file)}
//             onImageDelete={(imageId) => handleDeleteImage(product.id, imageId)}
//             saving={saving}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // Product Card Component with Edit Mode
// function ProductCard({
//   product,
//   categories,
//   isEditing,
//   onEdit,
//   onSave,
//   onCancel,
//   onDelete,
//   onImageUpload,
//   onImageDelete,
//   saving,
// }: {
//   product: Product;
//   categories: Category[];
//   isEditing: boolean;
//   onEdit: () => void;
//   onSave: (data: Partial<Product>) => void;
//   onCancel: () => void;
//   onDelete: () => void;
//   onImageUpload: (file: File) => void;
//   onImageDelete: (imageId: number) => void;
//   saving: boolean;
// }) {
//   const [editData, setEditData] = useState({
//     name: product.name,
//     price: product.price,
//     brand: product.brand,
//     description: product.description,
//     inventory: product.inventory,
//     categoryId: product.category.id,
//   });

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onImageUpload(file);
//     }
//   };

//   if (isEditing) {
//     return (
//       <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-blue-500">
//         <div className="p-4 space-y-3">
//           <input
//             type="text"
//             value={editData.name}
//             onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//             className="w-full border p-2 rounded"
//             placeholder="Product Name"
//           />
//           <input
//             type="number"
//             value={editData.price}
//             onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
//             className="w-full border p-2 rounded"
//             placeholder="Price"
//           />
//           <input
//             type="text"
//             value={editData.brand}
//             onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
//             className="w-full border p-2 rounded"
//             placeholder="Brand"
//           />
//           <input
//             type="number"
//             value={editData.inventory}
//             onChange={(e) => setEditData({ ...editData, inventory: parseInt(e.target.value) })}
//             className="w-full border p-2 rounded"
//             placeholder="Inventory"
//           />
//           <select
//             value={editData.categoryId}
//             onChange={(e) => setEditData({ ...editData, categoryId: parseInt(e.target.value) })}
//             className="w-full border p-2 rounded"
//           >
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//           <textarea
//             value={editData.description}
//             onChange={(e) => setEditData({ ...editData, description: e.target.value })}
//             className="w-full border p-2 rounded"
//             rows={3}
//             placeholder="Description"
//           />
//           <div className="flex gap-2">
//             <button
//               onClick={() => onSave(editData)}
//               disabled={saving}
//               className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
//             >
//               <Save size={16} className="inline mr-1" />
//               Save
//             </button>
//             <button
//               onClick={onCancel}
//               className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
//             >
//               <X size={16} className="inline mr-1" />
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
//       {/* Image Section */}
//       <div className="relative h-48 bg-gray-100">
//         {product.images?.[0] ? (
//           <Image
//             src={`http://localhost:8888${product.images[0].downloadUrl}`}
//             alt={product.name}
//             fill
//             className="object-cover"
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-400">
//             No Image
//           </div>
//         )}
        
//         {/* Image Upload Button */}
//         <label className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100">
//           <Upload size={16} className="text-gray-600" />
//           <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//         </label>
        
//         {/* Delete Image Button */}
//         {product.images?.[0] && (
//           <button
//             onClick={() => onImageDelete(product.images[0].imageId)}
//             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//           >
//             <Trash2 size={14} />
//           </button>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="p-4 space-y-2">
//         <h2 className="text-lg font-semibold line-clamp-1">{product.name}</h2>
//         <p className="text-sm text-gray-500">{product.brand}</p>
//         <p className="text-xl font-bold text-blue-600">${product.price}</p>
//         <p className="text-sm text-gray-600">Stock: {product.inventory}</p>
//         <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        
//         {/* Action Buttons */}
//         <div className="flex gap-2 mt-3">
//           <button
//             onClick={onEdit}
//             className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
//           >
//             <Pencil size={16} className="inline mr-1" />
//             Edit
//           </button>
//           <button
//             onClick={onDelete}
//             className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
//           >
//             <Trash2 size={16} className="inline mr-1" />
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }