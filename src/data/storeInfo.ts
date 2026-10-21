import { StoreSettings } from '../types';

export const STORE_SETTINGS_DEFAULT: StoreSettings = {
  businessName: 'SG LEATHERS',
  tagline: 'Genuine Leather Factory Outlet • Periamet, Chennai',
  address: '2nd Floor, Old No. 133 / New No. 40, Vepery High Road, Periamet, Chennai - 600003',
  landmark: 'Near Indian Overseas Bank',
  pincode: '600003',
  city: 'Chennai',
  timingsWeekday: 'Monday - Saturday: 10:00 AM to 9:00 PM',
  timingsSunday: 'Sunday: 10:00 AM to 7:00 PM',
  retailWhatsApp1: '+91 9840225411',
  retailWhatsApp2: '+91 9840445411',
  wholesaleWhatsApp: '+91 9840525411',
  announcementText: '🔥 SG LEATHERS FACTORY DIRECT • PURE GENUINE LEATHER DEALS • FAMOUS ₹999 FACTORY CLEARANCE ON SELECT STYLES • ALL-INDIA DISPATCH',
  heroHeadline: 'AUTHENTIC LEATHER. DIRECT FROM FACTORY.',
  heroSubheadline: 'Handcrafted genuine leather footwear, office laptop bags, duffels, jackets & accessories from Periamet—India’s legendary leather capital.',
  instagram: 'sgleathers_factoryoutlet',
  youtubeUrl: 'https://youtube.com',
  flat999Active: true,
  freeShippingMinAmount: 1999
};

export const STORE_HIGHLIGHTS = [
  {
    title: '100% Genuine Leather Guarantee',
    desc: 'Crafted using authentic full-grain and top-grain hides, zero synthetic imitation.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Direct-From-Factory Pricing',
    desc: 'No middleman retail markup. Enjoy famous factory outlet flat-rate ₹999 deals.',
    icon: 'Tag'
  },
  {
    title: 'Periamet Heritage Hub',
    desc: 'Located in Periamet, Chennai—the historic center of Indian leather craftsmanship.',
    icon: 'MapPin'
  },
  {
    title: 'Instant WhatsApp Assistance',
    desc: 'Real-time photos, sizing help, and instant direct orders via WhatsApp.',
    icon: 'MessageCircle'
  }
];
