"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listFeaturedProperties, listAvailableProperties } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function FeaturedListings() {
  const [properties, setProperties] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try featured first, fallback to available
    listFeaturedProperties()
      .then((data: AnyData[]) => {
        if (data.length > 0) return data;
        return listAvailableProperties();
      })
      .then((data: AnyData[]) => setProperties(data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: '96px 24px', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '16px' }}>
          <div>
            <span className="font-headline" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#002446' }}>CURATED COLLECTION</span>
            <h2 className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#191c1d', lineHeight: 1.1, marginTop: '8px' }}>
              Featured Properties
            </h2>
          </div>
          <Link href="/listings" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#002446', fontWeight: 700, fontSize: '14px', textDecoration: 'none', padding: '8px 0' }}>
            View All Listings
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
          </div>
        ) : properties.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>home_work</span>
            <h3 className="text-xl font-bold" style={{ color: '#002446', marginTop: '16px' }}>No Properties Listed Yet</h3>
            <p style={{ color: '#64748b', marginTop: '8px' }}>Be the first to list your property on Homie.</p>
            <Link href="/signup" style={{ display: 'inline-block', marginTop: '24px', padding: '14px 32px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
            {properties.map((prop: AnyData) => (
              <Link key={prop.id} href={`/property/${prop.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: '220px', backgroundColor: '#f3f4f5' }}>
                    {prop.photos?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={prop.title} src={prop.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>home</span>
                      </div>
                    )}
                    <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px 12px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#ffffff', fontSize: '11px', fontWeight: 700, borderRadius: '8px' }}>{prop.type}</span>
                  </div>
                  {/* Info */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#002446', marginBottom: '4px' }} className="truncate">{prop.title}</h3>
                    <p className="truncate" style={{ fontSize: '13px', color: '#64748b' }}>{prop.address || `${prop.city}, ${prop.state}`}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#002446' }}>${prop.monthlyRent?.toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af' }}>/mo</span></span>
                      <div className="flex" style={{ gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#43474e', padding: '4px 8px', backgroundColor: '#f3f4f5', borderRadius: '4px' }}>{prop.bedrooms} bed</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#43474e', padding: '4px 8px', backgroundColor: '#f3f4f5', borderRadius: '4px' }}>{prop.bathrooms} bath</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
