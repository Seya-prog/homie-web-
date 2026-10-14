"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  listTenantLeases,
  listTenantMaintenanceRequests,
  listTenantPayments,
  listSeekerApplications,
  listSavedProperties,
} from "@/lib/dataService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function SeekerDashboard() {
  const { user, profile } = useAuth();
  const [leases, setLeases] = useState<AnyData[]>([]);
  const [requests, setRequests] = useState<AnyData[]>([]);
  const [payments, setPayments] = useState<AnyData[]>([]);
  const [applications, setApplications] = useState<AnyData[]>([]);
  const [savedProps, setSavedProps] = useState<AnyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      listTenantLeases(),
      listTenantMaintenanceRequests(),
      listTenantPayments(),
      listSeekerApplications(),
      listSavedProperties(),
    ])
      .then(([l, r, p, a, s]) => { setLeases(l); setRequests(r); setPayments(p); setApplications(a); setSavedProps(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const displayName = profile?.displayName || user?.displayName || "Seeker";
  const activeLease = leases.find((l: AnyData) => l.status === "Active");
  const pendingApps = applications.filter((a: AnyData) => a.status === "Pending");
  const openRequests = requests.filter((r: AnyData) => r.status !== "Completed" && r.status !== "Canceled");
  const upcomingPayment = payments.find((p: AnyData) => p.status === "Pending");

  // Helper to dynamically calculate overdue penalty based on landlord settings
  const calculateDynamicPenalty = (payment: AnyData) => {
    if (!payment) return 0;
    
    let settings = {
      penaltyEnabled: false,
      gracePeriod: 0,
      penaltyType: "Fixed",
      penaltyValue: 0,
      penaltyFrequency: "once"
    };

    if (payment.lease?.owner?.bio) {
      try {
        const parsed = JSON.parse(payment.lease.owner.bio);
        if (typeof parsed === "object" && parsed !== null) {
          settings = { ...settings, ...parsed };
        }
      } catch (e) {
        // Ignored
      }
    }

    if (!settings.penaltyEnabled || settings.penaltyValue <= 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(payment.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    // Check if it is actually overdue
    const diffTime = today.getTime() - dueDate.getTime();
    const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (overdueDays <= settings.gracePeriod) {
      return 0; // Still inside grace period
    }

    const baseAmount = payment.amount || 0;
    const rate = settings.penaltyType === "Percentage"
      ? (settings.penaltyValue * baseAmount / 100)
      : settings.penaltyValue;

    const effectiveDays = overdueDays - settings.gracePeriod;
    if (settings.penaltyFrequency === "daily") {
      return rate * effectiveDays;
    } else if (settings.penaltyFrequency === "3 days") {
      return rate * Math.floor(effectiveDays / 3);
    } else {
      return rate; // "once"
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(26, 58, 95, 0.1)', borderTop: '4px solid #1a3a5f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto w-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Header */}
      <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: '#002446', marginBottom: '8px' }}>
            Welcome home, {displayName.split(" ")[0]}
          </h2>
          <p style={{ color: '#43474e', fontWeight: 500 }}>
            {pendingApps.length > 0 || openRequests.length > 0
              ? `You have ${pendingApps.length} active application${pendingApps.length !== 1 ? 's' : ''} and ${openRequests.length} maintenance update${openRequests.length !== 1 ? 's' : ''}.`
              : activeLease ? "Your lease is active. Everything looks good!" : "Start exploring properties to find your new home."}
          </p>
        </div>
        <Link href="/listings" className="flex items-center"
          style={{ gap: '8px', padding: '12px 24px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,36,70,0.1)' }}>
          <span className="material-symbols-outlined">search</span>
          Browse Properties
        </Link>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '32px' }}>
        {/* Left Column */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Current Property Card */}
          {activeLease ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px md:32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(195,198,207,0.1)', position: 'relative', overflow: 'hidden' }}>
              <div className="flex flex-col md:flex-row" style={{ gap: '24px', position: 'relative', zIndex: 10 }}>
                <div style={{ width: '100%', maxWidth: '280px', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f3f4f5' }}>
                  {activeLease.property?.photos?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={activeLease.property.title} src={activeLease.property.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>home</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span style={{ padding: '4px 12px', backgroundColor: 'rgba(177,240,206,0.3)', color: '#002a1a', fontSize: '10px', fontWeight: 800, borderRadius: '4px', textTransform: 'uppercase' }}>Active Lease</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold" style={{ color: '#002446', marginBottom: '8px' }}>{activeLease.property?.title || "Your Property"}</h3>
                  <p className="text-sm" style={{ color: '#43474e', marginBottom: '16px' }}>{activeLease.property?.address}, {activeLease.property?.city}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: '16px' }}>
                    <div><span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>Monthly Rent</span><p className="text-lg font-extrabold" style={{ color: '#002446' }}>ETB {activeLease.monthlyRent?.toLocaleString()}</p></div>
                    <div><span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>Lease Ends</span><p className="text-lg font-extrabold" style={{ color: '#002446' }}>{activeLease.endDate ? new Date(activeLease.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</p></div>
                    <div><span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>Open Requests</span><p className="text-lg font-extrabold" style={{ color: openRequests.length > 0 ? '#ba1a1a' : '#002446' }}>{openRequests.length}</p></div>
                    <div><span className="text-[10px] uppercase font-bold" style={{ color: '#9ca3af' }}>Landlord</span><p className="text-sm font-bold truncate" style={{ color: '#002446' }}>{activeLease.owner?.displayName || '—'}</p></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '48px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#c3c6cf' }}>home_work</span>
              <h3 className="text-xl font-bold" style={{ color: '#002446', marginTop: '16px' }}>No Active Lease</h3>
              <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '24px' }}>Browse properties and apply to find your perfect home.</p>
              <Link href="/listings" style={{ padding: '12px 32px', backgroundColor: '#002446', color: '#ffffff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
                Explore Properties
              </Link>
            </div>
          )}

          {/* Applications */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: '20px' }}>
              <h3 className="text-lg font-bold font-headline" style={{ color: '#002446' }}>Applications</h3>
              {pendingApps.length > 0 && <span style={{ padding: '4px 12px', backgroundColor: '#d3e3ff', color: '#002446', fontSize: '11px', fontWeight: 700, borderRadius: '9999px' }}>{pendingApps.length} Pending</span>}
            </div>
            {applications.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#c3c6cf' }}>description</span>
                <p style={{ color: '#64748b', marginTop: '8px' }}>No applications yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.slice(0, 3).map((app: AnyData) => (
                  <div key={app.id} className="flex items-center" style={{ padding: '16px', gap: '16px', background: '#f3f4f5', borderRadius: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#e7e8e9' }}>
                      {app.property?.photos?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" src={app.property.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ color: '#9ca3af' }}>apartment</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{app.property?.title || "Property"}</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>ETB {app.property?.monthlyRent?.toLocaleString()}/mo</p>
                    </div>
                    <span style={{
                      padding: '4px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase',
                      backgroundColor: app.status === 'Approved' ? 'rgba(177,240,206,0.3)' : app.status === 'Rejected' ? '#ffdad6' : '#e1e3e4',
                      color: app.status === 'Approved' ? '#002a1a' : app.status === 'Rejected' ? '#93000a' : '#002446',
                    }}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Rent & Payments */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-headline" style={{ color: '#002446' }}>Rent & Payments</h3>
              <Link href="/finances" style={{ fontSize: '12px', color: '#002446', fontWeight: 700, textDecoration: 'none' }}>View History</Link>
            </div>

            {upcomingPayment ? (() => {
              // Calculate difference in days
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const dueDate = new Date(upcomingPayment.dueDate);
              dueDate.setHours(0, 0, 0, 0);
              const diffTime = dueDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              const latePenalty = calculateDynamicPenalty(upcomingPayment);
              const totalDue = upcomingPayment.amount + latePenalty;
              const isOverdue = daysDiff < 0 || upcomingPayment.status === 'Overdue' || latePenalty > 0;
              const isDueSoon = daysDiff >= 0 && daysDiff <= 5;

              return (
                <>
                  {/* Reminder Alert Banner */}
                  {isOverdue ? (
                    <div style={{ backgroundColor: '#ffdad6', color: '#ba1a1a', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>warning</span>
                      <span>Payment is OVERDUE by {Math.abs(daysDiff)} day{Math.abs(daysDiff) !== 1 ? 's' : ''}!</span>
                    </div>
                  ) : isDueSoon ? (
                    <div style={{ backgroundColor: '#ffdcc3', color: '#914d00', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications_active</span>
                      <span>Payment is due in {daysDiff} day{daysDiff !== 1 ? 's' : ''}!</span>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
                      <span>Next payment is on track.</span>
                    </div>
                  )}

                  {/* Payment Breakdown Card */}
                  <div style={{ background: 'linear-gradient(135deg, #002446 0%, #1a3a5f 100%)', borderRadius: '12px', padding: '20px', color: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#abc8f5' }}>Due Date</span>
                        <p style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>
                          {upcomingPayment.dueDate ? new Date(upcomingPayment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#abc8f5' }}>Late Penalty</span>
                        <p style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px', color: latePenalty > 0 ? '#ffb4ab' : '#ffffff' }}>
                          ETB {latePenalty.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#abc8f5' }}>Total Due</span>
                        <p className="text-3xl font-extrabold" style={{ marginTop: '2px' }}>ETB {totalDue.toLocaleString()}</p>
                      </div>
                      <button style={{ padding: '8px 20px', backgroundColor: '#ffffff', color: '#002446', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                        Pay Now
                      </button>
                    </div>
                  </div>
                </>
              );
            })() : (
              <div style={{ backgroundColor: '#f3f4f5', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#9ca3af' }}>payments</span>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', fontWeight: 600 }}>No upcoming payments</p>
                <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>You&apos;re all caught up!</p>
              </div>
            )}

            {/* Payment Timeline */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#002446', marginBottom: '12px' }}>Payment Timeline</h4>
              {payments.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '12px' }}>No payment records found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '2px solid #e2e8f0', paddingLeft: '16px', marginLeft: '8px' }}>
                  {payments.slice(0, 3).map((p: AnyData) => {
                    const isPaid = p.status === 'Paid';
                    const lateFeeVal = isPaid ? (p.lateFee || 0) : calculateDynamicPenalty(p);
                    const isOverdue = p.status === 'Overdue' || (!isPaid && lateFeeVal > 0);
                    const dateText = isPaid
                      ? `Paid on ${p.paidDate ? new Date(p.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}`
                      : `Due ${p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}`;

                    return (
                      <div key={p.id} style={{ position: 'relative' }}>
                        {/* Timeline Dot */}
                        <div style={{
                          position: 'absolute',
                          left: '-23px',
                          top: '4px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: isPaid ? '#2e7d32' : isOverdue ? '#ba1a1a' : '#fc9430',
                          border: '2px solid #ffffff',
                          boxShadow: '0 0 0 2px #ffffff'
                        }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                          <div>
                            <p className="text-xs font-bold" style={{ color: '#191c1d' }}>{p.type || 'Rent Payment'}</p>
                            <p className="text-[10px]" style={{ color: '#73777f', marginTop: '2px' }}>{dateText}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p className="text-xs font-bold" style={{ color: isPaid ? '#2e7d32' : isOverdue ? '#ba1a1a' : '#191c1d' }}>
                              ETB {(p.amount + lateFeeVal)?.toLocaleString()}
                            </p>
                            {lateFeeVal > 0 && (
                              <p className="text-[9px] font-bold" style={{ color: '#ba1a1a' }}>+ ETB {lateFeeVal} fee</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Requests */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h3 className="text-lg font-bold font-headline" style={{ color: '#002446' }}>Maintenance</h3>
              <Link href="/maintenance" style={{ fontSize: '12px', color: '#002446', fontWeight: 700, textDecoration: 'none' }}>View All</Link>
            </div>
            {requests.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#c3c6cf' }}>handyman</span>
                <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>No requests submitted.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {requests.slice(0, 3).map((req: AnyData) => (
                  <div key={req.id} style={{ padding: '12px 16px', backgroundColor: '#f3f4f5', borderRadius: '8px', borderLeft: `3px solid ${req.priority === 'Urgent' ? '#ba1a1a' : req.priority === 'High' ? '#fc9430' : '#002446'}` }}>
                    <p className="text-sm font-bold truncate">{req.title}</p>
                    <div className="flex items-center justify-between" style={{ marginTop: '4px' }}>
                      <span className="text-[10px] font-bold" style={{ color: '#64748b' }}>{req.status}</span>
                      <span className="text-[10px] font-bold" style={{
                        padding: '2px 8px', borderRadius: '4px',
                        backgroundColor: req.priority === 'Urgent' ? '#ffdad6' : req.priority === 'High' ? '#ffdcc3' : '#e1e3e4',
                        color: req.priority === 'Urgent' ? '#93000a' : req.priority === 'High' ? '#914d00' : '#43474e',
                      }}>{req.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Properties */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h3 className="text-lg font-bold font-headline" style={{ color: '#002446' }}>Saved Properties</h3>
              <span className="text-xs font-bold" style={{ color: '#64748b' }}>{savedProps.length} saved</span>
            </div>
            {savedProps.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#c3c6cf' }}>favorite_border</span>
                <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>No saved properties yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedProps.slice(0, 3).map((s: AnyData) => (
                  <div key={s.id} className="flex items-center" style={{ gap: '12px', padding: '8px', borderRadius: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f3f4f5' }}>
                      {s.property?.photos?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" src={s.property.photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#9ca3af' }}>home</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{s.property?.title}</p>
                      <p className="text-[10px]" style={{ color: '#64748b' }}>ETB {s.property?.monthlyRent?.toLocaleString()}/mo</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
