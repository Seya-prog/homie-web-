"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 w-full border-b border-outline-variant/20">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary-container">
          Homie
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-on-surface font-semibold hover:text-primary-container transition-colors duration-200"
          >
            Find a Home
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant font-medium hover:text-primary-container transition-colors duration-200"
          >
            For Owners
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant font-medium hover:text-primary-container transition-colors duration-200"
          >
            Marketplace
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant font-medium hover:text-primary-container transition-colors duration-200"
          >
            About
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-on-surface-variant font-semibold hover:text-primary-container px-4 py-2 transition-colors">
            Sign In
          </button>
          <button className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-on-surface transition-all duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-on-surface transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-on-surface transition-all duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant/20 px-8 py-6 space-y-4 animate-in slide-in-from-top">
          <Link href="#" className="block text-on-surface font-semibold py-2">
            Find a Home
          </Link>
          <Link href="#" className="block text-on-surface-variant font-medium py-2">
            For Owners
          </Link>
          <Link href="#" className="block text-on-surface-variant font-medium py-2">
            Marketplace
          </Link>
          <Link href="#" className="block text-on-surface-variant font-medium py-2">
            About
          </Link>
          <hr className="border-outline-variant/30" />
          <button className="block w-full text-left text-on-surface-variant font-semibold py-2">
            Sign In
          </button>
          <button className="w-full bg-primary text-on-primary font-bold px-6 py-3 rounded-lg">
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}
