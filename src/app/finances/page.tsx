"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import SeekerFinances from "@/components/SeekerFinances";
import { useAuth } from "@/context/AuthContext";
import { listOwnerPayments } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function FinancesPage() {
  const { role, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [payments, setPayments] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || role !== "owner") { setLoading(false); return; }
    listOwnerPayments()
      .then(setPayments)
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
  const paidPayments = payments.filter((p: AnyData) => p.status === "Paid");
  const pendingPayments = payments.filter((p: AnyData) => p.status === "Pending");
  const overduePayments = payments.filter((p: AnyData) => p.status === "Overdue");
  const totalRevenue = paidPayments.reduce((s: number, p: AnyData) => s + (p.amount || 0), 0);
  const totalPending = pendingPayments.reduce((s: number, p: AnyData) => s + (p.amount || 0), 0);
  const totalLateFees = payments.reduce((s: number, p: AnyData) => s + (p.lateFee || 0), 0);

  const summaryCards = [
    { icon: "account_balance_wallet", label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, badge: `${paidPayments.length} paid`, badgeBg: "#ecfdf5", badgeColor: "#059669" },
    { icon: "monetization_on", label: "Collected Rent", value: `$${paidPayments.filter((p: AnyData) => p.type === "Rent").reduce((s: number, p: AnyData) => s + (p.amount || 0), 0).toLocaleString()}`, badge: "Rent Only", badgeBg: "#f1f5f9", badgeColor: "#1a3a5f" },
    { icon: "schedule", label: "Pending Payments", value: `$${totalPending.toLocaleString()}`, badge: `${pendingPayments.length} pending`, badgeBg: "#fffbeb", badgeColor: "#d97706" },
    { icon: "report_problem", label: "Late Fees", value: `$${totalLateFees.toLocaleString()}`, badge: `${overduePayments.length} overdue`, badgeBg: "#ffdad6", badgeColor: "#93000a" },
  ];

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={currentRole} activePage="Finances" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        {currentRole === "seeker" ? (
          <>
            <DashboardHeader />
            <SeekerFinances />
          </>
        ) : (
          <>
            {/* Owner Header */}
            <header style={{
              position: 'sticky', top: 0, zIndex: 30,
              backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)',
              borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0 32px', height: '80px', flexWrap: 'wrap', gap: '8px',
            }}>
              <div className="flex items-center" style={{ gap: '32px' }}>
                <span className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1a3a5f' }}>Finances</span>
              </div>
              <nav className="flex items-center overflow-x-auto" style={{ gap: '24px', height: '100%' }}>
                {["Overview", "Revenue", "Expenses"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    height: '100%', borderBottom: activeTab === tab ? '3px solid #002446' : '3px solid transparent',
                    color: activeTab === tab ? '#002446' : '#9ca3af',
                    fontWeight: activeTab === tab ? 800 : 500,
                    fontSize: '14px', background: 'none', border: 'none', borderBottomWidth: '3px', borderBottomStyle: 'solid',
                    borderBottomColor: activeTab === tab ? '#002446' : 'transparent',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>{tab}</button>
                ))}
              </nav>
            </header>

            {/* Owner Content */}
            <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Summary Cards */}
              <section className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
                {summaryCards.map((card, i) => (
                  <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center" style={{ gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f3f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: '#1a3a5f', fontSize: '22px' }}>{card.icon}</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>{card.label}</span>
                    </div>
                    <p className="text-xl md:text-2xl font-extrabold" style={{ color: '#002446' }}>{card.value}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: card.badgeBg, color: card.badgeColor }}>{card.badge}</span>
                  </div>
                ))}
              </section>

              {/* Transactions Table */}
              <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 className="text-lg font-bold font-headline mb-4" style={{ color: '#002446' }}>Transaction History</h3>
                {loading ? (
                  <div style={{ padding: '48px', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                  </div>
                ) : payments.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>receipt_long</span>
                    <p style={{ color: '#64748b', marginTop: '12px' }}>No transactions recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ minWidth: '700px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <th className="text-[10px] uppercase tracking-widest font-black px-4 py-3" style={{ color: '#9ca3af' }}>Property</th>
                          <th className="text-[10px] uppercase tracking-widest font-black px-4 py-3" style={{ color: '#9ca3af' }}>Tenant</th>
                          <th className="text-[10px] uppercase tracking-widest font-black px-4 py-3" style={{ color: '#9ca3af' }}>Type</th>
                          <th className="text-[10px] uppercase tracking-widest font-black px-4 py-3" style={{ color: '#9ca3af' }}>Date</th>
                          <th className="text-[10px] uppercase tracking-widest font-black px-4 py-3 text-right" style={{ color: '#9ca3af' }}>Amount</th>
                          <th className="text-[10px] uppercase tracking-widest font-black px-4 py-3 text-right" style={{ color: '#9ca3af' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p: AnyData) => {
                          const ss = { Paid: { bg: '#ecfdf5', color: '#059669' }, Pending: { bg: '#fffbeb', color: '#d97706' }, Overdue: { bg: '#ffdad6', color: '#ba1a1a' } }[p.status as string] || { bg: '#e7e8e9', color: '#64748b' };
                          return (
                            <tr key={p.id} className="hover:bg-[#f9fafb] transition-colors" style={{ borderBottom: '1px solid #f8fafc' }}>
                              <td className="px-4 py-3 text-sm font-bold truncate" style={{ maxWidth: '150px' }}>{p.lease?.property?.title || '—'}</td>
                              <td className="px-4 py-3 text-sm" style={{ color: '#64748b' }}>{p.payer?.displayName || '—'}</td>
                              <td className="px-4 py-3 text-sm" style={{ color: '#64748b' }}>{p.type}</td>
                              <td className="px-4 py-3 text-sm" style={{ color: '#64748b' }}>
                                {p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                              </td>
                              <td className="px-4 py-3 text-sm font-extrabold text-right" style={{ color: '#002446' }}>${p.amount?.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right">
                                <span style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '4px', backgroundColor: ss.bg, color: ss.color }}>{p.status}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Quick Actions */}
              <section className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '16px' }}>
                {[
                  { icon: "receipt_long", title: "Export Report", desc: "Generate financial statement" },
                  { icon: "account_balance", title: "Monthly Statement", desc: "Reconcile current ledger" },
                  { icon: "notifications_active", title: "Late Fee Settings", desc: "Configure penalty rules" },
                ].map((action, i) => (
                  <button key={i} style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer', textAlign: 'left' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#1a3a5f', marginBottom: '8px', display: 'block' }}>{action.icon}</span>
                    <p className="text-sm font-bold" style={{ color: '#002446' }}>{action.title}</p>
                    <p className="text-xs" style={{ color: '#64748b', marginTop: '2px' }}>{action.desc}</p>
                  </button>
                ))}
              </section>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
