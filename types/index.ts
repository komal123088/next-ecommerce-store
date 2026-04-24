export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  avatar?: string;
  banned: boolean;
  addresses: IAddress[];
  wishlist: string[];
  createdAt: string;
}

export interface IAddress {
  _id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ICategory | string;
  stock: number;
  featured: boolean;
  ratings: IRating[];
  avgRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface IRating {
  user: string;
  rating: number;
}

export interface ICategory {
  _id: string;
  name: string;
  image: string;
  slug: string;
  productCount?: number;
}

export interface IOrder {
  _id: string;
  user: IUser | string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  couponUsed?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
}

export interface IOrderItem {
  product: IProduct | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  amount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface IReview {
  _id: string;
  user: IUser | string;
  product: IProduct | string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  size?: string;
  color?: string;
}
