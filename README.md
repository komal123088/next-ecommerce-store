# Shoppe — Full-Stack E-Commerce Store

A complete, production-ready e-commerce store built with Next.js 14, TypeScript, MongoDB, NextAuth, and Stripe.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (e.g. MongoDB Atlas) |
| `NEXTAUTH_SECRET` | Random 32+ char secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | Stripe secret key from dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key from dashboard |

### 3. Seed the database (optional)
```bash
npm run seed
```
This creates demo accounts and 12 sample products.

**Demo credentials:**
- Admin: `admin@store.com` / `admin123`
- User: `user@store.com` / `user123`

### 4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Signup pages
│   ├── (shop)/           # Cart, Checkout, Orders, Product detail
│   ├── admin/            # Admin dashboard, products, orders
│   ├── api/              # All API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (product grid)
├── components/
│   ├── cart/             # CheckoutForm (Stripe Elements)
│   ├── layout/           # Navbar, Footer
│   ├── product/          # ProductCard
│   └── ui/               # LoadingSpinner, OrderStatusBadge
├── hooks/
│   ├── useCart.ts        # Zustand cart store (localStorage)
│   └── useTheme.ts       # Dark/light theme store
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # MongoDB connection
│   └── seed.ts           # Database seeder
├── models/               # Mongoose models (User, Product, Order)
└── types/                # TypeScript types
```

---

## 🛍️ Features

### User Features
- **Home page** — Product grid with search and category filtering
- **Product detail** — Images, description, stock status, add to cart
- **Cart** — Persistent via localStorage (Zustand), quantity updates, live total
- **Checkout** — Stripe payment with shipping address form
- **Orders** — Full order history with expandable details
- **Auth** — Login & signup with NextAuth

### Admin Features (`/admin`)
- **Dashboard** — Revenue, orders, products, customers stats + recent orders table
- **Products** — Full CRUD with modal form (add/edit/delete)
- **Orders** — All orders with filter by status + one-click status updates

### General
- 🌙 Dark/light theme toggle
- 📱 Fully mobile responsive
- ⚡ Loading states everywhere
- 🔔 Toast notifications
- 🔒 Role-based route protection (admin vs user)

---

## 💳 Stripe Testing

Use Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Authentication required:** `4000 0025 0000 3155`
- **Declined:** `4000 0000 0000 9995`

Use any future expiry date and any 3-digit CVC.

---

## 🗄️ Database Models

**User** — `name`, `email`, `password` (hashed), `role` (user/admin)  
**Product** — `name`, `description`, `price`, `images[]`, `category`, `stock`, `featured`  
**Order** — `user`, `items[]`, `total`, `status`, `stripePaymentId`, `shippingAddress`

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (JWT + Credentials) |
| Payments | Stripe |
| State | Zustand (cart + theme) |
| Notifications | react-hot-toast |

---

## 📦 Deployment

### Vercel (recommended)
1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables
4. Deploy!

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user
3. Get the connection string and set as `MONGODB_URI`

### Stripe
1. Create an account at [stripe.com](https://stripe.com)
2. Get API keys from the Developers section
3. Use test keys during development
