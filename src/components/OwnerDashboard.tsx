import Link from "next/link";

export default function OwnerDashboard() {
  return (
    <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Section */}
      <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <div className="space-y-2">
          <h2
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: '#002446' }}
          >
            Welcome back, Alexander
          </h2>
          <p style={{ color: '#43474e' }}>
            Your portfolio is performing 12% better than last quarter.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            className="px-6 py-3 font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
            style={{ backgroundColor: '#fc9430', color: '#663500' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            Quick Actions
          </button>
        </div>
      </section>

      {/* Key Metrics Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px' }}>
        {/* Total Portfolio Value */}
        <div
          className="p-6 rounded-xl shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1 transition-all" style={{ backgroundColor: 'rgba(0,36,70,0.1)' }} />
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#9ca3af' }}>Total Portfolio Value</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-3xl font-extrabold tracking-tighter" style={{ color: '#002446' }}>$4.2M</span>
            <span className="font-bold text-xs flex items-center px-2 py-1 rounded-full" style={{ color: '#002a1a', backgroundColor: 'rgba(177,240,206,0.3)' }}>+4.5%</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div
          className="p-6 rounded-xl shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1 transition-all" style={{ backgroundColor: 'rgba(0,36,70,0.1)' }} />
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#9ca3af' }}>Monthly Revenue</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-3xl font-extrabold tracking-tighter" style={{ color: '#002446' }}>$28,450</span>
            <span className="font-bold text-xs flex items-center px-2 py-1 rounded-full" style={{ color: '#002a1a', backgroundColor: 'rgba(177,240,206,0.3)' }}>+2.1%</span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div
          className="p-6 rounded-xl shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1 transition-all" style={{ backgroundColor: 'rgba(0,36,70,0.1)' }} />
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#9ca3af' }}>Occupancy Rate</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-3xl font-extrabold tracking-tighter" style={{ color: '#002446' }}>96.4%</span>
            <div style={{ width: '48px', height: '48px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="24" cy="24" fill="transparent" r="20" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="24" cy="24" fill="transparent" r="20" stroke="#002446" strokeDasharray="125.6" strokeDashoffset="4.5" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Properties Summary - Dark Card */}
        <div className="p-6 rounded-xl shadow-xl flex flex-col justify-between" style={{ backgroundColor: '#002446' }}>
          <span className="text-sm uppercase tracking-wider font-bold" style={{ color: '#cbd5e1' }}>Properties</span>
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-extrabold tracking-tighter" style={{ color: '#ffffff' }}>24</span>
              <span className="text-sm font-medium" style={{ color: '#abc8f5' }}>Total Assets</span>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: 'rgba(26,58,95,0.6)', color: '#ffffff', borderRadius: '4px' }}>18 LEASED</span>
              <span className="px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: 'rgba(252,148,48,0.4)', color: '#ffffff', borderRadius: '4px' }}>6 ACTIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Tier: Activity and Alerts */}
      <section className="flex flex-col md:flex-row" style={{ gap: '32px' }}>
        {/* Pending Tasks & Alerts */}
        <div className="md:w-[40%] shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight font-headline">Pending Tasks &amp; Alerts</h3>
            <span className="px-3 py-1 text-xs font-black" style={{ backgroundColor: '#ffdad6', color: '#93000a', borderRadius: '9999px' }}>4 URGENT</span>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Urgent Request */}
            <div className="flex items-start" style={{ padding: '16px', gap: '16px', background: '#f3f4f5', borderLeft: '4px solid #ba1a1a', borderRadius: '12px' }}>
              <div style={{ padding: '14px 10px', backgroundColor: '#ffdad6', color: '#ba1a1a', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>water_damage</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#191c1d' }}>Emergency: Water Leak</p>
                <p className="text-xs mb-2" style={{ color: '#43474e' }}>Unit 402 - Skyline Heights</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="text-[10px] font-bold px-3 py-1" style={{ backgroundColor: '#002446', color: '#ffffff', borderRadius: '4px' }}>Assign Tech</button>
                  <button className="text-[10px] font-bold px-3 py-1" style={{ backgroundColor: '#ffffff', color: '#002446', border: '1px solid #c3c6cf', borderRadius: '4px' }}>Contact Tenant</button>
                </div>
              </div>
              <span className="text-[10px] font-medium shrink-0" style={{ color: '#9ca3af' }}>12m ago</span>
            </div>

            {/* Normal Request */}
            <div className="flex items-center" style={{ padding: '16px', gap: '16px', background: '#f3f4f5', borderRadius: '12px' }}>
              <div style={{ padding: '14px 10px', backgroundColor: '#e1e3e4', color: '#002446', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>person_search</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#191c1d' }}>3 New Seeker Applications</p>
                <p className="text-xs" style={{ color: '#43474e' }}>Oakwood Villas - Unit 12B</p>
              </div>
              <button style={{ color: '#002446' }}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* Secondary Alert */}
            <div className="flex items-start" style={{ padding: '16px', gap: '16px', background: '#f3f4f5', borderLeft: '4px solid #fc9430', borderRadius: '12px' }}>
              <div style={{ padding: '14px 10px', backgroundColor: '#ffdcc3', color: '#914d00', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>contract_edit</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#191c1d' }}>Lease Renewal Pending</p>
                <p className="text-xs" style={{ color: '#43474e' }}>Tenant: Sarah Jenkins (Expires in 30 days)</p>
              </div>
              <span className="text-[10px] font-medium shrink-0" style={{ color: '#9ca3af' }}>2h ago</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="flex-1 min-w-0" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
            <h3 className="text-xl font-bold tracking-tight font-headline">Recent Activity</h3>
            <button className="font-bold text-sm flex items-center gap-1 hover:underline" style={{ color: '#002446' }}>
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest" style={{ color: '#9ca3af', borderBottom: '1px solid #f8fafc' }}>
                  <th className="pb-4 font-black">Transaction / Event</th>
                  <th className="pb-4 font-black">Date</th>
                  <th className="pb-4 font-black text-right">Amount / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#f8fafc' }}>
                <tr className="group hover:bg-[#f3f4f5] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(177,240,206,0.5)', color: '#002a1a', borderRadius: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>receipt_long</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Rent Received - Apt 12C</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Transaction ID: #88291</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-medium" style={{ color: '#64748b' }}>Oct 24, 2023</td>
                  <td className="py-4 text-right"><span className="text-sm font-extrabold" style={{ color: '#002a1a' }}>+$2,450.00</span></td>
                </tr>
                <tr className="group hover:bg-[#f3f4f5] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', backgroundColor: '#d3e3ff', color: '#002446', borderRadius: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>description</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Application Submitted</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Applicant: James Miller</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-medium" style={{ color: '#64748b' }}>Oct 23, 2023</td>
                  <td className="py-4 text-right">
                    <span className="text-[10px] font-black uppercase" style={{ padding: '4px 8px', backgroundColor: '#e1e3e4', color: '#002446', borderRadius: '4px' }}>Pending Review</span>
                  </td>
                </tr>
                <tr className="group hover:bg-[#f3f4f5] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(177,240,206,0.5)', color: '#002a1a', borderRadius: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>receipt_long</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Rent Received - Skyline 402</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Transaction ID: #88289</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-medium" style={{ color: '#64748b' }}>Oct 22, 2023</td>
                  <td className="py-4 text-right"><span className="text-sm font-extrabold" style={{ color: '#002a1a' }}>+$3,800.00</span></td>
                </tr>
                <tr className="group hover:bg-[#f3f4f5] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,218,214,0.5)', color: '#ba1a1a', borderRadius: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>plumbing</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Maintenance Expense</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Plumbing Repair - Oakwood</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-medium" style={{ color: '#64748b' }}>Oct 21, 2023</td>
                  <td className="py-4 text-right"><span className="text-sm font-extrabold" style={{ color: '#ba1a1a' }}>-$450.00</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom Quick Actions & Insights */}
      <section className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px' }}>
        {/* Add New Property */}
        <Link href="/properties/new" className="relative overflow-hidden group" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#1a3a5f', textDecoration: 'none' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 className="font-headline font-bold text-lg" style={{ color: '#ffffff', marginBottom: '4px' }}>Add New Property</h4>
            <p style={{ fontSize: '12px', color: '#87a4cf', marginBottom: '16px' }}>Expand your investment portfolio today.</p>
            <span className="font-bold text-xs" style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#002446' }}>Get Started</span>
          </div>
          <span className="material-symbols-outlined group-hover:rotate-0 transition-transform duration-500" style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '96px', color: '#ffffff', opacity: 0.05, transform: 'rotate(12deg)', fontVariationSettings: "'FILL' 1" }}>add_business</span>
        </Link>

        {/* Create Report */}
        <div className="relative overflow-hidden group" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#e7e8e9', border: '1px solid rgba(195,198,207,0.3)' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 className="font-headline font-bold text-lg" style={{ color: '#002446', marginBottom: '4px' }}>Create Report</h4>
            <p style={{ fontSize: '12px', color: '#43474e', marginBottom: '16px' }}>Generate Q4 financial tax statements.</p>
            <button className="font-bold text-xs active:scale-95 transition-transform" style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#002446', color: '#ffffff' }}>Configure</button>
          </div>
          <span className="material-symbols-outlined group-hover:rotate-0 transition-transform duration-500" style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '96px', color: '#002446', opacity: 0.05, transform: 'rotate(12deg)', fontVariationSettings: "'FILL' 1" }}>analytics</span>
        </div>

        {/* Message Tenant */}
        <div className="relative overflow-hidden group" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fc9430' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 className="font-headline font-bold text-lg" style={{ color: '#663500', marginBottom: '4px' }}>Message Tenant</h4>
            <p style={{ fontSize: '12px', color: 'rgba(102,53,0,0.8)', marginBottom: '16px' }}>Direct communication with all residents.</p>
            <button className="font-bold text-xs active:scale-95 transition-transform" style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#002446', color: '#ffffff' }}>Open Inbox</button>
          </div>
          <span className="material-symbols-outlined group-hover:rotate-0 transition-transform duration-500" style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '96px', color: '#ffffff', opacity: 0.1, transform: 'rotate(12deg)', fontVariationSettings: "'FILL' 1" }}>chat</span>
        </div>
      </section>
    </main>
  );
}
