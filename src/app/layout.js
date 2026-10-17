import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers";
import MainNavigation from "./components/MainNavigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Adis Eats | Ethiopian Food, Delivered",
    template: "%s | Adis Eats",
  },

  description:
    "Explore Ethiopian favorites and order freshly prepared meals from Adis Eats.",

  openGraph: {
    type: "website",
    siteName: "Adis Eats",
    title: "Adis Eats | Ethiopian Food, Delivered",
    description:
      "Explore Ethiopian favorites and order freshly prepared meals from Adis Eats.",
    images: ["/opengraph-image"],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} bg-[#fffdf8] font-sans text-[#203b2d] antialiased`}
      >
        <Providers>
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-[#e9e7dc] bg-[#fffdf8]/95 shadow-sm backdrop-blur-md">
            <nav
              aria-label="Main navigation"
              className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
            >
              {/* Brand */}
              <Link
                href="/"
                className="shrink-0 text-xl font-extrabold tracking-tight text-[#244b36] sm:text-2xl"
              >
                Adis<span className="text-[#bd7137]"> Eats.</span>
              </Link>

              {/* Responsive navigation */}
              <MainNavigation />
            </nav>
          </header>

          {/* Main page content */}
          <main className="min-h-[70vh]">{children}</main>

          {/* Footer */}
          <footer className="mt-16 bg-[#193b2a] text-white">
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {/* Brand */}
                <div>
                  <Link
                    href="/"
                    className="inline-block text-2xl font-extrabold tracking-tight"
                  >
                    Adis<span className="text-[#e9a15b]"> Eats.</span>
                  </Link>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
                    Discover the taste of Ethiopia. Enjoy your favorite
                    traditional dishes, made for sharing.
                  </p>
                </div>

                {/* Explore */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#e9a15b]">
                    Explore
                  </h2>

                  <ul className="mt-4 space-y-3 text-sm text-white/80">
                    <li>
                      <Link
                        href="/menu"
                        className="transition-colors hover:text-white"
                      >
                        Our Menu
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/cart"
                        className="transition-colors hover:text-white"
                      >
                        Shopping Cart
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/checkout"
                        className="transition-colors hover:text-white"
                      >
                        Checkout
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/orders"
                        className="transition-colors hover:text-white"
                      >
                        My Orders
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Customer care */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#e9a15b]">
                    Customer Care
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/75">
                    Need help with your order? Visit our menu and choose your
                    favorite Ethiopian meals.
                  </p>

                  <Link
                    href="/menu"
                    className="mt-4 inline-flex min-h-10 items-center rounded-full bg-[#e9a15b] px-5 py-2 text-sm font-bold text-[#193b2a] transition-colors hover:bg-[#f3b978]"
                  >
                    Explore Menu
                  </Link>
                </div>

                {/* Location */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#e9a15b]">
                    Our Kitchen
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/75">
                    Addis Ababa, Ethiopia
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/75">
                    Fresh flavors. Ethiopian tradition. Every meal.
                  </p>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-10 border-t border-white/15 pt-6">
                <div className="flex flex-col gap-3 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
                  <p>© 2026 Adis Eats. All rights reserved.</p>
                  <p>Made with care in Ethiopia.</p>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
