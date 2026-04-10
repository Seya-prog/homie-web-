"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const applicants = [
  {
    id: 1,
    name: "Eleanor Vance",
    email: "e.vance@email.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHRXoNWTPzCQqLoSvrOn0ltyLlZfh426zlTjlir7W00rX3vGMogVOfX6GShxljFxFiVJLyuQlz-cLOTj8EqzhFEIvJqOfRHlDBMyqZIin8Ir_1kONPAgf9Cj-4B2eZ-4RMucgG9bsQ4Wf4sae29c2jhumI5G4QB_zjxLxpgEyBRPAGr5fp4ntgJgi8HCZPjd8b0bOuXmCct_8rMnprxRb9iXjN6zlafz-TB7bGihOmdmbToESTRd_CnmyJ-FDCxhJu-01epGM0Z15X",
    property: "The Grandview Suite 402",
    rent: "$3,400/mo",
    creditScore: "742 CS",
    creditColor: "#002a1a",
    ratio: "3.8x Ratio",
    status: "Pending",
    statusBg: "rgba(0,36,70,0.1)",
    statusColor: "#002446",
    date: "Oct 12, 2023",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    email: "m.thorne@corp.co",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBUDwNc1jRbngRAN9ifoTIELEQrsiEw42Av5ZjtPjBY0G6OGpWGSwWLKlOrzL01drpUrHPwKLz3qp13X3N5rqKuUZT1dtxBmiK83eETN9PbYOh0f4ukLiAO13swunCkXotEGlfDWUtmqP3ErppLRY009463zJBIlqS0oy4mEEWd-3qNe1Lkdu487h8ZOzPZsoKGG5reTCmEwIULO3LSl4Ft1l3aBiUguaCnspNzv7mc4_vCAEs89I19jeRtCoJddBOk2cgQJ00vARw",
    property: "Oak Ridge Penthouse",
    rent: "$5,200/mo",
    creditScore: "810 CS",
    creditColor: "#002a1a",
    ratio: "5.2x Ratio",
    status: "Screening",
    statusBg: "rgba(252,148,48,0.2)",
    statusColor: "#663500",
    date: "Oct 10, 2023",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    email: "sarah.j@web.io",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgM5PlUHJeaZrcG7YxvU4PzPfZwL6GtpgAboEe7S-F69GXbeewcMI7WPlJ1-auol9s8IP7VcrOBlzpTOHRrhlcQIEPHlaSUvV0Kmd0tCmwLWnU8QLDH4sgrxOWkPf4WMWGAtKN82BwLhuJUlmuiR8cb-BqmFUmg8qieojfi7rJPADK5ls90900P9lwoK3NpQYL-js4P7B46hGl1kWFiM_8Iu37-xX3c4USmhL2i9GIbyGIL7xwcJPb0W49vsjRUcwcsDcESclg_KCi",
    property: "Liberty Gardens #12",
    rent: "$2,150/mo",
    creditScore: "680 CS",
    creditColor: "#002a1a",
    ratio: "3.1x Ratio",
    status: "Approved",
    statusBg: "rgba(0,42,26,0.1)",
    statusColor: "#002a1a",
    date: "Oct 08, 2023",
  },
  {
    id: 4,
    name: "Julian Grey",
    email: "grey.j@mail.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb7n0wm63MgBp2WKvYYJFvwMEVMVmlxaNgjilbed_BvaxCYKWwbG4BSf4q_BgTscLtU4c15bjjjfblAxrsqqQNm3clAzF5AoP2y06M8MkHElo0gfu26TWTrIhiw1pS39tTxi9OZ8LvZG3Dvzf_dIKEqgaAyzHLV7apQawd7IwKQ0kg5MKzobFK70gg4-lP861Inplhtkum2Z_RyaPrM9tOBMrZKHxg8AuGrXaFDMPVB2THoRsGnz8PxYk7pKoFv96_4efCf9is0-c8",
    property: "The Grandview Suite 402",
    rent: "$3,400/mo",
    creditScore: "590 CS",
    creditColor: "#ba1a1a",
    ratio: "2.4x Ratio",
    status: "Declined",
    statusBg: "rgba(255,218,214,0.3)",
    statusColor: "#ba1a1a",
    date: "Oct 05, 2023",
  },
];

const tips = [
  { title: "3:1 Income Ratio", desc: "Ensure gross monthly income is at least 3x the monthly rent for long-term stability." },
  { title: "Verify References", desc: "Cross-reference current employer and past landlords for behavioral consistency." },
  { title: "Check for Gaps", desc: "Look for unexplained employment gaps longer than 3 months." },
];

