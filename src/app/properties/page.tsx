"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { listMyProperties } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function PropertiesPage() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    listMyProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
      </div>
    );
  }
  if (!user) return null;

  const currentRole = role || "seeker";
  const filtered = filter === "All" ? properties : properties.filter((p: AnyData) => p.status === filter);
  const statusStyle = (s: string) => ({
    Rented: { bg: '#002a1a', color: '#ffffff' }, Available: { bg: '#d3e3ff', color: '#002446' },
    Pending: { bg: '#ffdcc3', color: '#914d00' }, Maintenance: { bg: '#ffdad6', color: '#93000a' },
  }[s] || { bg: '#e7e8e9', color: '#43474e' });

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={currentRole} activePage="Properties" />
      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <DashboardHeader />
        <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between" style={{ gap: '16px' }}>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#002446' }}>Properties</h2>
              <p className="text-sm" style={{ color: '#64748b' }}>{properties.length} total propert{properties.length !== 1 ? 'ies' : 'y'}</p>
            </div>
            <Link href="/properties/new" className="flex items-center gap-2"
              style={{ padding: '12px 24px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
              Add Property
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {["All", "Available", "Rented", "Pending", "Maintenance"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, backgroundColor: filter === f ? '#002446' : '#e7e8e9', color: filter === f ? '#ffffff' : '#43474e' }}>{f}</button>
            ))}
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>home_work</span>
              <h3 className="text-lg font-bold" style={{ color: '#002446', marginTop: '16px' }}>
                {filter === "All" ? "No properties yet" : `No ${filter.toLowerCase()} properties`}
              </h3>
              <p style={{ color: '#64748b', marginTop: '8px' }}>
                {filter === "All" ? "Add your first property to get started." : "Try changing the filter."}
              </p>
              {filter === "All" && (
                <Link href="/properties/new" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 32px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
                  Add Property
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: '24px' }}>
              {filtered.map((prop: AnyData) => {
                const ss = statusStyle(prop.status);
                return (
                  <Link href={`/properties/${prop.id}`} key={prop.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} className="hover:scale-[1.02]">
                      {/* Image */}
                      <div style={{ position: 'relative', height: '200px', backgroundColor: '#f3f4f5' }}>
                        {prop.photos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={prop.title} src={prop.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>home</span>
                          </div>
                        )}
                        <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', fontSize: '10px', fontWeight: 700, borderRadius: '6px', backgroundColor: ss.bg, color: ss.color, textTransform: 'uppercase' }}>{prop.status}</span>
                      </div>
                      {/* Info */}
                      <div style={{ padding: '20px' }}>
                        <h3 className="text-lg font-bold truncate" style={{ color: '#002446' }}>{prop.title}</h3>
                        <p className="text-sm truncate" style={{ color: '#64748b', marginTop: '2px' }}>{prop.address}, {prop.city}, {prop.state}</p>
                        <div className="flex items-center flex-wrap" style={{ gap: '16px', marginTop: '16px' }}>
                          <span className="text-xl font-extrabold" style={{ color: '#002446' }}>${prop.monthlyRent?.toLocaleString()}<span className="text-xs font-normal" style={{ color: '#9ca3af' }}>/mo</span></span>
                        </div>
                        <div className="flex flex-wrap" style={{ gap: '8px', marginTop: '12px' }}>
                          <span className="text-xs font-bold px-3 py-1" style={{ backgroundColor: '#f3f4f5', borderRadius: '6px', color: '#43474e' }}>{prop.bedrooms} bed</span>
                          <span className="text-xs font-bold px-3 py-1" style={{ backgroundColor: '#f3f4f5', borderRadius: '6px', color: '#43474e' }}>{prop.bathrooms} bath</span>
                          <span className="text-xs font-bold px-3 py-1" style={{ backgroundColor: '#f3f4f5', borderRadius: '6px', color: '#43474e' }}>{prop.squareFootage?.toLocaleString()} sqft</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
