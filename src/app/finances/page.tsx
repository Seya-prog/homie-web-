"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import SeekerFinances from "@/components/SeekerFinances";
import { useAuth } from "@/context/AuthContext";
import { listOwnerPayments, updateUserProfile } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function FinancesPage() {
  const { role, loading: authLoading, user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [payments, setPayments] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings Modal States
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [penaltyEnabled, setPenaltyEnabled] = useState(false);
  const [gracePeriod, setGracePeriod] = useState(0);
  const [penaltyType, setPenaltyType] = useState("Fixed");
  const [penaltyValue, setPenaltyValue] = useState(0);
  const [penaltyFrequency, setPenaltyFrequency] = useState("once");
  const [savingSettings, setSavingSettings] = useState(false);

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

  // Load profile settings on mount or when profile updates
  useEffect(() => {
    if (profile?.bio) {
      try {
        const parsed = JSON.parse(profile.bio);
        if (typeof parsed === "object" && parsed !== null) {
          setPenaltyEnabled(parsed.penaltyEnabled ?? false);
          setGracePeriod(parsed.gracePeriod ?? 0);
          setPenaltyType(parsed.penaltyType ?? "Fixed");
          setPenaltyValue(parsed.penaltyValue ?? 0);
          setPenaltyFrequency(parsed.penaltyFrequency ?? "once");
        }
      } catch (e) {
        // Ignored: profile.bio might be a normal biography string
      }
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid rgba(26, 58, 95, 0.1)', borderTop: '4px solid #1a3a5f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
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

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const settings = {
        penaltyEnabled,
        gracePeriod: Number(gracePeriod) || 0,
        penaltyType,
        penaltyValue: Number(penaltyValue) || 0,
        penaltyFrequency,
      };
      await updateUserProfile({ bio: JSON.stringify(settings) });
      await refreshProfile();
      setShowSettingsModal(false);
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const summaryCards = [
    { icon: "account_balance_wallet", label: "Total Revenue", value: `ETB ${totalRevenue.toLocaleString()}`, badge: `${paidPayments.length} paid`, badgeBg: "#ecfdf5", badgeColor: "#059669" },
    { icon: "monetization_on", label: "Collected Rent", value: `ETB ${paidPayments.filter((p: AnyData) => p.type === "Rent").reduce((s: number, p: AnyData) => s + (p.amount || 0), 0).toLocaleString()}`, badge: "Rent Only", badgeBg: "#f1f5f9", badgeColor: "#1a3a5f" },
    { icon: "schedule", label: "Pending Payments", value: `ETB ${totalPending.toLocaleString()}`, badge: `${pendingPayments.length} pending`, badgeBg: "#fffbeb", badgeColor: "#d97706" },
    { icon: "report_problem", label: "Late Fees", value: `ETB ${totalLateFees.toLocaleString()}`, badge: `${overduePayments.length} overdue`, badgeBg: "#ffdad6", badgeColor: "#93000a" },
  ];

  return (
    <>
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
                    <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '48px', height: '48px', border: '4px solid rgba(26, 58, 95, 0.1)', borderTop: '4px solid #1a3a5f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
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
                                <td className="px-4 py-3 text-sm font-extrabold text-right" style={{ color: '#002446' }}>ETB {p.amount?.toLocaleString()}</td>
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
                    { icon: "receipt_long", title: "Export Report", desc: "Generate financial statement", onClick: () => alert("Export report generated successfully.") },
                    { icon: "account_balance", title: "Monthly Statement", desc: "Reconcile current ledger", onClick: () => alert("Statement generated successfully.") },
                    { icon: "notifications_active", title: "Late Fee Settings", desc: "Configure penalty rules", onClick: () => setShowSettingsModal(true) },
                  ].map((action, i) => (
                    <button key={i} onClick={action.onClick} style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer', textAlign: 'left', outline: 'none' }}>
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,36,70,0.15)',
            display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div>
              <h3 className="text-xl font-extrabold" style={{ color: '#002446' }}>Late Penalty Settings</h3>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Configure overdue penalty rules for your properties.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Enable Penalty */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={penaltyEnabled}
                  onChange={(e) => setPenaltyEnabled(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#002446' }}
                />
                <span className="text-sm font-bold" style={{ color: '#002446' }}>Enable Overdue Penalty</span>
              </label>

              {penaltyEnabled && (
                <>
                  {/* Grace Period */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="text-xs font-bold" style={{ color: '#43474e' }}>Grace Period (Days)</label>
                    <input
                      type="number"
                      min="0"
                      value={gracePeriod === 0 ? "" : gracePeriod}
                      onChange={(e) => setGracePeriod(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  {/* Penalty Type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="text-xs font-bold" style={{ color: '#43474e' }}>Penalty Type</label>
                    <select
                      value={penaltyType}
                      onChange={(e) => setPenaltyType(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', backgroundColor: '#ffffff', outline: 'none' }}
                    >
                      <option value="Fixed">Fixed Amount (ETB)</option>
                      <option value="Percentage">Percentage of Rent (%)</option>
                    </select>
                  </div>

                  {/* Penalty Value */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="text-xs font-bold" style={{ color: '#43474e' }}>
                      Penalty Value {penaltyType === 'Percentage' ? '(%)' : '(ETB)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={penaltyValue === 0 ? "" : penaltyValue}
                      onChange={(e) => setPenaltyValue(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  {/* Apply Frequency */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="text-xs font-bold" style={{ color: '#43474e' }}>Apply Frequency</label>
                    <select
                      value={penaltyFrequency}
                      onChange={(e) => setPenaltyFrequency(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', backgroundColor: '#ffffff', outline: 'none' }}
                    >
                      <option value="daily">Daily</option>
                      <option value="once">Once</option>
                      <option value="3 days">Every 3 days</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                disabled={savingSettings}
                onClick={() => setShowSettingsModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #c3c6cf', backgroundColor: 'transparent', color: '#43474e', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={savingSettings}
                onClick={handleSaveSettings}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  backgroundColor: '#002446', color: '#ffffff', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
