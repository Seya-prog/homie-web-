"use client";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import OwnerDashboard from "@/components/OwnerDashboard";
import SeekerDashboard from "@/components/SeekerDashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { role, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto', width: '48px', height: '48px', border: '4px solid rgba(26, 58, 95, 0.1)', borderTop: '4px solid #1a3a5f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: '#64748b', fontWeight: 500 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentRole = role || "seeker";

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={currentRole} activePage="Dashboard" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <DashboardHeader />

        {currentRole === "owner" ? <OwnerDashboard /> : <SeekerDashboard />}
      </div>

      {/* Contextual FAB (Mobile only) */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20 md:hidden"
        style={{ backgroundColor: '#002446', color: '#ffffff' }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'wght' 700" }}
        >
          add
        </span>
      </button>
    </div>
  );
}