export default function ApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role="owner" activePage="Applications" />

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
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center flex-1" style={{ maxWidth: '36rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '18px' }}>search</span>
              <input
                type="text"
                placeholder="Search applicants, properties..."
                style={{ width: '100%', backgroundColor: '#f3f4f5', border: 'none', borderRadius: '8px', paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '24px', marginLeft: '32px' }}>
            <div className="flex items-center" style={{ gap: '16px', paddingRight: '24px', borderRight: '1px solid #e2e8f0' }}>
              <button style={{ position: 'relative', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">notifications</span>
                <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: '#fc9430', borderRadius: '9999px', border: '2px solid #ffffff' }} />
              </button>
              <button style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#002446' }}>Alexander Sterling</p>
                <p style={{ fontSize: '10px', fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portfolio Owner</p>
              </div>
              <img
                alt="Owner Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNzYlCHTTSX3dXnNumGSSDfyzgosjfLJL-asWnp6F08Vw-5aXHVV0rzuJw4QxID17ng-Jnq29EUULEvZtKR_DtsWMj1Mlgpx34l4PHQHKiQG399GgU9NijwVGbuXRctTyEUBMnCbSCnw7thsjW0GTsJlgUsNXfBgVg57UWat2rHHluVCG2C-DVKY2u0bzesU3GtCnjpznEin4FVw_WssP6VfhJO9X-ArbBKgUjl_izB4_md0EXhqLpw6dHopPOH61W7vfsPQDqj4NX"
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 0 0 2px #e7e8e9' }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ padding: '40px', maxWidth: '80rem', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Page Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <h1 className="font-headline" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#002446', letterSpacing: '-0.025em' }}>Application Management</h1>
              <p style={{ color: '#64748b', fontWeight: 500, marginTop: '4px' }}>
                You have <span style={{ color: '#002446', fontWeight: 700 }}>124</span> total applications across your portfolio.
              </p>
            </div>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <button
                className="flex items-center"
                style={{ gap: '8px', padding: '10px 20px', backgroundColor: '#ffffff', border: '1px solid rgba(195,198,207,0.3)', color: '#191c1d', fontWeight: 600, borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_list</span>
                Export CSV
              </button>
              <button style={{ padding: '10px 20px', backgroundColor: '#fc9430', color: '#663500', fontWeight: 700, borderRadius: '8px', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                Invite New Tenant
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { label: "Pending Review", value: "28", borderColor: "#002446", icon: "trending_up", iconColor: "rgba(0,36,70,0.6)", sub: "12% since last week" },
              { label: "Background Checks", value: "14", borderColor: "#fc9430", icon: "schedule", iconColor: "rgba(145,77,0,0.6)", sub: "8 in progress" },
              { label: "Approved", value: "76", borderColor: "#002a1a", icon: "check_circle", iconColor: "rgba(0,42,26,0.6)", sub: "5 lease signatures pending" },
              { label: "Declined", value: "6", borderColor: "#ba1a1a", icon: "history", iconColor: "rgba(186,26,26,0.6)", sub: "Last 30 days" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${stat.borderColor}`,
                  boxShadow: '0 12px 40px -4px rgba(25,28,29,0.06)',
                }}
              >
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 900, color: '#002446' }}>{stat.value}</p>
                <div className="flex items-center" style={{ marginTop: '8px', color: stat.iconColor, fontSize: '12px', fontWeight: 500 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>{stat.icon}</span>
                  <span>{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Content: Table + Sidebar */}
          <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '32px', alignItems: 'start' }}>
            {/* Applications Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 12px 40px -4px rgba(25,28,29,0.06)', overflow: 'hidden' }}>
              {/* Table Filters */}
              <div style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid #edeeef' }}>
                <div className="flex items-center" style={{ gap: '12px' }}>
                  <select style={{ backgroundColor: '#f3f4f5', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#002446', padding: '8px 16px' }}>
                    <option>All Properties</option>
                    <option>The Grandview Suite 402</option>
                    <option>Oak Ridge Penthouse</option>
                    <option>Liberty Gardens #12</option>
                  </select>
                  <select style={{ backgroundColor: '#f3f4f5', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#002446', padding: '8px 16px' }}>
                    <option>Any Status</option>
                    <option>Pending</option>
                    <option>Screening</option>
                    <option>Approved</option>
                  </select>
                </div>
                <div className="flex items-center" style={{ gap: '8px', color: '#9ca3af' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sort by:</span>
                  <button className="flex items-center" style={{ gap: '4px', fontSize: '14px', fontWeight: 700, color: '#002446', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <span>Recent First</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f5' }}>
                      {["Applicant", "Property", "Finances", "Status", "Submitted", ""].map((h) => (
                        <th key={h} style={{ padding: '16px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#43474e' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #edeeef', transition: 'background 0.2s', cursor: 'pointer' }}>
                        <td style={{ padding: '20px 24px' }}>
                          <div className="flex items-center" style={{ gap: '12px' }}>
                            <img alt={a.name} src={a.avatar} style={{ width: '40px', height: '40px', borderRadius: '9999px', objectFit: 'cover' }} />
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: 700, color: '#002446' }}>{a.name}</p>
                              <p style={{ fontSize: '12px', color: '#64748b' }}>{a.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#002446' }}>{a.property}</p>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>{a.rent}</p>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: a.creditColor }}>{a.creditScore}</span>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>{a.ratio}</p>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ padding: '4px 12px', backgroundColor: a.statusBg, color: a.statusColor, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '9999px' }}>
                            {a.status}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px', fontSize: '14px', color: '#64748b' }}>{a.date}</td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button style={{ padding: '8px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #edeeef' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Showing 4 of 124 Applications</span>
                <div className="flex" style={{ gap: '8px' }}>
                  <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(195,198,207,0.3)', color: '#9ca3af', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_left</span>
                  </button>
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
                        border: currentPage === p ? 'none' : '1px solid rgba(195,198,207,0.3)',
                        backgroundColor: currentPage === p ? '#002446' : 'transparent',
                        color: currentPage === p ? '#ffffff' : '#475569',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(195,198,207,0.3)', color: '#9ca3af', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Portfolio Health Score */}
              <div style={{ backgroundColor: '#002446', color: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 20px 40px rgba(0,36,70,0.3)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 className="font-headline" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.025em' }}>Portfolio Health Score</h3>
                    <span className="material-symbols-outlined" style={{ color: '#fc9430' }}>verified</span>
                  </div>
                  <div className="flex items-end" style={{ gap: '8px' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 900 }}>94</span>
                    <span style={{ color: '#1a3a5f', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>/ 100</span>
                  </div>
                  <p style={{ color: '#87a4cf', fontSize: '12px', lineHeight: '1.6' }}>
                    Your applicant pool is currently <span style={{ color: '#ffffff', fontWeight: 700 }}>Excellent</span>. Average credit score has increased by 14 points this month.
                  </p>
                  <div style={{ paddingTop: '8px' }}>
                    <div style={{ width: '100%', backgroundColor: '#1a3a5f', height: '6px', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#fc9430', height: '100%', width: '94%', borderRadius: '9999px' }} />
                    </div>
                  </div>
                </div>
                {/* Background glow */}
                <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: '128px', height: '128px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', filter: 'blur(48px)' }} />
                <div style={{ position: 'absolute', bottom: '-48px', left: '-48px', width: '96px', height: '96px', backgroundColor: 'rgba(252,148,48,0.1)', borderRadius: '9999px', filter: 'blur(32px)' }} />
              </div>

              {/* Quick Screening Tips */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 12px 40px -4px rgba(25,28,29,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 className="flex items-center font-headline" style={{ fontSize: '14px', fontWeight: 700, color: '#002446' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '8px' }}>tips_and_updates</span>
                  Quick Screening Tips
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {tips.map((tip) => (
                    <li key={tip.title} className="flex items-start" style={{ gap: '12px' }}>
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#fc9430', borderRadius: '9999px', marginTop: '6px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#002446', marginBottom: '2px' }}>{tip.title}</p>
                        <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>{tip.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="flex items-center justify-center"
                  style={{ width: '100%', padding: '10px', fontSize: '10px', fontWeight: 900, color: '#002446', border: '1px solid rgba(0,36,70,0.2)', borderRadius: '8px', backgroundColor: 'transparent', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                >
                  View Full Screening Guide
                </button>
              </div>

              {/* Upgrade Banner */}
              <div style={{ backgroundColor: '#f3f4f5', borderRadius: '12px', padding: '4px', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                  <img
                    alt="Upgrade to Pro"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwZOmGw-7Zusu-hKz7dcE7-UDZV5CBXYDxOlj_VbGbV8rGQ_EwmU61yjYevVwo5KQGHhPp6igG3fNP8aNAEN4QaExZwvbDvRLfBHkd9AiURM6mocjGdGhHnS0OC_F4jFxJKwvEY7rtmmPcSMx4BegH6SK4nJeYFYe9xbWm9oEiB0Lt-Js7fYnmfEbaYutiXLHLIpcruq4qEeXdIiTDdih5zU0hig1YBh7GkfYmIu1i21pWzp3tdbzlNaTcHcHzn1QJ9kzZB48FqlcB"
                    style={{ width: '100%', height: '128px', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,36,70,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#fc9430', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Upgrade to Pro</p>
                    <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: 500 }}>Automated AI background screening is now available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          backgroundColor: '#002446',
          color: '#ffffff',
          borderRadius: '9999px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          zIndex: 50,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>add</span>
      </button>
    </div>
  );
}
