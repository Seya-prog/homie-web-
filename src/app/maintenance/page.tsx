"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const tickets = [
  {
    id: 1,
    property: "Skyline Heights",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC47w6ioCViKHUDa1zi1i_TcAGVLqPT5seH219GkARzoYcufLy0DTOJF3pbaW6mhoHGjvYZJKzsUs_d9t65tbk3vuAAYaYzj1TK0K7qFdymGyZh8XdFSObR1KbQHDEMsCeKmu9vk6FUskS7qFDgxoi6zLf0x49cEp1WeyTp1PROZP6w5aMnCRvo2DJf-nB1-GLo66rHGXhnDdSEVlj68QWGc1r2MLB-pFX-eHqCUz_BNeZ9dkuYUsSs00aRPkIGQM6D_HzLOoSHQCd2",
    issue: "Leaking Faucet",
    detail: "Unit 402 - Master Bath",
    priority: "High",
    priorityBg: "#ffdad6",
    priorityColor: "#93000a",
    status: "In Progress",
    statusBg: "#fc9430",
    statusColor: "#663500",
    date: "Oct 12, 2023",
  },
  {
    id: 2,
    property: "Oakwood Villa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuByPAw2mT1LIbS1-mh5b7Z4NJPr0heddRRoB85fAEmmJYx_KyaRvY6BT-5gdttdvP5Aumyei-awhriOyAL0Pf2f5-ADFbZpOwXXaseNS7PWZNxXqt5n6gh6rjcHWH7Hl94pUTt1UVuYyCIH9btsPqGgkRT1OB1JfBL6Eg0khYVS0I54XCfLVy1iqCN8UIFLehB32srYq_uh6iLV2Ptvq9ptn3aoWQnOcNeOlOhjx7iI3fQG7EmjifIHaPLFz_940bOFfmuz7kNR5i4H",
    issue: "AC Unit Noisy",
    detail: "Main Hallway System",
    priority: "Medium",
    priorityBg: "#e7e8e9",
    priorityColor: "#43474e",
    status: "New",
    statusBg: "#d3e3ff",
    statusColor: "#001c39",
    date: "Oct 14, 2023",
  },
  {
    id: 3,
    property: "Azure Bay",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_dxldEc5WhVOX4oDHao0C3DMGF1aYY5nZ8hSWHSQBPF41cIsYJFQNBsJrCP8YEKG71pL7EtisZNIcny4-keYkqIRZiu238rJCpgbmYhuXfr6eM82nN733lEf0NqKS-w9MzAVYqSg7rupCsdvto-2pDUDVE-2UB4VwCxa-q-Mvdtf5n1pKjSKmMjQ-zD27VHaCPgdYzbr8lAOawtmRCpYAi5d36hoal7AZA4ycejno-wExvM2u57_Bv6P2fAuPDKLVCLhLa4yErpPz",
    issue: "Broken Window Lock",
    detail: "Unit 210 - Bedroom 2",
    priority: "Low",
    priorityBg: "#e7e8e9",
    priorityColor: "#43474e",
    status: "Assigned",
    statusBg: "#b1f0ce",
    statusColor: "#002114",
    date: "Oct 15, 2023",
  },
  {
    id: 4,
    property: "Emerald Mews",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqEHZPd7gUdP1O65o2Ug-Tk0UpUpg21MGPVjSBGS8GKfD_ll9l5cf3LX4G_naqTs7zAqjVHPrG_P3OeaZUejVjVZ1a47lqc3n9UsnojX91ZuUXtiHRQaG0uwc57EL0bjv3QPvLyN2yUdBw3e9yRcQp4Jo7v2_wpaUX8LkfnpuiKfgwMMEKQ9XRRuwDC2O1fawHr07jmqLQN-VphfQdgJjVkZhTRrZVAHiwF6IO3axPmMbq_IDHL7BlFdvPMg8-RSJIUMGblj4gC81D",
    issue: "Garden Fence Repair",
    detail: "Rear Boundary Fence",
    priority: "Low",
    priorityBg: "#e7e8e9",
    priorityColor: "#43474e",
    status: "In Progress",
    statusBg: "#fc9430",
    statusColor: "#663500",
    date: "Oct 11, 2023",
  },
];

