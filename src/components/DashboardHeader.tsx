"use client";

import Link from "next/link";

interface DashboardHeaderProps {
  activeTab?: string;
}

export default function DashboardHeader({ activeTab = "Owner View" }: DashboardHeaderProps) {
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
          <Link href="#" className="font-headline" style={{ fontWeight: 500, color: '#94a3b8', borderBottom: '2px solid transparent', paddingBottom: '4px', textDecoration: 'none' }}>
            Reports
          </Link>
        </nav>
      </div>
      <div className="flex items-center" style={{ gap: '8px' }}>
        <button className="p-2 rounded-full transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 rounded-full transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div style={{ width: '40px', height: '40px', borderRadius: '9999px', overflow: 'hidden', border: '2px solid rgba(0,36,70,0.1)', marginLeft: '8px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_zRKGxmOjGghpmuhRqcEiEcwY0YCKPV-7NLkmv6bgfElEIPxV1kdbf8P1STZkLfoaCDlC7j44vpRIVpb-oGjQIEnE83Ityal7z2UXvDgpbChwp7THCeDOF2yOZaK4z-rP8q_d0Gbhr-qWKg93pRxgNVRZIPHT08VJnoay66PGWzw51KuuZRvbDS7N8JMim2E7N36Q28dOU8rLOnFK_lpzrA39zM175ufnkU-wD4-ZOQO9fdkNYUBSsYpH3R6H4XllGLYyC_R87DRL"
          />
        </div>
      </div>
    </header>
  );
}
