"use client";

import Link from "next/link";
import { Package, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-white font-bold text-xl mb-4"
            >
              <Package className="w-6 h-6 text-blue-400" /> ShopElite
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium products curated for modern lifestyles. Quality you can
              trust.
            </p>
          </div>

          {[
            {
              title: "Shop",
              links: [
                { name: "All Products", href: "/products" },
                { name: "Featured", href: "/products?featured=true" },
                { name: "New Arrivals", href: "/products?sort=newest" },
                { name: "Sale", href: "/products?sort=price-asc" },
              ],
            },
            {
              title: "Account",
              links: [
                { name: "My Account", href: "/account" },
                { name: "Orders", href: "/account/orders" },
                { name: "Wishlist", href: "/account/wishlist" },
                { name: "Addresses", href: "/account/addresses" },
              ],
            },
            {
              title: "Support",
              links: [
                { name: "Contact Us", href: "#" },
                { name: "FAQ", href: "#" },
                { name: "Shipping Policy", href: "#" },
                { name: "Returns", href: "#" },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                Subscribe to our newsletter
              </h3>
              <p className="text-sm text-gray-400">
                Get the latest deals and updates straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex gap-2 w-full md:w-auto"
            >
              <div className="relative flex-1 md:w-64">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-sm py-2.5 px-4 flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2024 ShopElite. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
