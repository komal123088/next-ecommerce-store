import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env.local");

// ── Schemas ────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  avatar: String,
});
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  image: String,
});
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [String],
  stock: Number,
  featured: Boolean,
  category: mongoose.Schema.Types.ObjectId,
  avgRating: Number,
  reviewCount: Number,
});
const OrderSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId,
    items: Array,
    shippingAddress: Object,
    paymentId: String,
    status: String,
    subtotal: Number,
    tax: Number,
    total: Number,
  },
  { timestamps: true },
);
const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discountType: String,
  amount: Number,
  expiryDate: Date,
  usageLimit: Number,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

// ── Data ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
  },
  {
    name: "Clothing",
    slug: "clothing",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  },
  {
    name: "Sports",
    slug: "sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
  },
  {
    name: "Books",
    slug: "books",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
  },
  {
    name: "Beauty",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
  },
];

const PRODUCTS = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium audio experience with active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    price: 299.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    ],
    stock: 45,
    featured: true,
    category: "Electronics",
  },
  {
    name: "Mechanical Keyboard RGB",
    description:
      "Tactile mechanical switches with per-key RGB lighting, aluminum body, and USB-C connectivity.",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    ],
    stock: 32,
    featured: false,
    category: "Electronics",
  },
  {
    name: "4K Webcam Pro",
    description:
      "Ultra HD 4K resolution webcam with built-in ring light and noise-cancelling microphone.",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600",
    ],
    stock: 18,
    featured: true,
    category: "Electronics",
  },
  {
    name: "Smart Watch Series X",
    description:
      "Advanced fitness tracking, heart rate monitoring, GPS, and 7-day battery life.",
    price: 349.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    ],
    stock: 60,
    featured: true,
    category: "Electronics",
  },
  {
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging compatible with all Qi-enabled devices. Sleek aluminum design.",
    price: 39.99,
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600",
    ],
    stock: 120,
    featured: false,
    category: "Electronics",
  },
  {
    name: "Men's Premium Cotton Tee",
    description:
      "Ultra-soft 100% organic cotton, relaxed fit, available in 12 colors.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    ],
    stock: 200,
    featured: false,
    category: "Clothing",
  },
  {
    name: "Women's Yoga Leggings",
    description:
      "High-waist compression leggings with moisture-wicking fabric and 4-way stretch.",
    price: 65.99,
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600",
    ],
    stock: 150,
    featured: true,
    category: "Clothing",
  },
  {
    name: "Classic Denim Jacket",
    description:
      "Vintage-wash denim jacket with custom embroidery details and a modern slim fit.",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600"],
    stock: 75,
    featured: false,
    category: "Clothing",
  },
  {
    name: "Running Sneakers Pro",
    description:
      "Lightweight foam cushioning with breathable knit upper. Perfect for daily runs.",
    price: 119.99,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    stock: 88,
    featured: true,
    category: "Sports",
  },
  {
    name: "Minimalist Desk Lamp",
    description:
      "Architect-style LED desk lamp with touch dimmer, USB charging port, and warm/cool modes.",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    ],
    stock: 55,
    featured: false,
    category: "Home & Garden",
  },
  {
    name: "Ceramic Planter Set",
    description:
      "Set of 3 handcrafted ceramic planters in natural earth tones, drainage holes included.",
    price: 44.99,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600",
    ],
    stock: 90,
    featured: false,
    category: "Home & Garden",
  },
  {
    name: "Bamboo Cutting Board",
    description:
      "Extra-large 18x12 bamboo cutting board with juice groove and non-slip feet.",
    price: 29.99,
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"],
    stock: 160,
    featured: false,
    category: "Home & Garden",
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip 6mm thick TPE yoga mat with alignment lines and carry strap.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600",
    ],
    stock: 110,
    featured: false,
    category: "Sports",
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "32oz double-wall insulated bottle keeps drinks cold 24hrs or hot 12hrs.",
    price: 35.99,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
    ],
    stock: 250,
    featured: false,
    category: "Sports",
  },
  {
    name: "Resistance Band Set",
    description:
      "Set of 5 latex-free resistance bands with door anchor, handles and ankle straps.",
    price: 27.99,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    ],
    stock: 180,
    featured: false,
    category: "Sports",
  },
  {
    name: "The Design of Everyday Things",
    description:
      "Don Norman's classic guide to human-centered design. Essential reading for designers.",
    price: 19.99,
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600"],
    stock: 70,
    featured: false,
    category: "Books",
  },
  {
    name: "Atomic Habits",
    description:
      "James Clear's #1 NYT bestseller on building good habits and breaking bad ones.",
    price: 16.99,
    images: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600",
    ],
    stock: 95,
    featured: true,
    category: "Books",
  },
  {
    name: "Vitamin C Serum",
    description:
      "20% Vitamin C with hyaluronic acid and ferulic acid for brightening and anti-aging.",
    price: 42.99,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
    ],
    stock: 130,
    featured: true,
    category: "Beauty",
  },
  {
    name: "Natural Face Moisturizer",
    description:
      "Oil-free daily moisturizer with SPF 30, hyaluronic acid, and niacinamide.",
    price: 38.99,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600",
    ],
    stock: 140,
    featured: false,
    category: "Beauty",
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "360° sound with 20W output, IPX7 waterproof, 15-hour battery, and bass radiator.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    ],
    stock: 8,
    featured: true,
    category: "Electronics",
  },
];

