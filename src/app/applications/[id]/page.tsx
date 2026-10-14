"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { getApplication, updateApplication, getProperty, createLease, updateProperty } from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, profile, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [application, setApplication] = useState<AnyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Lease Creation modal state
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [leaseForm, setLeaseForm] = useState({
    startDate: "",
    endDate: "",
    monthlyRent: "",
    securityDeposit: ""
  });
  const [leaseSubmitting, setLeaseSubmitting] = useState(false);
  const [leaseSuccess, setLeaseSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    getApplication(id)
      .then((data) => {
        if (!data) {
          alert("Application not found");
          router.push("/applications");
          return;
        }
        // Verify ownership/guard
        const isApplicant = role === 'seeker' || user.uid === data.applicant?.id;
        const isOwner = role === 'owner' || user.uid === data.owner?.id;
        if (!isApplicant && !isOwner) {
          alert("Unauthorized access");
          router.push("/dashboard");
          return;
        }
        setApplication(data);

        // Fetch full property details (since ListOwner/SeekerApplications queries only return minimal property fields)
        if (data.property?.id) {
          getProperty(data.property.id).then(fullProp => {
            if (fullProp) {
              setApplication((prev: any) => {
                if (!prev) return data;
                return {
                  ...prev,
                  property: {
                    ...prev.property,
                    ...fullProp
                  }
                };
              });
            }
          }).catch(console.error);
        }
      })
      .catch((e) => {
        console.error(e);
        alert("Failed to load application details.");
      })
      .finally(() => setLoading(false));
  }, [id, user, role, router]);

  if (authLoading || loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid rgba(26, 58, 95, 0.1)', borderTop: '4px solid #1a3a5f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user || !application) return null;

  const currentRole = role || "seeker";
  const isOwner = currentRole === 'owner' || user.uid === application.owner?.id;

  const handleStatusChange = async (newStatus: "Approved" | "Rejected") => {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`)) return;
    setSubmitting(true);
    try {
      await updateApplication(id, { status: newStatus });
      setApplication((prev: any) => ({ ...prev, status: newStatus }));
      alert(`Application has been successfully ${newStatus.toLowerCase()}.`);
    } catch (e) {
      console.error(e);
      alert(`Failed to update status: ${(e as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaseSubmit = async () => {
    if (!leaseForm.startDate || !leaseForm.endDate || !leaseForm.monthlyRent) {
      alert("Please fill in all required fields.");
      return;
    }
    setLeaseSubmitting(true);
    try {
      // 1. Create Lease Agreement
      await createLease({
        tenantId: application.applicant?.id || "",
        propertyId: application.property?.id || "",
        startDate: leaseForm.startDate,
        endDate: leaseForm.endDate,
        monthlyRent: parseFloat(leaseForm.monthlyRent),
        securityDeposit: leaseForm.securityDeposit ? parseFloat(leaseForm.securityDeposit) : undefined
      });

      // 2. Mark the property as Rented
      if (application.property?.id) {
        await updateProperty(application.property.id, { status: "Rented" });
      }

      setLeaseSuccess(true);
      setShowLeaseModal(false);
      alert("Lease agreement created successfully and property status updated to Rented!");
    } catch (e) {
      console.error(e);
      alert(`Failed to create lease: ${(e as Error).message}`);
    } finally {
      setLeaseSubmitting(false);
    }
  };

  const statusStyle = (s: string) => ({
    Pending: { bg: 'rgba(0,36,70,0.1)', color: '#002446', label: 'Pending Review' },
    Approved: { bg: 'rgba(0,42,26,0.1)', color: '#002a1a', label: 'Approved' },
    Rejected: { bg: 'rgba(255,218,214,0.3)', color: '#ba1a1a', label: 'Rejected' },
    Screening: { bg: 'rgba(252,148,48,0.2)', color: '#663500', label: 'In Screening' },
  }[s] || { bg: '#e7e8e9', color: '#43474e', label: s });

  const ss = statusStyle(application.status);

  return (
    <>
      <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={currentRole} activePage="Applications" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <DashboardHeader />

        <main className="max-w-4xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Breadcrumbs */}
          <nav className="flex items-center" style={{ gap: '8px', fontSize: '14px', color: '#73777f' }}>
            <Link href="/applications" style={{ color: '#73777f', textDecoration: 'none' }}>Applications</Link>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
            <span style={{ fontWeight: 600, color: '#191c1d' }}>Details</span>
          </nav>

          {/* Header Card */}
          <section className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl shadow-sm border border-outline-variant/10" style={{ backgroundColor: '#ffffff', gap: '24px' }}>
            <div className="flex items-center gap-6">
              <div style={{ width: '64px', height: '64px', borderRadius: '14px', backgroundColor: '#e8def8', color: '#21005d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>description</span>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#002446' }}>Application Details</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>Submitted on {application.createdAt ? new Date(application.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</p>
              </div>
            </div>
            <span style={{ padding: '8px 18px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '9999px', backgroundColor: ss.bg, color: ss.color, alignSelf: 'flex-start' }}>
              {ss.label}
            </span>
          </section>

          {/* Content Split: Applicant vs Property */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* Applicant Profile */}
            <div className="p-6 rounded-2xl shadow-sm border border-outline-variant/10" style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 className="text-lg font-bold" style={{ color: '#002446', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Applicant Profile</h3>
              <div className="flex items-center gap-4">
                <div style={{ width: '56px', height: '56px', borderRadius: '9999px', backgroundColor: '#e7e8e9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(application.applicant?.photoURL || (role === 'seeker' ? user?.photoURL || profile?.photoUrl : '')) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" src={application.applicant?.photoURL || (role === 'seeker' ? user?.photoURL || profile?.photoUrl : undefined)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#9ca3af' }}>person</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: '#191c1d' }}>{application.applicant?.displayName || (role === 'seeker' ? profile?.displayName || user?.displayName : '') || 'Applicant'}</p>
                  <p className="text-sm" style={{ color: '#64748b' }}>{application.applicant?.email || (role === 'seeker' ? user?.email : '')}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px' }}>Phone Number</span>
                  <p style={{ fontWeight: 700, color: '#191c1d', marginTop: '2px' }}>{application.applicant?.phoneNumber || (role === 'seeker' ? profile?.phoneNumber : '') || 'Not provided'}</p>
                </div>
                <div>
                  <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px' }}>Employment Status</span>
                  <p style={{ fontWeight: 700, color: '#191c1d', marginTop: '2px' }}>{application.employmentStatus || 'Not specified'}</p>
                </div>
                <div>
                  <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px' }}>Monthly Income</span>
                  <p style={{ fontWeight: 700, color: '#002a1a', marginTop: '2px' }}>
                    {application.monthlyIncome ? `ETB ${application.monthlyIncome.toLocaleString()}` : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Property Profile */}
            <div className="p-6 rounded-2xl shadow-sm border border-outline-variant/10" style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 className="text-lg font-bold" style={{ color: '#002446', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Property Details</h3>
              <div className="flex items-center gap-4">
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#e7e8e9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {application.property?.photos?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" src={application.property.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#9ca3af' }}>home</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: '#1a3a5f' }}>
                    <Link href={`/properties/${application.property?.id}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:underline">
                      {application.property?.title || 'Property Name'}
                    </Link>
                  </p>
                  <p className="text-sm truncate" style={{ color: '#64748b', maxWidth: '240px' }}>{application.property?.address}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px' }}>Monthly Rent</span>
                  <p style={{ fontWeight: 800, color: '#002446', marginTop: '2px', fontSize: '16px' }}>ETB {application.property?.monthlyRent?.toLocaleString()}/mo</p>
                </div>
                <div className="grid grid-cols-3 gap-2" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '20px' }}>meeting_room</span>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{application.property?.bedrooms} {application.property?.type === 'Office Space' || application.property?.type === 'Retail/Shop' || application.property?.type === 'Warehouse' || application.property?.type === 'Restaurant' || application.property?.type === 'Hotel' || application.property?.type === 'Co-working Space' ? 'Rooms' : 'Beds'}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '20px' }}>bathroom</span>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{application.property?.bathrooms} {application.property?.type === 'Office Space' || application.property?.type === 'Retail/Shop' || application.property?.type === 'Warehouse' || application.property?.type === 'Restaurant' || application.property?.type === 'Hotel' || application.property?.type === 'Co-working Space' ? 'Toilets' : 'Baths'}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '20px' }}>square_foot</span>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{application.property?.squareFootage} sqft</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statement & Application details */}
          <section className="p-6 rounded-2xl shadow-sm border border-outline-variant/10" style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 className="text-lg font-bold" style={{ color: '#002446', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Applicant Statement</h3>
            <div>
              <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px' }}>Cover Message</span>
              <p style={{ color: '#43474e', fontSize: '15px', lineHeight: '1.6', marginTop: '6px', whiteSpace: 'pre-line' }}>
                {application.message || "No statement message provided."}
              </p>
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', gap: '32px' }}>
              <div>
                <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px' }}>Desired Move-in Date</span>
                <p style={{ fontWeight: 700, color: '#191c1d', marginTop: '2px' }}>
                  {application.moveInDate ? new Date(application.moveInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Flexible'}
                </p>
              </div>
            </div>
          </section>

          {/* Owner Decision Section */}
          {isOwner && application.status === "Pending" && (
            <section className="p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ backgroundColor: '#fff8f6', borderLeft: '4px solid #ba1a1a' }}>
              <div>
                <h4 style={{ fontWeight: 700, color: '#ba1a1a' }}>Action Required</h4>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Please review the applicant profile and choose to approve or reject the application.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => handleStatusChange("Rejected")}
                  disabled={submitting}
                  style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #c3c6cf', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, backgroundColor: '#ffffff', color: '#ba1a1a' }}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleStatusChange("Approved")}
                  disabled={submitting}
                  style={{ padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, backgroundColor: '#002a1a', color: '#ffffff' }}
                >
                  {submitting ? 'Updating...' : 'Approve Application'}
                </button>
              </div>
            </section>
          )}

          {isOwner && application.status === "Approved" && !leaseSuccess && (
            <section className="p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
              <div>
                <h4 style={{ fontWeight: 700, color: '#16a34a' }}>Application Approved!</h4>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Generate the formal Lease Agreement to complete the move-in process.</p>
              </div>
              <button
                onClick={() => {
                  setLeaseForm({
                    startDate: application.moveInDate || new Date().toISOString().split('T')[0],
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                    monthlyRent: application.property?.monthlyRent?.toString() || "",
                    securityDeposit: application.property?.monthlyRent?.toString() || ""
                  });
                  setShowLeaseModal(true);
                }}
                style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, backgroundColor: '#16a34a', color: '#ffffff' }}
              >
                Create Lease Agreement
              </button>
            </section>
          )}

          {isOwner && leaseSuccess && (
            <section className="p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-4" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
              <span className="material-symbols-outlined" style={{ color: '#16a34a', fontSize: '28px' }}>check_circle</span>
              <div>
                <h4 style={{ fontWeight: 700, color: '#16a34a' }}>Lease Agreement Created Successfully!</h4>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>The lease has been initialized and the property is now marked as rented.</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>

    {/* Lease Agreement Modal */}
    {showLeaseModal && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div onClick={() => setShowLeaseModal(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
        <div style={{ position: 'relative', backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#002446' }}>Create Lease Agreement</h2>
            <button onClick={() => setShowLeaseModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Start Date *</label>
              <input type="date" value={leaseForm.startDate} onChange={e => setLeaseForm(f => ({ ...f, startDate: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>End Date *</label>
              <input type="date" value={leaseForm.endDate} onChange={e => setLeaseForm(f => ({ ...f, endDate: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Monthly Rent (ETB) *</label>
              <input type="number" value={leaseForm.monthlyRent} onChange={e => setLeaseForm(f => ({ ...f, monthlyRent: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#43474e', display: 'block', marginBottom: '6px' }}>Security Deposit (ETB)</label>
              <input type="number" value={leaseForm.securityDeposit} onChange={e => setLeaseForm(f => ({ ...f, securityDeposit: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c3c6cf', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleLeaseSubmit} disabled={leaseSubmitting} style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: leaseSubmitting ? 'not-allowed' : 'pointer', opacity: leaseSubmitting ? 0.7 : 1 }}>
              {leaseSubmitting ? 'Creating Agreement...' : 'Confirm and Initialize Lease'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
