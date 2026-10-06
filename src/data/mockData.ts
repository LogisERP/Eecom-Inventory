export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: 'Fashion' | 'Shoes' | 'Electronics' | 'Jewelry' | 'Furniture';
  price: number;
  ordersCount: number;
  stockCount: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Dead Stock';
  image: string;
  demandTrend: string;
}

export interface OrderItem {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: number;
  date: string;
  status: 'Received' | 'Processing' | 'Shipped' | 'Delivered';
  paymentMethod: string;
}

export const TOP_RECOMMENDATIONS: ProductItem[] = [
  {
    id: 'rec-1',
    sku: 'RT15246630',
    name: 'Gold Bracelet pla...',
    category: 'Jewelry',
    price: 65.00,
    ordersCount: 6,
    stockCount: 495,
    status: 'In Stock',
    image: '/gold_bracelet.png',
    demandTrend: '+28%'
  },
  {
    id: 'rec-2',
    sku: 'RT15246680',
    name: 'Ocean blue plush lo...',
    category: 'Furniture',
    price: 250.00,
    ordersCount: 2,
    stockCount: 120,
    status: 'Low Stock',
    image: '/blue_plush.png',
    demandTrend: '+14%'
  },
  {
    id: 'rec-3',
    sku: 'RT15246690',
    name: 'Woman High Heel..',
    category: 'Shoes',
    price: 100.00,
    ordersCount: 2,
    stockCount: 89,
    status: 'Out of Stock',
    image: '/woman_heels.png',
    demandTrend: '+35%'
  }
];

export const FULL_INVENTORY: ProductItem[] = [
  ...TOP_RECOMMENDATIONS,
  {
    id: 'rec-4',
    sku: 'RT15246710',
    name: 'Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 180.00,
    ordersCount: 14,
    stockCount: 310,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    demandTrend: '+42%'
  },
  {
    id: 'rec-5',
    sku: 'RT15246725',
    name: 'Italian Leather Crossbody Bag',
    category: 'Fashion',
    price: 140.00,
    ordersCount: 8,
    stockCount: 20,
    status: 'Dead Stock',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=80',
    demandTrend: '-5%'
  },
  {
    id: 'rec-6',
    sku: 'RT15246799',
    name: 'Minimalist Ceramic Vase Set',
    category: 'Furniture',
    price: 45.00,
    ordersCount: 19,
    stockCount: 495,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=200&auto=format&fit=crop&q=80',
    demandTrend: '+19%'
  }
];

export const RECENT_ORDERS: OrderItem[] = [
  {
    id: 'ORD-9901',
    customerName: 'Gilbert Smith',
    customerEmail: 'gilbert.smith@gmail.com',
    productName: 'Gold Bracelet pla...',
    amount: 65.00,
    date: '24 Feb, 2025',
    status: 'Received',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-9902',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@techmail.io',
    productName: 'Ocean blue plush lo...',
    amount: 250.00,
    date: '23 Feb, 2025',
    status: 'Processing',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-9903',
    customerName: 'David Vance',
    customerEmail: 'dvance@retailplus.com',
    productName: 'Woman High Heel..',
    amount: 100.00,
    date: '22 Feb, 2025',
    status: 'Shipped',
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'ORD-9904',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@design.org',
    productName: 'Wireless Noise-Canceling Headphones',
    amount: 180.00,
    date: '21 Feb, 2025',
    status: 'Delivered',
    paymentMethod: 'Credit Card'
  }
];
