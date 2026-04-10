"use client";

import { useState } from "react";
import Link from "next/link";

const listings = [
  {
    id: 1, name: "Modern Riverside Penthouse", price: "$3,200/mo", location: "Downtown Metropolis",
    beds: 3, baths: 2, sqft: "1,800", badge: "Featured", badgeBg: "#002446", badgeColor: "#ffffff",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA65VDb9rRN4AdAXVUVYmkLmP-hbQ-ui_MtCmB_a0Lchxho7SQPJcQOwYA4U9AdT9OK8jh1UHU3vK8O2WRwFP7nCI5sIMotTx60uud6es-Xblc_5xontCCfsbx6RNvKNRDT8LJ2va92EEZturjXbqGlgyyKzjoFowrRWdM8EDUFEFV0Vqt19PP25UGWKT7dSfb6DKcgU1lgY04m9jIqDbr6_Q8HAJtJgmQZrXN8prQHO_ek3VyBzI6B43NhExxeuAcADvUasQhfrlOq",
  },
  {
    id: 2, name: "Oak Ridge Family Estate", price: "$850,000", location: "North Hills District",
    beds: 4, baths: 3, sqft: "2,450", badge: "New", badgeBg: "#00422b", badgeColor: "#72af90",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2jPh83hnXecqmz_q-yZclZD7QLUbLt-sxNVHNg1LtK-EnxGsnn0smVmHel6ABioxBcm86l_aS5_xPp7vQf75VV1tf7jnpD8XiMAEwScRQw-DPEu70raYi--lajTS7AlJhyeVgXebR1od4sX_Zlun68TvefkaBWoNgY5Wea8d-oXeeWlN4Wpe0sAAJ5z_qVdeiqfQAwpA2olXw68gygIrr4DLk3-MB6Lt7aNVj0Fjs3cR-km1c_wx8cdxCX6toV9WNdxWAfXDI2_Zp",
  },
  {
    id: 3, name: "Neo-Industrial Studio", price: "$2,100/mo", location: "Arts District",
    beds: 1, baths: 1, sqft: "920", badge: null, badgeBg: "", badgeColor: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr_pc2yuVVQDke2uAqvAzrbRC4fP0Bg5GDLO4FGr7Yha2B_n4jJdDtc0l1muz8n3tIunVpjJfG5zxrOi_T_88O2ijQ2IsOkWDgZwZ_nGGj6uH0bjGe86zcheo46QmLf5ZoTj_XCppppIvJECQxlLNPjuHg6V_R4flpC90A1kOOcVqdBJ8DHAkldwb4Kj_cYmftXJvIc7tdhWPFheh4OgFXC4hxZUGrEXnDvOmH0Xaj0rUZ7vBDOOctqK2iokyzFJa1Kqp_R8YPygxS",
  },
  {
    id: 4, name: "Crystal Lake Haven", price: "$1,250,000", location: "Silvermere Lake",
    beds: 5, baths: 4, sqft: "4,100", badge: null, badgeBg: "", badgeColor: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHpQiuadwMVEkamcCT5vY9371zKehkhGPfdpz17WRAdLvxx3fgg1iV4PyZvZyZkrZ42vfqCkMTv1nM5Xn7xzJ0iHgkUWLFqms-SvHR4Pfe-N-et11BD-ianvLqBFVZ1vO2CQYY6FyAxbwhJCImt5yOA5kk8Yp5XDAxHfIv501BpSX4FBFMv994plUdbUqClNZZEF1SxPeXHuc54lqa-Z-aYDTE3m5L-Fk5EMbL3UDcKv2dnUJMHEEn8eEqtjj22nkKzM_KqNr5xIam",
  },
  {
    id: 5, name: "Skyline View Condos", price: "$4,500/mo", location: "Central Plaza",
    beds: 2, baths: 2, sqft: "1,200", badge: "Featured", badgeBg: "#002446", badgeColor: "#ffffff",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXrTpDPFFYSj2GgegjrafkJ7FkeSONoFItKFHtx_BO35-UoJp-wPV_cJ99yL10LMD5Tv7sGAy5PAyCkKBXDvwpfIJHyMKCyZVr42BoU6RcaXeQTxHoD_TYsUJG2SycyIGkTAjZ1n5zL3FdTuheADWIInZk7VD0DC1smN-XSP8i8VLrctKM08GU_3xIznVPtpqe_tw-uzFvqvy0286zXJJCHFX7mcz1Wq_4XUfUiuDl33hXhD8Zrr3QIF0ZIjLrLqW-UEE_BMlNjBB_",
  },
  {
    id: 6, name: "The Solarium Retreat", price: "$1,850,000", location: "Palm Springs Outskirts",
    beds: 3, baths: 3, sqft: "3,200", badge: null, badgeBg: "", badgeColor: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqL74u5WVxYesyhFK_ZVual2UqFwuNXBPyqysR8U13X1TV9nc7DXJ2SVm2nLagJEmkyGyKTg9-idTIw7WxKOG74wSNkI7trLCCC7I8Yp2XDsua2vI16--RkHIL9QwszaO33uYpLF-ailsTdtgnO0Gro5XtnZWCzKuTiG0KysFDox3fGjJ-_wAe9YtKaBWy9fHy2PRKknZU557xQE0C9phZWPPSXXmmFlMcTP1W7sVl_Mmk2ub-iD4e_BjyFuoM7R05uyhVL9npMwWV",
  },
];

