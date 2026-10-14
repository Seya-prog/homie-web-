"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  listMyProperties,
  listOwnerLeases,
  listOwnerMaintenanceRequests,
  listOwnerPayments,
  listOwnerApplications,
} from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function OwnerDashboard() {
  const { user, profile } = useAuth();
  const [properties, setProperties] = useState<AnyData[]>([]);
  const [leases, setLeases] = useState<AnyData[]>([]);
  const [requests, setRequests] = useState<AnyData[]>([]);
  const [payments, setPayments] = useState<AnyData[]>([]);
  const [applications, setApplications] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      listMyProperties(),
      listOwnerLeases(),
      listOwnerMaintenanceRequests(),
      listOwnerPayments(),
      listOwnerApplications(),
    ])
      .then(([p, l, r, pay, apps]) => {
        setProperties(p);
        setLeases(l);
        setRequests(r);
        setPayments(pay);
        setApplications(apps);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const displayName = profile?.displayName || user?.displayName || "Owner";
  const activeLeases = leases.filter((l: AnyData) => l.status === "Active");
  const totalRevenue = payments
    .filter((p: AnyData) => p.status === "Paid")
    .reduce((sum: number, p: AnyData) => sum + (p.amount || 0), 0);
  const occupancyRate = properties.length > 0
    ? Math.round((activeLeases.length / properties.length) * 100)
    : 0;
  const urgentRequests = requests.filter((r: AnyData) => r.priority === "Urgent" || r.priority === "High");
  const pendingApps = applications.filter((a: AnyData) => a.status === "Pending");
  const recentPayments = payments.slice(0, 4);

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
    <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Section */}
      <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: '#002446' }}>
            Welcome back, {displayName.split(" ")[0]}
          </h2>
          <p style={{ color: '#43474e' }}>
            {properties.length > 0
              ? `You have ${properties.length} propert${properties.length > 1 ? 'ies' : 'y'} and ${activeLeases.length} active lease${activeLeases.length !== 1 ? 's' : ''}.`
              : "Start by adding your first property to build your portfolio."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/properties/new"
            className="px-6 py-3 font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
            style={{ backgroundColor: '#fc9430', color: '#663500', textDecoration: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_business</span>
            Add Property
          </Link>
        </div>
      </section>

      {/* Key Metrics Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
        {/* Total Revenue */}
        <div className="p-6 rounded-xl shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden" style={{ background: '#ffffff' }}>
          <div className="absolute bottom-0 left-0 right-0 h-1 transition-all" style={{ backgroundColor: 'rgba(0,36,70,0.1)' }} />
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#9ca3af' }}>Total Revenue</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tighter" style={{ color: '#002446' }}>ETB {totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Monthly From Active Leases */}
        <div className="p-6 rounded-xl shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden" style={{ background: '#ffffff' }}>
          <div className="absolute bottom-0 left-0 right-0 h-1 transition-all" style={{ backgroundColor: 'rgba(0,36,70,0.1)' }} />
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#9ca3af' }}>Monthly Income</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tighter" style={{ color: '#002446' }}>
              ETB {activeLeases.reduce((s: number, l: AnyData) => s + (l.monthlyRent || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="p-6 rounded-xl shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden" style={{ background: '#ffffff' }}>
          <div className="absolute bottom-0 left-0 right-0 h-1 transition-all" style={{ backgroundColor: 'rgba(0,36,70,0.1)' }} />
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#9ca3af' }}>Occupancy Rate</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tighter" style={{ color: '#002446' }}>{occupancyRate}%</span>
            <div style={{ width: '48px', height: '48px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="24" cy="24" fill="transparent" r="20" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="24" cy="24" fill="transparent" r="20" stroke="#002446" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * occupancyRate / 100)} strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Properties Summary */}
        <div className="p-6 rounded-xl shadow-xl flex flex-col justify-between" style={{ backgroundColor: '#002446' }}>
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#cbd5e1' }}>Properties</span>
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tighter" style={{ color: '#ffffff' }}>{properties.length}</span>
              <span className="text-sm font-medium" style={{ color: '#abc8f5' }}>Total Assets</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: 'rgba(26,58,95,0.6)', color: '#ffffff', borderRadius: '4px' }}>
                {properties.filter((p: AnyData) => p.status === "Rented").length} LEASED
              </span>
              <span className="px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: 'rgba(252,148,48,0.4)', color: '#ffffff', borderRadius: '4px' }}>
                {properties.filter((p: AnyData) => p.status === "Available").length} AVAILABLE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Tier: Alerts + Activity */}
      <section className="flex flex-col lg:flex-row" style={{ gap: '32px' }}>
        {/* Pending Tasks & Alerts */}
        <div className="lg:w-[40%] shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xl font-bold tracking-tight font-headline">Pending Tasks &amp; Alerts</h3>
            {urgentRequests.length > 0 && (
              <span className="px-3 py-1 text-xs font-black" style={{ backgroundColor: '#ffdad6', color: '#93000a', borderRadius: '9999px' }}>
                {urgentRequests.length} URGENT
              </span>
            )}
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {urgentRequests.length === 0 && pendingApps.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', background: '#f3f4f5', borderRadius: '12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#c3c6cf' }}>check_circle</span>
                <p style={{ marginTop: '12px', color: '#64748b', fontWeight: 500 }}>All clear! No pending tasks.</p>
              </div>
            ) : (
              <>
                {urgentRequests.map((req: AnyData) => (
                  <div key={req.id} className="flex items-start" style={{ padding: '16px', gap: '16px', background: '#f3f4f5', borderLeft: req.priority === "Urgent" ? '4px solid #ba1a1a' : '4px solid #fc9430', borderRadius: '12px' }}>
                    <div style={{ padding: '14px 10px', backgroundColor: req.priority === "Urgent" ? '#ffdad6' : '#ffdcc3', color: req.priority === "Urgent" ? '#ba1a1a' : '#914d00', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>build</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#191c1d' }}>{req.title}</p>
                      <p className="text-xs truncate" style={{ color: '#43474e' }}>{req.property?.title || req.property?.address}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 mt-1 inline-block" style={{ backgroundColor: req.priority === "Urgent" ? '#ffdad6' : '#ffdcc3', color: req.priority === "Urgent" ? '#93000a' : '#914d00', borderRadius: '4px' }}>{req.priority}</span>
                    </div>
                  </div>
                ))}
                {pendingApps.map((app: AnyData) => (
                  <Link key={app.id} href={`/applications/${app.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '16px', gap: '16px', background: '#f3f4f5', borderRadius: '12px', transition: 'transform 0.2s', width: '100%' }} className="hover:scale-[1.01]">
                    <div style={{ padding: '14px 10px', backgroundColor: '#e1e3e4', color: '#002446', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>person_search</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#191c1d' }}>New Application</p>
                      <p className="text-xs truncate" style={{ color: '#43474e' }}>{app.applicant?.displayName} — {app.property?.title}</p>
                    </div>
                    <div style={{ color: '#002446' }}>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="flex-1 min-w-0" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
            <h3 className="text-xl font-bold tracking-tight font-headline">Recent Activity</h3>
          </div>
          {recentPayments.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#c3c6cf' }}>receipt_long</span>
              <p style={{ marginTop: '12px', color: '#64748b', fontWeight: 500 }}>No transactions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest" style={{ color: '#9ca3af', borderBottom: '1px solid #f8fafc' }}>
                    <th className="pb-4 font-black">Transaction</th>
                    <th className="pb-4 font-black hidden sm:table-cell">Date</th>
                    <th className="pb-4 font-black text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#f8fafc' }}>
                  {recentPayments.map((payment: AnyData) => (
                    <tr key={payment.id} className="group hover:bg-[#f3f4f5] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center shrink-0" style={{ width: '36px', height: '36px', backgroundColor: payment.status === 'Paid' ? 'rgba(177,240,206,0.5)' : '#ffdcc3', color: payment.status === 'Paid' ? '#002a1a' : '#914d00', borderRadius: '6px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>receipt_long</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{payment.type} — {payment.lease?.property?.title || "Property"}</p>
                            <p className="text-[10px]" style={{ color: '#9ca3af' }}>{payment.payer?.displayName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-medium hidden sm:table-cell" style={{ color: '#64748b' }}>
                        {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-extrabold" style={{ color: payment.status === 'Paid' ? '#002a1a' : '#914d00' }}>
                          {payment.status === 'Paid' ? '+' : ''}ETB {payment.amount?.toLocaleString() || "0"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
        <Link href="/properties/new" className="relative overflow-hidden group" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#1a3a5f', textDecoration: 'none' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 className="font-headline font-bold text-lg" style={{ color: '#ffffff', marginBottom: '4px' }}>Add New Property</h4>
            <p style={{ fontSize: '12px', color: '#87a4cf', marginBottom: '16px' }}>Expand your investment portfolio today.</p>
            <span className="font-bold text-xs" style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#002446' }}>Get Started</span>
          </div>
          <span className="material-symbols-outlined group-hover:rotate-0 transition-transform duration-500" style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '96px', color: '#ffffff', opacity: 0.05, transform: 'rotate(12deg)', fontVariationSettings: "'FILL' 1" }}>add_business</span>
        </Link>

        <Link href="/finances" className="relative overflow-hidden group" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#e7e8e9', border: '1px solid rgba(195,198,207,0.3)', textDecoration: 'none' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 className="font-headline font-bold text-lg" style={{ color: '#002446', marginBottom: '4px' }}>Financial Reports</h4>
            <p style={{ fontSize: '12px', color: '#43474e', marginBottom: '16px' }}>View revenue, expenses and tax reports.</p>
            <span className="font-bold text-xs" style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#002446', color: '#ffffff' }}>View Reports</span>
          </div>
          <span className="material-symbols-outlined group-hover:rotate-0 transition-transform duration-500" style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '96px', color: '#002446', opacity: 0.05, transform: 'rotate(12deg)', fontVariationSettings: "'FILL' 1" }}>analytics</span>
        </Link>

        <div className="relative overflow-hidden group" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fc9430' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 className="font-headline font-bold text-lg" style={{ color: '#663500', marginBottom: '4px' }}>Message Tenant</h4>
            <p style={{ fontSize: '12px', color: 'rgba(102,53,0,0.8)', marginBottom: '16px' }}>Direct communication with all residents.</p>
            <button className="font-bold text-xs active:scale-95 transition-transform" style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#002446', color: '#ffffff', border: 'none', cursor: 'pointer' }}>Open Inbox</button>
          </div>
          <span className="material-symbols-outlined group-hover:rotate-0 transition-transform duration-500" style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '96px', color: '#ffffff', opacity: 0.1, transform: 'rotate(12deg)', fontVariationSettings: "'FILL' 1" }}>chat</span>
        </div>
      </section>
    </main>
  );
}