const COUPONS = [
  {
    code: "SAVE10",
    discountType: "percentage",
    amount: 10,
    expiryDate: new Date("2025-12-31"),
    usageLimit: 1000,
  },
  {
    code: "SAVE20",
    discountType: "percentage",
    amount: 20,
    expiryDate: new Date("2025-06-30"),
    usageLimit: 500,
  },
  {
    code: "FLAT15",
    discountType: "fixed",
    amount: 15,
    expiryDate: new Date("2025-12-31"),
    usageLimit: 200,
  },
  {
    code: "WELCOME",
    discountType: "percentage",
    amount: 15,
    expiryDate: new Date("2025-12-31"),
    usageLimit: 100,
  },
  {
    code: "SUMMER30",
    discountType: "percentage",
    amount: 30,
    expiryDate: new Date("2025-08-31"),
    usageLimit: 300,
  },
];

// ── Main ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected");

  // Drop all collections cleanly to avoid duplicate key errors
  console.log("🗑️  Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Order.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  // Drop indexes so unique constraints don't cause issues on re-seed
  await Promise.all([
    mongoose.connection.collection("users").dropIndexes(),
    mongoose.connection.collection("categories").dropIndexes(),
    mongoose.connection.collection("coupons").dropIndexes(),
  ]);

  console.log("👤 Creating users...");
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  const [adminUser, testUser] = await Promise.all([
    User.create({
      name: "Admin User",
      email: "admin@store.com",
      password: adminPass,
      role: "admin",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    }),
    User.create({
      name: "Test User",
      email: "user@store.com",
      password: userPass,
      role: "user",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    }),
  ]);

  console.log("📂 Creating categories...");
  const categories = await Category.insertMany(CATEGORIES);
  const categoryMap = Object.fromEntries(
    categories.map((c: any) => [c.name, c._id]),
  );

  console.log("📦 Creating products...");
  const productsWithCats = PRODUCTS.map((p) => ({
    ...p,
    category: categoryMap[p.category],
    avgRating: +(3.5 + Math.random() * 1.5).toFixed(1),
    reviewCount: Math.floor(Math.random() * 200 + 10),
  }));
  const products = await Product.insertMany(productsWithCats);

  console.log("🎟️  Creating coupons...");
  await Coupon.insertMany(COUPONS);

  console.log("🛒 Creating orders...");
  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const orderPromises = Array.from({ length: 10 }, (_, i) => {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({ length: numItems }, () => {
      const p = products[Math.floor(Math.random() * products.length)] as any;
      return {
        product: p._id,
        name: p.name,
        image: p.images[0],
        price: p.price,
        quantity: Math.floor(Math.random() * 3) + 1,
      };
    });
    const subtotal = items.reduce(
      (s, item) => s + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return Order.create({
      user: i % 3 === 0 ? adminUser._id : testUser._id,
      items,
      shippingAddress: {
        name: "John Doe",
        street: `${i + 1}23 Main St`,
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "US",
      },
      paymentId: `pi_seed_${Date.now()}_${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      subtotal,
      tax,
      total,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ),
    });
  });
  await Promise.all(orderPromises);

  console.log("\n✅ Database seeded successfully!");
  console.log("─────────────────────────────────");
  console.log("👤 Admin  → admin@store.com / admin123");
  console.log("👤 User   → user@store.com  / user123");
  console.log("─────────────────────────────────");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
