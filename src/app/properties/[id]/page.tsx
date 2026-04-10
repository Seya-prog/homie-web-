"use client";

import Link from "next/link";
import { use } from "react";

const galleryImages = [
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwsoix3PNaI26-1C-r66IgwEHvC1b5cPr9v6RkRKvX9S9CYad9_unbfDwQaF4lB-kpbcDSBKifgMDCiolkHciDRhk71hHibnZlTUC9TX8GYX7lEFPr_AL3BF4bUK5DeIYOXBjJUMP2LWme6zu1O-3gKW-v2gPZDcObfpDQldhflqOldYhkz3OXuMKOdFHi-zPzTcpZcX1vgcVBwPd7Zeq2q_tDDNs7wIxFWZvh1bE4MVh9o_eJVuTCvRobAcFunPxnll410UlbeYci", alt: "Modern glass house exterior at dusk", span: "col-span-2 row-span-2" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcuG7oqTIswIii7GrrhEoQLVNDhi3ajTxR9ewAZyJb-hDX5rqAzhMngSTmtHmIWZ12gVEEOqrh1GmJYV7I2EniP-eGvtH0UXH5KAsI9Jvv4g0-perEg8Fy1MTFaTTLgjeOOFqr3PbmpI3t4JTEfatgA9ncgpXmZdTo8tB9oKH1Ao14zhzqIZrH47QYIbUGsh5kf9GHYdoeXxK-Sg-rmrQIa9D-Jr2oTUAC535e4XAeWEJ7fXT3rNgRUC1duDjL40rRwY09sUeFgagU", alt: "Minimalist luxury living room" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkHIhvCeCc6C9L4uONbr4uj1uHW3Sm9TfzOL6eaBIvTHriSyu9n7-AGz8uxknwpD41dLuKDzyBvgPVh18pj3f7uAZZDnPpuYZE8HPOMHi5ZnUcCHMXsklpri-OtVvGf6IAXDnqPwJiUScdd69cMckVYkHidfc0Es8ys1COj4JXbCVd4Y-_baemisS6k3zBicOoU0-ZlBxfXZd1UnSfuMv_45x3OIed3DiBs9o4-zaAluUhoiGoxruayBHIQD0jDtboqLFCwHiRMyAD", alt: "Gourmet kitchen with marble counters" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmNdmQ1Nd2nmam3jv32nD8fpscYkdzwL4WI4SgCdY2iy1uO2ZA-Wy_RJ1Fv5YfRzHzfnulBqP6W-YZGaV9Elfl5VxBUdbn2tEFP_QknrFex1KaB4ZMLngtYXe6zW4NJXkpBqqt37xnw68tvNHhYdmxGpgS316EP5T4QguGT77kwiLHtz4vSulOojM3R-sYWtzkd25QdqTBsfNGxyYLELweD_qfVadrSpwMoMS9Lta3eJt4UvBIWtR4pf7UQxzgK9mNCr2IPPqkg8fn", alt: "Primary bedroom with balcony" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZMV1juGAGc6SxmiNTbcJpFdas48R7PQoqdhv5EtUy6gcaRGBPMLCK7vs3Y8suaL6c5pBqm05oSmUO55MBE-L6FKTt4mMDrkhDmM03yuIH1gOtBJv4_U5-_BbvrbH6kZdXzdYUlb7Xlsbu2eDA9iHLw5h8dd4lrFnBXIwWv8sOKr0PeKwGg1i2TtshenPvMNCHAbyJlkeHoYZ63KTzF6RwbjRF8IzEcFOkN11xPcoxZkz3Hi7_rcRUNtXOQFTY5dM5asrPfW9TsMbk", alt: "Spa bathroom", overlay: true },
];

const features = [
  { icon: "bed", label: "Bedrooms", value: "5 Beds" },
  { icon: "bathtub", label: "Bathrooms", value: "4.5 Baths" },
  { icon: "square_foot", label: "Living Area", value: "4,250 sq ft" },
  { icon: "garage", label: "Parking", value: "3 Car Garage" },
];

const amenities = [
  { icon: "pool", name: "Infinity Pool" },
  { icon: "fitness_center", name: "Private Gym" },
  { icon: "local_fire_department", name: "Outdoor Firepit" },
  { icon: "wine_bar", name: "Wine Cellar" },
  { icon: "smart_toy", name: "Smart Home OS" },
  { icon: "charging_station", name: "EV Charging" },
];

