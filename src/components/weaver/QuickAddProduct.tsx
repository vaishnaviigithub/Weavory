"use client";

import React, { useState } from 'react';
import { PlusCircle, X, Upload, Loader2 } from 'lucide-react';
import { createProduct, uploadProductImage } from '@/lib/weaverService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const QuickAddProduct = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    craft_type: '',
    materials: '',
    images: [] as string[]
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      const uploadedUrls: string[] = [];
      
      try {
        for (const file of files) {
          const imageUrl = await uploadProductImage(file);
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
          }
        }
        
        setPreviewImages(prev => [...prev, ...uploadedUrls]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Valid price is required';
    if (!formData.stock_quantity || isNaN(Number(formData.stock_quantity))) {
      newErrors.stock_quantity = 'Valid quantity is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.craft_type) newErrors.craft_type = 'Craft type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (!user?.id) {
        console.error('User ID not found');
        return;
      }
      
      const materialsArray = formData.materials
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      const newProduct = await createProduct({
        weaver_id: user.id,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        category: formData.category,
        craft_type: formData.craft_type,
        materials: materialsArray,
        images: formData.images,
        is_active: true
      });
      
      if (newProduct) {
        router.refresh();
        closeModal();
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          stock_quantity: '',
          category: '',
          craft_type: '',
          materials: '',
          images: []
        });
        setPreviewImages([]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Quick Add Button */}
      <button
        onClick={openModal}
        className="bg-amber-800 hover:bg-amber-700 text-white rounded-lg p-5 shadow-sm w-full h-full flex flex-col items-center justify-center transition-transform hover:scale-105"
      >
        <PlusCircle className="h-10 w-10 mb-2" />
        <span className="text-lg font-medium">Add Product</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="Describe your product"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full p-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    className={`w-full p-3 border ${errors.stock_quantity ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="0"
                  />
                  {errors.stock_quantity && <p className="mt-1 text-sm text-red-500">{errors.stock_quantity}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white`}
                  >
                    <option value="">Select category</option>
                    <option value="sarees">Sarees</option>
                    <option value="fabrics">Fabrics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="craft_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Craft Type *
                  </label>
                  <select
                    id="craft_type"
                    name="craft_type"
                    value={formData.craft_type}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.craft_type ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white`}
                  >
                    <option value="">Select craft type</option>
                    <option value="silk">Silk Weaving</option>
                    <option value="cotton">Cotton Weaving</option>
                    <option value="wool">Wool Weaving</option>
                    <option value="ikat">Ikat</option>
                    <option value="block-printing">Block Printing</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.craft_type && <p className="mt-1 text-sm text-red-500">{errors.craft_type}</p>}
                </div>

                <div className="col-span-2">
                  <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
                    Materials Used (comma separated)
                  </label>
                  <input
                    type="text"
                    id="materials"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Cotton, Silk, etc."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-24 h-24 object-cover rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    
                    <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${isUploading ? 'opacity-50' : ''}`}>
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="mt-1 text-xs text-gray-500">Add Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isUploading}
                        multiple
                      />
                    </label>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Upload clear images of your product. You can add multiple images.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-8 gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="px-6 py-3 bg-amber-800 hover:bg-amber-700 text-white rounded-md flex items-center justify-center min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickAddProduct;