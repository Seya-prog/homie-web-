"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const summaryCards = [
  { icon: "account_balance_wallet", label: "Total Revenue (YTD)", value: "$412,890.00", badge: "+12.4%", badgeBg: "#ecfdf5", badgeColor: "#059669" },
  { icon: "monetization_on", label: "Collected Rent (MTD)", value: "$48,200.00", badge: "92% Collected", badgeBg: "#f1f5f9", badgeColor: "#1a3a5f" },
  { icon: "schedule", label: "Pending Payments", value: "$12,450.00", badge: "8 Pending", badgeBg: "#fffbeb", badgeColor: "#d97706" },
  { icon: "report_problem", label: "Penalty Income", value: "$1,840.00", badge: "Late Fees", badgeBg: "#f1f5f9", badgeColor: "#9ca3af" },
];

const barHeights = [40, 55, 80, 70, 95, 85, 75];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];

const transactions = [
  { property: "Harbor View Estates", tenant: "Marcus Sterling", type: "Monthly Rent", amount: "$3,200.00", status: "Paid", statusBg: "#ecfdf5", statusColor: "#059669", date: "Oct 12, 2023" },
  { property: "Skyline Lofts Unit 4B", tenant: "Sarah Jenkins", type: "Monthly Rent", amount: "$2,850.00", status: "Pending", statusBg: "#fffbeb", statusColor: "#d97706", date: "Oct 14, 2023" },
  { property: "The Willow Complex", tenant: "David Chen", type: "Late Fee", amount: "$150.00", status: "Late", statusBg: "#ffdad6", statusColor: "#ba1a1a", date: "Oct 15, 2023" },
  { property: "Harbor View Estates", tenant: "Avery Brooks", type: "Monthly Rent", amount: "$3,200.00", status: "Paid", statusBg: "#ecfdf5", statusColor: "#059669", date: "Oct 16, 2023" },
];

