import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings, FilterState } from '../types';
import { storageService } from '../services/storageService';
import { STORE_SETTINGS_DEFAULT } from '../data/storeInfo';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  products: Product[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  isSuccessModalOpen: boolean;
  setIsSuccessModalOpen: (open: boolean) => void;
  latestOrder: Order | null;
  setLatestOrder: (order: Order | null) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Cart Actions
  addToCart: (product: Product, selectedColor: string, selectedSize: string, quantity?: number) => boolean;
  updateCartQty: (productId: string, selectedColor: string, selectedSize: string, qty: number) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;

  // Admin Actions
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateSettings: (newSettings: StoreSettings) => void;
  resetCatalog: () => void;
}

const defaultFilters: FilterState = {
  category: 'all',
  search: '',
  priceRange: [0, 10000],
  selectedSizes: [],
  selectedColors: [],
  leatherTypes: [],
  onlyInStock: false,
  onlyFlat999: false,
  sortBy: 'featured'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(STORE_SETTINGS_DEFAULT);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Initial load
  useEffect(() => {
    refreshData();

    // Load persisted Cart & Wishlist
    try {
      const savedCart = localStorage.getItem('sg_leathers_cart_v2');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('sg_leathers_wishlist_v2');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const adminAuth = localStorage.getItem('sg_admin_session');
      if (adminAuth === 'true') setAdminAuthenticated(true);
    } catch (e) {
      console.error(e);
    }

    const handleProductsUpdated = () => setProducts(storageService.getProducts());
    const handleOrdersUpdated = () => setOrders(storageService.getOrders());
    const handleSettingsUpdated = () => setSettings(storageService.getSettings());

    window.addEventListener('sg_products_updated', handleProductsUpdated);
    window.addEventListener('sg_orders_updated', handleOrdersUpdated);
    window.addEventListener('sg_settings_updated', handleSettingsUpdated);

    return () => {
      window.removeEventListener('sg_products_updated', handleProductsUpdated);
      window.removeEventListener('sg_orders_updated', handleOrdersUpdated);
      window.removeEventListener('sg_settings_updated', handleSettingsUpdated);
    };
  }, []);

  const refreshData = () => {
    setProducts(storageService.getProducts());
    setSettings(storageService.getSettings());
    setOrders(storageService.getOrders());
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('sg_leathers_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('sg_leathers_wishlist_v2', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Cart operations
  const addToCart = (product: Product, selectedColor: string, selectedSize: string, quantity = 1): boolean => {
    // Check stock for this specific size
    const availableStock = product.sizeStock?.[selectedSize] ?? 10;
    if (availableStock <= 0) {
      showToast(`Size ${selectedSize} is currently Out of Stock!`, 'error');
      return false;
    }

    setCart(prev => {
      const existing = prev.find(
        item => item.productId === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > availableStock) {
          showToast(`Only ${availableStock} pairs available in size ${selectedSize}.`, 'info');
          return prev.map(item => item === existing ? { ...item, quantity: availableStock } : item);
        }
        showToast(`Updated ${product.name} quantity to ${newQty}!`);
        return prev.map(item => item === existing ? { ...item, quantity: newQty } : item);
      } else {
        showToast(`Added ${product.name} (${selectedSize}) to cart!`);
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            image: product.thumbnail || product.images[0],
            price: product.salePrice,
            selectedColor,
            selectedSize,
            quantity: Math.min(quantity, availableStock),
            maxStock: availableStock
          }
        ];
      }
    });

    return true;
  };

  const updateCartQty = (productId: string, selectedColor: string, selectedSize: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.productId === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize) {
          return { ...item, quantity: Math.min(qty, item.maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedColor: string, selectedSize: string) => {
    setCart(prev =>
      prev.filter(item => !(item.productId === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize))
    );
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const id = `SGL-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    storageService.saveOrder(newOrder);
    setLatestOrder(newOrder);
    setOrders(storageService.getOrders());
    clearCart();
    setIsCheckoutOpen(false);
    setIsSuccessModalOpen(true);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    storageService.updateOrderStatus(orderId, status);
    setOrders(storageService.getOrders());
    showToast(`Order #${orderId} status set to: ${status}`);
  };

  // Product & Admin actions
  const saveProduct = (product: Product) => {
    storageService.saveProduct(product);
    setProducts(storageService.getProducts());
    showToast(`Product "${product.name}" saved successfully!`);
  };

  const deleteProduct = (productId: string) => {
    storageService.deleteProduct(productId);
    setProducts(storageService.getProducts());
    showToast('Product deleted from inventory', 'info');
  };

  const updateSettings = (newSettings: StoreSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
    showToast('Store settings updated successfully!');
  };

  const resetCatalog = () => {
    const reset = storageService.resetDefaultProducts();
    setProducts(reset);
    showToast('Catalog restored to default factory products', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        settings,
        cart,
        wishlist,
        orders,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        latestOrder,
        setLatestOrder,
        isAdminOpen,
        setIsAdminOpen,
        adminAuthenticated,
        setAdminAuthenticated,
        toasts,
        showToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        updateSettings,
        resetCatalog
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
