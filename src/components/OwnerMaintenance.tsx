"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { listOwnerMaintenanceRequests, updateMaintenanceRequest } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function OwnerMaintenance() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user) return;
    listOwnerMaintenanceRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === "All" ? requests : requests.filter((r: AnyData) => r.status === filter);
  const counts = { all: requests.length, new: requests.filter((r: AnyData) => r.status === "New").length, inProgress: requests.filter((r: AnyData) => r.status === "In Progress").length, completed: requests.filter((r: AnyData) => r.status === "Completed").length };
  const priorityColor = (p: string) => ({ Urgent: { bg: '#ffdad6', text: '#93000a', border: '#ba1a1a' }, High: { bg: '#ffdcc3', text: '#914d00', border: '#fc9430' }, Medium: { bg: '#d3e3ff', text: '#002446', border: '#002446' }, Low: { bg: '#e7e8e9', text: '#43474e', border: '#9ca3af' } }[p] || { bg: '#e7e8e9', text: '#43474e', border: '#9ca3af' });
  const statusColor = (s: string) => ({ New: { bg: '#d3e3ff', text: '#002446' }, "In Progress": { bg: '#ffdcc3', text: '#914d00' }, Completed: { bg: 'rgba(177,240,206,0.3)', text: '#002a1a' }, Canceled: { bg: '#e7e8e9', text: '#64748b' } }[s] || { bg: '#e7e8e9', text: '#43474e' });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateMaintenanceRequest(id, { status });
      setRequests(prev => prev.map((r: AnyData) => r.id === id ? { ...r, status } : r));
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between" style={{ gap: '16px' }}>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#002446' }}>Maintenance</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>Manage tenant service requests across all properties</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px' }}>
        {[
          { label: "Total", value: counts.all, icon: "build", color: '#002446' },
          { label: "New", value: counts.new, icon: "fiber_new", color: '#002446' },
          { label: "In Progress", value: counts.inProgress, icon: "pending", color: '#914d00' },
          { label: "Completed", value: counts.completed, icon: "check_circle", color: '#002a1a' },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: stat.color }}>{stat.icon}</span>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#9ca3af' }}>{stat.label}</span>
            </div>
            <p className="text-2xl font-extrabold mt-2" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap" style={{ gap: '8px' }}>
        {["All", "New", "In Progress", "Completed", "Canceled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, backgroundColor: filter === f ? '#002446' : '#e7e8e9', color: filter === f ? '#ffffff' : '#43474e' }}>{f}</button>
        ))}
      </div>

      {/* Requests */}
      {filtered.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>check_circle</span>
          <h3 className="text-lg font-bold" style={{ color: '#002446', marginTop: '16px' }}>
            {filter === "All" ? "No maintenance requests yet" : `No ${filter.toLowerCase()} requests`}
          </h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((req: AnyData) => {
            const pc = priorityColor(req.priority);
            const sc = statusColor(req.status);
            return (
              <div key={req.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: `4px solid ${pc.border}` }}>
                <div className="flex flex-wrap items-start justify-between" style={{ gap: '12px' }}>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold truncate" style={{ color: '#191c1d' }}>{req.title}</h4>
                    <p className="text-sm" style={{ color: '#64748b', marginTop: '2px' }}>{req.property?.title} — {req.requester?.displayName}</p>
                    {req.description && <p className="text-sm mt-2" style={{ color: '#43474e' }}>{req.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap">
                    <span style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backgroundColor: pc.bg, color: pc.text }}>{req.priority}</span>
                    <span style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backgroundColor: sc.bg, color: sc.text }}>{req.status}</span>
                  </div>
                </div>
                {req.photos && req.photos.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {req.photos.map((p: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={p} alt="" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between flex-wrap mt-3" style={{ gap: '8px' }}>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}>{req.category || 'Other'} · {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}</span>
                  {req.status !== "Completed" && req.status !== "Canceled" && (
                    <div className="flex gap-2">
                      {req.status === "New" && (
                        <button onClick={() => handleStatusChange(req.id, "In Progress")} style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#002446', color: '#ffffff' }}>Start Work</button>
                      )}
                      {req.status === "In Progress" && (
                        <button onClick={() => handleStatusChange(req.id, "Completed")} style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#002a1a', color: '#ffffff' }}>Mark Complete</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
