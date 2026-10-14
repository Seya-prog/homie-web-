"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { listTenantLeases, listOwnerLeases } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function LeasesPage() {
  const { role, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [leases, setLeases] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    const fetcher = role === "owner" ? listOwnerLeases : listTenantLeases;
    fetcher()
      .then(setLeases)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, role]);

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
      </div>
    );
  }
  if (!user) return null;

  const currentRole = role || "seeker";
  const filtered = filter === "All" ? leases : leases.filter((l: AnyData) => l.status === filter);
  const statusStyle = (s: string) => ({
    Active: { bg: 'rgba(177,240,206,0.3)', color: '#002a1a' },
    Pending: { bg: '#d3e3ff', color: '#002446' },
    Ended: { bg: '#e7e8e9', color: '#64748b' },
    Terminated: { bg: '#ffdad6', color: '#93000a' },
  }[s] || { bg: '#e7e8e9', color: '#43474e' });

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={currentRole} activePage="Leases" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <DashboardHeader />

        <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between" style={{ gap: '16px' }}>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#002446' }}>Leases</h2>
              <p className="text-sm" style={{ color: '#64748b' }}>{leases.length} total lease{leases.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px' }}>
            {[
              { label: "Active", value: leases.filter((l: AnyData) => l.status === "Active").length, color: '#002a1a', bg: 'rgba(177,240,206,0.3)' },
              { label: "Pending", value: leases.filter((l: AnyData) => l.status === "Pending").length, color: '#002446', bg: '#d3e3ff' },
              { label: "Monthly Income", value: `ETB ${leases.filter((l: AnyData) => l.status === "Active").reduce((s: number, l: AnyData) => s + (l.monthlyRent || 0), 0).toLocaleString()}`, color: '#002446', bg: '#ffffff' },
              { label: "Ended", value: leases.filter((l: AnyData) => l.status === "Ended").length, color: '#64748b', bg: '#e7e8e9' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: stat.bg, borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#9ca3af' }}>{stat.label}</span>
                <p className="text-2xl font-extrabold mt-2" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {["All", "Active", "Pending", "Ended"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, backgroundColor: filter === f ? '#002446' : '#e7e8e9', color: filter === f ? '#ffffff' : '#43474e' }}>{f}</button>
            ))}
          </div>

          {/* Leases List */}
          {loading ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>description</span>
              <h3 className="text-lg font-bold" style={{ color: '#002446', marginTop: '16px' }}>
                {filter === "All" ? "No leases found" : `No ${filter.toLowerCase()} leases`}
              </h3>
              <p style={{ color: '#64748b', marginTop: '8px' }}>
                {currentRole === "seeker" ? "Apply for a property to start a lease." : "Create a lease for one of your properties."}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.map((lease: AnyData) => {
                const ss = statusStyle(lease.status);
                const otherParty = currentRole === "owner" ? lease.tenant : lease.owner;
                return (
                  <div key={lease.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between" style={{ gap: '16px' }}>
                      <div className="flex items-center" style={{ gap: '16px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f3f4f5' }}>
                          {lease.property?.photos?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img alt="" src={lease.property.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#c3c6cf' }}>home</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold truncate" style={{ color: '#002446' }}>{lease.property?.title || "Property"}</h3>
                          <p className="text-sm truncate" style={{ color: '#64748b' }}>{lease.property?.address}, {lease.property?.city}</p>
                        </div>
                      </div>
                      <span style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 700, borderRadius: '6px', textTransform: 'uppercase', backgroundColor: ss.bg, color: ss.color, alignSelf: 'flex-start' }}>{lease.status}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>Monthly Rent</span>
                        <p className="text-lg font-extrabold" style={{ color: '#002446' }}>ETB {lease.monthlyRent?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>Start Date</span>
                        <p className="text-sm font-bold" style={{ color: '#002446' }}>{lease.startDate ? new Date(lease.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>End Date</span>
                        <p className="text-sm font-bold" style={{ color: '#002446' }}>{lease.endDate ? new Date(lease.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>{currentRole === "owner" ? "Tenant" : "Landlord"}</span>
                        <p className="text-sm font-bold truncate" style={{ color: '#002446' }}>{otherParty?.displayName || '—'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
