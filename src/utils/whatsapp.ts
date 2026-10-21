import { Product, Order, CartItem } from '../types';

export const WHATSAPP_NUMBERS = {
  retail1: '+919840225411',
  retail2: '+919840445411',
  wholesale: '+919840525411'
};

export function cleanPhoneForUrl(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Open WhatsApp with a pre-filled, cleanly encoded message
 */
export function openWhatsApp(phone: string, message: string) {
  const cleanNumber = cleanPhoneForUrl(phone);
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanNumber}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Generate Product Enquiry message for WhatsApp
 */
export function generateProductWhatsAppMessage(
  product: Product,
  color?: string,
  size?: string
): string {
  const priceDisplay = `₹${product.salePrice.toLocaleString('en-IN')}`;
  const originalPrice = `₹${product.price.toLocaleString('en-IN')}`;
  
  let msg = `*SG LEATHERS • PRODUCT ENQUIRY*\n`;
  msg += `------------------------------------\n`;
  msg += `Hello SG Leathers Periamet team, I would like to check availability for:\n\n`;
  msg += `👞 *Product:* ${product.name}\n`;
  msg += `🏷️ *SKU:* ${product.sku}\n`;
  msg += `💰 *Outlet Price:* ${priceDisplay} (MRP ${originalPrice})\n`;
  if (color) msg += `🎨 *Selected Color:* ${color}\n`;
  if (size) msg += `📏 *Selected Size:* ${size} (${product.sizeSystem})\n`;
  msg += `🧵 *Material:* ${product.material}\n\n`;
  msg += `Could you please confirm if this pair is in stock at your Periamet showroom or for courier dispatch?\n`;
  msg += `------------------------------------\n`;
  msg += `_From SG Leathers Factory Outlet Web App_`;

  return msg;
}

/**
 * Generate Order Confirmation message to send to SG Leathers WhatsApp
 */
export function generateOrderWhatsAppMessage(order: Order): string {
  let msg = `*SG LEATHERS • NEW ORDER #${order.id}*\n`;
  msg += `====================================\n`;
  msg += `Customer Name: *${order.customerName}*\n`;
  msg += `Phone / WhatsApp: *${order.phone}*\n`;
  msg += `Delivery City: *${order.shippingAddress.city} - ${order.shippingAddress.pincode}*\n`;
  msg += `Full Address: ${order.shippingAddress.houseStreet}, ${order.shippingAddress.areaLandmark}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\n\n`;
  
  msg += `*ORDERED ITEMS:*\n`;
  order.items.forEach((item, idx) => {
    msg += `${idx + 1}. *${item.name}*\n`;
    msg += `   • Color: ${item.selectedColor} | Size: ${item.selectedSize}\n`;
    msg += `   • Qty: ${item.quantity} x ₹${item.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}\n`;
  });

  msg += `\nSubtotal: ₹${order.subtotal.toLocaleString('en-IN')}\n`;
  msg += `Shipping: ${order.shippingFee === 0 ? 'FREE DELIVERY' : `₹${order.shippingFee}`}\n`;
  msg += `*TOTAL AMOUNT: ₹${order.totalAmount.toLocaleString('en-IN')}*\n`;
  msg += `Payment Method: *${order.paymentMethod}*\n`;
  msg += `Payment Status: *${order.paymentStatus}*\n`;
  msg += `====================================\n`;
  msg += `Please confirm my order and share dispatch tracking details from Periamet factory. Thank you!`;

  return msg;
}

/**
 * Generate Wholesale enquiry message
 */
export function generateWholesaleMessage(): string {
  let msg = `*SG LEATHERS • BULK / WHOLESALE ENQUIRY*\n`;
  msg += `====================================\n`;
  msg += `Hello SG Leathers Factory Outlet,\n`;
  msg += `I am reaching out to enquire about bulk/wholesale genuine leather supply:\n`;
  msg += `• Factory pricing for footwear & leather bags\n`;
  msg += `• Minimum Order Quantities (MOQ)\n`;
  msg += `• Custom corporate gifting / leather goods\n\n`;
  msg += `Please share your wholesale catalog and wholesale rates.`;
  return msg;
}
