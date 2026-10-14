"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { listAvailableProperties } from "@/lib/dataService";
import useGoogleMaps from "@/hooks/useGoogleMaps";
import { useAuth } from "@/context/AuthContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

function GoogleMap({
  properties,
  selectedId,
  onSelectProperty,
}: {
  properties: AnyData[];
  selectedId: string | null;
  onSelectProperty: (id: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const mapsLoaded = useGoogleMaps();

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 39.8283, lng: -98.5795 },
      zoom: 4,
      mapId: "d33308f0a48ade0a4dc9cb13",
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy",
    });

    mapInstanceRef.current = map;
  }, []);

  useEffect(() => {
    if (mapsLoaded && !mapInstanceRef.current) {
      initMap();
    }
  }, [mapsLoaded, initMap]);

  // Update markers when properties or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps?.marker) return;

    // Clear existing markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let hasValidCoords = false;

    properties.forEach((p: AnyData) => {
      if (!p.latitude || !p.longitude) return;
      hasValidCoords = true;

      const position = { lat: p.latitude, lng: p.longitude };
      bounds.extend(position);

      const isSelected = selectedId === p.id;
      const rent = p.monthlyRent >= 1000
        ? `ETB ${(p.monthlyRent / 1000).toFixed(1)}k`
        : `ETB ${p.monthlyRent}`;

      // Custom HTML pin
      const pinEl = document.createElement("div");
      pinEl.style.cssText = `
        background: ${isSelected ? "#ffffff" : "#002446"};
        color: ${isSelected ? "#002446" : "#ffffff"};
        padding: 6px 14px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 13px;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        border: ${isSelected ? "2px solid #002446" : "2px solid transparent"};
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
        transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
      `;
      pinEl.textContent = rent;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        content: pinEl,
        title: p.title,
        zIndex: isSelected ? 100 : 1,
      });

      marker.addListener("click", () => onSelectProperty(p.id));
      markersRef.current.push(marker);
    });

    // Fit bounds if we have markers
    if (hasValidCoords && properties.length > 0) {
      const withCoords = properties.filter((p: AnyData) => p.latitude && p.longitude);
      if (withCoords.length === 1) {
        map.setCenter({ lat: withCoords[0].latitude, lng: withCoords[0].longitude });
        map.setZoom(14);
      } else {
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }
    }
  }, [properties, selectedId, onSelectProperty]);

  if (!mapsLoaded) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e7e8e9" }}>
        <div style={{ textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#1a3a5f", animation: "spin 1s linear infinite" }}>progress_activity</span>
          <p style={{ color: "#64748b", marginTop: "12px", fontWeight: 500 }}>Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

export default function MapSearchPage() {
  const { user, role, loading: authLoading, logout } = useAuth();
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [properties, setProperties] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    listAvailableProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProps = searchQuery
    ? properties.filter((p: AnyData) =>
        (p.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (p.address?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (p.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (p.zipCode || "").includes(searchQuery)
      )
    : properties;

  const handleSelectProperty = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <div style={{ backgroundColor: '#f8f9fa', color: '#191c1d', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: '64px', backgroundColor: 'rgba(248,250,252,0.8)',
        backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 40,
        borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(241,245,249,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em', color: '#1e3a5f' }}>Homie</span>
          </Link>
          <div className="hidden md:flex" style={{ gap: '24px' }}>
            <Link href="/map-search" style={{ color: '#1e3a5f', fontWeight: 700, borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: '#1e3a5f', paddingBottom: '4px', textDecoration: 'none', fontSize: '14px' }}>Properties</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {authLoading ? (
            <div style={{ width: '80px', height: '32px', borderRadius: '8px', backgroundColor: '#e7e8e9', animation: 'pulse 1.5s infinite' }} />
          ) : user ? (
            <div className="flex items-center" style={{ gap: '12px' }}>
              <Link href="/dashboard" style={{ color: '#002446', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Dashboard</Link>
              {role === 'owner' && (
                <Link href="/properties/new" style={{
                  backgroundColor: '#002446', color: '#ffffff', padding: '8px 20px',
                  borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                }}>
                  List Property
                </Link>
              )}
              <button onClick={logout} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Log Out</button>
            </div>
          ) : (
            <div className="flex items-center" style={{ gap: '12px' }}>
              <Link href="/login" style={{ color: '#002446', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Log In</Link>
              <Link href="/signup" style={{
                backgroundColor: '#002446', color: '#ffffff', padding: '8px 20px',
                borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ===== MAP VIEW ===== */}
        {viewMode === 'map' && (
          <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
            {/* Map takes full area */}
            <div style={{ flex: 1, position: 'relative' }}>
              <GoogleMap
                properties={filteredProps}
                selectedId={selectedId}
                onSelectProperty={handleSelectProperty}
              />

              {/* Search & Filter overlay on top of map */}
              <div style={{
                position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 10,
                display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
              }}>
                {/* Search */}
                <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}>search</span>
                  <input
                    type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by city, address, or zip..."
                    style={{
                      width: '100%', padding: '12px 16px 12px 44px', backgroundColor: '#ffffff',
                      border: 'none', borderRadius: '12px', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    }}
                  />
                </div>
                {/* Filter Buttons */}
                <div className="hidden sm:flex" style={{ gap: '8px' }}>
                  {[{ icon: 'filter_list', label: 'Price' }, { icon: 'bed', label: 'Beds' }, { icon: 'home_work', label: 'Type' }].map(f => (
                    <button key={f.label} style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px',
                      backgroundColor: '#ffffff', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                      border: 'none', cursor: 'pointer', color: '#191c1d', whiteSpace: 'nowrap',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{f.icon}</span>
                      {f.label}
                    </button>
                  ))}
                </div>
                {/* View Toggle */}
                <div style={{ display: 'flex', backgroundColor: '#ffffff', padding: '4px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                  <button onClick={() => setViewMode("map")} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                    fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 700,
                    backgroundColor: '#002446', color: '#ffffff',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>map</span> Map
                  </button>
                  <button onClick={() => setViewMode("list")} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                    fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 500,
                    backgroundColor: 'transparent', color: '#64748b',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grid_view</span> Grid
                  </button>
                </div>
              </div>

              {/* Results count chip */}
              <div style={{
                position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10,
                backgroundColor: '#002446', color: '#ffffff', padding: '10px 20px', borderRadius: '9999px',
                fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}>
                {filteredProps.length} propert{filteredProps.length !== 1 ? 'ies' : 'y'} found
              </div>
            </div>

            {/* Sidebar panel (large screens only) */}
            <div className="hidden lg:flex" style={{
              width: '384px', backgroundColor: '#ffffff', borderLeftWidth: '1px', borderLeftStyle: 'solid', borderLeftColor: '#f1f5f9',
              flexDirection: 'column', height: '100%', zIndex: 20,
            }}>
              <div style={{ padding: '20px 24px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: '#f8fafc' }}>
                <h2 className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e3a5f' }}>Nearby</h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{filteredProps.length} result{filteredProps.length !== 1 ? 's' : ''}</p>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                  </div>
                ) : filteredProps.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#c3c6cf' }}>search_off</span>
                    <p style={{ color: '#64748b', marginTop: '12px' }}>No properties found.</p>
                  </div>
                ) : (
                  filteredProps.map((p: AnyData) => <PropertyCard key={p.id} p={p} selected={selectedId === p.id} onClick={() => setSelectedId(p.id)} />)
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== LIST/GRID VIEW ===== */}
        {viewMode === 'list' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Filter bar for grid view */}
            <div style={{
              padding: '12px 24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap',
              backgroundColor: '#ffffff', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9',
              gap: '12px',
            }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>search</span>
                <input
                  type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by city, address, or zip..."
                  style={{
                    width: '100%', padding: '10px 16px 10px 40px', backgroundColor: '#f3f4f5',
                    border: 'none', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div className="hidden sm:flex" style={{ gap: '8px' }}>
                {[{ icon: 'filter_list', label: 'Price' }, { icon: 'bed', label: 'Beds' }, { icon: 'home_work', label: 'Type' }].map(f => (
                  <button key={f.label} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px',
                    backgroundColor: '#f3f4f5', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                    border: 'none', cursor: 'pointer', color: '#191c1d', whiteSpace: 'nowrap',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', backgroundColor: '#f3f4f5', padding: '4px', borderRadius: '12px' }}>
                <button onClick={() => setViewMode("map")} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                  fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 500,
                  backgroundColor: 'transparent', color: '#64748b',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>map</span> Map
                </button>
                <button onClick={() => setViewMode("list")} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                  fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  backgroundColor: '#ffffff', color: '#191c1d',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grid_view</span> Grid
                </button>
              </div>
            </div>

            {/* Grid header */}
            <div style={{ padding: '20px 24px 0' }}>
              <h2 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a5f' }}>Available Properties</h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{filteredProps.length} result{filteredProps.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Grid body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                </div>
              ) : filteredProps.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#c3c6cf' }}>search_off</span>
                  <p style={{ color: '#64748b', marginTop: '12px' }}>No properties found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: '20px' }}>
                  {filteredProps.map((p: AnyData) => <PropertyCard key={p.id} p={p} selected={selectedId === p.id} onClick={() => setSelectedId(p.id)} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Book a Walk FAB */}
        {selectedId && (
          <button style={{
            position: 'fixed', bottom: '24px', right: '40px',
            backgroundColor: '#fc9430', color: '#663500',
            padding: '14px 24px', borderRadius: '9999px', fontWeight: 700,
            boxShadow: '0 8px 32px rgba(252,148,48,0.4)',
            display: 'flex', alignItems: 'center', gap: '10px',
            border: 'none', cursor: 'pointer', zIndex: 30, fontSize: '14px',
          }}>
            <span className="material-symbols-outlined">calendar_today</span>
            Book a Walk
          </button>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ p, selected, onClick }: { p: AnyData; selected: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s',
        boxShadow: selected ? '0 0 0 2px #002446, 0 0 0 4px rgba(0,36,70,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ height: '180px', position: 'relative', backgroundColor: '#f3f4f5' }}>
          {p.photos?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={p.title} src={p.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#c3c6cf' }}>home</span>
            </div>
          )}
          {p.featured && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Featured
            </div>
          )}
          <button onClick={e => { e.stopPropagation(); }} style={{
            position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '9999px',
            backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', border: 'none', cursor: 'pointer',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>favorite</span>
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <h3 className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#002446' }}>ETB {p.monthlyRent?.toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 400, color: '#9ca3af' }}>/mo</span></h3>
          </div>
          <p className="truncate" style={{ fontSize: '13px', color: '#475569', fontWeight: 500, marginBottom: '12px' }}>{p.title || p.address}</p>
          <div style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '13px', borderTop: '1px solid #f8fafc', paddingTop: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bed</span> {p.bedrooms}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bathtub</span> {p.bathrooms}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>square_foot</span> {p.squareFootage?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
