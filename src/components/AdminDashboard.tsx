import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order } from '../types';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Lock,
  MessageSquare
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { openWhatsApp } from '../utils/whatsapp';
import { FACTORY_STORE_GALLERY_IMAGES } from '../data/initialProducts';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    orders, 
    settings, 
    saveProduct, 
    deleteProduct, 
    updateOrderStatus,
    updateSettings,
    resetCatalog,
    showToast,
    adminAuthenticated,
    setAdminAuthenticated 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'settings'>('analytics');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  
  // Product Form Modal state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Image URL input state
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminOpen) return null;

  // Authentication check
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === 'sgleathers2026' || adminPasswordInput.trim() === 'admin' || adminPasswordInput.trim() === 'periamet') {
      setAdminAuthenticated(true);
      localStorage.setItem('sg_admin_session', 'true');
      showToast('Admin access granted! Welcome to SG Leathers Portal.');
    } else {
      showToast('Incorrect passcode. Use default: sgleathers2026 or admin', 'error');
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    localStorage.removeItem('sg_admin_session');
    showToast('Admin logged out safely.', 'info');
  };

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter(p => {
    const totalStock = Object.values(p.sizeStock || {}).reduce((a, b) => a + b, 0);
    return totalStock < 5;
  });

  // Handle Editing or Creating a product
  const handleOpenAddProduct = () => {
    const newProd: Product = {
      id: `sgl-custom-${Date.now()}`,
      slug: `sg-custom-${Date.now()}`,
      name: '',
      brand: 'SG LEATHERS',
      category: 'formal-shoes',
      gender: 'Men',
      description: '',
      shortDescription: '',
      price: 2499,
      salePrice: 999,
      discountPercentage: 60,
      currency: '₹',
      images: [FACTORY_STORE_GALLERY_IMAGES[0]],
      thumbnail: FACTORY_STORE_GALLERY_IMAGES[0],
      material: 'Full Grain Leather',
      style: 'Handcrafted',
      features: ['100% Genuine Leather', 'Periamet Factory Direct', 'Cushioned Insole'],
      sku: `SGL-${Math.floor(1000 + Math.random() * 9000)}`,
      sizeSystem: 'India/UK',
      sizes: ['6', '7', '8', '9', '10', '11'],
      sizeStock: { '6': 4, '7': 8, '8': 10, '9': 6, '10': 4, '11': 2 },
      colors: ['Tan', 'Black'],
      variants: [],
      featured: true,
      newArrival: true,
      bestSeller: false,
      offer: true,
      isFlat999: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingProduct(newProd);
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(prod)));
    setIsEditingProduct(true);
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...JSON.parse(JSON.stringify(prod)),
      id: `sgl-dup-${Date.now()}`,
      slug: `${prod.slug}-copy-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku}-CP`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveProduct(duplicated);
    showToast(`Duplicated product: ${duplicated.name}`);
  };

  // Image Management - Handle Local File Upload
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setImageUploadLoading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await storageService.readFileAsDataURL(file);
        newUrls.push(dataUrl);
      }

      setEditingProduct(prev => {
        if (!prev) return null;
        const updatedImages = [...newUrls, ...prev.images];
        return {
          ...prev,
          images: updatedImages,
          thumbnail: updatedImages[0]
        };
      });

      showToast(`Uploaded ${newUrls.length} local image(s) successfully!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to read local image file.', 'error');
    } finally {
      setImageUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Image Management - Handle ANY custom URL
  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim() || !editingProduct) return;

    const cleanUrl = customImageUrl.trim();
    setEditingProduct(prev => {
      if (!prev) return null;
      const updatedImages = [cleanUrl, ...prev.images];
      return {
        ...prev,
        images: updatedImages,
        thumbnail: cleanUrl
      };
    });

    setCustomImageUrl('');
    showToast('Custom image link added successfully!');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct) return;
    const filtered = editingProduct.images.filter((_, i) => i !== index);
    const newThumb = filtered[0] || '';
    setEditingProduct({
      ...editingProduct,
      images: filtered,
      thumbnail: newThumb
    });
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    const discount = editingProduct.price > editingProduct.salePrice
      ? Math.round(((editingProduct.price - editingProduct.salePrice) / editingProduct.price) * 100)
      : 0;

    const finalProduct: Product = {
      ...editingProduct,
      discountPercentage: discount,
      updatedAt: new Date().toISOString()
    };

    saveProduct(finalProduct);
    setIsEditingProduct(false);
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAdminOpen(false)}
      />

      {/* Main Admin Window with White Background */}
      <div className="relative w-full max-w-6xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 text-stone-900">
        
        {/* Top Bar with Logo */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/aistudio/image_67be200c.png" 
              alt="SG Leathers Logo" 
              className="w-10 h-10 rounded-full object-cover border border-stone-300 shadow-sm"
            />
            <div>
              <h2 className="font-brand text-lg font-black text-black flex items-center gap-2">
                <span>SG LEATHERS</span>
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded font-mono">ADMIN HUB</span>
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">Inventory & Real-Time Analytics Portal • Periamet</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminAuthenticated && (
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-black text-xs font-bold flex items-center gap-1.5"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If Not Authenticated, show Admin Login View */}
        {!adminAuthenticated ? (
          <div className="p-8 sm:p-16 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 text-black flex items-center justify-center shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-brand text-2xl font-black text-black">Periamet Factory Admin</h3>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Enter your administrative passcode to manage factory inventory, upload local product photos, and view real-time orders.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="w-full space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="Enter passcode (default: sgleathers2026)"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  autoFocus
                  className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-4 py-3 text-sm text-black placeholder-stone-400 text-center focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Access Dashboard
              </button>
              <p className="text-[11px] text-stone-400">
                Hint: Passcode is <code className="text-black font-mono font-bold">sgleathers2026</code> or <code className="text-black font-mono font-bold">admin</code>
              </p>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Views */
          <div className="flex-1 overflow-hidden flex flex-col">
            
            {/* Admin Tabs */}
            <div className="px-6 border-b border-stone-200 bg-stone-50 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 px-4 border-b-2 text-xs font-black flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-black text-black'
                    : 'border-transparent text-stone-500 hover:text-black'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Real-Time Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-3 px-4 border-b-2 text-xs font-black flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'border-black text-black'
                    : 'border-transparent text-stone-500 hover:text-black'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Inventory & Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-4 border-b-2 text-xs font-black flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-black text-black'
                    : 'border-transparent text-stone-500 hover:text-black'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
                {pendingOrders > 0 && (
                  <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-4 border-b-2 text-xs font-black flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-black text-black'
                    : 'border-transparent text-stone-500 hover:text-black'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                        <span>Total Sales Revenue</span>
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-black">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold">Real-time order sum</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                        <span>Total Orders</span>
                        <ShoppingBag className="w-4 h-4 text-black" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-black">
                        {totalOrders}
                      </div>
                      <span className="text-[11px] text-black font-semibold">{pendingOrders} awaiting dispatch</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                        <span>Active Catalog Styles</span>
                        <Package className="w-4 h-4 text-black" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-black">
                        {products.length}
                      </div>
                      <span className="text-[11px] text-stone-500">All genuine leather items</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                        <span>Low Stock Warnings</span>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-red-600">
                        {lowStockProducts.length}
                      </div>
                      <span className="text-[11px] text-stone-500">Requires Periamet restocking</span>
                    </div>

                  </div>

                  {/* Orders Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200">
                      <h4 className="font-brand text-sm font-black text-black mb-4">Order Status Pipeline</h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-stone-200">
                          <span className="text-stone-700 font-medium">Pending Confirmation</span>
                          <span className="font-black text-black">{orders.filter(o => o.orderStatus === 'Pending').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-stone-200">
                          <span className="text-stone-700 font-medium">Packed at Periamet Hub</span>
                          <span className="font-black text-black">{orders.filter(o => o.orderStatus === 'Packed at Periamet').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-stone-200">
                          <span className="text-stone-700 font-medium">Shipped / In Transit</span>
                          <span className="font-black text-black">{orders.filter(o => o.orderStatus === 'Shipped').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-stone-200">
                          <span className="text-stone-700 font-medium">Successfully Delivered</span>
                          <span className="font-black text-emerald-700">{deliveredOrders}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200">
                      <h4 className="font-brand text-sm font-black text-black mb-4">Outlet Pricing Highlights</h4>
                      <div className="space-y-3 text-xs text-stone-700">
                        <div className="p-3.5 rounded-2xl bg-white border border-stone-200">
                          <span className="text-red-600 font-black block mb-1">Famous ₹999 Clearance Section:</span>
                          <p>{products.filter(p => p.isFlat999).length} live products currently marked at flat ₹999 factory rate.</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white border border-stone-200">
                          <span className="text-black font-black block mb-1">Average Footwear Price:</span>
                          <p>₹1,640 (Factory Direct) vs. Retail Market Benchmark ₹3,999.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: INVENTORY & PRODUCTS */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div>
                      <h3 className="font-brand text-base font-black text-black">Genuine Leather Footwear & Goods</h3>
                      <p className="text-xs text-stone-500">Add products, upload local images or any custom URL, and update size stock.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenAddProduct}
                        className="px-4 py-2.5 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Product</span>
                      </button>

                      <button
                        onClick={resetCatalog}
                        className="px-3 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-black border border-stone-300 text-xs font-bold flex items-center gap-1.5"
                        title="Restore default factory catalog"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
                    <table className="w-full text-left text-xs text-stone-700">
                      <thead className="bg-stone-50 text-[11px] font-black uppercase tracking-wider text-stone-600 border-b border-stone-200">
                        <tr>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Material</th>
                          <th className="py-3 px-4">Outlet Price</th>
                          <th className="py-3 px-4">Size Stock</th>
                          <th className="py-3 px-4">Flags</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {products.map((prod) => {
                          const totalStock = Object.values(prod.sizeStock || {}).reduce((a, b) => a + b, 0);
                          return (
                            <tr key={prod.id} className="hover:bg-stone-50 transition-colors">
                              <td className="py-3 px-4 flex items-center gap-3">
                                <img
                                  src={prod.thumbnail || prod.images[0]}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-lg object-contain bg-stone-50 border border-stone-200 p-0.5"
                                />
                                <div>
                                  <span className="font-black text-black block line-clamp-1">{prod.name}</span>
                                  <span className="text-[10px] text-stone-400">SKU: {prod.sku}</span>
                                </div>
                              </td>

                              <td className="py-3 px-4 capitalize font-medium">
                                {prod.category.replace('-', ' ')}
                              </td>

                              <td className="py-3 px-4 text-stone-600 font-medium">
                                {prod.material}
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-black text-black">₹{prod.salePrice}</span>
                                <span className="text-stone-400 line-through text-[10px] ml-1.5">₹{prod.price}</span>
                              </td>

                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  totalStock === 0 
                                    ? 'bg-red-50 text-red-600 border border-red-200' 
                                    : totalStock < 5 
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {totalStock} in stock
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {prod.isFlat999 && (
                                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                                      ₹999
                                    </span>
                                  )}
                                  {prod.featured && (
                                    <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditProduct(prod)}
                                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-black hover:text-white text-stone-700 transition-colors"
                                    title="Edit Product & Images"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDuplicateProduct(prod)}
                                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                                    title="Duplicate Product"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete product "${prod.name}"?`)) {
                                        deleteProduct(prod.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-600 hover:text-white text-stone-700 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="font-brand text-base font-black text-black">All Customer Orders</h3>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-stone-400 text-xs">
                      No orders placed yet. Orders created via checkout will appear here in real time.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div key={ord.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-black text-sm">#{ord.id}</span>
                              <span className="text-xs text-stone-400">• {new Date(ord.createdAt).toLocaleDateString()}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-800">
                                {ord.paymentMethod}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-black mt-1">
                              {ord.customerName} ({ord.phone})
                            </h4>
                            <p className="text-[11px] text-stone-600 mt-0.5">
                              {ord.shippingAddress.houseStreet}, {ord.shippingAddress.city} - {ord.shippingAddress.pincode}
                            </p>
                            <div className="text-[11px] text-stone-700 mt-1 font-medium">
                              {ord.items.map(it => `${it.name} (Size: ${it.selectedSize}, Qty: ${it.quantity})`).join(', ')}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-sm font-black text-black block">
                                ₹{ord.totalAmount.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => openWhatsApp(ord.phone, `Hello ${ord.customerName}, this is SG Leathers Periamet regarding your order #${ord.id}.`)}
                                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp Customer</span>
                              </button>
                            </div>

                            {/* Status Selector */}
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-white border border-stone-300 text-black text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-black shadow-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed at Periamet">Packed at Periamet</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-4">
                  <h3 className="font-brand text-base font-black text-black">SG Leathers Store & Factory Settings</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-700 mb-1 font-bold">Business Name</label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => updateSettings({ ...settings, businessName: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 mb-1 font-bold">Store Address</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => updateSettings({ ...settings, address: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 mb-1 font-bold">Top Announcement Bar Text</label>
                      <input
                        type="text"
                        value={settings.announcementText}
                        onChange={(e) => updateSettings({ ...settings, announcementText: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 mb-1 font-bold">Retail WhatsApp 1</label>
                        <input
                          type="text"
                          value={settings.retailWhatsApp1}
                          onChange={(e) => updateSettings({ ...settings, retailWhatsApp1: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 mb-1 font-bold">Retail WhatsApp 2</label>
                        <input
                          type="text"
                          value={settings.retailWhatsApp2}
                          onChange={(e) => updateSettings({ ...settings, retailWhatsApp2: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 mb-1 font-bold">Wholesale WhatsApp Line</label>
                      <input
                        type="text"
                        value={settings.wholesaleWhatsApp}
                        onChange={(e) => updateSettings({ ...settings, wholesaleWhatsApp: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD/EDIT MODAL (White Theme) */}
      {isEditingProduct && editingProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsEditingProduct(false)}
          />

          <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 text-stone-900">
            
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
              <h3 className="font-brand text-lg font-black text-black">
                {editingProduct.id.includes('custom') ? 'Add New Genuine Leather Product' : `Edit: ${editingProduct.name}`}
              </h3>
              <button
                onClick={() => setIsEditingProduct(false)}
                className="p-1 rounded-full text-stone-400 hover:text-black hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SG Hand-Burnished Classic Derby Shoes"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                  >
                    <option value="formal-shoes">Formal Shoes</option>
                    <option value="loafers">Loafers & Moccasins</option>
                    <option value="boots">Chelsea & Lace-Up Boots</option>
                    <option value="laptop-bags">Office Laptop Bags</option>
                    <option value="travel-duffels">Travel Duffels</option>
                    <option value="jackets">Leather Jackets</option>
                    <option value="belts">Belts</option>
                    <option value="wallets">Wallets & Cardholders</option>
                    <option value="flat-999-deals">Famous ₹999 Deals</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Leather Material Type</label>
                  <select
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                  >
                    <option value="Full Grain Leather">Full Grain Leather</option>
                    <option value="Top Grain Leather">Top Grain Leather</option>
                    <option value="Saddle Pull-Up Leather">Saddle Pull-Up Leather</option>
                    <option value="Burnished Calfskin">Burnished Calfskin</option>
                    <option value="Suede / Nubuck">Suede / Nubuck</option>
                    <option value="Nappa Soft Leather">Nappa Soft Leather</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">MRP / Regular Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Outlet Sale Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.salePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black font-black focus:outline-none focus:border-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="Brief highlight of the leather & style"
                    value={editingProduct.shortDescription}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe genuine leather craft, sole, lining, and styling notes..."
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Product Image Upload & Link Manager */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-black flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>Product Images Manager (Local File Upload + Any Custom URL)</span>
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Upload photos directly from your computer/phone or paste any web image URL without restrictions.
                    </p>
                  </div>
                </div>

                {/* Upload Local File Button */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleLocalImageUpload}
                    className="hidden"
                    id="local-image-input"
                  />
                  <label
                    htmlFor="local-image-input"
                    className="px-4 py-2 rounded-xl bg-black hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{imageUploadLoading ? 'Processing file...' : 'Upload Local Image File'}</span>
                  </label>

                  <span className="text-stone-400 text-[11px] font-bold">or paste link:</span>

                  <div className="flex-1 flex gap-2 min-w-[240px]">
                    <input
                      type="url"
                      placeholder="Paste ANY image URL (https://...)"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-black"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-black font-bold text-xs"
                    >
                      Add URL
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGalleryPicker(!showGalleryPicker)}
                    className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-black border border-stone-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>{showGalleryPicker ? 'Hide Store Photos' : 'Pick from 42 Store Photos'}</span>
                  </button>
                </div>

                {/* Expandable Store Photos Tray */}
                {showGalleryPicker && (
                  <div className="p-3 bg-white rounded-2xl border border-stone-300 space-y-2 animate-in fade-in shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-black">
                        SG LEATHERS Factory Stock Photos (Click any to add):
                      </span>
                      <span className="text-[10px] text-stone-500 font-bold">42 Real Store Items</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 gap-2 max-h-48 overflow-y-auto p-1">
                      {FACTORY_STORE_GALLERY_IMAGES.map((imgUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (!editingProduct) return;
                            const updated = [imgUrl, ...editingProduct.images.filter(x => x !== imgUrl)];
                            setEditingProduct({
                              ...editingProduct,
                              images: updated,
                              thumbnail: updated[0]
                            });
                            showToast('Photo added from store collection!');
                          }}
                          className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 hover:border-black hover:scale-105 transition-all group"
                          title="Click to add to this product"
                        >
                          <img src={imgUrl} alt={`Store photo ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Plus className="w-4 h-4 text-white font-bold" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display Current Images List with Thumbnail indicator */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
                  {editingProduct.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-white">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-black text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Stock Matrix */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-black block">
                  Per-Size Stock Management ({editingProduct.sizeSystem})
                </span>
                <p className="text-[11px] text-stone-500">
                  Set live stock quantity for each size. Set to 0 to automatically mark that size Out of Stock.
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                  {editingProduct.sizes.map((s) => (
                    <div key={s} className="p-2 rounded-xl bg-white border border-stone-200 text-center shadow-sm">
                      <span className="font-bold text-black block mb-1">Size {s}</span>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.sizeStock?.[s] ?? 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditingProduct({
                            ...editingProduct,
                            sizeStock: {
                              ...editingProduct.sizeStock,
                              [s]: val
                            }
                          });
                        }}
                        className="w-full bg-stone-50 border border-stone-300 text-center rounded py-1 text-xs text-black font-black focus:outline-none focus:border-black"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags & Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFlat999}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFlat999: e.target.checked })}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span className="font-black text-red-600">Famous Flat ₹999 Clearance Deal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded text-black focus:ring-0"
                  />
                  <span className="text-black font-bold">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.newArrival}
                    onChange={(e) => setEditingProduct({ ...editingProduct, newArrival: e.target.checked })}
                    className="rounded text-black focus:ring-0"
                  />
                  <span className="text-black font-bold">New Arrival Badge</span>
                </label>
              </div>

              {/* Save / Cancel CTA */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-black font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-stone-800 text-white font-black tracking-wide cursor-pointer"
                >
                  Save Product to Catalog
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