const propertyTypes = ["Apartment", "House", "Condo", "Townhouse"];
const amenitiesList = ["Parking", "Pool", "Gym", "Pet Friendly"];
const bedroomOpts = ["Any", "1+", "2+", "3+"];

export default function ListingsPage() {
  const [activeNav, setActiveNav] = useState("Discover");
  const [viewMode, setViewMode] = useState("Grid");
  const [activeBed, setActiveBed] = useState("Any");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFav = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  return (
    <div style={{ background: '#f8f9fa', color: '#191c1d', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 32px', height: '64px',
        backgroundColor: 'rgba(248,250,252,0.8)', backdropFilter: 'blur(16px)',
      }}>
        <div className="flex items-center" style={{ gap: '32px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em', color: '#0f172a' }}>EstateManager</span>
          </Link>
          <div className="flex" style={{ gap: '24px' }}>
            {["Discover", "Saved", "Inquiries", "Tours"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveNav(tab)}
                style={{
                  color: activeNav === tab ? '#0f172a' : '#64748b',
                  fontWeight: activeNav === tab ? 700 : 500,
                  borderBottom: activeNav === tab ? '2px solid #0f172a' : '2px solid transparent',
                  background: 'none', border: 'none', cursor: 'pointer',
                  paddingBottom: '4px', transition: 'color 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>search</span>
            <input type="text" placeholder="Search areas..." style={{ paddingLeft: '40px', paddingRight: '16px', padding: '6px 16px 6px 40px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', fontSize: '14px', width: '256px', outline: 'none' }} />
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: '#475569' }}>notifications</span>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: '#475569' }}>favorite</span>
          </button>
          <div style={{ width: '32px', height: '32px', borderRadius: '9999px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
            <img alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA60lAYc1puh0mdBFGzS7X1AZ8IWJVhYOupk68nROyx3Fe5qL2y4DD9QlrBRchQj8eUvAu2v0Tl7ku4-5G6cfU96uglT-uCFOhNdrM37wcFj97VUaH4DyXuyXAfqs2W9UBk6h3ZqHmC-zYWv05fxBE0n9s8e7OLxTeDGi6dG_g5POVdbyYB6PvXVwcxlmLzal5s65c6gk07rEw9Do0k-GSigg9Ihh7S8uXPRjQRV--GZIgw3cduDDlRWKOLkDLMA8FsbExrstSwe69y" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </nav>

      {/* Sidebar Filters */}
      <aside style={{
        height: 'calc(100vh - 64px)', width: '256px', position: 'fixed', left: 0, top: '64px',
        backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '8px',
        padding: '24px', borderRight: '1px solid #f1f5f9', overflowY: 'auto', zIndex: 40,
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '16px' }}>Search Filters</h3>

          {/* Price Range */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Price Range</label>
            <div className="flex" style={{ gap: '8px', marginBottom: '8px' }}>
              <input type="text" placeholder="Min" style={{ width: '100%', fontSize: '12px', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none' }} />
              <input type="text" placeholder="Max" style={{ width: '100%', fontSize: '12px', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none' }} />
            </div>
            <input type="range" style={{ width: '100%', accentColor: '#fc9430' }} />
          </div>

          {/* Property Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Property Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {propertyTypes.map((t) => (
                <label key={t} className="flex items-center" style={{ gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ borderRadius: '4px', accentColor: '#002446' }} /> {t}
                </label>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Bedrooms</label>
            <div className="flex" style={{ backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              {bedroomOpts.map((b) => (
                <button
                  key={b}
                  onClick={() => setActiveBed(b)}
                  style={{
                    flex: 1, padding: '4px', fontSize: '12px', fontWeight: 500, borderRadius: '6px',
                    backgroundColor: activeBed === b ? '#ffffff' : 'transparent',
                    boxShadow: activeBed === b ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Amenities</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {amenitiesList.map((a) => (
                <label key={a} className="flex items-center" style={{ gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ borderRadius: '4px', accentColor: '#002446' }} /> {a}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button style={{ width: '100%', padding: '12px 16px', backgroundColor: '#fc9430', color: '#663500', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            Apply Filters
          </button>
          <button style={{ width: '100%', padding: '12px 16px', backgroundColor: 'transparent', color: '#64748b', fontWeight: 500, borderRadius: '8px', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
            Reset All
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '256px', paddingTop: '96px', padding: '96px 32px 48px', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <h1 className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#002446', marginBottom: '8px' }}>Exclusive Listings</h1>
            <p style={{ color: '#43474e' }}>Showing 1,240 luxury properties available for you</p>
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="flex" style={{ backgroundColor: '#e7e8e9', padding: '4px', borderRadius: '8px' }}>
              {["Grid", "Map"].map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className="flex items-center"
                  style={{
                    gap: '8px', padding: '6px 16px', fontSize: '14px', fontWeight: viewMode === v ? 600 : 500,
                    borderRadius: '6px',
                    backgroundColor: viewMode === v ? '#ffffff' : 'transparent',
                    boxShadow: viewMode === v ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    color: viewMode === v ? '#002446' : '#43474e',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{v === "Grid" ? "grid_view" : "map"}</span>
                  {v}
                </button>
              ))}
            </div>
            <select style={{ backgroundColor: '#ffffff', border: 'none', fontSize: '14px', fontWeight: 500, padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none' }}>
              <option>Sort By: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Square Feet</option>
            </select>
          </div>
        </header>

        {/* Property Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {listings.map((listing) => (
            <Link href={`/properties/${listing.id}`} key={listing.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article className="group" style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s' }}>
                <div style={{ position: 'relative', height: '256px', overflow: 'hidden' }}>
                  <img
                    alt={listing.name}
                    src={listing.image}
                    className="group-hover:scale-110"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  />
                  {listing.badge && (
                    <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                      <span style={{ padding: '4px 12px', backgroundColor: listing.badgeBg, color: listing.badgeColor, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '9999px' }}>
                        {listing.badge}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleFav(listing.id); }}
                    style={{
                      position: 'absolute', top: '16px', right: '16px',
                      width: '40px', height: '40px',
                      backgroundColor: favorites.includes(listing.id) ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(12px)', borderRadius: '9999px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: favorites.includes(listing.id) ? '#ef4444' : '#ffffff',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: favorites.includes(listing.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#002446' }}>{listing.name}</h3>
                    <p className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#002446', whiteSpace: 'nowrap' }}>{listing.price}</p>
                  </div>
                  <p className="flex items-center" style={{ fontSize: '14px', color: '#43474e', gap: '4px', marginBottom: '24px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                    {listing.location}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f3f4f5', color: '#43474e', fontSize: '12px', fontWeight: 600 }}>
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bed</span> {listing.beds} {listing.beds === 1 ? 'Bed' : 'Beds'}
                    </div>
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bathtub</span> {listing.baths} {listing.baths === 1 ? 'Bath' : 'Baths'}
                    </div>
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>square_foot</span> {listing.sqft} sqft
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>

        {/* Pagination */}
        <footer style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
          <nav className="flex items-center" style={{ gap: '8px' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="flex items-center"
              style={{ height: '40px', padding: '0 16px', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#002446', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.2s' }}
            >
              <span className="material-symbols-outlined">chevron_left</span> Previous
            </button>
            <div className="flex items-center" style={{ gap: '4px', padding: '0 16px' }}>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{
                    height: '40px', width: '40px', borderRadius: '8px', fontWeight: currentPage === p ? 700 : 500,
                    backgroundColor: currentPage === p ? '#002446' : 'transparent',
                    color: currentPage === p ? '#ffffff' : '#43474e',
                    boxShadow: currentPage === p ? '0 4px 8px rgba(0,36,70,0.2)' : 'none',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {p}
                </button>
              ))}
              <span style={{ padding: '0 8px', color: '#43474e' }}>...</span>
              <button
                onClick={() => setCurrentPage(12)}
                style={{
                  height: '40px', width: '40px', borderRadius: '8px', fontWeight: currentPage === 12 ? 700 : 500,
                  backgroundColor: currentPage === 12 ? '#002446' : 'transparent',
                  color: currentPage === 12 ? '#ffffff' : '#43474e',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                12
              </button>
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(12, currentPage + 1))}
              className="flex items-center"
              style={{ height: '40px', padding: '0 16px', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#002446', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Next <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </nav>
        </footer>
      </main>
    </div>
  );
}
