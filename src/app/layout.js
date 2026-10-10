// app/layout.js
import Link from "next/link";
import NavLinks from "./components/NavLinks";
import Providers from "./Providers";
import "./globals.css";
import { getSession } from "./lib/session";

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Adis Eats",
    template: "%s | Adis Eats",
  },
  description: "Order authentic Ethiopian food online",
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const initialUser = session
    ? { id: session.userId, name: session.name }
    : null;

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Providers initialUser={initialUser}>
          <nav className="bg-white border-b border-gray-200 shadow-sm relative">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-lg font-bold text-orange-600">
                Adis Eats
              </Link>
              <NavLinks />
            </div>
          </nav>

          <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <span className="text-lg font-bold text-white">Adis Eats</span>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Traditional Ethiopian stews, spiced meats and fresh injera, brought
            straight to your door.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-orange-500 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/menu"
                className="hover:text-orange-500 transition-colors"
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="hover:text-orange-500 transition-colors"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="hover:text-orange-500 transition-colors"
              >
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Company
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-orange-500 transition-colors">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition-colors">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition-colors">
                Terms of service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Get in touch
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>Bole Road, Addis Ababa</li>
            <li>
              <a
                href="mailto:hello@adiseats.example.com"
                className="hover:text-orange-500 transition-colors"
              >
                hello@adiseats.example.com
              </a>
            </li>
            <li>
              <a
                href="tel:+251911223344"
                className="hover:text-orange-500 transition-colors"
              >
                +251 91 122 3344
              </a>
            </li>
          </ul>

          <div className="flex gap-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {/* <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /> */}
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {/* <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.6.23 1.03.5 1.48.95.45.45.72.88.95 1.48.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4 4 0 0 1-.95 1.48 4 4 0 0 1-1.48.95c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4 4 0 0 1-1.48-.95 4 4 0 0 1-.95-1.48c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.23-.6.5-1.03.95-1.48.45-.45.88-.72 1.48-.95.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.74-.35.34-.56.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.83.18.46.39.79.74 1.13.34.35.67.56 1.13.74.35.14.87.3 1.83.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.74.35-.34.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.83a3 3 0 0 0-.74-1.13 3 3 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34-1.23-.06-1.58-.07-4.73-.07zm0 4.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2zm5.1-2a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" /> */}
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {/* <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.7a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4A4.2 4.2 0 0 1 4.3 14a4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" /> */}
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Adis Eats. All rights reserved.
          </p>
          <p>Made with care in Addis Ababa.</p>
        </div>
      </div>
    </footer>
  );
}
