"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { listOwnerApplications, updateApplication, listSeekerApplications } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function ApplicationsPage() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    const fetcher = role === "owner" ? listOwnerApplications : listSeekerApplications;
    fetcher()
      .then(setApplications)
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
  const filtered = filter === "All" ? applications : applications.filter((a: AnyData) => a.status === filter);
  const counts = {
    pending: applications.filter((a: AnyData) => a.status === "Pending").length,
    approved: applications.filter((a: AnyData) => a.status === "Approved").length,
    rejected: applications.filter((a: AnyData) => a.status === "Rejected").length,
  };

  const statusStyle = (s: string) => ({
    Pending: { bg: 'rgba(0,36,70,0.1)', color: '#002446' },
    Approved: { bg: 'rgba(0,42,26,0.1)', color: '#002a1a' },
    Rejected: { bg: 'rgba(255,218,214,0.3)', color: '#ba1a1a' },
    Screening: { bg: 'rgba(252,148,48,0.2)', color: '#663500' },
  }[s] || { bg: '#e7e8e9', color: '#43474e' });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateApplication(id, { status });
      setApplications(prev => prev.map((a: AnyData) => a.id === id ? { ...a, status } : a));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={currentRole} activePage="Applications" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <DashboardHeader />

        <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between" style={{ gap: '16px' }}>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#002446' }}>Applications</h2>
              <p className="text-sm" style={{ color: '#64748b' }}>{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px' }}>
            {[
              { label: "Total", value: applications.length, color: '#002446', border: '#002446' },
              { label: "Pending", value: counts.pending, color: '#002446', border: '#fc9430' },
              { label: "Approved", value: counts.approved, color: '#002a1a', border: '#002a1a' },
              { label: "Rejected", value: counts.rejected, color: '#ba1a1a', border: '#ba1a1a' },
            ].map(stat => (
              <div key={stat.label} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${stat.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#9ca3af' }}>{stat.label}</span>
                <p className="text-2xl font-extrabold mt-2" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {["All", "Pending", "Approved", "Rejected"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, backgroundColor: filter === f ? '#002446' : '#e7e8e9', color: filter === f ? '#ffffff' : '#43474e' }}>{f}</button>
            ))}
          </div>

          {/* Applications List */}
          {loading ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>description</span>
              <h3 className="text-lg font-bold" style={{ color: '#002446', marginTop: '16px' }}>
                {filter === "All" ? "No applications yet" : `No ${filter.toLowerCase()} applications`}
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto" style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <table className="w-full text-left" style={{ minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f3f4f5' }}>
                    <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4" style={{ color: '#9ca3af' }}>{currentRole === "owner" ? "Applicant" : "Property"}</th>
                    <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4" style={{ color: '#9ca3af' }}>{currentRole === "owner" ? "Property" : "Landlord"}</th>
                    <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4" style={{ color: '#9ca3af' }}>Message</th>
                    <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4" style={{ color: '#9ca3af' }}>Date</th>
                    <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4 text-right" style={{ color: '#9ca3af' }}>Status</th>
                    {currentRole === "owner" && <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4 text-right" style={{ color: '#9ca3af' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app: AnyData) => {
                    const ss = statusStyle(app.status);
                    return (
                      <tr key={app.id} className="hover:bg-[#f9fafb] transition-colors" style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div style={{ width: '36px', height: '36px', borderRadius: '9999px', backgroundColor: '#e7e8e9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {(currentRole === "owner" ? app.applicant?.photoURL : app.property?.photos?.[0]) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img alt="" src={currentRole === "owner" ? app.applicant?.photoURL : app.property?.photos?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#9ca3af' }}>{currentRole === "owner" ? "person" : "home"}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold" style={{ color: '#002446' }}>{currentRole === "owner" ? (app.applicant?.displayName || "Applicant") : (app.property?.title || "Property")}</p>
                              <p className="text-xs" style={{ color: '#64748b' }}>{currentRole === "owner" ? app.applicant?.email : `$${app.property?.monthlyRent?.toLocaleString()}/mo`}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                          {currentRole === "owner" ? (app.property?.title || "—") : (app.property?.owner?.displayName || "—")}
                        </td>
                        <td className="px-6 py-4 text-sm truncate" style={{ color: '#64748b', maxWidth: '200px' }}>{app.message || "—"}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span style={{ padding: '4px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '9999px', backgroundColor: ss.bg, color: ss.color }}>{app.status}</span>
                        </td>
                        {currentRole === "owner" && (
                          <td className="px-6 py-4 text-right">
                            {app.status === "Pending" && (
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => handleStatusChange(app.id, "Approved")} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#002a1a', color: '#ffffff' }}>Approve</button>
                                <button onClick={() => handleStatusChange(app.id, "Rejected")} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid #c3c6cf', cursor: 'pointer', backgroundColor: 'transparent', color: '#64748b' }}>Reject</button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
