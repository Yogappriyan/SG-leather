import { Product, Order, StoreSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { STORE_SETTINGS_DEFAULT } from '../data/storeInfo';

const PRODUCTS_KEY = 'sg_leathers_products_v3';
const ORDERS_KEY = 'sg_leathers_orders_v2';
const SETTINGS_KEY = 'sg_leathers_settings_v2';
const WISHLIST_KEY = 'sg_leathers_wishlist_v2';
const CART_KEY = 'sg_leathers_cart_v2';
const RECENT_KEY = 'sg_leathers_recent_v2';

export const storageService = {
  // Products Management
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return parsed;
    } catch (e) {
      console.error('Error loading products from storage:', e);
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      // Dispatch custom event for real-time reactivity across tabs or components
      window.dispatchEvent(new Event('sg_products_updated'));
    } catch (e) {
      console.error('Error saving products to storage:', e);
    }
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id || p.slug === id);
  },

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    // Ensure thumbnails & images are sanitized and fallbacks exist
    const images = Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(img => Boolean(img && img.trim()))
      : [product.thumbnail || 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop'];
    
    const thumbnail = product.thumbnail && product.thumbnail.trim()
      ? product.thumbnail.trim()
      : images[0];

    const sanitizedProduct: Product = {
      ...product,
      images,
      thumbnail,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      products[existingIndex] = sanitizedProduct;
    } else {
      products.unshift(sanitizedProduct);
    }

    this.saveProducts(products);
    return sanitizedProduct;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      this.saveProducts(filtered);
      return true;
    }
    return false;
  },

  resetDefaultProducts(): Product[] {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    window.dispatchEvent(new Event('sg_products_updated'));
    return INITIAL_PRODUCTS;
  },

  // Orders Management
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error loading orders:', e);
      return [];
    }
  },

  saveOrder(order: Order): Order {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      orders[existingIndex] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift(order);
    }
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('sg_orders_updated'));
    } catch (e) {
      console.error('Error saving order:', e);
    }
    return order;
  },

  updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      this.saveOrder(order);
      return order;
    }
    return undefined;
  },

  // Settings Management
  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(STORE_SETTINGS_DEFAULT));
        return STORE_SETTINGS_DEFAULT;
      }
      return { ...STORE_SETTINGS_DEFAULT, ...JSON.parse(data) };
    } catch (e) {
      return STORE_SETTINGS_DEFAULT;
    }
  },

  saveSettings(settings: StoreSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event('sg_settings_updated'));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  // Helper for reading Local File as Base64 Data URL
  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as string'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
};