const leaseTermsLeft = [
  { label: "Security Deposit", value: "$18,500" },
  { label: "Lease Duration", value: "12 - 36 Months" },
  { label: "Pets Allowed", value: "Small breeds only" },
];
const leaseTermsRight = [
  { label: "Utilities", value: "Tenant responsible" },
  { label: "Maintenance", value: "Included" },
  { label: "Available From", value: "Oct 1, 2024" },
];

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div style={{ background: '#f8f9fa', color: '#191c1d', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <header style={{ backgroundColor: 'rgba(248,250,252,0.8)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1440px', margin: '0 auto', padding: '16px 32px' }}>
          <div className="flex items-center" style={{ gap: '32px' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#1a3a5f' }}>Homie</span>
            </Link>
            <div className="flex" style={{ gap: '24px' }}>
              <a href="#" style={{ color: '#64748b', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>Seeker View</a>
              <a href="#" style={{ color: '#1a3a5f', fontWeight: 700, borderBottom: '2px solid #1a3a5f', paddingBottom: '4px', textDecoration: 'none' }}>Owner View</a>
              <a href="#" style={{ color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>Marketplace</a>
              <a href="#" style={{ color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>Reports</a>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="flex items-center" style={{ backgroundColor: '#e7e8e9', borderRadius: '8px', padding: '6px 12px', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#73777f', fontSize: '16px' }}>search</span>
              <input type="text" placeholder="Search properties..." style={{ backgroundColor: 'transparent', border: 'none', fontSize: '14px', width: '192px', outline: 'none' }} />
            </div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ padding: '8px', color: '#64748b', cursor: 'pointer' }}>notifications</span>
              <span className="material-symbols-outlined" style={{ padding: '8px', color: '#64748b', cursor: 'pointer' }}>settings</span>
            </div>
            <button style={{ backgroundColor: '#002446', color: '#ffffff', padding: '8px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>List Property</button>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center" style={{ gap: '8px', fontSize: '14px', color: '#73777f', marginBottom: '32px' }}>
          <Link href="/properties" style={{ color: '#73777f', textDecoration: 'none' }}>Marketplace</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <a href="#" style={{ color: '#73777f', textDecoration: 'none' }}>Residential</a>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#191c1d', fontWeight: 500 }}>The Glass House Estate</span>
        </nav>

        {/* Bento Gallery */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '16px', height: '600px', marginBottom: '48px' }}>
          {galleryImages.map((img, i) => (
            <div
              key={i}
              style={{
                gridColumn: i === 0 ? 'span 2' : 'span 1',
                gridRow: i === 0 ? 'span 2' : 'span 1',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
              }}
            >
              <img
                alt={img.alt}
                src={img.src}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.7s',
                  filter: img.overlay ? 'brightness(0.5)' : undefined,
                }}
              />
              {i === 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#002446', color: '#ffffff', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Premium Listing
                </div>
              )}
              {img.overlay && (
                <button style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}>
                  + 12 More Photos
                </button>
              )}
            </div>
          ))}
        </section>

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Title */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h1 className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#002446' }}>The Glass House Estate</h1>
                <div className="flex" style={{ gap: '8px' }}>
                  <button style={{ padding: '8px', borderRadius: '9999px', border: '1px solid #c3c6cf', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ color: '#43474e' }}>share</span>
                  </button>
                  <button style={{ padding: '8px', borderRadius: '9999px', border: '1px solid #c3c6cf', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ color: '#43474e' }}>favorite</span>
                  </button>
                </div>
              </div>
              <p className="flex items-center" style={{ fontSize: '18px', color: '#43474e', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#914d00' }}>location_on</span>
                482 North Greenwich Rd, Aspen, CO 81611
              </p>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap" style={{ gap: '32px', padding: '32px 0', borderTop: '1px solid #edeeef', borderBottom: '1px solid #edeeef' }}>
              {features.map((f) => (
                <div key={f.label} className="flex items-center" style={{ gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#edeeef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#002446' }}>{f.icon}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#73777f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                    <p style={{ fontWeight: 700, color: '#191c1d' }}>{f.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <article style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446' }}>About this property</h2>
              <p style={{ color: '#43474e', lineHeight: '1.8' }}>
                Nestled in the heart of the Rocky Mountains, The Glass House Estate represents the pinnacle of modern luxury living. This architectural masterpiece features seamless transitions between indoor and outdoor spaces, with floor-to-ceiling high-performance glass walls that offer breathtaking 270-degree views of the Aspen valley.
              </p>
              <p style={{ color: '#43474e', lineHeight: '1.8' }}>
                Designed by renowned architects, the residence boasts wide-plank white oak flooring, a state-of-the-art Bulthaup kitchen, and a private wellness wing including a sauna and cold plunge pool. The expansive outdoor terrace features a custom infinity-edge pool and a sunken fire pit, perfect for high-altitude entertaining.
              </p>
            </article>

            {/* Amenities */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446' }}>Exclusive Amenities</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {amenities.map((a) => (
                  <div key={a.name} className="flex items-center" style={{ gap: '12px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#72af90' }}>{a.icon}</span>
                    <span style={{ color: '#191c1d' }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Lease & Terms */}
            <section style={{ backgroundColor: '#f3f4f5', padding: '32px', borderRadius: '12px', border: '1px solid rgba(195,198,207,0.3)' }}>
              <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446', marginBottom: '24px' }}>Lease &amp; Terms</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {leaseTermsLeft.map((t) => (
                    <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(195,198,207,0.2)' }}>
                      <span style={{ color: '#43474e' }}>{t.label}</span>
                      <span style={{ fontWeight: 700 }}>{t.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {leaseTermsRight.map((t) => (
                    <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(195,198,207,0.2)' }}>
                      <span style={{ color: '#43474e' }}>{t.label}</span>
                      <span style={{ fontWeight: 700 }}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Map */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446' }}>Location</h2>
              <div style={{ height: '320px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                <img
                  alt="Map of Aspen Colorado"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATFbCXvHApbM_-uqJNCwItPt0JNeYei4anI0vR8HU7v_mZgUhGHG_hgaKg8xpApok86cbg8UTgCCNo6LTrIpMMv5HoKV4hEg9H4miNS46ivUE_ZTA9gAaJq1jpeyi7skk_4LCGG-DuriNaSLu6KU11Qq2oHxMhrxy4g3QT3bQhnHKuM8jhNQ2JsBvltuGgjTMWypBir4094h4YDVS9RTFIq90cKZ-E_JbR3TpcjTPAWU9L4Ab4Dq546orf_sa6yKv1fd3u-uPFfZbQ"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,36,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined">home</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px' }}>Glass House Estate</p>
                      <p style={{ fontSize: '12px', color: '#73777f' }}>Show on Google Maps</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <aside style={{ position: 'relative' }}>
            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Pricing Card */}
              <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(25,28,29,0.08)', border: '1px solid rgba(195,198,207,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                  <div>
                    <p style={{ color: '#73777f', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Rent</p>
                    <h3 className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#002446' }}>
                      $12,500<span style={{ fontSize: '18px', fontWeight: 500, color: '#73777f' }}>/mo</span>
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#002a1a', backgroundColor: '#b1f0ce', padding: '4px 8px', borderRadius: '4px' }}>AVAILABLE NOW</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {[
                    { icon: "verified_user", text: "Verified Property & Owner" },
                    { icon: "event_available", text: "Guided Tour Available" },
                    { icon: "history", text: "Listed 3 days ago" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center" style={{ gap: '12px', fontSize: '14px', color: '#43474e' }}>
                      <span className="material-symbols-outlined" style={{ color: '#002446', fontSize: '20px' }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button style={{ width: '100%', backgroundColor: '#002446', color: '#ffffff', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                    Apply to Rent
                  </button>
                  <button style={{ width: '100%', backgroundColor: '#fc9430', color: '#663500', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    Schedule a Tour
                  </button>
                </div>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#73777f', marginTop: '24px' }}>
                  Application fee: $85 per applicant over 18.
                </p>
              </div>

              {/* Host Profile */}
              <div className="flex items-center" style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '16px', border: '1px solid rgba(195,198,207,0.3)', gap: '16px' }}>
                <img
                  alt="Property Manager"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHWX_T086UnT2TgLKl7aZ8sh_8RDkkokBUK0EOIoUR0F1PmCd4wXuXkhlJr8ufgJZYYbPJ4amhJjcldyLAGnoHDz_msurLbeMvX0CZdcgmHneHYXJlOq4teerUKv2EHyZKqaXlvtg34_CFJ6rYiQumpVqL-4tztjqrqBeXeJW2uUaTjcvmFBDvMfPsh97TVmR78xNrpYwvpo9iwoU72YHFkSzsT6jK41Q6KXr47yeU6iu9hFMs5LdVa5iBBEyuOLOb_xRWyV2AUNBp"
                  style={{ width: '56px', height: '56px', borderRadius: '9999px', objectFit: 'cover' }}
                />
                <div>
                  <p style={{ fontSize: '12px', color: '#73777f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Manager</p>
                  <p style={{ fontWeight: 700, color: '#191c1d' }}>Marcus Sterling</p>
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#fc9430', fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>4.9 (124 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#002446', color: '#ffffff', marginTop: '96px', padding: '64px 0' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
          <div>
            <span className="font-headline" style={{ fontSize: '1.875rem', fontWeight: 900, letterSpacing: '-0.05em', display: 'block', marginBottom: '16px' }}>Homie</span>
            <p style={{ color: '#87a4cf', fontSize: '14px', lineHeight: '1.6' }}>
              Redefining property management for the modern era. Elite listings, seamless transitions, and professional concierge services.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '24px', color: '#f0f1f2' }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#87a4cf' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>All Listings</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Market Insights</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Luxury Estates</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Neighborhood Guides</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '24px', color: '#f0f1f2' }}>Management</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#87a4cf' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Owner Portal</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Maintenance Request</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Lease Agreement</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Reports</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '24px', color: '#f0f1f2' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#87a4cf' }}>
              <li className="flex items-center" style={{ gap: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span> hello@homie.com</li>
              <li className="flex items-center" style={{ gap: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>phone</span> +1 (555) 012-3456</li>
              <li className="flex items-center" style={{ gap: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span> Aspen, Colorado HQ</li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px', marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(135,164,207,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#87a4cf' }}>
          <p>© 2024 Homie Real Estate. All rights reserved.</p>
          <div className="flex" style={{ gap: '24px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