export default function MaintenancePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Active Tickets");

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role="owner" activePage="Maintenance" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        {/* Top Header */}
        <header
          className="flex justify-between items-center w-full"
          style={{
            padding: '0 32px',
            height: '64px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center flex-1" style={{ gap: '32px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '28rem' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '18px' }}>search</span>
              <input
                type="text"
                placeholder="Search maintenance tickets..."
                style={{ width: '100%', backgroundColor: '#f3f4f5', border: 'none', borderRadius: '8px', paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <nav className="flex items-center" style={{ gap: '24px' }}>
              {["Active Tickets", "History", "Vendors"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontSize: '14px',
                    fontWeight: activeTab === tab ? 600 : 500,
                    color: activeTab === tab ? '#1a3a5f' : '#64748b',
                    borderBottom: activeTab === tab ? '2px solid #1a3a5f' : '2px solid transparent',
                    paddingBottom: '4px',
                    background: 'none',
                    border: 'none',
                    borderBottomWidth: '2px',
                    borderBottomStyle: 'solid',
                    borderBottomColor: activeTab === tab ? '#1a3a5f' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <button style={{ backgroundColor: '#002446', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              Create Ticket
            </button>
            <div className="flex items-center" style={{ gap: '8px', color: '#64748b', borderLeft: '1px solid #e2e8f0', marginLeft: '8px', paddingLeft: '16px' }}>
              <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>notifications</span>
              <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>account_circle</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h2 className="font-headline" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#002446', marginBottom: '8px' }}>Maintenance Management</h2>
            <p style={{ color: '#64748b', maxWidth: '42rem' }}>Manage repairs, vendor assignments, and ongoing upkeep across your property portfolio from a centralized dashboard.</p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
            {[
              { label: "Total Tickets", value: "24", badge: "+3 this week", badgeBg: "rgba(177,240,206,0.3)", badgeColor: "#002a1a", icon: null },
              { label: "Urgent", value: "04", badge: null, icon: "priority_high", iconColor: "#ba1a1a", valueColor: "#ba1a1a" },
              { label: "In Progress", value: "12", badge: null, icon: "pending_actions", iconColor: "#002446", valueColor: "#002446" },
              { label: "Recently Resolved", value: "08", badge: null, icon: "check_circle", iconColor: "#002a1a", valueColor: "#002446" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(241,245,249,0.5)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{stat.label}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.875rem', fontWeight: 900, color: stat.valueColor || '#002446' }}>{stat.value}</span>
                  {stat.badge && (
                    <span style={{ fontSize: '12px', fontWeight: 500, color: stat.badgeColor, backgroundColor: stat.badgeBg, padding: '4px 8px', borderRadius: '4px' }}>{stat.badge}</span>
                  )}
                  {stat.icon && (
                    <span className="material-symbols-outlined" style={{ color: stat.iconColor, fontVariationSettings: stat.icon === "priority_high" ? "'FILL' 1" : undefined }}>{stat.icon}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <button className="flex items-center" style={{ gap: '8px', padding: '8px 16px', backgroundColor: '#f3f4f5', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#002446', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
                Filter
              </button>
              <button className="flex items-center" style={{ gap: '8px', padding: '8px 16px', backgroundColor: '#f3f4f5', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#002446', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>sort</span>
                Sort by Date
              </button>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
              Showing <span style={{ color: '#002446', fontWeight: 700 }}>12</span> active tickets
            </div>
          </div>

          {/* Tickets Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f5' }}>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Priority</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Opened</th>
                    <th style={{ padding: '16px 24px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div className="flex items-center" style={{ gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                            <img alt={t.property} src={t.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontWeight: 700, color: '#002446' }}>{t.property}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#191c1d' }}>{t.issue}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>{t.detail}</p>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, backgroundColor: t.priorityBg, color: t.priorityColor }}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, backgroundColor: t.statusBg, color: t.statusColor }}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500, color: '#64748b' }}>{t.date}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button style={{ fontSize: '14px', fontWeight: 600, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>Previous</button>
              <div className="flex items-center" style={{ gap: '8px' }}>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: currentPage === p ? 700 : 500,
                      backgroundColor: currentPage === p ? '#002446' : 'transparent',
                      color: currentPage === p ? '#ffffff' : '#64748b',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button style={{ fontSize: '14px', fontWeight: 600, color: '#002446', background: 'none', border: 'none', cursor: 'pointer' }}>Next</button>
            </div>
          </div>

          {/* Bottom CTA Area */}
          <div style={{ marginTop: '48px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            {/* Automate CTA */}
            <div style={{ flex: 2, backgroundColor: '#002446', padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Automate Your Maintenance</h3>
                <p style={{ color: 'rgba(211,227,255,0.8)', maxWidth: '28rem', marginBottom: '24px' }}>Link your preferred local vendors to Homie Hearth for instant dispatch on urgent tickets.</p>
                <button style={{ backgroundColor: '#fc9430', color: '#663500', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                  Connect Vendors
                </button>
              </div>
              {/* Decorative */}
              <div style={{ position: 'absolute', right: '-64px', bottom: '-64px', width: '256px', height: '256px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', filter: 'blur(48px)' }} />
              <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '120px', color: '#ffffff' }}>engineering</span>
              </div>
            </div>

            {/* Performance Insights */}
            <div style={{ flex: 1, backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '16px', border: '1px solid rgba(226,232,240,0.5)' }}>
              <h4 className="flex items-center font-headline" style={{ fontWeight: 700, color: '#002446', marginBottom: '16px', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#914d00' }}>trending_up</span>
                Performance Insights
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: "Avg. Resolution Time", value: "2.4 Days" },
                  { label: "First-time Fix Rate", value: "92%" },
                  { label: "Vendor Compliance", value: "98%" },
                ].map((item) => (
                  <li key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#002446' }}>{item.value}</span>
                  </li>
                ))}
              </ul>
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Updated: Today, 08:42 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
