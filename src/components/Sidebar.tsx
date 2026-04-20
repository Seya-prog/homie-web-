"use client";

import { useState } from "react";
import Link from "next/link";

type Role = "owner" | "seeker";

interface SidebarProps {
  role: Role;
  activePage?: string;
}

const ownerNavItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "domain", label: "My Properties", href: "/properties" },
  { icon: "assignment_ind", label: "Applications", href: "/applications" },
  { icon: "build", label: "Maintenance", href: "/maintenance" },
  { icon: "account_balance_wallet", label: "Finances", href: "/finances" },
];

const seekerNavItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "description", label: "Leases", href: "/leases" },
  { icon: "build", label: "Maintenance", href: "/maintenance" },
  { icon: "account_balance_wallet", label: "Finances", href: "/finances" },
];

export default function Sidebar({ role, activePage = "Dashboard" }: SidebarProps) {
  const [active, setActive] = useState(activePage);
  const navItems = role === "owner" ? ownerNavItems : seekerNavItems;

  return (
    <aside
      className="hidden md:flex flex-col"
      style={{
        position: 'sticky',
        top: 0,
        width: '256px',
        height: '100vh',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #f1f5f9',
        padding: '24px 16px',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: '32px', paddingLeft: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1
            className="font-headline"
            style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3a5f', letterSpacing: '-0.025em' }}
          >
            Homie Management
          </h1>
        </Link>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Premium Estate Portal
        </p>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setActive(item.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                color: isActive ? '#1a3a5f' : '#64748b',
                backgroundColor: isActive ? '#f8fafc' : 'transparent',
                fontWeight: isActive ? 700 : 600,
                borderRight: isActive ? '4px solid #1a3a5f' : '4px solid transparent',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-headline" style={{ fontSize: '14px' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {role === "owner" && (
          <Link
            href="/properties/new"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#002446',
              color: '#ffffff',
              textDecoration: 'none',
              marginBottom: '12px',
              transition: 'opacity 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ffffff' }}>add</span>
            Add Property
          </Link>
        )}
        <Link
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: '#64748b',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-headline" style={{ fontSize: '14px', fontWeight: 600 }}>Support</span>
        </Link>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: '#64748b',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-headline" style={{ fontSize: '14px', fontWeight: 600 }}>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
