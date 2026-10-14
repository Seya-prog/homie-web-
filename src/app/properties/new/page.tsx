"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createProperty } from "@/lib/dataService";
import { uploadPropertyPhotos } from "@/lib/storage";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import useGoogleMaps from "@/hooks/useGoogleMaps";

const steps = [
  { num: 1, label: "Property Details" },
  { num: 2, label: "Media" },
  { num: 3, label: "Pricing" },
  { num: 4, label: "Publish" },
];

export default function AddPropertyPage() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Laundry']);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>(['Electricity', 'Internet']);
  const [submitting, setSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [propertyCategory, setPropertyCategory] = useState<'Residential' | 'Commercial'>('Residential');
  const [propertyType, setPropertyType] = useState("Apartment");
  const [sqft, setSqft] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [floor, setFloor] = useState("");
  const [leaseType, setLeaseType] = useState("Gross Lease");
  const [yearBuilt, setYearBuilt] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);

  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteInitRef = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const mapsLoaded = useGoogleMaps();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user && role && role !== "owner") router.push("/dashboard");
  }, [authLoading, user, role, router]);

  // Handle Autocomplete
  useEffect(() => {
    if (!mapsLoaded || !autocompleteInputRef.current || autocompleteInitRef.current) return;
    if (!window.google?.maps?.places?.Autocomplete) return;

    autocompleteInitRef.current = true;

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
      fields: ['formatted_address', 'geometry', 'address_components', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLatitude(lat);
      setLongitude(lng);

      let streetNumber = "";
      let route = "";
      let extractedCity = "";
      let extractedState = "";
      let extractedZip = "";

      place.address_components?.forEach(component => {
        const types = component.types;
        if (types.includes("street_number")) streetNumber = component.long_name;
        if (types.includes("route")) route = component.long_name;
        if (types.includes("locality")) extractedCity = component.long_name;
        // Also check sublocality for cities like NYC boroughs
        if (!extractedCity && types.includes("sublocality_level_1")) extractedCity = component.long_name;
        if (types.includes("administrative_area_level_1")) extractedState = component.short_name;
        if (types.includes("postal_code")) extractedZip = component.long_name;
        // Some addresses split postal code into prefix + suffix
        if (types.includes("postal_code_suffix") && extractedZip) extractedZip += "-" + component.long_name;
      });

      setAddress(`${streetNumber} ${route}`.trim() || place.formatted_address || "");
      if (extractedCity) setCity(extractedCity);
      if (extractedState) setState(extractedState);
      if (extractedZip) setZipCode(extractedZip);

      if (mapInstanceRef.current && markerInstanceRef.current) {
        const pos = { lat, lng };
        mapInstanceRef.current.setCenter(pos);
        mapInstanceRef.current.setZoom(16);
        markerInstanceRef.current.position = pos;
      }
    });
  }, [mapsLoaded]);

  // Init Map
  useEffect(() => {
    if (mapsLoaded && mapContainerRef.current && !mapInstanceRef.current && window.google?.maps?.Map && window.google?.maps?.marker?.AdvancedMarkerElement) {
      const center = { lat: 39.8283, lng: -98.5795 };
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 4,
        mapId: "d33308f0a48ade0a4dc9cb13",
        disableDefaultUI: true,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      // Custom HTML pin for visual consistency
      const pinEl = document.createElement("div");
      pinEl.style.cssText = `
        background: #002446; color: #ffffff; padding: 6px 14px;
        border-radius: 9999px; font-weight: 700; font-size: 13px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25); border: 2px solid #ffffff;
      `;
      pinEl.textContent = "Location";

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: center,
        map,
        content: pinEl,
      });
      markerInstanceRef.current = marker;
    }
  }, [mapsLoaded]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreviews(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handlePublish = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
    if (!user) return;
    setSubmitting(true);
    try {
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        photoUrls = await uploadPropertyPhotos(photoFiles, "new");
      }
      
      const finalAmenities = [...selectedAmenities];
      if (propertyCategory === 'Commercial') {
        if (floor.trim()) finalAmenities.push(`Floor: ${floor.trim()}`);
        if (leaseType) finalAmenities.push(`Lease: ${leaseType}`);
      }

      await createProperty({
        title, description, type: propertyType,
        monthlyRent: parseFloat(monthlyRent), bedrooms, bathrooms,
        squareFootage: parseInt(sqft) || 0,
        address, city, state, zipCode,
        amenities: finalAmenities, photos: photoUrls,
        petFriendly: selectedAmenities.includes("Pet Friendly"),
        parkingSpaces: selectedAmenities.includes("Parking") ? 1 : 0,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
        latitude, longitude,
      });
      // Force full page navigation so properties list re-fetches fresh data
      window.location.href = "/properties";
    } catch (e) { console.error(e); setSubmitting(false); }
  };

  const residentialTypes = ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Villa'];
  const commercialTypes = ['Office Space', 'Retail/Shop', 'Warehouse', 'Restaurant', 'Hotel', 'Co-working Space'];
  const propertyTypes = propertyCategory === 'Residential' ? residentialTypes : commercialTypes;

  const isCommercial = propertyCategory === 'Commercial';

  const residentialAmenities = [
    { icon: 'pets', label: 'Pet Friendly' },
    { icon: 'local_laundry_service', label: 'Laundry' },
    { icon: 'local_parking', label: 'Parking' },
    { icon: 'fitness_center', label: 'Gym' },
    { icon: 'pool', label: 'Pool' },
    { icon: 'ac_unit', label: 'AC' },
    { icon: 'balcony', label: 'Balcony' },
    { icon: 'yard', label: 'Garden' },
    { icon: 'shield', label: 'Security' },
    { icon: 'bolt', label: 'Generator' },
  ];

  const commercialAmenities = [
    { icon: 'elevator', label: 'Elevator' },
    { icon: 'shield', label: '24/7 Security' },
    { icon: 'bolt', label: 'Generator' },
    { icon: 'wifi', label: 'High-Speed Internet' },
    { icon: 'meeting_room', label: 'Conference Room' },
    { icon: 'local_shipping', label: 'Loading Dock' },
    { icon: 'videocam', label: 'CCTV' },
    { icon: 'concierge', label: 'Reception Area' },
    { icon: 'power', label: 'Backup Power' },
    { icon: 'local_parking', label: 'Parking' },
  ];

  const amenities = isCommercial ? commercialAmenities : residentialAmenities;

  const utilities = [
    { icon: 'bolt', label: 'Electricity' },
    { icon: 'water_drop', label: 'Water' },
    { icon: 'wifi', label: 'Internet' },
    { icon: 'mode_fan', label: 'Gas' },
  ];

  const toggleAmenity = (label: string) => {
    setSelectedAmenities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const toggleUtility = (label: string) => {
    setSelectedUtilities(prev =>
      prev.includes(label) ? prev.filter(u => u !== label) : [...prev, label]
    );
  };

  // Category change handler
  const handleCategoryChange = (category: 'Residential' | 'Commercial') => {
    setPropertyCategory(category);
    setPropertyType(category === 'Residential' ? 'Apartment' : 'Office Space');
    setSelectedAmenities([]);
    setFloor("");
  };

  // Per-step validation
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!title.trim()) errors.title = 'Property name is required';
      if (!address.trim()) errors.address = 'Address is required';
      if (!city.trim()) errors.city = 'City is required';
      if (!state.trim()) errors.state = 'State/Region is required';
      if (!sqft.trim()) errors.sqft = 'Square footage is required';
      if (isCommercial && !floor.trim()) errors.floor = 'Floor number is required';
      if (bedrooms < 1) errors.bedrooms = 'At least 1 required';
      if (bathrooms < 1) errors.bathrooms = 'At least 1 required';
    } else if (step === 2) {
      if (photoFiles.length === 0) errors.photos = 'Upload at least 1 photo';
    } else if (step === 3) {
      if (!monthlyRent.trim()) errors.monthlyRent = 'Monthly rent is required';
      if (!description.trim()) errors.description = 'Description is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderError = (field: string) => {
    if (!validationErrors[field]) return null;
    return <span style={{ color: '#ba1a1a', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>{validationErrors[field]}</span>;
  };

  const currentRole = role || "owner";

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1a3a5f', animation: 'spin 1s linear infinite' }}>progress_activity</span>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={currentRole as "owner" | "seeker"} activePage="My Properties" />
      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <DashboardHeader />

        <main className="max-w-5xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '64px' }}>
          {/* Page Title */}
          <div>
            <h1 className="font-headline" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#002446', letterSpacing: '-0.025em' }}>Add New Property</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Fill in the details to list your property on Homie.</p>
          </div>

          {/* Progress Stepper */}
          <div style={{ maxWidth: '700px', width: '100%', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', top: '20px', left: '60px', right: '60px', height: '2px', backgroundColor: '#e7e8e9', zIndex: 0 }} />
              {steps.map((step) => {
                const isCompleted = currentStep > step.num;
                const isActive = currentStep === step.num;
                return (
                  <div
                    key={step.num}
                    onClick={() => setCurrentStep(step.num)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative', zIndex: 10 }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '9999px',
                      backgroundColor: isCompleted ? '#002a1a' : isActive ? '#002446' : '#e1e3e4',
                      color: isCompleted || isActive ? '#ffffff' : '#43474e',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '14px',
                      boxShadow: isActive ? 'none' : isCompleted ? '0 2px 4px rgba(0,42,26,0.2)' : 'none',
                      outline: isActive ? '4px solid #d3e3ff' : 'none',
                      outlineOffset: '2px',
                      transition: 'all 0.3s',
                    }}>
                      {isCompleted ? (
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'wght' 700" }}>check</span>
                      ) : (
                        step.num
                      )}
                    </div>
                    <span className="font-headline" style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? '#002446' : isCompleted ? '#191c1d' : '#73777f',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Form Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1: Property Essentials */}
            {currentStep === 1 && (
              <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', transition: 'all 0.3s' }}>
                <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446', marginBottom: '32px', letterSpacing: '-0.025em' }}>Property Essentials</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Property Category */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Category</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {(['Residential', 'Commercial'] as const).map((cat) => (
                        <button key={cat} type="button" onClick={() => handleCategoryChange(cat)}
                          style={{ flex: 1, padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', border: propertyCategory === cat ? '2px solid #002446' : '2px solid #e7e8e9', backgroundColor: propertyCategory === cat ? '#d3e3ff' : '#e7e8e9', color: propertyCategory === cat ? '#002446' : '#43474e', cursor: 'pointer', transition: 'all 0.2s' }}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Property Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Name</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Sunset Valley Residences" style={{ width: '100%', backgroundColor: '#e7e8e9', border: validationErrors.title ? '2px solid #ba1a1a' : 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                    {renderError('title')}
                  </div>
                  {/* Address */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search Address</label>
                    <div style={{ position: 'relative' }}>
                      <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 1, pointerEvents: 'none' }}>search</span>
                      <input type="text" ref={autocompleteInputRef} placeholder="Search for property location..." style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px 16px 16px 48px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  {/* Address preview map */}
                  <div style={{ width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e7e8e9', position: 'relative' }}>
                    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
                    {!mapsLoaded && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
                      </div>
                    )}
                  </div>
                  {/* City / State / Zip */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Addis Ababa" style={{ width: '100%', backgroundColor: '#e7e8e9', border: validationErrors.city ? '2px solid #ba1a1a' : 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                      {renderError('city')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</label>
                      <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="Addis Ababa" style={{ width: '100%', backgroundColor: '#e7e8e9', border: validationErrors.state ? '2px solid #ba1a1a' : 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                      {renderError('state')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zip Code</label>
                      <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="10001" style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  {/* Type + Sqft */}
                  <div style={{ display: 'grid', gridTemplateColumns: isCommercial ? '1fr 1fr 1fr' : '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                      <select value={propertyType} onChange={e => setPropertyType(e.target.value)} style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px' }}>
                        {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    {isCommercial && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Floor Number</label>
                        <input type="text" value={floor} onChange={e => setFloor(e.target.value)} placeholder="e.g., 3rd Floor" style={{ width: '100%', backgroundColor: '#e7e8e9', border: validationErrors.floor ? '2px solid #ba1a1a' : 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                        {renderError('floor')}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isCommercial ? 'Floor Area (sqft)' : 'Sq Footage'}</label>
                      <input type="number" value={sqft} onChange={e => setSqft(e.target.value)} placeholder="1,200" style={{ width: '100%', backgroundColor: '#e7e8e9', border: validationErrors.sqft ? '2px solid #ba1a1a' : 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                      {renderError('sqft')}
                    </div>
                  </div>
                  {/* Bed/Bath/Year */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '16px' }}>
                    {/* Bedrooms */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#43474e', textTransform: 'uppercase' }}>{isCommercial ? 'Rooms / Offices' : 'Bedrooms'}</label>
                      <div className="flex items-center" style={{ backgroundColor: '#f3f4f5', borderRadius: '8px', padding: '4px' }}>
                        <button type="button" onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>-</button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>{bedrooms}</span>
                        <button type="button" onClick={() => setBedrooms(bedrooms + 1)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>+</button>
                      </div>
                    </div>
                    {/* Bathrooms / Restrooms */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#43474e', textTransform: 'uppercase' }}>{isCommercial ? 'Restrooms' : 'Bathrooms'}</label>
                      <div className="flex items-center" style={{ backgroundColor: '#f3f4f5', borderRadius: '8px', padding: '4px' }}>
                        <button type="button" onClick={() => setBathrooms(Math.max(1, bathrooms - 1))} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>-</button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>{bathrooms}</span>
                        <button type="button" onClick={() => setBathrooms(bathrooms + 1)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>+</button>
                      </div>
                    </div>
                    {/* Year Built */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#43474e', textTransform: 'uppercase' }}>Year Built</label>
                      <input type="number" value={yearBuilt} onChange={e => setYearBuilt(e.target.value)} placeholder="2020" style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', textAlign: 'center', fontWeight: 700, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  {/* Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your property — highlights, features, neighborhood..." rows={4} style={{ width: '100%', backgroundColor: '#e7e8e9', border: validationErrors.description ? '2px solid #ba1a1a' : 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
                    {renderError('description')}
                  </div>
                </form>
              </section>
            )}

            {/* Step 2: Media */}
            {currentStep === 2 && (
              <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px' }}>
                <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446', marginBottom: '8px', letterSpacing: '-0.025em' }}>Media &amp; Photos</h2>
                <p style={{ color: '#43474e', lineHeight: '1.6', marginBottom: '32px' }}>High-quality visual content increases property engagement by up to 80%.{validationErrors.photos && <span style={{ display: 'block', color: '#ba1a1a', fontSize: '13px', fontWeight: 500, marginTop: '8px' }}>{validationErrors.photos}</span>}</p>

                {/* Dropzone */}
                <div style={{ border: '2px dashed #c3c6cf', borderRadius: '12px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafbfc', transition: 'all 0.3s', marginBottom: '32px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '9999px', backgroundColor: 'rgba(211,227,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a3a5f', marginBottom: '16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>cloud_upload</span>
                  </div>
                  <h3 className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#002446', marginBottom: '4px' }}>Drag and drop your photos here</h3>
                  <p style={{ color: '#43474e', fontSize: '14px', marginBottom: '24px' }}>Supporting JPG, PNG, up to 10MB per file.</p>
                  <label className="flex items-center" style={{ gap: '8px', padding: '10px 24px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} style={{ display: 'none' }} />
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                    Browse Files
                  </label>
                </div>

                {/* Uploaded Gallery */}
                {photoPreviews.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 className="font-headline" style={{ fontWeight: 700, color: '#002446', letterSpacing: '-0.025em' }}>Uploaded ({photoPreviews.length} photos)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {photoPreviews.map((preview, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f5' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt={`Photo ${i + 1}`} src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {i === 0 && <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#fc9430', color: '#663500', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>Main Cover</span>}
                          <button onClick={() => { setPhotoFiles(prev => prev.filter((_, idx) => idx !== i)); setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i)); }} style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '9999px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                          </button>
                        </div>
                      ))}
                      {/* Add More */}
                      <label style={{ aspectRatio: '16/9', borderRadius: '8px', border: '2px dashed #c3c6cf', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} style={{ display: 'none' }} />
                        <span className="material-symbols-outlined" style={{ color: '#abc8f5' }}>add_a_photo</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#73777f', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.1em' }}>Add Photos</span>
                      </label>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Step 3: Amenities & Pricing */}
            {currentStep === 3 && (
              <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px' }}>
                <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446', marginBottom: '8px', letterSpacing: '-0.025em' }}>Amenities & Pricing</h2>
                <p style={{ color: '#43474e', fontWeight: 500, marginBottom: '40px' }}>Define your property&apos;s value and unique offerings to attract the right tenants.</p>

                {/* Essential Amenities */}
                <div style={{ marginBottom: '48px' }}>
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '24px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#002446', fontVariationSettings: "'FILL' 1" }}>hotel_class</span>
                    <h3 className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#002446' }}>Essential Amenities</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {amenities.map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity.label);
                      return (
                        <button
                          key={amenity.label}
                          type="button"
                          onClick={() => toggleAmenity(amenity.label)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '24px', borderRadius: '12px',
                            backgroundColor: isSelected ? '#ffffff' : '#f3f4f5',
                            border: isSelected ? '2px solid #d3e3ff' : '2px solid transparent',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '30px', marginBottom: '12px', color: isSelected ? '#002446' : '#43474e', fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>{amenity.icon}</span>
                          <span style={{ fontSize: '14px', fontWeight: isSelected ? 700 : 600, color: isSelected ? '#002446' : '#191c1d' }}>{amenity.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Details */}
                <div style={{ marginBottom: '48px' }}>
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '24px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#002446', fontVariationSettings: "'FILL' 1" }}>payments</span>
                    <h3 className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#002446' }}>Pricing Details</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Monthly Rent</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#43474e', fontSize: '13px' }}>ETB</span>
                        <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} placeholder="50000" style={{ width: '100%', padding: '12px 16px 12px 48px', backgroundColor: '#e7e8e9', border: validationErrors.monthlyRent ? '2px solid #ba1a1a' : 'none', borderRadius: '8px', outline: 'none', fontWeight: 600, boxSizing: 'border-box' }} />
                        {renderError('monthlyRent')}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Security Deposit</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#43474e', fontSize: '13px' }}>ETB</span>
                        <input type="number" defaultValue={50000} style={{ width: '100%', padding: '12px 16px 12px 48px', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', outline: 'none', fontWeight: 600, boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>

                  {isCommercial && (
                    <div style={{ marginTop: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Lease Type</label>
                      <select value={leaseType} onChange={e => setLeaseType(e.target.value)} style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', fontWeight: 600 }}>
                        {['Gross Lease', 'Net Lease', 'Double Net (NN)', 'Triple Net (NNN)', 'Modified Gross'].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Utilities Included */}
                  <div style={{ marginTop: '32px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Utilities Included</label>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '12px' }}>
                      {utilities.map((util) => {
                        const isSelected = selectedUtilities.includes(util.label);
                        return (
                          <button
                            key={util.label}
                            type="button"
                            onClick={() => toggleUtility(util.label)}
                            className="flex items-center"
                            style={{
                              gap: '8px', padding: '8px 16px', borderRadius: '9999px',
                              backgroundColor: isSelected ? '#1a3a5f' : '#e7e8e9',
                              color: isSelected ? '#87a4cf' : '#43474e',
                              fontWeight: 600, fontSize: '14px',
                              border: isSelected ? '1px solid #1a3a5f' : '1px solid transparent',
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{util.icon}</span>
                            {util.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 4: Review & Publish */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446', letterSpacing: '-0.025em' }}>Review Your Listing</h2>

                {/* Preview Card */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(195,198,207,0.1)' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/7', backgroundColor: '#f3f4f5' }}>
                    {photoPreviews[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoPreviews[0]} alt="Property Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>image</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(0,36,70,0.9)', backdropFilter: 'blur(12px)', color: '#ffffff', padding: '4px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview Mode</div>
                  </div>
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446' }}>{title || 'Untitled Property'}</h3>
                        <p className="flex items-center" style={{ color: '#43474e', gap: '4px', marginTop: '4px', fontSize: '14px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                          {address || 'No address set'}{city ? `, ${city}` : ''}{state ? `, ${state}` : ''}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446' }}>ETB {monthlyRent ? parseFloat(monthlyRent).toLocaleString() : '0'}</span>
                        <span style={{ color: '#43474e', fontSize: '14px', fontWeight: 500 }}>/mo</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap" style={{ gap: '24px', padding: '16px 0', borderTop: '1px solid rgba(195,198,207,0.2)', borderBottom: '1px solid rgba(195,198,207,0.2)' }}>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#002446' }}>{isCommercial ? 'meeting_room' : 'bed'}</span>
                        <span style={{ fontWeight: 600 }}>{bedrooms} {isCommercial ? 'Rooms' : 'Bed'}</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#002446' }}>{isCommercial ? 'bathroom' : 'bathtub'}</span>
                        <span style={{ fontWeight: 600 }}>{bathrooms} {isCommercial ? 'Restrooms' : 'Bath'}</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#002446' }}>square_foot</span>
                        <span style={{ fontWeight: 600 }}>{sqft ? parseInt(sqft).toLocaleString() : '0'} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Basic Info */}
                  <div style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="font-headline flex items-center" style={{ fontWeight: 700, color: '#1a3a5f', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>info</span>
                      Basic Info
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { label: 'Type', value: propertyType },
                        ...(isCommercial ? [
                          { label: 'Floor', value: floor || 'N/A' },
                          { label: 'Lease Type', value: leaseType || 'N/A' },
                        ] : []),
                        { label: 'Year Built', value: yearBuilt || 'N/A' },
                        { label: 'Photos', value: `${photoFiles.length} uploaded` },
                      ].map((item) => (
                        <div key={item.label} className="flex" style={{ justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: '#43474e' }}>{item.label}</span>
                          <span style={{ fontWeight: 600 }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Amenities */}
                  <div style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="font-headline flex items-center" style={{ fontWeight: 700, color: '#1a3a5f', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Amenities
                    </h4>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '12px' }}>
                      {selectedAmenities.map((amenity) => {
                        const a = amenities.find(x => x.label === amenity);
                        return (
                          <div key={amenity} className="flex items-center" style={{ gap: '8px', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(195,198,207,0.1)' }}>
                            <span className="material-symbols-outlined" style={{ color: '#002446', fontSize: '18px' }}>{a?.icon || 'check'}</span>
                            {amenity}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #e7e8e9', marginTop: '8px' }}>
              {currentStep > 1 ? (
                <button onClick={() => setCurrentStep(currentStep - 1)} className="flex items-center" style={{ gap: '8px', padding: '12px 32px', borderRadius: '8px', border: 'none', fontWeight: 700, color: '#002446', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
              ) : (
                <div />
              )}
              {currentStep < 4 ? (
                <button onClick={handleNextStep} className="flex items-center font-headline" style={{ gap: '8px', padding: '12px 48px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                  Next Step
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              ) : (
                <button onClick={handlePublish} disabled={submitting} className="flex items-center font-headline" style={{ gap: '8px', padding: '12px 32px', backgroundColor: submitting ? '#64748b' : '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                  {submitting ? 'Publishing...' : 'Publish Listing'}
                  {!submitting && <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>}
                  {submitting && <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>progress_activity</span>}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
