"use client";

import Link from "next/link";
import { use, useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProperty, deleteProperty, updateProperty, createApplication, createViewing, listSeekerApplications } from "@/lib/dataService";
import useGoogleMaps from "@/hooks/useGoogleMaps";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

function PropertyLocationMap({ lat, lng, title }: { lat: number, lng: number, title: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapsLoaded = useGoogleMaps();

  useEffect(() => {
    if (mapsLoaded && mapRef.current) {
      const pos = { lat, lng };
      const map = new window.google.maps.Map(mapRef.current, {
        center: pos,
        zoom: 15,
        mapId: "d33308f0a48ade0a4dc9cb13",
        disableDefaultUI: true,
        zoomControl: true,
      });

      // Custom HTML pin for visual consistency
      const pinEl = document.createElement("div");
      pinEl.style.cssText = `
        background: #002446; color: #ffffff; padding: 6px 14px;
        border-radius: 9999px; font-weight: 700; font-size: 13px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25); border: 2px solid #ffffff;
        white-space: nowrap;
      `;
      pinEl.textContent = title || "Location";

      new window.google.maps.marker.AdvancedMarkerElement({
        position: pos,
        map,
        content: pinEl,
      });
    }
  }, [mapsLoaded, lat, lng, title]);

  if (!mapsLoaded) {
    return (
      <div style={{ height: '320px', width: '100%', borderRadius: '12px', backgroundColor: '#e7e8e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(0, 36, 70, 0.1)', borderTop: '3px solid #002446', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return <div ref={mapRef} style={{ height: '320px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }} />;
}



export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, role } = useAuth();
  const [property, setProperty] = useState<AnyData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "", monthlyRent: 0 });
  const [hasApplied, setHasApplied] = useState(false);

  // Apply to Rent modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ message: "", moveInDate: "", employmentStatus: "Employed", monthlyIncome: "" });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Schedule Tour modal
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourForm, setTourForm] = useState({ scheduledDate: "", scheduledTime: "10:00", notes: "" });
  const [tourSubmitting, setTourSubmitting] = useState(false);
  const [tourSuccess, setTourSuccess] = useState(false);

  useEffect(() => {
    getProperty(id).then(p => {
      if (p) {
        setProperty(p);
        setEditData({ title: p.title, description: p.description, monthlyRent: p.monthlyRent });
      }
    }).catch(console.error);
  }, [id]);

  // Check if seeker has already applied to this property
  useEffect(() => {
    if (user && role === 'seeker') {
      listSeekerApplications().then(apps => {
        setHasApplied(apps.some((a: AnyData) => a.property?.id === id));
      }).catch(console.error);
    }
  }, [user, role, id]);

  if (!property) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '48px', height: '48px', border: '4px solid rgba(26, 58, 95, 0.1)', borderTop: '4px solid #1a3a5f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

  const isOwner = user?.uid === property.owner?.id;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(id);
      window.location.href = "/properties";
    } catch (e) {
      alert("Failed to delete property");
    }
  };

  const handleSave = async () => {
    try {
      await updateProperty(id, editData);
      setProperty({ ...property, ...editData });
      setIsEditing(false);
    } catch (e) {
      alert("Failed to save changes");
    }
  };

  const handleApplySubmit = async () => {
    if (!user) { window.location.href = "/login"; return; }
    if (!applyForm.moveInDate) { alert("Please choose a move-in date."); return; }
    setApplySubmitting(true);
    try {
      await createApplication({
        propertyId: id,
        ownerId: property.owner?.id || "",
        message: applyForm.message,
        moveInDate: applyForm.moveInDate,
        employmentStatus: applyForm.employmentStatus,
        monthlyIncome: applyForm.monthlyIncome ? parseFloat(applyForm.monthlyIncome) : undefined,
      });
      setApplySuccess(true);
    } catch (e) {
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplySubmitting(false);
    }
  };

  const handleTourSubmit = async () => {
    if (!user) { window.location.href = "/login"; return; }
    if (!tourForm.scheduledDate) { alert("Please choose a date."); return; }
    setTourSubmitting(true);
    try {
      await createViewing({
        propertyId: id,
        ownerId: property.owner?.id || "",
        scheduledDate: tourForm.scheduledDate,
        scheduledTime: tourForm.scheduledTime,
        notes: tourForm.notes,
      });
      setTourSuccess(true);
    } catch (e) {
      alert("Failed to schedule tour. Please try again.");
    } finally {
      setTourSubmitting(false);
    }
  };

  const isCommercial = ['Office Space', 'Retail/Shop', 'Warehouse', 'Restaurant', 'Hotel', 'Co-working Space'].includes(property.type);

  let floor = "";
  let leaseType = "";
  const cleanAmenities: string[] = [];

  (property.amenities || []).forEach((a: string) => {
    if (a.startsWith("Floor: ")) {
      floor = a.replace("Floor: ", "");
    } else if (a.startsWith("Lease: ")) {
      leaseType = a.replace("Lease: ", "");
    } else {
      cleanAmenities.push(a);
    }
  });

  const dynamicFeatures = [
    { icon: isCommercial ? "meeting_room" : "bed", label: isCommercial ? "Rooms / Offices" : "Bedrooms", value: `${property.bedrooms || 0} ${isCommercial ? 'Rooms' : 'Beds'}` },
    { icon: isCommercial ? "bathroom" : "bathtub", label: isCommercial ? "Restrooms" : "Bathrooms", value: `${property.bathrooms || 0} ${isCommercial ? 'Restrooms' : 'Baths'}` },
    { icon: "square_foot", label: isCommercial ? "Floor Area" : "Living Area", value: `${property.squareFootage?.toLocaleString() || 0} sq ft` },
    { icon: "garage", label: "Parking", value: `${property.parkingSpaces || 0} Spaces` },
  ];

  return (
    <>
      <div style={{ background: '#f8f9fa', color: '#191c1d', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <header style={{ backgroundColor: 'rgba(248,250,252,0.8)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1440px', margin: '0 auto', padding: '16px 32px' }}>
          <div className="flex items-center" style={{ gap: '32px' }}>
            <Link href={user ? "/dashboard" : "/"} style={{ textDecoration: 'none' }}>
              <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#1a3a5f' }}>Homie</span>
            </Link>
            {user && (
              <div className="flex" style={{ gap: '24px' }}>
                <Link href="/dashboard" style={{ color: '#64748b', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>Seeker View</Link>
                <Link href="/dashboard" style={{ color: '#1a3a5f', fontWeight: 700, borderBottom: '2px solid #1a3a5f', paddingBottom: '4px', textDecoration: 'none' }}>Owner View</Link>
                <Link href="/listings" style={{ color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>Marketplace</Link>
                <Link href="/dashboard" style={{ color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>Reports</Link>
              </div>
            )}
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="flex items-center" style={{ backgroundColor: '#e7e8e9', borderRadius: '8px', padding: '6px 12px', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#73777f', fontSize: '16px' }}>search</span>
              <input type="text" placeholder="Search properties..." style={{ backgroundColor: 'transparent', border: 'none', fontSize: '14px', width: '192px', outline: 'none' }} />
            </div>
            {user ? (
              <>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ padding: '8px', color: '#64748b', cursor: 'pointer' }}>notifications</span>
                  <span className="material-symbols-outlined" style={{ padding: '8px', color: '#64748b', cursor: 'pointer' }}>settings</span>
                </div>
                <Link href="/properties/new" style={{ backgroundColor: '#002446', color: '#ffffff', padding: '8px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none', fontSize: '14px' }}>List Property</Link>
              </>
            ) : (
              <div className="flex items-center" style={{ gap: '12px' }}>
                <Link href="/login" style={{ color: '#002446', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Log In</Link>
                <Link href="/signup" style={{ backgroundColor: '#002446', color: '#ffffff', padding: '8px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none', fontSize: '14px' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center" style={{ gap: '8px', fontSize: '14px', color: '#73777f', marginBottom: '32px' }}>
          <Link href="/properties" style={{ color: '#73777f', textDecoration: 'none' }}>Marketplace</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#73777f', textDecoration: 'none' }}>Residential</span>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#191c1d', fontWeight: 500 }}>{property.title}</span>
        </nav>

        {/* Bento Gallery */}
        {property.photos && property.photos.length > 0 && (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '16px', height: '600px', marginBottom: '48px' }}>
            {property.photos.slice(0, 5).map((photoUrl: string, i: number) => {
              const isMain = i === 0;
              return (
                <div
                  key={i}
                  style={{
                    gridColumn: isMain ? 'span 2' : 'span 1',
                    gridRow: isMain ? 'span 2' : 'span 1',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '12px',
                  }}
                >
                  <img
                    alt={`Photo ${i+1}`}
                    src={photoUrl}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.7s',
                      filter: i === 4 && property.photos?.length > 5 ? 'brightness(0.5)' : undefined,
                    }}
                  />
                  {isMain && (
                    <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#002446', color: '#ffffff', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Premium Listing
                    </div>
                  )}
                  {i === 4 && property.photos?.length > 5 && (
                    <button style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      + {property.photos.length - 5} More Photos
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Title */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                {isEditing ? (
                  <input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#002446', border: '1px solid #c3c6cf', borderRadius: '8px', padding: '8px', width: '100%' }} />
                ) : (
                  <h1 className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#002446' }}>{property.title}</h1>
                )}
                <div className="flex" style={{ gap: '8px', marginLeft: '16px' }}>
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
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </p>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap" style={{ gap: '32px', padding: '32px 0', borderTop: '1px solid #edeeef', borderBottom: '1px solid #edeeef' }}>
              {dynamicFeatures.map((f) => (
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
              {isEditing ? (
                <textarea rows={5} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} style={{ color: '#43474e', lineHeight: '1.8', border: '1px solid #c3c6cf', borderRadius: '8px', padding: '8px', width: '100%', resize: 'vertical' }} />
              ) : (
                <p style={{ color: '#43474e', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                  {property.description}
                </p>
              )}
            </article>

            {/* Commercial Specs */}
            {isCommercial && (floor || leaseType) && (
              <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: '#f3f4f5', borderRadius: '12px' }}>
                <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#002446' }}>Commercial Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {floor && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#73777f', fontWeight: 700, textTransform: 'uppercase' }}>Floor Number</p>
                      <p style={{ fontWeight: 700, color: '#191c1d', fontSize: '16px', marginTop: '4px' }}>{floor}</p>
                    </div>
                  )}
                  {leaseType && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#73777f', fontWeight: 700, textTransform: 'uppercase' }}>Lease Type</p>
                      <p style={{ fontWeight: 700, color: '#191c1d', fontSize: '16px', marginTop: '4px' }}>{leaseType}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Amenities */}
            {cleanAmenities.length > 0 && (
              <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446' }}>Exclusive Amenities</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  {cleanAmenities.map((a: string) => (
                    <div key={a} className="flex items-center" style={{ gap: '12px' }}>
                      <span className="material-symbols-outlined" style={{ color: '#72af90' }}>check_circle</span>
                      <span style={{ color: '#191c1d' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location (Dynamic Map) */}
            {property.latitude && property.longitude && (
              <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446' }}>Location</h2>
                <PropertyLocationMap lat={property.latitude} lng={property.longitude} title={property.title} />
              </section>
            )}
          </div>

          {/* Right Column: Sticky Sidebar */}
          <aside style={{ position: 'relative' }}>
            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Pricing Card */}
              <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(25,28,29,0.08)', border: '1px solid rgba(195,198,207,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                  <div>
                    <p style={{ color: '#73777f', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Rent</p>
                    {isEditing ? (
                      <div className="flex items-center mt-1">
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002446', marginRight: '8px' }}>ETB</span>
                        <input type="number" value={editData.monthlyRent} onChange={e => setEditData({...editData, monthlyRent: parseFloat(e.target.value)||0})} style={{ fontSize: '2rem', fontWeight: 900, color: '#002446', border: '1px solid #c3c6cf', borderRadius: '8px', padding: '4px', width: '120px' }} />
                      </div>
                    ) : (
                      <h3 className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#002446' }}>
                        ETB {property.monthlyRent?.toLocaleString()}<span style={{ fontSize: '18px', fontWeight: 500, color: '#73777f' }}>/mo</span>
                      </h3>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#002a1a', backgroundColor: '#b1f0ce', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{property.status}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {[
                    { icon: "verified_user", text: "Verified Property & Owner" },
                    { icon: "event_available", text: "Guided Tour Available" },
                    { icon: "history", text: "Listed recently" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center" style={{ gap: '12px', fontSize: '14px', color: '#43474e' }}>
                      <span className="material-symbols-outlined" style={{ color: '#002446', fontSize: '20px' }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                
                {isOwner ? (
                   isEditing ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <button onClick={handleSave} style={{ width: '100%', backgroundColor: '#002446', color: '#ffffff', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                         Save Changes
                       </button>
                       <button onClick={() => setIsEditing(false)} style={{ width: '100%', backgroundColor: '#f3f4f5', color: '#191c1d', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: '1px solid #c3c6cf', cursor: 'pointer', transition: 'all 0.2s' }}>
                         Cancel
                       </button>
                     </div>
                   ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <button onClick={() => setIsEditing(true)} style={{ width: '100%', backgroundColor: '#002446', color: '#ffffff', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                         Edit Property
                       </button>
                       <button onClick={handleDelete} style={{ width: '100%', backgroundColor: '#fff0f0', border: '1px solid #ffdad6', color: '#ba1a1a', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s' }}>
                         Delete Property
                       </button>
                     </div>
                   )
                 ) : role === 'owner' ? (
                   <div style={{ padding: '16px', backgroundColor: '#ffdcc3', borderRadius: '12px', color: '#914d00', fontWeight: 600, textAlign: 'center', fontSize: '14px' }}>
                     You are logged in as a Landlord. Landlords cannot apply to rent or schedule tours.
                   </div>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     {hasApplied ? (
                       <button disabled style={{ width: '100%', backgroundColor: '#b1f0ce', color: '#002a1a', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                         <span className="material-symbols-outlined">check_circle</span>
                         Applied
                       </button>
                     ) : (
                       <button onClick={() => { if (!user) { window.location.href = '/login'; } else { setShowApplyModal(true); } }} style={{ width: '100%', backgroundColor: '#002446', color: '#ffffff', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                         Apply to Rent
                       </button>
                     )}
                     <button onClick={() => { if (!user) { window.location.href = '/login'; } else { setShowTourModal(true); } }} style={{ width: '100%', backgroundColor: '#fc9430', color: '#663500', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                       Schedule a Tour
                     </button>
                   </div>
                 )}
                
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#73777f', marginTop: '24px' }}>
                  Application fee: ETB 1,000 per applicant over 18.
                </p>
              </div>

              {/* Host Profile */}
              <div className="flex items-center" style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '16px', border: '1px solid rgba(195,198,207,0.3)', gap: '16px' }}>
                {property.owner?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={property.owner.displayName} src={property.owner.photoUrl} style={{ width: '56px', height: '56px', borderRadius: '9999px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '56px', height: '56px', borderRadius: '9999px', backgroundColor: '#c3c6cf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: '32px' }}>person</span>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '12px', color: '#73777f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Manager</p>
                  <p style={{ fontWeight: 700, color: '#191c1d' }}>{property.owner?.displayName || "Agent"}</p>
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#fc9430', fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>4.8 (New)</span>
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
              <li><a href="/listings" style={{ color: 'inherit', textDecoration: 'none' }}>All Listings</a></li>
              <li><a href="/map-search" style={{ color: 'inherit', textDecoration: 'none' }}>Map Search</a></li>
              <li><a href="/listings" style={{ color: 'inherit', textDecoration: 'none' }}>Commercial</a></li>
              <li><a href="/listings" style={{ color: 'inherit', textDecoration: 'none' }}>Residential</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '24px', color: '#f0f1f2' }}>Management</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#87a4cf' }}>
              <li><a href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Owner Portal</a></li>
              <li><a href="/maintenance" style={{ color: 'inherit', textDecoration: 'none' }}>Maintenance Request</a></li>
              <li><a href="/leases" style={{ color: 'inherit', textDecoration: 'none' }}>Lease Agreement</a></li>
              <li><a href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Reports</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '24px', color: '#f0f1f2' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#87a4cf' }}>
              <li className="flex items-center" style={{ gap: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span> hello@homie.et</li>
              <li className="flex items-center" style={{ gap: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>phone</span> +251 (0) 911-234567</li>
              <li className="flex items-center" style={{ gap: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span> Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px', marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(135,164,207,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#87a4cf' }}>
          <p>© 2024 Homie Real Estate. All rights reserved.</p>
          <div className="flex" style={{ gap: '24px' }}>
            <a href="/listings" style={{ color: 'inherit', textDecoration: 'none' }}>Properties</a>
            <a href="/map-search" style={{ color: 'inherit', textDecoration: 'none' }}>Map Search</a>
            <a href="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>Sign Up</a>
          </div>
        </div>
      </footer>
    </div>

      {/* Apply to Rent Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={() => setShowApplyModal(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#002446' }}>check_circle</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446', marginTop: '16px' }}>Application Submitted!</h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>The property owner will review your application and get back to you soon.</p>
                <button onClick={() => { setShowApplyModal(false); setApplySuccess(false); }} style={{ marginTop: '24px', padding: '12px 32px', backgroundColor: '#002446', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#002446' }}>Apply to Rent</h2>
                  <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><span className="material-symbols-outlined">close</span></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Desired Move-in Date *</label>
                    <input type="date" value={applyForm.moveInDate} onChange={e => setApplyForm(f => ({ ...f, moveInDate: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Employment Status</label>
                    <select value={applyForm.employmentStatus} onChange={e => setApplyForm(f => ({ ...f, employmentStatus: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }}>
                      <option>Employed</option>
                      <option>Self-Employed</option>
                      <option>Student</option>
                      <option>Retired</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Monthly Income (ETB)</label>
                    <input type="number" placeholder="e.g. 25000" value={applyForm.monthlyIncome} onChange={e => setApplyForm(f => ({ ...f, monthlyIncome: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Message to Owner</label>
                    <textarea rows={3} placeholder="Introduce yourself and why you want this property..." value={applyForm.message} onChange={e => setApplyForm(f => ({ ...f, message: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={handleApplySubmit} disabled={applySubmitting} style={{ width: '100%', backgroundColor: '#002446', color: '#ffffff', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: applySubmitting ? 'not-allowed' : 'pointer', opacity: applySubmitting ? 0.7 : 1 }}>
                    {applySubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Schedule a Tour Modal */}
      {showTourModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={() => setShowTourModal(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            {tourSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#002446' }}>event_available</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446', marginTop: '16px' }}>Tour Scheduled!</h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Your viewing request has been sent. The owner will confirm the time shortly.</p>
                <button onClick={() => { setShowTourModal(false); setTourSuccess(false); }} style={{ marginTop: '24px', padding: '12px 32px', backgroundColor: '#002446', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#002446' }}>Schedule a Tour</h2>
                  <button onClick={() => setShowTourModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><span className="material-symbols-outlined">close</span></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Preferred Date *</label>
                    <input type="date" value={tourForm.scheduledDate} onChange={e => setTourForm(f => ({ ...f, scheduledDate: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Preferred Time</label>
                    <select value={tourForm.scheduledTime} onChange={e => setTourForm(f => ({ ...f, scheduledTime: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }}>
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Additional Notes</label>
                    <textarea rows={3} placeholder="Any specific requests or questions?" value={tourForm.notes} onChange={e => setTourForm(f => ({ ...f, notes: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={handleTourSubmit} disabled={tourSubmitting} style={{ width: '100%', backgroundColor: '#fc9430', color: '#663500', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: tourSubmitting ? 'not-allowed' : 'pointer', opacity: tourSubmitting ? 0.7 : 1 }}>
                    {tourSubmitting ? 'Scheduling...' : 'Confirm Tour Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
