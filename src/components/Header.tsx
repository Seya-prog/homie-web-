"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, logout, loading, role } = useAuth();

  const displayName = profile?.displayName || user?.displayName || user?.email || "";
  const userInitial = displayName ? displayName[0].toUpperCase() : "?";

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 w-full border-b border-outline-variant/20">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-primary-container">
            Homie
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/listings"
              className="text-on-surface font-semibold hover:text-primary-container transition-colors duration-200"
            >
              Buy
            </Link>
            <Link
              href="/listings"
              className="text-on-surface-variant font-medium hover:text-primary-container transition-colors duration-200"
            >
              Rent
            </Link>
            <Link
              href="/signup"
              className="text-on-surface-variant font-medium hover:text-primary-container transition-colors duration-200"
            >
              Sell
            </Link>
            {(!user || role === 'owner') && (
              <Link
                href="/properties/new"
                className="text-on-surface-variant font-medium hover:text-primary-container transition-colors duration-200"
              >
                List Property
              </Link>
            )}
            <Link
              href="/map-search"
              className="text-on-surface-variant font-medium hover:text-primary-container transition-colors duration-200"
            >
              Map Search
            </Link>
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-outline-variant/30 animate-pulse" />
          ) : user ? (
            <>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "#002446",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {userInitial}
              </div>
              <Link
                href="/dashboard"
                className="text-on-surface-variant font-semibold hover:text-primary-container px-4 py-2 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-on-surface-variant font-semibold hover:text-primary-container px-4 py-2 transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
                Sign Up
              </Link>
            </>
          )}
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
          <Link href="/listings" className="block text-on-surface font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
            Buy
          </Link>
          <Link href="/listings" className="block text-on-surface-variant font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
            Rent
          </Link>
          <Link href="/signup" className="block text-on-surface-variant font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
            Sell
          </Link>
          {(!user || role === 'owner') && (
            <Link href="/properties/new" className="block text-on-surface-variant font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              List Property
            </Link>
          )}
          <Link href="/map-search" className="block text-on-surface-variant font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
            Map Search
          </Link>
          <hr className="border-outline-variant/30" />
          {loading ? (
            <div className="w-full h-10 rounded-lg bg-outline-variant/30 animate-pulse" />
          ) : user ? (
            <>
              <Link href="/dashboard" className="block w-full text-left text-on-surface-variant font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="block w-full bg-primary text-on-primary font-bold px-6 py-3 rounded-lg text-center"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block w-full text-left text-on-surface-variant font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Link>
              <Link href="/signup" className="block w-full bg-primary text-on-primary font-bold px-6 py-3 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
