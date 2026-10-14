"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { listTenantPayments, listTenantLeases } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function SeekerFinances() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<AnyData[]>([]);
  const [leases, setLeases] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user) return;
    Promise.all([listTenantPayments(), listTenantLeases()])
      .then(([p, l]) => { setPayments(p); setLeases(l); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const activeLease = leases.find((l: AnyData) => l.status === "Active");
  const paidPayments = payments.filter((p: AnyData) => p.status === "Paid");
  const pendingPayments = payments.filter((p: AnyData) => p.status === "Pending");
  const overduePayments = payments.filter((p: AnyData) => p.status === "Overdue");
  const totalPaid = paidPayments.reduce((s: number, p: AnyData) => s + (p.amount || 0), 0);
  const nextPayment = pendingPayments[0];
  const filtered = filter === "All" ? payments : payments.filter((p: AnyData) => p.status === filter);

  const statusStyle = (s: string) => ({ Paid: { bg: 'rgba(177,240,206,0.3)', color: '#002a1a' }, Pending: { bg: '#d3e3ff', color: '#002446' }, Overdue: { bg: '#ffdad6', color: '#93000a' }, Failed: { bg: '#e7e8e9', color: '#64748b' } }[s] || { bg: '#e7e8e9', color: '#43474e' });

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
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#9ca3af' }}>Total Paid</span>
          <p className="text-2xl font-extrabold mt-2" style={{ color: '#002a1a' }}>ETB {totalPaid.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#9ca3af' }}>Monthly Rent</span>
          <p className="text-2xl font-extrabold mt-2" style={{ color: '#002446' }}>ETB {activeLease?.monthlyRent?.toLocaleString() || '0'}</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#9ca3af' }}>Pending</span>
          <p className="text-2xl font-extrabold mt-2" style={{ color: '#002446' }}>{pendingPayments.length}</p>
        </div>
        <div style={{ backgroundColor: overduePayments.length > 0 ? '#ffdad6' : '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="text-xs uppercase font-bold tracking-wider" style={{ color: overduePayments.length > 0 ? '#93000a' : '#9ca3af' }}>Overdue</span>
          <p className="text-2xl font-extrabold mt-2" style={{ color: overduePayments.length > 0 ? '#93000a' : '#002446' }}>{overduePayments.length}</p>
        </div>
      </div>

      {/* Next Payment Banner */}
      {nextPayment && (
        <div style={{ background: 'linear-gradient(135deg, #002446, #1a3a5f)', borderRadius: '12px', padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#abc8f5' }}>Next Payment Due</p>
            <p className="text-3xl font-extrabold" style={{ color: '#ffffff', marginTop: '4px' }}>ETB {nextPayment.amount?.toLocaleString()}</p>
            <p className="text-sm" style={{ color: '#87a4cf', marginTop: '4px' }}>
              {nextPayment.dueDate ? new Date(nextPayment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}
            </p>
          </div>
          <button style={{ padding: '14px 32px', backgroundColor: '#ffffff', color: '#002446', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
            Pay Now
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between" style={{ gap: '12px' }}>
        <h3 className="text-lg font-bold font-headline" style={{ color: '#002446' }}>Payment History</h3>
        <div className="flex flex-wrap" style={{ gap: '8px' }}>
          {["All", "Paid", "Pending", "Overdue"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, backgroundColor: filter === f ? '#002446' : '#e7e8e9', color: filter === f ? '#ffffff' : '#43474e' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      {filtered.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>payments</span>
          <h3 className="text-lg font-bold" style={{ color: '#002446', marginTop: '16px' }}>No Payments</h3>
          <p style={{ color: '#64748b', marginTop: '8px' }}>
            {filter === "All" ? "No payment records found." : `No ${filter.toLowerCase()} payments.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table className="w-full text-left" style={{ minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4" style={{ color: '#9ca3af' }}>Type</th>
                <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4" style={{ color: '#9ca3af' }}>Property</th>
                <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4" style={{ color: '#9ca3af' }}>Due Date</th>
                <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4 text-right" style={{ color: '#9ca3af' }}>Amount</th>
                <th className="text-[10px] uppercase tracking-widest font-black px-6 py-4 text-right" style={{ color: '#9ca3af' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: AnyData) => {
                const ss = statusStyle(p.status);
                return (
                  <tr key={p.id} className="hover:bg-[#f9fafb] transition-colors" style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: '#191c1d' }}>{p.type}</td>
                    <td className="px-6 py-4 text-sm truncate" style={{ color: '#64748b', maxWidth: '200px' }}>{p.lease?.property?.title || '—'}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                      {p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-extrabold" style={{ color: '#002446' }}>ETB {p.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backgroundColor: ss.bg, color: ss.color }}>{p.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