const quickActions = [
  { icon: "receipt_long", title: "Export Tax Report", desc: "Generate 2023 FY statement" },
  { icon: "account_balance", title: "Monthly Statement", desc: "Reconcile current ledger" },
  { icon: "notifications_active", title: "Late Fee Automation", desc: "Configure penalty settings" },
];

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [chartMode, setChartMode] = useState("Monthly");

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role="owner" activePage="Finances" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        {/* Top Header */}
        <header
          style={{
            position: 'sticky', top: 0, zIndex: 30,
            backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0 32px', height: '80px',
          }}
        >
          <div className="flex items-center" style={{ gap: '32px' }}>
            <span className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1a3a5f' }}>Finances</span>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }}>search</span>
              <input type="text" placeholder="Search financials..." style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#f3f4f5', border: 'none', borderRadius: '9999px', fontSize: '14px', width: '256px', outline: 'none' }} />
            </div>
          </div>
          <nav className="flex items-center" style={{ gap: '32px', height: '100%' }}>
            {["Overview", "Revenue", "Expenses", "Tax Documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  color: activeTab === tab ? '#1a3a5f' : '#64748b',
                  fontWeight: activeTab === tab ? 700 : 400,
                  borderBottom: activeTab === tab ? '2px solid #1a3a5f' : '2px solid transparent',
                  paddingBottom: '4px',
                  height: '100%',
                  display: 'flex', alignItems: 'center',
                  background: 'none', border: 'none',
                  borderBottomWidth: '2px', borderBottomStyle: 'solid',
                  borderBottomColor: activeTab === tab ? '#1a3a5f' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="flex items-center" style={{ gap: '24px' }}>
            <button style={{ backgroundColor: '#1a3a5f', color: '#ffffff', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Export Report</button>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <span className="material-symbols-outlined" style={{ color: '#64748b', cursor: 'pointer' }}>notifications</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '9999px', overflow: 'hidden', border: '2px solid rgba(26,58,95,0.1)' }}>
                <img alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRgw6i6mH1fv7KectQUW4Q37uZ1I8aNYcAVVgK0DhOFd_TcvCxPB7CaF5lbE44GFAODPFb9rI3oBPclD_jzIT-kT5C_0nKkjsTlq7U-3U3-yrUW_ZMRzoDyQZkXxuC2PqefmVUJDqdGCb9Jwy7wH_KC4gRSZ9G3jRwQM9dDStRtL5yrTWv-eMExrqsolZ3KgQAOyTiO4A0L0s1ma5kVhkR9sges6BAyus6-gd_x-UDVLtXdphNO5hcX_oyIm5zs96fNMGpwSS6Tak7" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
          {/* Page Title */}
          <div style={{ gridColumn: 'span 12', marginBottom: '8px' }}>
            <h2 className="font-headline" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#1a3a5f' }}>Financial Overview</h2>
            <p style={{ color: '#64748b', fontSize: '18px', marginTop: '4px' }}>Manage your property portfolio&apos;s fiscal health and transaction logs.</p>
          </div>

          {/* Summary Cards */}
          <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {summaryCards.map((card) => (
              <div key={card.label} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid transparent', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#1a3a5f' }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#1a3a5f' }}>{card.icon}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: card.badgeColor, backgroundColor: card.badgeBg, padding: '4px 8px', borderRadius: '8px' }}>{card.badge}</span>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 500 }}>{card.label}</p>
                <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3a5f', marginTop: '4px' }}>{card.value}</h3>
              </div>
            ))}
          </div>

          {/* Left Column: Chart + Transactions */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Revenue Chart */}
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a3a5f' }}>Revenue Performance</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Visualizing growth against historical benchmarks</p>
                </div>
                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                  {["Monthly", "Quarterly"].map((m) => (
                    <button key={m} onClick={() => setChartMode(m)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: chartMode === m ? 700 : 500, backgroundColor: chartMode === m ? '#ffffff' : 'transparent', color: chartMode === m ? '#1a3a5f' : '#64748b', boxShadow: chartMode === m ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', border: 'none', cursor: 'pointer' }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ height: '256px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                {barHeights.map((h, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: '#f8fafc', position: 'relative', borderRadius: '8px 8px 0 0', height: '100%' }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#1a3a5f', borderRadius: '8px 8px 0 0', height: `${h}%`, transition: 'all 0.3s' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '0 8px' }}>
                {months.map((m) => (
                  <span key={m} style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af' }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a3a5f' }}>Transaction History</h3>
                <div className="flex" style={{ gap: '8px' }}>
                  <button style={{ padding: '8px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">filter_list</span></button>
                  <button style={{ padding: '8px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">search</span></button>
                </div>
              </div>
              <table style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    {["Property Name", "Tenant Name", "Type", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: '#1a3a5f' }}>{t.property}</td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>{t.tenant}</td>
                      <td style={{ padding: '16px 24px', color: '#9ca3af', fontSize: '14px' }}>{t.type}</td>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: '#1a3a5f' }}>{t.amount}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 12px', backgroundColor: t.statusBg, color: t.statusColor, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', borderRadius: '9999px', letterSpacing: '-0.02em' }}>{t.status}</span>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#9ca3af', fontSize: '14px' }}>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '16px 32px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                <button style={{ color: '#1a3a5f', fontWeight: 700, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>View All Transactions</button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Financial Health Score */}
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a3a5f', alignSelf: 'flex-start', marginBottom: '32px' }}>Financial Health Score</h3>
              <div style={{ position: 'relative', width: '192px', height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="96" cy="96" r="88" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="96" cy="96" r="88" fill="transparent" stroke="#1a3a5f" strokeWidth="12" strokeDasharray="552.92" strokeDashoffset="33" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#1a3a5f' }}>94</span>
                  <span style={{ color: '#9ca3af', fontWeight: 700, fontSize: '14px' }}>Out of 100</span>
                </div>
              </div>
              <div style={{ marginTop: '32px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#ecfdf5', borderRadius: '12px' }}>
                  <span style={{ color: '#065f46', fontSize: '14px', fontWeight: 700 }}>Excellent Performance</span>
                  <span className="material-symbols-outlined" style={{ color: '#059669' }}>check_circle</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '0 16px', fontStyle: 'italic', lineHeight: '1.6' }}>
                  &quot;Your collection rate is 4% higher than the market average for your region.&quot;
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a3a5f', marginBottom: '24px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {quickActions.map((qa) => (
                  <button key={qa.title} className="flex items-center" style={{ gap: '16px', padding: '16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a3a5f', flexShrink: 0 }}>
                      <span className="material-symbols-outlined">{qa.icon}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: '#1a3a5f' }}>{qa.title}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>{qa.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Property */}
            <div style={{ position: 'relative', height: '192px', borderRadius: '24px', overflow: 'hidden' }}>
              <img alt="Featured Property" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPA9iU8L6TNdhx8j6fQyBXi8AzdSIyKpSEqC27WQf4bVgUSeOr99695n-AOM3yjXAv4N6mEULvT5WM5XJGQc_T8TvZxpCssKajQ2RReAYiJApEUFX1WtJ5IMZHv4p374_OyWwlDTSRC9ubvJnFNKhJ-2RLzb4zbQefbew8Op8lZzbrDNXN6W9OxGF5dJZnaQas5Excj6BJi8j6kWdZfFi0yqpxjXG9M-7Cv7KBAF0fnB3Gv5Ho7Q0jgSHjJBYQtvoaY9gLM6iMhNGk" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,58,95,0.9), transparent, transparent)', opacity: 0.9 }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#fc9430', letterSpacing: '0.1em', backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', backdropFilter: 'blur(12px)' }}>Top Performing Asset</span>
                <h4 className="font-headline" style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.25rem', marginTop: '8px' }}>Harbor View Estates</h4>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>Revenue up 15% this quarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
