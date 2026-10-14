"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function DashboardHeader() {
  const { user, profile, role, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const displayName = profile?.displayName || user?.displayName || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="w-full flex justify-between items-center px-8 py-4 sticky top-0 z-10" style={{ backgroundColor: 'rgba(250,251,252,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(226,228,233,0.5)' }}>
      <div className="flex items-center" style={{ gap: '32px' }}>
        <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a3a5f', letterSpacing: '-0.025em' }}>
          Homie
        </span>
        <nav className="hidden lg:flex items-center" style={{ gap: '24px' }}>
          <Link href="/dashboard" className="font-headline" style={{ fontWeight: 700, color: '#1a3a5f', borderBottom: '2px solid #1a3a5f', paddingBottom: '4px', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link href="/listings" className="font-headline" style={{ fontWeight: 500, color: '#94a3b8', borderBottom: '2px solid transparent', paddingBottom: '4px', textDecoration: 'none' }}>
            Marketplace
          </Link>
          <Link href="/applications" className="font-headline" style={{ fontWeight: 500, color: '#94a3b8', borderBottom: '2px solid transparent', paddingBottom: '4px', textDecoration: 'none' }}>
            Applications
          </Link>
        </nav>
      </div>
      <div className="flex items-center" style={{ gap: '8px' }}>
        {role === 'owner' && (
          <Link href="/properties/new"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#002446', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            List Property
          </Link>
        )}
        <button className="p-2 rounded-full transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 rounded-full transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* User Avatar + Dropdown */}
        <div style={{ position: 'relative', marginLeft: '8px' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{ width: '40px', height: '40px', borderRadius: '9999px', overflow: 'hidden', border: '2px solid rgba(0,36,70,0.1)', cursor: 'pointer', background: 'none', padding: 0 }}
          >
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={displayName} src={user.photoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#1a3a5f', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
                {initials}
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div style={{
              position: 'absolute', top: '48px', right: 0, width: '240px',
              backgroundColor: '#ffffff', borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9',
              padding: '8px', zIndex: 50,
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                <p style={{ fontWeight: 700, color: '#1a3a5f', fontSize: '14px' }}>{displayName}</p>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{user?.email}</p>
                <span style={{
                  display: 'inline-block', marginTop: '8px', padding: '2px 8px',
                  backgroundColor: profile?.role === 'owner' ? '#d3e3ff' : '#b1f0ce',
                  color: profile?.role === 'owner' ? '#001c39' : '#002114',
                  fontSize: '11px', fontWeight: 700, borderRadius: '9999px', textTransform: 'capitalize',
                }}>
                  {profile?.role || 'seeker'}
                </span>
              </div>
              <button
                onClick={() => { setShowMenu(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
                Profile
              </button>
              <button
                onClick={() => { setShowMenu(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
                Settings
              </button>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                <button
                  onClick={() => { setShowMenu(false); logout(); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', fontSize: '14px', fontWeight: 600, textAlign: 'left' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
