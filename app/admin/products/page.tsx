

// "use client";

// import { useState } from "react";
// import { useAuth } from "@/app/context/authcontext";
// import Link from "next/link";

// type Image = {
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
//   images: Image[];
//   inventory: number;
//   category: {
//     id: number;
//     name: string;
//   };
// };

// type ProductListProps = {
//   products: Product[];
//   onProductUpdate?: (updatedProduct: Product) => void;
// };

// export default function ProductList({ products, onProductUpdate }: ProductListProps) {
//   const { token } = useAuth();
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [editingField, setEditingField] = useState<keyof Product | null>(null);
//   const [editValue, setEditValue] = useState<string>("");
//   const [uploadingImage, setUploadingImage] = useState<number | null>(null);

//   // Handle double-click to edit
//   const handleDoubleClick = (product: Product, field: keyof Product) => {
//     if (field === "images") return; // Images handled separately
//     setEditingProduct(product);
//     setEditingField(field);
//     setEditValue(String(product[field]));
//   };

//   // Save edited field
//   const saveEdit = async () => {
//     if (!editingProduct || !editingField) return;

//     let updatedValue: any = editValue;
    
//     // Convert to appropriate type
//     if (editingField === "price" || editingField === "inventory") {
//       updatedValue = parseFloat(editValue);
//       if (isNaN(updatedValue)) {
//         alert("Please enter a valid number");
//         return;
//       }
//     }

//     try {
//       const response = await fetch(`/api/products/${editingProduct.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           [editingField]: updatedValue,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update product");
//       }

//       const data = await response.json();
      
//       // Update the product in the UI
//       if (onProductUpdate && data.data) {
//         onProductUpdate(data.data);
//       }
      
//       alert(`${editingField} updated successfully!`);
      
