export type ProductCategory = 
  | 'formal-shoes'
  | 'loafers'
  | 'boots'
  | 'laptop-bags'
  | 'travel-duffels'
  | 'jackets'
  | 'belts'
  | 'wallets'
  | 'flat-999-deals';

export type LeatherType = 
  | 'Full Grain Leather'
  | 'Top Grain Leather'
  | 'Saddle Pull-Up Leather'
  | 'Suede / Nubuck'
  | 'Burnished Calfskin'
  | 'Nappa Soft Leather';

export interface ColorVariant {
  color: string;
  colorCode: string;
  images: string[];
  sizes: Record<string, number>; // e.g. { "6": 4, "7": 8, "8": 12, "9": 6, "10": 2, "11": 0 }
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;
  gender: 'Men' | 'Women' | 'Unisex';
  description: string;
  shortDescription: string;
  price: number; // MRP / Regular Price
  salePrice: number; // Outlet Price
  discountPercentage: number;
  currency: string;
  images: string[];
  thumbnail: string;
  material: LeatherType;
  style: string;
  features: string[];
  sku: string;
  sizeSystem: 'India/UK' | 'EU' | 'US';
  sizes: string[]; // ['6', '7', '8', '9', '10', '11'] or ['S', 'M', 'L', 'XL'] or ['Free Size']
  sizeStock: Record<string, number>;
  colors: string[];
  variants: ColorVariant[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  offer: boolean;
  isFlat999: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  maxStock: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  houseStreet: string;
  areaLandmark: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Packed at Periamet'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'UPI QR Payment' | 'Direct WhatsApp Transfer';
  paymentStatus: 'Pending' | 'Paid' | 'Cash on Delivery';
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  address: string;
  landmark: string;
  pincode: string;
  city: string;
  timingsWeekday: string;
  timingsSunday: string;
  retailWhatsApp1: string;
  retailWhatsApp2: string;
  wholesaleWhatsApp: string;
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
  instagram: string;
  youtubeUrl: string;
  flat999Active: boolean;
  freeShippingMinAmount: number;
}

export interface FilterState {
  category: string;
  search: string;
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
  leatherTypes: string[];
  onlyInStock: boolean;
  onlyFlat999: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'discount';
}
