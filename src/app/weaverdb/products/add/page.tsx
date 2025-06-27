"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Loader2, 
  X,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createProduct } from '@/lib/weaverService';

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    craft_type: '',
    is_active: true,
    materials: [] as string[],
    images: [] as string[]
  });

  const [materialInput, setMaterialInput] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddMaterial = () => {
    if (materialInput.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, materialInput.trim()]
      }));
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newPreviewUrls]
      }));
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
      
      const newProduct = await createProduct({
        weaver_id: user.id,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        category: formData.category,
        craft_type: formData.craft_type,
        materials: formData.materials,
        images: formData.images,
        is_active: formData.is_active
      });
      
      if (newProduct) {
        router.push('/weaverdb/products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Product Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h2>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-amber-500 focus:border-amber-500`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-amber-500 focus:border-amber-500`}
                placeholder="Describe your product in detail. Include information about the craftsmanship, materials, design, and any unique features."
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full p-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-amber-500 focus:border-amber-500`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 border ${errors.stock_quantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-amber-500 focus:border-amber-500`}
                placeholder="0"
              />
              {errors.stock_quantity && <p className="mt-1 text-sm text-red-500">{errors.stock_quantity}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white`}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Craft Type *
              </label>
              <select
                name="craft_type"
                value={formData.craft_type}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.craft_type ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white`}
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
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Make this product available for sale
                </label>
              </div>
            </div>
            
            {/* Materials */}
            <div className="md:col-span-2 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Materials Used</h2>
              
              <div className="flex items-center mb-3">
                <input
                  type="text"
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  placeholder="Add material (e.g., Cotton, Silk)"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 mr-2"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="p-3 bg-amber-800 text-white rounded-md hover:bg-amber-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                    {material}
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="ml-2 focus:outline-none"
                    >
                      <X className="h-4 w-4 text-amber-600 hover:text-amber-800" />
                    </button>
                  </div>
                ))}
                {formData.materials.length === 0 && (
                  <p className="text-sm text-gray-500">No materials added yet</p>
                )}
              </div>
            </div>
            
            {/* Product Images */}
            <div className="md:col-span-2 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h2>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
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
                
                <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-1 text-xs text-gray-500">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                  />
                </label>
              </div>
              
              <p className="text-xs text-gray-500">
                Upload clear images of your product. You can add multiple images to showcase different angles and details.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-amber-800 hover:bg-amber-700 text-white rounded-md flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}