//     } catch (error) {
//       console.error("Error updating product:", error);
//       alert("Failed to update product. Please try again.");
//     } finally {
//       setEditingProduct(null);
//       setEditingField(null);
//       setEditValue("");
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = async (productId: number, files: FileList | null) => {
//     if (!files || files.length === 0) return;

//     setUploadingImage(productId);
//     const formData = new FormData();
    
//     for (let i = 0; i < files.length; i++) {
//       formData.append("images", files[i]);
//     }

//     try {
//       const response = await fetch(`/api/products/${productId}/images`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to upload image");
//       }

//       const data = await response.json();
      
//       // Refresh the product to show new image
//       if (onProductUpdate && data.data) {
//         onProductUpdate(data.data);
//       }
      
//       alert("Image uploaded successfully!");
      
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Failed to upload image. Please try again.");
//     } finally {
//       setUploadingImage(null);
//     }
//   };

//   // Handle image deletion
//   const handleDeleteImage = async (productId: number, imageId: number, e: React.MouseEvent) => {
//     e.stopPropagation();
    
//     if (!confirm("Are you sure you want to delete this image?")) return;

//     try {
//       const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete image");
//       }

//       // Refresh the product
//       const productResponse = await fetch(`/api/products/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const productData = await productResponse.json();
      
//       if (onProductUpdate && productData.data) {
//         onProductUpdate(productData.data);
//       }
      
//       alert("Image deleted successfully!");
      
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       alert("Failed to delete image. Please try again.");
//     }
//   };

//   // Render edit input
//   const renderEditInput = (product: Product, field: keyof Product) => {
//     if (editingProduct?.id === product.id && editingField === field) {
//       return (
//         <div className="mt-1" onClick={(e) => e.stopPropagation()}>
//           {field === "description" ? (
//             <textarea
//               value={editValue}
//               onChange={(e) => setEditValue(e.target.value)}
//               onBlur={saveEdit}
//               onKeyPress={(e) => e.key === "Enter" && saveEdit()}
//               className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={3}
//               autoFocus
//             />
//           ) : (
//             <input
//               type={field === "price" || field === "inventory" ? "number" : "text"}
//               value={editValue}
//               onChange={(e) => setEditValue(e.target.value)}
//               onBlur={saveEdit}
//               onKeyPress={(e) => e.key === "Enter" && saveEdit()}
//               className="w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               autoFocus
//             />
//           )}
//           <p className="text-xs text-gray-500 mt-1">Press Enter to save or click outside</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
//           >
//             {/* Image Section - Clickable for upload */}
//             <div className="relative group">
//               <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 {product.images?.[0] ? (
//                   <img
//                     src={`http://localhost:8888${product.images[0].downloadUrl}`}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="text-gray-400 text-center">
//                     <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     No Image
//                   </div>
//                 )}
                
//                 {/* Upload overlay on double-click */}
//                 <div 
//                   className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center cursor-pointer"
//                   onDoubleClick={(e) => {
//                     e.stopPropagation();
//                     const fileInput = document.createElement('input');
//                     fileInput.type = 'file';
//                     fileInput.accept = 'image/*';
//                     fileInput.multiple = true;
//                     fileInput.onchange = (e) => {
//                       const target = e.target as HTMLInputElement;
//                       handleImageUpload(product.id, target.files);
//                     };
//                     fileInput.click();
//                   }}
//                 >
//                   <div className="opacity-0 group-hover:opacity-100 transition">
//                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <p className="text-white text-xs mt-1">Double-click to upload</p>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Image gallery indicator and delete buttons */}
//               {product.images && product.images.length > 0 && (
//                 <div className="absolute bottom-2 right-2 flex gap-1">
//                   {product.images.map((img, idx) => (
//                     <div key={img.imageId} className="relative group/image">
//                       <div className="w-6 h-6 bg-black bg-opacity-50 rounded text-white text-xs flex items-center justify-center cursor-pointer hover:bg-opacity-75">
//                         {idx + 1}
//                       </div>
//                       <button
//                         onClick={(e) => handleDeleteImage(product.id, img.imageId, e)}
//                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover/image:opacity-100 transition"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
              
//               {uploadingImage === product.id && (
//                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                   <div className="text-white text-sm">Uploading...</div>
//                 </div>
//               )}
//             </div>

//             <div className="p-4 space-y-2">
//               {/* Product Name - Double-click to edit */}
//               <div>
//                 {renderEditInput(product, "name")}
//                 {!(editingProduct?.id === product.id && editingField === "name") && (
//                   <h2 
//                     className="text-lg font-semibold line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
//                     onDoubleClick={() => handleDoubleClick(product, "name")}
//                     title="Double-click to edit name"
//                   >
//                     {product.name}
//                   </h2>
//                 )}
//               </div>

//               {/* Brand - Double-click to edit */}
//               <div>
//                 {renderEditInput(product, "brand")}
//                 {!(editingProduct?.id === product.id && editingField === "brand") && (
//                   <p 
//                     className="text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
//                     onDoubleClick={() => handleDoubleClick(product, "brand")}
//                     title="Double-click to edit brand"
//                   >
//                     {product.brand}
//                   </p>
//                 )}
//               </div>

//               {/* Price - Double-click to edit */}
//               <div>
//                 {renderEditInput(product, "price")}
//                 {!(editingProduct?.id === product.id && editingField === "price") && (
//                   <p 
//                     className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
//                     onDoubleClick={() => handleDoubleClick(product, "price")}
//                     title="Double-click to edit price"
//                   >
//                     ${product.price}
//                   </p>
//                 )}
//               </div>

//               {/* Inventory - Double-click to edit */}
//               <div>
//                 {renderEditInput(product, "inventory")}
//                 {!(editingProduct?.id === product.id && editingField === "inventory") && (
//                   <p 
//                     className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
//                     onDoubleClick={() => handleDoubleClick(product, "inventory")}
//                     title="Double-click to edit inventory"
//                   >
//                     Stock: {product.inventory} units
//                   </p>
//                 )}
//               </div>

//               {/* Category - Display only (optional edit) */}
//               <p className="text-xs text-gray-400">
//                 Category: {product.category?.name}
//               </p>

//               {/* Description - Double-click to edit */}
//               <div>
//                 {renderEditInput(product, "description")}
//                 {!(editingProduct?.id === product.id && editingField === "description") && (
//                   <p 
//                     className="text-sm text-gray-600 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
//                     onDoubleClick={() => handleDoubleClick(product, "description")}
//                     title="Double-click to edit description"
//                   >
//                     {product.description}
//                   </p>
//                 )}
//               </div>

//               {/* Product ID link */}
//               <Link 
//                 href={`/products/${product.id}`}
//                 className="text-xs text-blue-500 hover:text-blue-700 block mt-2"
//               >
//                 View Details →
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }