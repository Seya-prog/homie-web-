"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listAvailableProperties, searchProperties } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

const propertyTypes = ["Apartment", "House", "Condo", "Townhouse", "Studio"];
const amenitiesList = ["Parking", "Pool", "Gym", "Pet Friendly", "Laundry", "AC"];
const bedroomOpts = ["Any", "1+", "2+", "3+"];

export default function ListingsPage() {
  const [activeNav, setActiveNav] = useState("Discover");
  const [viewMode, setViewMode] = useState("Grid");
  const [activeBed, setActiveBed] = useState("Any");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    listAvailableProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setLoading(true);
      const data = await listAvailableProperties();
      setProperties(data);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const results = await searchProperties(searchQuery);
      setProperties(results);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleFav = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const resetFilters = async () => {
    setActiveBed("Any");
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setLoading(true);
    const data = await listAvailableProperties();
    setProperties(data);
    setLoading(false);
  };

  const filtered = properties.filter((p: AnyData) => {
    // Bedroom filter
    if (activeBed !== "Any") {
      const minBeds = parseInt(activeBed);
      if ((p.bedrooms || 0) < minBeds) return false;
    }
    // Property type filter
    if (selectedTypes.length > 0) {
      if (!selectedTypes.includes(p.type)) return false;
    }
    // Amenities filter
    if (selectedAmenities.length > 0) {
      const propAmenities: string[] = p.amenities || [];
      const petCheck = selectedAmenities.includes("Pet Friendly") && !p.petFriendly;
      const otherAmenities = selectedAmenities.filter(a => a !== "Pet Friendly");
      const hasAll = otherAmenities.every(a => propAmenities.includes(a));
      if (petCheck || !hasAll) return false;
    }
    // Price range filter
    if (minPrice && p.monthlyRent < parseFloat(minPrice)) return false;
    if (maxPrice && p.monthlyRent > parseFloat(maxPrice)) return false;
    return true;
  });

  return (
    <div style={{ background: '#f8f9fa', color: '#191c1d', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: '64px',
        backgroundColor: 'rgba(248,250,252,0.8)', backdropFilter: 'blur(16px)',
      }}>
        <div className="flex items-center" style={{ gap: '24px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em', color: '#1e3a5f' }}>Homie</span>
          </Link>
          <div className="hidden md:flex" style={{ gap: '24px' }}>
            {["Discover", "Saved", "Map"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveNav(tab); if (tab === "Map") window.location.href = "/map-search"; }}
                style={{
                  color: activeNav === tab ? '#0f172a' : '#64748b',
                  fontWeight: activeNav === tab ? 700 : 500,
                  borderBottom: activeNav === tab ? '2px solid #0f172a' : '2px solid transparent',
                  background: 'none', border: 'none', cursor: 'pointer',
                  paddingBottom: '4px', fontSize: '14px',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>search</span>
            <input
              type="text"
              value={searchQuery || ""}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search city, address..."
              style={{ paddingLeft: '40px', paddingRight: '16px', padding: '8px 16px 8px 40px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', fontSize: '14px', width: '220px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <Link href="/dashboard" style={{ backgroundColor: '#002446', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>Dashboard</Link>
        </div>
      </nav>

      {/* Sidebar Filters */}
      <aside className="hidden lg:flex" style={{
        height: 'calc(100vh - 64px)', width: '256px', position: 'fixed', left: 0, top: '64px',
        backgroundColor: '#f8fafc', flexDirection: 'column', gap: '8px',
        padding: '24px', borderRight: '1px solid #f1f5f9', overflowY: 'auto', zIndex: 40,
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '16px' }}>Search Filters</h3>

          {/* Property Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Property Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {propertyTypes.map((t) => (
                <label key={t} className="flex items-center" style={{ gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t) || false}
                    onChange={() => toggleType(t)}
                    style={{ borderRadius: '4px', accentColor: '#002446' }}
                  /> {t}
                </label>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Bedrooms</label>
            <div className="flex" style={{ backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              {bedroomOpts.map((b) => (
                <button key={b} onClick={() => setActiveBed(b)} style={{
                  flex: 1, padding: '4px', fontSize: '12px', fontWeight: 500, borderRadius: '6px',
                  backgroundColor: activeBed === b ? '#ffffff' : 'transparent',
                  boxShadow: activeBed === b ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  border: 'none', cursor: 'pointer',
                }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Price Range</label>
            <div className="flex" style={{ gap: '8px' }}>
              <input
                type="number"
                value={minPrice || ""}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="Min"
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
              <span style={{ color: '#9ca3af', alignSelf: 'center' }}>–</span>
              <input
                type="number"
                value={maxPrice || ""}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="Max"
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#002446', marginBottom: '12px' }}>Amenities</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {amenitiesList.map((a) => (
                <label key={a} className="flex items-center" style={{ gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a) || false}
                    onChange={() => toggleAmenity(a)}
                    style={{ borderRadius: '4px', accentColor: '#002446' }}
                  /> {a}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter count */}
        {(selectedTypes.length > 0 || selectedAmenities.length > 0 || activeBed !== "Any" || minPrice || maxPrice) && (
          <div style={{ padding: '8px 12px', backgroundColor: '#d3e3ff', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#002446', marginBottom: '8px' }}>
            {[
              selectedTypes.length > 0 ? `${selectedTypes.length} type${selectedTypes.length > 1 ? 's' : ''}` : '',
              activeBed !== "Any" ? `${activeBed} beds` : '',
              selectedAmenities.length > 0 ? `${selectedAmenities.length} amenit${selectedAmenities.length > 1 ? 'ies' : 'y'}` : '',
              (minPrice || maxPrice) ? 'price range' : '',
            ].filter(Boolean).join(' · ')} active
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handleSearch} style={{ width: '100%', padding: '12px 16px', backgroundColor: '#fc9430', color: '#663500', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Apply Filters
          </button>
          <button onClick={resetFilters} style={{ width: '100%', padding: '12px 16px', backgroundColor: 'transparent', color: '#64748b', fontWeight: 500, borderRadius: '8px', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
            Reset All
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-[256px]" style={{ paddingTop: '96px', padding: '96px 32px 48px', minHeight: '100vh' }}>
        {/* Header */}
        <header className="flex flex-wrap" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px' }}>
          <div>
            <h1 className="font-headline text-3xl md:text-4xl" style={{ fontWeight: 800, letterSpacing: '-0.05em', color: '#002446', marginBottom: '8px' }}>Discover Properties</h1>
            <p style={{ color: '#43474e' }}>
              {loading ? 'Loading...' : `Showing ${filtered.length} propert${filtered.length !== 1 ? 'ies' : 'y'}`}
            </p>
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="flex" style={{ backgroundColor: '#e7e8e9', padding: '4px', borderRadius: '8px' }}>
              {["Grid", "Map"].map((v) => (
                <button
                  key={v}
                  onClick={() => { setViewMode(v); if (v === "Map") window.location.href = "/map-search"; }}
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
          </div>
        </header>

        {/* Property Grid */}
        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>search_off</span>
            <h3 className="text-xl font-bold" style={{ color: '#002446', marginTop: '16px' }}>No Properties Found</h3>
            <p style={{ color: '#64748b', marginTop: '8px' }}>Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: '24px' }}>
            {filtered.map((prop: AnyData) => (
              <Link href={`/properties/${prop.id}`} key={prop.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="group" style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#f3f4f5' }}>
                    {prop.photos?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={prop.title}
                        src={prop.photos[0]}
                        className="group-hover:scale-110"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>home</span>
                      </div>
                    )}
                    {prop.featured && (
                      <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                        <span style={{ padding: '4px 12px', backgroundColor: '#002446', color: '#ffffff', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '9999px' }}>
                          Featured
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFav(prop.id); }}
                      style={{
                        position: 'absolute', top: '16px', right: '16px',
                        width: '40px', height: '40px',
                        backgroundColor: favorites.includes(prop.id) ? '#ffffff' : 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(12px)', borderRadius: '9999px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: favorites.includes(prop.id) ? '#ef4444' : '#ffffff',
                        border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: favorites.includes(prop.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div className="flex flex-wrap" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                      <h3 className="font-headline truncate" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#002446', maxWidth: '60%' }}>{prop.title}</h3>
                      <p className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#002446', whiteSpace: 'nowrap' }}>
                        ${prop.monthlyRent?.toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 400, color: '#9ca3af' }}>/mo</span>
                      </p>
                    </div>
                    <p className="flex items-center truncate" style={{ fontSize: '13px', color: '#43474e', gap: '4px', marginBottom: '16px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                      {prop.address || `${prop.city}, ${prop.state}`}
                    </p>
                    <div className="flex flex-wrap" style={{ justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f3f4f5', color: '#43474e', fontSize: '12px', fontWeight: 600, gap: '8px' }}>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bed</span> {prop.bedrooms} {prop.bedrooms === 1 ? 'Bed' : 'Beds'}
                      </div>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bathtub</span> {prop.bathrooms} {prop.bathrooms === 1 ? 'Bath' : 'Baths'}
                      </div>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>square_foot</span> {prop.squareFootage?.toLocaleString()} sqft
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
