"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { listTenantMaintenanceRequests, createMaintenanceRequest, listTenantLeases } from "@/lib/dataService";
import { uploadMaintenancePhoto } from "@/lib/storage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function SeekerMaintenance() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AnyData[]>([]);
  const [leases, setLeases] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", category: "Other", propertyId: "" });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([listTenantMaintenanceRequests(), listTenantLeases()])
      .then(([r, l]) => { setRequests(r); setLeases(l); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const activeLeases = leases.filter((l: AnyData) => l.status === "Active" || l.status === "Pending");
  const filtered = filter === "All" ? requests : requests.filter((r: AnyData) => r.status === filter);

  const handleSubmit = async () => {
    if (!user || !form.title || !form.propertyId) return;
    setSubmitting(true);
    try {
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        photoUrls = await Promise.all(photoFiles.map(f => uploadMaintenancePhoto(f, "new")));
      }
      await createMaintenanceRequest({
        propertyId: form.propertyId,
        title: form.title, description: form.description,
        priority: form.priority, category: form.category, photos: photoUrls,
      });
      const updated = await listTenantMaintenanceRequests();
      setRequests(updated);
      setShowForm(false);
      setForm({ title: "", description: "", priority: "Medium", category: "Other", propertyId: "" });
      setPhotoFiles([]);
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const priorityColor = (p: string) => ({ Urgent: { bg: '#ffdad6', text: '#93000a' }, High: { bg: '#ffdcc3', text: '#914d00' }, Medium: { bg: '#d3e3ff', text: '#002446' }, Low: { bg: '#e7e8e9', text: '#43474e' } }[p] || { bg: '#e7e8e9', text: '#43474e' });
  const statusColor = (s: string) => ({ New: { bg: '#d3e3ff', text: '#002446' }, "In Progress": { bg: '#ffdcc3', text: '#914d00' }, Completed: { bg: 'rgba(177,240,206,0.3)', text: '#002a1a' }, Canceled: { bg: '#e7e8e9', text: '#64748b' } }[s] || { bg: '#e7e8e9', text: '#43474e' });

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
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#002446' }}>Maintenance Requests</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2" style={{ padding: '12px 24px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
          <h3 className="text-lg font-bold" style={{ color: '#002446', marginBottom: '20px' }}>Submit a Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#43474e', marginBottom: '6px' }}>Property *</label>
              <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', backgroundColor: '#f8f9fa' }}>
                <option value="">Select property</option>
                {activeLeases.map((l: AnyData) => (
                  <option key={l.property?.id} value={l.property?.id}>{l.property?.title || l.property?.address}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#43474e', marginBottom: '6px' }}>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief description" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#43474e', marginBottom: '6px' }}>Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', backgroundColor: '#f8f9fa' }}>
                {["Low", "Medium", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#43474e', marginBottom: '6px' }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', backgroundColor: '#f8f9fa' }}>
                {["Plumbing", "Electrical", "HVAC", "Appliance", "Structural", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#43474e', marginBottom: '6px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the issue in detail..." style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div className="md:col-span-2">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#43474e', marginBottom: '6px' }}>Photos</label>
              <input type="file" accept="image/*" multiple onChange={e => setPhotoFiles(Array.from(e.target.files || []))} style={{ fontSize: '14px' }} />
              {photoFiles.length > 0 && <p className="text-xs mt-1" style={{ color: '#64748b' }}>{photoFiles.length} file(s) selected</p>}
            </div>
          </div>
          <button onClick={handleSubmit} disabled={submitting || !form.title || !form.propertyId} style={{ marginTop: '20px', padding: '12px 32px', backgroundColor: submitting ? '#64748b' : '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap" style={{ gap: '8px' }}>
        {["All", "New", "In Progress", "Completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, backgroundColor: filter === f ? '#002446' : '#e7e8e9', color: filter === f ? '#ffffff' : '#43474e' }}>{f}</button>
        ))}
      </div>

      {/* Request List */}
      {filtered.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>handyman</span>
          <h3 className="text-lg font-bold" style={{ color: '#002446', marginTop: '16px' }}>No Requests</h3>
          <p style={{ color: '#64748b', marginTop: '8px' }}>
            {filter === "All" ? "You haven't submitted any maintenance requests yet." : `No ${filter.toLowerCase()} requests.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((req: AnyData) => {
            const pc = priorityColor(req.priority);
            const sc = statusColor(req.status);
            return (
              <div key={req.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: `4px solid ${pc.text}` }}>
                <div className="flex flex-wrap items-start justify-between" style={{ gap: '12px' }}>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold truncate" style={{ color: '#191c1d' }}>{req.title}</h4>
                    <p className="text-sm truncate" style={{ color: '#64748b', marginTop: '2px' }}>{req.property?.title || req.property?.address}</p>
                    {req.description && <p className="text-sm mt-2 line-clamp-2" style={{ color: '#43474e' }}>{req.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
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
                <div className="flex items-center justify-between mt-3" style={{ color: '#9ca3af', fontSize: '11px' }}>
                  <span>{req.category || 'Other'}</span>
                  <span>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
