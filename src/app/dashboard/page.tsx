"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import OwnerDashboard from "@/components/OwnerDashboard";
import SeekerDashboard from "@/components/SeekerDashboard";

type Role = "owner" | "seeker";

export default function DashboardPage() {
  // ✅ Change role here: "owner" for property owner, "seeker" for tenant
  const [role] = useState<Role>("owner");

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={role} activePage="Dashboard" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <DashboardHeader />

        {role === "owner" ? <OwnerDashboard /> : <SeekerDashboard />}
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
