import Link from "next/link";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            Summer Sale — Up to 40% Off
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Discover Premium
            <span className="block text-blue-200">Products Online</span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-xl">
            Shop thousands of curated products from top brands. Fast shipping,
            easy returns, and unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/30 active:scale-95"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products?featured=true"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors active:scale-95"
            >
              View Featured
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-6">
            {[
              { icon: Truck, text: "Free shipping over $50" },
              { icon: Shield, text: "30-day returns" },
              { icon: Zap, text: "Fast checkout" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-blue-100 text-sm"
              >
                <Icon className="w-4 h-4 text-blue-300" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
