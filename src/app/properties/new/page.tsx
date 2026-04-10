"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  { num: 1, label: "Property Details" },
  { num: 2, label: "Media" },
  { num: 3, label: "Pricing" },
  { num: 4, label: "Publish" },
];

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1.5);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Laundry']);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>(['Electricity', 'Internet']);

  const amenities = [
    { icon: 'pets', label: 'Pet Friendly' },
    { icon: 'local_laundry_service', label: 'Laundry' },
    { icon: 'local_parking', label: 'Parking' },
    { icon: 'fitness_center', label: 'Gym' },
    { icon: 'pool', label: 'Pool' },
    { icon: 'ac_unit', label: 'AC' },
  ];

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

  return (
    <div style={{ background: '#f8f9fa', color: '#191c1d', minHeight: '100vh' }}>
      {/* Top Nav */}
      <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, backgroundColor: 'rgba(248,250,252,0.8)', backdropFilter: 'blur(16px)', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', transition: 'all 0.2s' }}>
        <div className="flex items-center" style={{ gap: '32px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em', color: '#1a3a5f' }}>Homie</span>
          </Link>
          <nav className="flex items-center" style={{ gap: '24px' }}>
            <Link href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '4px 12px', borderRadius: '6px', transition: 'all 0.2s' }}>Dashboard</Link>
            <Link href="/properties" style={{ color: '#1a3a5f', fontWeight: 700, borderBottom: '2px solid #1a3a5f', padding: '4px 12px', textDecoration: 'none' }}>Properties</Link>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', padding: '4px 12px', borderRadius: '6px' }}>Leases</a>
          </nav>
        </div>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined" style={{ color: '#43474e', padding: '8px', borderRadius: '9999px' }}>notifications</span></button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined" style={{ color: '#43474e', padding: '8px', borderRadius: '9999px' }}>help</span></button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined" style={{ color: '#43474e', padding: '8px', borderRadius: '9999px' }}>settings</span></button>
          <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: '#1a3a5f', overflow: 'hidden', border: '1px solid #c3c6cf' }}>
            <img alt="Owner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw8nfPf6RLi_vcoWs9udSbvTAg3eMAI_bU9sM_4BocgtxAGpXaptU2bMaLqMoGHQUWF19SQGrZfBpEE_isff_u5RJrL_56gS02ZC8MPaJVjEIY6fUW2KvTB4T808cmWQ9lf6qDX_fOrGKVrSLeuQZdixZ1HfGPSvJj278s2X3kHCrqaJYYGkU2-MLS-7psW2HGoPA_07c8G61GGHseQfomFbfC0APbUYrABepEfIF2dz1Y3S8CTJfabN5P2HaJYpfKGrxhPz4UoZD-" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '96px', paddingBottom: '48px', padding: '96px 32px 48px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Progress Stepper */}
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: '20px', left: '60px', right: '60px', height: '2px', backgroundColor: '#e7e8e9', zIndex: 0 }} />
            {steps.map((step) => {
              const isCompleted = currentStep > step.num;
              const isActive = currentStep === step.num;
              const isFuture = currentStep < step.num;
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

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
          {/* Main Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1: Property Essentials */}
            {currentStep === 1 && (
              <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', transition: 'all 0.3s' }}>
                <h2 className="font-headline" style={{ fontSize: '1.875rem', fontWeight: 800, color: '#002446', marginBottom: '32px', letterSpacing: '-0.025em' }}>Property Essentials</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Property Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Name</label>
                    <input type="text" placeholder="e.g., Sunset Valley Residences" style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px' }} />
                  </div>
                  {/* Address + Map */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Address</label>
                        <textarea placeholder="Street number, Building, City, State, Zip" rows={3} style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px', resize: 'none' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                          <select style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px' }}>
                            <option>Apartment</option><option>House</option><option>Condo</option><option>Townhouse</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sq Footage</label>
                          <input type="number" placeholder="1,200" style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', fontSize: '14px' }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location Preview</label>
                      <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#edeeef' }}>
                        <img alt="Map View" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6RFT7hUBxdOziSVrPLXtTFGMUvVmoi0pT1-q21UNAJbUuCSRcr8TS_FmHR1wWJj1Khh8l_09H6V_x4wY2PmT6ZdfDGsaQlzIKtrpgt1uNqoescKbfKk7im-DPS0BUevgXakpFrFoe2s1vP78pAyiT0pYSA_gy8Z15ERd42y2GfDPclgQ1Mo9NceQ0pnqbleqbZRF-eOSE97Zk6zZkfhvnTUVTzPIa4R3igCUCQNgUUuxOtQUfbRR17GvC8UfyB2ToWzBS5UkpVsqj" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.25)' }} />
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,36,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '40px', height: '40px', backgroundColor: '#fc9430', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', border: '2px solid #ffffff' }}>
                            <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                          </div>
                        </div>
                        <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: '#002446', textTransform: 'uppercase' }}>Geo-Verified</div>
                      </div>
                    </div>
                  </div>
                  {/* Bed/Bath/Floors/Year */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', paddingTop: '16px' }}>
                    {/* Bedrooms */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#43474e', textTransform: 'uppercase' }}>Bedrooms</label>
                      <div className="flex items-center" style={{ backgroundColor: '#f3f4f5', borderRadius: '8px', padding: '4px' }}>
                        <button type="button" onClick={() => setBedrooms(Math.max(0, bedrooms - 1))} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>-</button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>{bedrooms}</span>
                        <button type="button" onClick={() => setBedrooms(bedrooms + 1)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>+</button>
                      </div>
                    </div>
                    {/* Bathrooms */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#43474e', textTransform: 'uppercase' }}>Bathrooms</label>
                      <div className="flex items-center" style={{ backgroundColor: '#f3f4f5', borderRadius: '8px', padding: '4px' }}>
                        <button type="button" onClick={() => setBathrooms(Math.max(0, bathrooms - 0.5))} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>-</button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>{bathrooms}</span>
                        <button type="button" onClick={() => setBathrooms(bathrooms + 0.5)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '18px' }}>+</button>
                      </div>
                    </div>
                    {/* Floors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#43474e', textTransform: 'uppercase' }}>Floors</label>
                      <input type="number" placeholder="1" style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', textAlign: 'center', fontWeight: 700 }} />
                    </div>
                    {/* Year Built */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#43474e', textTransform: 'uppercase' }}>Year Built</label>
                      <input type="number" placeholder="2020" style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '16px', outline: 'none', textAlign: 'center', fontWeight: 700 }} />
                    </div>
                  </div>
                </form>
              </section>
            )}

            {/* Step 2: Media */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <section>
                  <h2 className="font-headline" style={{ fontSize: '1.875rem', fontWeight: 800, color: '#002446', marginBottom: '8px', letterSpacing: '-0.025em' }}>Media &amp; Photos</h2>
                  <p style={{ color: '#43474e', lineHeight: '1.6' }}>High-quality visual content increases property engagement by up to 80%. Upload your best shots below.</p>
                </section>

                {/* Dropzone */}
                <div className="group" style={{ position: 'relative' }}>
                  <div style={{ border: '2px dashed #c3c6cf', borderRadius: '12px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', transition: 'all 0.3s' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '9999px', backgroundColor: 'rgba(211,227,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a3a5f', marginBottom: '16px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>cloud_upload</span>
                    </div>
                    <h3 className="font-headline" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#002446', marginBottom: '4px' }}>Drag and drop your photos here</h3>
                    <p style={{ color: '#43474e', fontSize: '14px', marginBottom: '24px' }}>Supporting JPG, PNG, up to 10MB per file.</p>
                    <button className="flex items-center" style={{ gap: '8px', padding: '10px 24px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Uploaded Gallery */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 className="font-headline" style={{ fontWeight: 700, color: '#002446', letterSpacing: '-0.025em' }}>Uploaded Gallery (6 photos)</h3>
                    <button className="flex items-center" style={{ gap: '4px', fontSize: '14px', fontWeight: 600, color: '#1a3a5f', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sync_alt</span>
                      Rearrange
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {/* Main Cover */}
                    <div className="group" style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f5' }}>
                      <img alt="Property main view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfIrTLflr2_pcB2uiC7vdXTHNm0HY9Fusf4bi1d0O2btiUbpg1otUMrjPp_BjoNE29Ztex1oeRmckCxyvlviT9XqTqvGU3AlU216CiL_CjijXrxp6CElIImjKEa-a0QHxIfpaMkccB_X1V9XC3_8_aP04-7c_5rANvHspVkNUhcnyoz3Y5qxMZ8ACb8sGQxJq6d2Z7xkFM-09rFs9Cyo6uPG4zXe2k-gbSEOfFscvbhMIN938gpVp9iwJsj7kzrf7x2II7s4wDVzPN" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#fc9430', color: '#663500', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>Main Cover</span>
                    </div>
                    {/* Photo 2 */}
                    <div className="group" style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f5' }}>
                      <img alt="Living room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvObIG2MvTzXnESsdk1SqBn1PTf4ak7WRf7CN5L00FvaGT8dXdLF77EcMuPZRUhw6WjBRvWdjRHcpb9HLVa6nLxXceL3BhyLPFhgyRimcay8iMTXDhebNdaP6w0vOicYaYnNsGUhwSsZlrkTWTDBQWUOlr1KtFUg6C1llrqJ-71DxE3Hv05MCrl2lIOHdCTO3FIu-vmBPSqKmqe95kYjt-HbpAMHPy0j8cR8mhA5yNxnZnIp8rOMvtOXCQQZ38lOqTmR0hU5vA1Ioz" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* Photo 3 */}
                    <div className="group" style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f5' }}>
                      <img alt="Kitchen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClJZlb8l4hcPRKcNdLEq5Kfxk-OzaqP4laomoM7fiOPZNe5GC7lJBzvBWhaV-D6-Sym49Vp59-_QrsJT0-diVyqXo1K8usAmcX6ymP3F4qUNCon7QqIPOlgIBmGCu8sZOuwpD4lHSDaT4b62B60JAMObsYd1fcS1Q-7ac9SKk8bxa9DM5d7I0lQkrAai9NBBCk9V9_gaddNtb-EQpsgKbIsu2mTuJoHYq2KRcGSjcGn5pefrhHMrUwH4IboE20s9JibFynGoglj5Pn" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* Photo 4 */}
                    <div className="group" style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f5' }}>
                      <img alt="Bathroom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU61boxn6Y6NWA58W0a5Gts-B6RQtmV_nrPOGWh-BdaqD4z4wBTgjPBr01OiwBq1YKxaMj4FfthEMWllg_RWC60mFInsDCkqYpOmNRu4NWtnlbBku248At35bUosXWrZJgz8u7n4MsrYkOwBhkInql0NH5Za-8R65Y-kWQItdRx9Wer82jpTx6jxQKbHroId6Y1LQ0S_TDjPAZ4YYiBi5YwcES6sUOxYggAs72m4-2lgl6S-2k7rvI38RKmudxwL_IkTA1SgUMMXSx" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* Photo 5 */}
                    <div className="group" style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f5' }}>
                      <img alt="Backyard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWuZ6KxVYMEqzhZX0k64DlRIWwtiArIhEI1dGWsmH3zyjX3c6teOA9QZWZyhgu1op2kfIritkPm4mAxeqx8oAmG7jvLVg4iNhXdGd1kYvJEFyokAVmcI_zevNv6pycQ8X9L7vP4JAeRBnWqkP7XsMUFulHETdUptN3q1I17nMDxE2Ep2Auq5eNwauIfj2436gYHVxBSY-XwEu5WEQfiP0F29WezsdWryKNae2wlrCQO2ITaNbd5QEBTkGI_A68QWrWa4OVUZpVMYpV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* Add More */}
                    <div style={{ aspectRatio: '16/9', borderRadius: '8px', border: '2px dashed #c3c6cf', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <span className="material-symbols-outlined" style={{ color: '#abc8f5' }}>add_a_photo</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#73777f', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.1em' }}>Add More</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Amenities & Pricing */}
            {currentStep === 3 && (
              <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px' }}>
                <header style={{ marginBottom: '40px' }}>
                  <h2 className="font-headline" style={{ fontSize: '2rem', fontWeight: 800, color: '#002446', marginBottom: '8px', letterSpacing: '-0.025em' }}>Amenities & Pricing</h2>
                  <p style={{ color: '#43474e', fontWeight: 500 }}>Define your property&apos;s value and unique offerings to attract the right tenants.</p>
                </header>

                {/* Essential Amenities */}
                <div style={{ marginBottom: '48px' }}>
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '24px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#002446', fontVariationSettings: "'FILL' 1" }}>hotel_class</span>
                    <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#002446' }}>Essential Amenities</h3>
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
                    <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#002446' }}>Pricing Details</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Monthly Rent</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#43474e' }}>$</span>
                        <input type="number" defaultValue={3400} style={{ width: '100%', paddingLeft: '32px', paddingRight: '16px', padding: '12px 16px 12px 32px', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', outline: 'none', fontWeight: 600 }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Security Deposit</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#43474e' }}>$</span>
                        <input type="number" defaultValue={3400} style={{ width: '100%', padding: '12px 16px 12px 32px', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', outline: 'none', fontWeight: 600 }} />
                      </div>
                    </div>
                  </div>

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

                {/* Lease Terms */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '24px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#002446', fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                    <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#002446' }}>Lease Terms</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Lease Duration</label>
                      <select style={{ width: '100%', padding: '12px 16px', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', outline: 'none', fontWeight: 600 }}>
                        <option>12 Months</option><option>24 Months</option><option>Flexible / Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Available From</label>
                      <input type="date" defaultValue="2024-06-01" style={{ width: '100%', padding: '12px 16px', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', outline: 'none', fontWeight: 600 }} />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 4: Review & Publish */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 className="font-headline" style={{ fontSize: '1.875rem', fontWeight: 800, color: '#002446', letterSpacing: '-0.025em' }}>Review Your Listing</h2>

                {/* Preview Card */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(195,198,207,0.1)' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/7' }}>
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6LzBG03RfSXHmXO99llD2WzZMXAKf-O3wPMLsJzRgSeLVHwHGpsWMV5vEQ7_XovVXoogA9Hv_Hq-TgbLNrNX__qP898O-RzoY8VVLTvEpO021P8XQ0kiT5h0GSreLff2WvgS-N8Rlk2NEPgFxfFRI3jmZPDGW8I4jb1wYYvdD9nMyGljsxYKkmt2OnpjICi1BHG4ndnuOiLMfQM1CJgpcVF_KPB0BFamaRj18x2kYxcO3tfiU-ntWnXDzXEi4fGKSb7pmWaKM-d5c" alt="Property Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(0,36,70,0.9)', backdropFilter: 'blur(12px)', color: '#ffffff', padding: '4px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview Mode</div>
                  </div>
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446' }}>Modern Loft in Chelsea</h3>
                        <p className="flex items-center" style={{ color: '#43474e', gap: '4px', marginTop: '4px', fontSize: '14px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                          24th West St, Manhattan, NY
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002446' }}>$3,400</span>
                        <span style={{ color: '#43474e', fontSize: '14px', fontWeight: 500 }}>/mo</span>
                      </div>
                    </div>
                    <div className="flex" style={{ gap: '24px', padding: '16px 0', borderTop: '1px solid rgba(195,198,207,0.2)', borderBottom: '1px solid rgba(195,198,207,0.2)' }}>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#002446' }}>bed</span>
                        <span style={{ fontWeight: 600 }}>{bedrooms} Bed</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#002446' }}>bathtub</span>
                        <span style={{ fontWeight: 600 }}>{bathrooms} Bath</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#002446' }}>square_foot</span>
                        <span style={{ fontWeight: 600 }}>1,250 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Basic Info */}
                  <div style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="font-headline flex items-center" style={{ fontWeight: 700, color: '#1a3a5f', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>info</span>
                      Basic Info
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { label: 'Type', value: 'Residential Loft' },
                        { label: 'Condition', value: 'Newly Renovated' },
                        { label: 'Floor', value: '4th Floor (Elevator)' },
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
                  {/* Pricing & Terms */}
                  <div style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: 'span 2' }}>
                    <h4 className="font-headline flex items-center" style={{ fontWeight: 700, color: '#1a3a5f', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>payments</span>
                      Pricing & Terms
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                      <div>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#43474e', fontWeight: 700, marginBottom: '4px' }}>Monthly Rent</p>
                        <p className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002446' }}>$3,400.00</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#43474e', fontWeight: 700, marginBottom: '4px' }}>Security Deposit</p>
                        <p className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002446' }}>$5,000.00</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#43474e', fontWeight: 700, marginBottom: '4px' }}>Lease Duration</p>
                        <p className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002446' }}>12 Months</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: currentStep === 3 || currentStep === 4 ? '1px solid #e7e8e9' : 'none', marginTop: currentStep === 3 || currentStep === 4 ? '16px' : '0' }}>
              {currentStep > 1 ? (
                <button onClick={() => setCurrentStep(currentStep - 1)} className="flex items-center" style={{ gap: '8px', padding: '12px 32px', borderRadius: '8px', border: 'none', fontWeight: 700, color: '#002446', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
              ) : (
                <button style={{ padding: '12px 32px', borderRadius: '8px', border: '1px solid #c3c6cf', fontWeight: 600, color: '#002446', backgroundColor: 'transparent', cursor: 'pointer' }}>
                  Save Draft
                </button>
              )}
              {currentStep < 4 ? (
                <button onClick={() => setCurrentStep(currentStep + 1)} className="flex items-center font-headline" style={{ gap: '8px', padding: '12px 48px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                  Next Step
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              ) : (
                <div className="flex" style={{ gap: '16px' }}>
                  <button style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 700, color: '#43474e', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    Save as Draft
                  </button>
                  <Link href="/properties" className="flex items-center font-headline" style={{ gap: '8px', padding: '12px 32px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,36,70,0.2)', transition: 'all 0.2s' }}>
                    Publish Listing
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1: Pro Tip */}
            {currentStep === 1 && (
              <div style={{ backgroundColor: '#1a3a5f', color: '#ffffff', padding: '32px', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: '1.3' }}>Pro Tip for Higher Value</h3>
                  <p style={{ color: '#87a4cf', fontSize: '14px', lineHeight: '1.6' }}>
                    Properties with accurate square footage and high-quality addresses get <span style={{ fontWeight: 700, color: '#ffffff', textDecoration: 'underline', textDecorationColor: '#fc9430', textUnderlineOffset: '4px', textDecorationThickness: '2px' }}>2.4x more inquiries</span> within the first 48 hours.
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
                    <li className="flex items-start" style={{ gap: '12px', fontSize: '14px', color: '#87a4cf' }}>
                      <span className="material-symbols-outlined" style={{ color: '#fc9430', fontSize: '20px' }}>check_circle</span>
                      Ensure the building number matches your tax documents.
                    </li>
                    <li className="flex items-start" style={{ gap: '12px', fontSize: '14px', color: '#87a4cf' }}>
                      <span className="material-symbols-outlined" style={{ color: '#fc9430', fontSize: '20px' }}>check_circle</span>
                      Round sq footage to the nearest 10 units.
                    </li>
                  </ul>
                </div>
                <div style={{ position: 'absolute', right: '-48px', bottom: '-48px', width: '192px', height: '192px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', filter: 'blur(48px)' }} />
              </div>
            )}

            {/* Step 2: Photo Tips */}
            {currentStep === 2 && (
              <div style={{ backgroundColor: '#1a3a5f', color: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,36,70,0.2)' }}>
                <h2 className="font-headline flex items-center" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#fc9430' }}>lightbulb</span>
                  Photo Tips for Success
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { icon: "wb_sunny", title: "Use natural light", desc: "Shoot during the 'Golden Hour' or midday for bright, welcoming interiors." },
                    { icon: "star", title: "Showcase key amenities", desc: "Highlight the pool, master suite, and smart home features specifically." },
                    { icon: "high_quality", title: "High resolution matters", desc: "Ensure photos are at least 1920px wide to avoid blurriness on retina displays." },
                  ].map((tip) => (
                    <li key={tip.title} className="flex" style={{ gap: '16px' }}>
                      <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: '16px' }}>{tip.icon}</span>
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fc9430' }}>{tip.title}</h4>
                        <p style={{ fontSize: '14px', color: '#87a4cf', lineHeight: '1.5' }}>{tip.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '12px', color: '#87a4cf', fontStyle: 'italic' }}>&quot;Properties with professional photography rent 2x faster than those without.&quot;</p>
                </div>
              </div>
            )}

            {/* Step 3: Price Benchmarking */}
            {currentStep === 3 && (
              <>
                <div style={{ backgroundColor: '#1a3a5f', color: '#ffffff', padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <header style={{ marginBottom: '32px' }}>
                      <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Price Benchmarking</h3>
                      <p style={{ color: 'rgba(135,164,207,0.7)', fontSize: '14px', fontWeight: 500 }}>Chelsea, New York City</p>
                    </header>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="flex" style={{ justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(135,164,207,0.6)' }}>
                          <span>Average Rent</span>
                          <span>$3,850</span>
                        </div>
                        <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', backgroundColor: '#fc9430', width: '85%', borderRadius: '9999px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="flex" style={{ justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(135,164,207,0.6)' }}>
                          <span>Your Listing</span>
                          <span>$3,400</span>
                        </div>
                        <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', backgroundColor: '#95d4b3', width: '72%', borderRadius: '9999px' }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="flex items-start" style={{ gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#95d4b3' }}>info</span>
                        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>Your price is <span style={{ fontWeight: 700, color: '#95d4b3' }}>12% lower</span> than the neighborhood average. This positioning often leads to 3x more viewing requests.</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', right: '-64px', bottom: '-64px', width: '256px', height: '256px', backgroundColor: 'rgba(252,148,48,0.2)', borderRadius: '9999px', filter: 'blur(48px)' }} />
                </div>
                <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f3f4f5' }}>
                  <h4 className="font-headline" style={{ fontWeight: 700, color: '#002446', marginBottom: '16px' }}>Concierge Tip</h4>
                  <p style={{ fontSize: '14px', color: '#43474e', lineHeight: '1.6', marginBottom: '16px' }}>Properties with <span style={{ fontWeight: 700 }}>Laundry</span> and <span style={{ fontWeight: 700 }}>Parking</span> included receive significantly higher engagement in Chelsea.</p>
                  <div className="flex items-center" style={{ gap: '8px', color: '#002446', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                    Read Listing Guide <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Listing Health + Pro Tip + Checklist */}
            {currentStep === 4 && (
              <>
                {/* Listing Health */}
                <div style={{ backgroundColor: '#002a1a', color: '#ffffff', padding: '32px', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-16px', top: '-16px', width: '96px', height: '96px', backgroundColor: 'rgba(149,212,179,0.1)', borderRadius: '9999px', filter: 'blur(48px)' }} />
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h4 style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', opacity: 0.8 }}>Listing Health</h4>
                      <span style={{ backgroundColor: '#95d4b3', color: '#002114', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '9999px' }}>OPTIMIZED</span>
                    </div>
                    <div className="flex items-end" style={{ gap: '8px', marginBottom: '8px' }}>
                      <span className="font-headline" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>100</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, opacity: 0.6, marginBottom: '4px' }}>%</span>
                    </div>
                    <p style={{ fontSize: '14px', opacity: 0.8, fontWeight: 500, marginBottom: '24px' }}>All essential fields are completed. Your listing is ready to capture high-quality leads.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {['High-res media uploaded', 'Pricing strategy set', 'Amenities verified'].map((check) => (
                        <div key={check} className="flex items-center" style={{ gap: '12px', fontSize: '14px' }}>
                          <span className="material-symbols-outlined" style={{ color: '#95d4b3', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          {check}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="flex" style={{ backgroundColor: 'rgba(252,148,48,0.1)', border: '2px solid rgba(252,148,48,0.2)', padding: '24px', borderRadius: '12px', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fc9430', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: '#663500', fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 700, color: '#663500', fontSize: '14px', marginBottom: '4px' }}>Pro Tip: Photography</h5>
                    <p style={{ fontSize: '12px', color: 'rgba(102,53,0,0.8)', lineHeight: '1.5' }}>
                      Listings with professional architectural photography receive <span style={{ fontWeight: 700 }}>3.5x more inquiries</span> on average. Consider booking our partner studio for a virtual tour.
                    </p>
                  </div>
                </div>

                {/* Final Checklist */}
                <div style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#002446', marginBottom: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Final Checklist</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['Review occupancy date', 'Confirm contact information', 'Agree to listing terms'].map((item) => (
                      <label key={item} className="flex items-center" style={{ gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked disabled style={{ width: '16px', height: '16px', accentColor: '#002446', borderRadius: '4px' }} />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Required Documents / Need Assistance */}
            {currentStep <= 2 && (
              <>
                <div style={{ backgroundColor: '#f3f4f5', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 className="font-headline flex items-center" style={{ fontWeight: 700, color: '#002446', gap: '8px' }}>
                    <span className="material-symbols-outlined">{currentStep === 1 ? 'description' : 'help'}</span>
                    {currentStep === 1 ? 'Required Documents' : 'Need Assistance?'}
                  </h4>
                  {currentStep === 1 ? (
                    <>
                      <p style={{ fontSize: '10px', color: '#43474e', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Upcoming Steps</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { icon: "file_present", label: "Ownership Deed", dim: false },
                          { icon: "photo_camera", label: "8+ HD Property Photos", dim: false },
                          { icon: "account_balance", label: "Bank Details (for payouts)", dim: true },
                        ].map((doc) => (
                          <div key={doc.label} className="flex items-center" style={{ gap: '12px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', opacity: doc.dim ? 0.5 : 1 }}>
                            <span className="material-symbols-outlined" style={{ color: '#73777f' }}>{doc.icon}</span>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{doc.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '14px', color: '#43474e', marginBottom: '16px' }}>Our concierge team can help you hire a professional photographer at preferred rates.</p>
                      <a href="#" className="flex items-center" style={{ fontSize: '14px', fontWeight: 700, color: '#002446', gap: '4px', textDecoration: 'none' }}>
                        Contact Support
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                      </a>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Help Card */}
            {currentStep === 1 && (
              <div style={{ padding: '24px', border: '1px dashed #c3c6cf', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#e7e8e9', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#43474e' }}>support_agent</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#002446' }}>Need help listing?</p>
                  <p style={{ fontSize: '12px', color: '#43474e' }}>Our concierge team is available 24/7 to assist with your documentation.</p>
                </div>
                <button style={{ fontSize: '12px', fontWeight: 700, color: '#fc9430', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px' }}>Connect to Agent</button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
