import Link from "next/link";

export default function SeekerDashboard() {
  return (
    <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Header */}
      <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: '#002446', marginBottom: '8px' }}>
            Welcome home, Alex
          </h2>
          <p style={{ color: '#43474e', fontWeight: 500 }}>
            You have 2 active applications and 1 maintenance update.
          </p>
        </div>
        <Link
          href="/listings"
          className="flex items-center"
          style={{
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#002446',
            color: '#ffffff',
            borderRadius: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0,36,70,0.1)',
            transition: 'all 0.2s',
          }}
        >
          <span className="material-symbols-outlined">search</span>
          Browse Properties
        </Link>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '32px' }}>
        {/* Left Column: Property + Applications */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Current Property Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(195,198,207,0.1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', backgroundColor: 'rgba(0,36,70,0.03)', borderRadius: '9999px', marginRight: '-128px', marginTop: '-128px', filter: 'blur(48px)' }} />
            <div className="flex flex-col md:flex-row" style={{ gap: '32px', position: 'relative', zIndex: 10 }}>
              {/* Property Image */}
              <div style={{ width: '100%', maxWidth: '280px', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Current Property"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPiboZHOZyDosLHcbKeD6Q2ZYXgXH7OWAyo1T1kBABvIxWzR5CCDuigsM-ZVTM8SkudZZSdgqaelGp_d7tmcpeIdqBgnh7nW1nONY-wDflsZlBpeHcESKGhmw7ZyDVWrZf6iWk80kXmpN-7eUOdaxbno7OLFiuYKlhHRoYIimaUHR-W68DCRuM7JjwFkaORvGdgfM3tlnETHjaQ69kpkjSMs3ltiINPfLVB_BLZCVgi5nGrhS_OBKL-m6irPINMUaIxstidYoRcB-F"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              {/* Property Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ padding: '4px 12px', backgroundColor: '#b1f0ce', color: '#002114', fontSize: '10px', fontWeight: 700, borderRadius: '9999px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    ACTIVE RENTAL
                  </span>
                  <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446', marginTop: '16px', marginBottom: '4px' }}>
                    The Glass Pavilion, Penthouse B
                  </h3>
                  <p className="flex items-center" style={{ color: '#43474e', gap: '4px', fontSize: '14px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                    2420 Highstreet Avenue, Seattle WA
                  </p>
                </div>
                <div className="grid grid-cols-2" style={{ gap: '16px', borderTop: '1px solid rgba(195,198,207,0.3)', paddingTop: '24px', marginTop: '24px' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Next Payment</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#002446' }}>Oct 01, 2023</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Total Balance</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#914d00' }}>$3,450.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Applications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex items-center" style={{ justifyContent: 'space-between' }}>
              <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#002446' }}>My Applications</h3>
              <button style={{ fontSize: '14px', fontWeight: 700, color: '#426087', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Application 1 */}
              <div className="flex items-center" style={{ padding: '16px', backgroundColor: '#f3f4f5', borderRadius: '12px', gap: '16px', transition: 'background 0.2s', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#e1e3e4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#002446', flexShrink: 0 }}>
                  <span className="material-symbols-outlined">apartment</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 700, color: '#002446', fontSize: '14px' }}>Riverfront Lofts</h4>
                  <p style={{ fontSize: '12px', color: '#43474e' }}>Applied on Sep 12, 2023</p>
                </div>
                <div className="flex items-center" style={{ gap: '16px' }}>
                  <span style={{ padding: '4px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, backgroundColor: '#fef9c3', color: '#854d0e' }}>Pending</span>
                  <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>chevron_right</span>
                </div>
              </div>
              {/* Application 2 */}
              <div className="flex items-center" style={{ padding: '16px', backgroundColor: '#f3f4f5', borderRadius: '12px', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#e1e3e4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#002446', flexShrink: 0 }}>
                  <span className="material-symbols-outlined">home</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 700, color: '#002446', fontSize: '14px' }}>Cedar Street Garden Home</h4>
                  <p style={{ fontSize: '12px', color: '#43474e' }}>Applied on Aug 28, 2023</p>
                </div>
                <div className="flex items-center" style={{ gap: '16px' }}>
                  <span style={{ padding: '4px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#166534' }}>Approved</span>
                  <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions */}
          <div style={{ backgroundColor: '#002446', color: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 8px 24px rgba(0,36,70,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Quick Actions</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              {[
                { icon: 'payments', label: 'Pay Rent' },
                { icon: 'engineering', label: 'Maintenance' },
                { icon: 'description', label: 'Lease Docs' },
                { icon: 'chat', label: 'Owner Chat' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center"
                  style={{
                    gap: '8px',
                    padding: '16px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{action.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div style={{ backgroundColor: '#e7e8e9', borderRadius: '12px', padding: '24px' }}>
            <div className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700, color: '#002446' }}>Upcoming</h3>
              <span className="material-symbols-outlined" style={{ color: '#43474e', fontSize: '20px' }}>calendar_month</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex" style={{ gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#ffffff', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#002446', fontWeight: 700, flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', lineHeight: 1 }}>Sep</span>
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>24</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#002446' }}>Annual Inspection</h4>
                  <p style={{ fontSize: '12px', color: '#43474e' }}>10:00 AM • Pending Confirmation</p>
                </div>
              </div>
              <div className="flex" style={{ gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#ffffff', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#002446', fontWeight: 700, flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', lineHeight: 1 }}>Oct</span>
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>05</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#002446' }}>Lease Renewal Window</h4>
                  <p style={{ fontSize: '12px', color: '#43474e' }}>Opens for 2024 terms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Promo Card */}
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '192px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Support Team"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCu1cAfeNZCv_IlVH3kxF2dne5NzcWT7rgSDdmUUrbvYmsOPBgj_1CE-LrpMWJ1IRBRjtn9dCU4nmJKYZybAVVjSRw11537qxtQD72_N9TXE32INmXemAF3bzuvShkZhnIyDA54XNGEImnlXizXP5tO4gxMMJrmWp-p4Zsvx8UPzcYxmeHJjmtTqcqtD_m-e8BYrJuPWa7jljuyFMFoKfFu1rHM-aQZDRMnxLigVFksMBFhQoTWEXjnQ_EP_pE3KBj9hmkNs3818Gj"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,36,70,0.9), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '24px' }}>
              <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Need help?</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Our concierge team is available 24/7 for all seekers.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
