"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle, createGoogleUserProfile, UserRole } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type Role = "owner" | "seeker" | null;

export default function SignupPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, fullName, selectedRole as UserRole);
      await refreshProfile();
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 8 characters.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(firebaseError.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) return;
    setError("");
    setLoading(true);
    try {
      const { user, isNewUser } = await signInWithGoogle();
      if (isNewUser) {
        await createGoogleUserProfile(user, selectedRole as UserRole);
      }
      await refreshProfile();
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseError = err as { message?: string };
      setError(firebaseError.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      backgroundImage: step === 1 ? 'radial-gradient(#d9dadb 0.5px, transparent 0.5px)' : 'none',
      backgroundSize: '24px 24px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 0.4s',
    }}>
      {/* Step 1: Choose Your Role */}
      {step === 1 && (
        <>
          <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 24px 0' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3a5f', letterSpacing: '-0.025em' }}>
                Homie Hearth
              </span>
            </Link>
          </header>

          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ maxWidth: '56rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 className="font-headline" style={{ fontSize: '3.5rem', fontWeight: 800, color: '#002446', letterSpacing: '-0.025em', marginBottom: '16px' }}>
                  I am here to...
                </h1>
                <p style={{ color: '#43474e', maxWidth: '32rem', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  Select your journey. Whether you&apos;re managing an estate or seeking your next sanctuary, we&apos;ve crafted the tools for you.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%', maxWidth: '42rem' }}>
                <button
                  onClick={() => setSelectedRole("owner")}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '32px',
                    backgroundColor: '#ffffff',
                    border: selectedRole === 'owner' ? '2px solid #002446' : '1px solid rgba(195,198,207,0.3)',
                    borderRadius: '16px',
                    boxShadow: selectedRole === 'owner' ? '0 20px 50px rgba(0,0,0,0.08)' : '0 8px 30px rgba(0,0,0,0.04)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s',
                    transform: selectedRole === 'owner' ? 'translateY(-4px)' : 'none',
                  }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: '#1a3a5f', color: '#87a4cf', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>real_estate_agent</span>
                  </div>
                  <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446', marginBottom: '8px' }}>List Property</h2>
                  <p style={{ color: '#43474e', fontWeight: 500 }}>Owner or Estate Manager</p>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '32px', fontSize: '14px', fontWeight: 700, color: '#002446' }}>
                    <span>Get Started</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', marginLeft: '4px' }}>arrow_forward</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedRole("seeker")}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '32px',
                    backgroundColor: '#ffffff',
                    border: selectedRole === 'seeker' ? '2px solid #002446' : '1px solid rgba(195,198,207,0.3)',
                    borderRadius: '16px',
                    boxShadow: selectedRole === 'seeker' ? '0 20px 50px rgba(0,0,0,0.08)' : '0 8px 30px rgba(0,0,0,0.04)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s',
                    transform: selectedRole === 'seeker' ? 'translateY(-4px)' : 'none',
                  }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: '#1a3a5f', color: '#87a4cf', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>home_pin</span>
                  </div>
                  <h2 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#002446', marginBottom: '8px' }}>Find Home</h2>
                  <p style={{ color: '#43474e', fontWeight: 500 }}>Seeker or Tenant</p>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '32px', fontSize: '14px', fontWeight: 700, color: '#002446' }}>
                    <span>Explore Listings</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', marginLeft: '4px' }}>arrow_forward</span>
                  </div>
                </button>
              </div>

              {selectedRole && (
                <button
                  onClick={() => setStep(2)}
                  style={{
                    marginTop: '32px', padding: '14px 48px',
                    backgroundColor: '#002446', color: '#ffffff', borderRadius: '12px',
                    fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,36,70,0.2)', transition: 'all 0.2s',
                  }}
                >
                  Continue as {selectedRole === 'owner' ? 'Property Owner' : 'Home Seeker'}
                </button>
              )}

              <div style={{ marginTop: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#73777f', fontWeight: 500, letterSpacing: '0.05em' }}>
                  ALREADY HAVE AN ACCOUNT?{' '}
                  <Link href="/login" style={{ color: '#002446', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                    LOG IN HERE
                  </Link>
                </p>
              </div>
            </div>
          </main>

          <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(195,198,207,0.1)', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#c3c6cf', fontWeight: 500 }}>
              © 2024 Homie Hearth. The digital concierge for modern living.
            </p>
          </footer>
        </>
      )}

      {/* Step 2: Create Account Form */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <main style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <span className="font-headline" style={{ fontSize: '2.25rem', fontWeight: 900, color: '#002446', letterSpacing: '-0.05em' }}>Homie</span>
              </Link>
              <div style={{ height: '6px', width: '40px', backgroundColor: '#fc9430', borderRadius: '9999px', marginTop: '8px' }} />
            </div>

            <section style={{
              backgroundColor: '#ffffff', padding: '40px',
              borderRadius: '16px', border: '1px solid rgba(195,198,207,0.3)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}>
              <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 className="font-headline" style={{ fontSize: '1.875rem', fontWeight: 800, color: '#002446', letterSpacing: '-0.025em', marginBottom: '12px' }}>
                  Create Account
                </h2>
                <p style={{ color: '#43474e', fontWeight: 500 }}>
                  Join our community and start your journey today.
                </p>
                <div style={{
                  marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700,
                  backgroundColor: selectedRole === 'owner' ? '#d3e3ff' : '#b1f0ce',
                  color: selectedRole === 'owner' ? '#001c39' : '#002114',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{selectedRole === 'owner' ? 'real_estate_agent' : 'home_pin'}</span>
                  {selectedRole === 'owner' ? 'Property Owner' : 'Home Seeker'}
                  <button
                    onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', marginLeft: '4px', display: 'flex', alignItems: 'center' }}
                    title="Change role"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                  </button>
                </div>
              </header>

              {/* Error Message */}
              {error && (
                <div style={{
                  padding: '12px 16px', backgroundColor: '#ffdad6', color: '#93000a',
                  borderRadius: '12px', fontSize: '14px', fontWeight: 600, marginBottom: '24px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#191c1d', marginBottom: '8px', paddingLeft: '4px' }}>Full Name</label>
                  <input
                    type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    style={{ width: '100%', padding: '16px 20px', backgroundColor: '#f3f4f5', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#191c1d', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#191c1d', marginBottom: '8px', paddingLeft: '4px' }}>Email Address</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{ width: '100%', padding: '16px 20px', backgroundColor: '#f3f4f5', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#191c1d', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#191c1d', marginBottom: '8px', paddingLeft: '4px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      style={{ width: '100%', padding: '16px 20px', backgroundColor: '#f3f4f5', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#191c1d', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#73777f' }}>
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div style={{ paddingTop: '16px' }}>
                  <button type="submit" disabled={loading}
                    style={{
                      width: '100%', backgroundColor: loading ? '#64748b' : '#002446', color: '#ffffff',
                      fontWeight: 700, padding: '16px', borderRadius: '12px', border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px',
                      boxShadow: '0 4px 16px rgba(0,36,70,0.1)', transition: 'all 0.15s',
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>

              <div style={{ position: 'relative', margin: '40px 0' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100%', borderTop: '1px solid rgba(195,198,207,0.5)' }} />
                </div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <span style={{ padding: '0 16px', backgroundColor: '#ffffff', color: '#73777f', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>or continue with</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                <button onClick={handleGoogleSignUp} disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #c3c6cf', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, color: '#191c1d' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.21-3.21C17.55 1.74 14.93 1 12 1 7.37 1 3.4 3.71 1.58 7.64l3.72 2.89c.87-2.61 3.32-4.49 6.7-4.49z" fill="#EA4335" />
                    <path d="M23.49 12.27c0-.8-.07-1.57-.21-2.32H12v4.4h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.94 3.73-8.53z" fill="#4285F4" />
                    <path d="M5.3 14.77c-.24-.7-.37-1.46-.37-2.27s.13-1.57.37-2.27L1.58 7.35C.57 9.38 0 11.63 0 14s.57 4.62 1.58 6.65l3.72-2.88z" fill="#FBBC05" />
                    <path d="M12 23c3.12 0 5.73-1.04 7.64-2.82l-3.7-2.87c-1.02.68-2.33 1.09-3.94 1.09-3.38 0-5.83-2.28-6.7-5.3L1.58 15.93C3.4 19.89 7.37 23 12 23z" fill="#34A853" />
                  </svg>
                  Google
                </button>
                <button disabled
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #c3c6cf', cursor: 'not-allowed', fontSize: '14px', fontWeight: 700, color: '#191c1d', opacity: 0.5 }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  Apple
                </button>
              </div>

              <footer style={{ textAlign: 'center' }}>
                <p style={{ color: '#43474e', fontWeight: 500 }}>
                  Already have an account?{' '}
                  <Link href="/login" style={{ color: '#002446', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                    Sign in
                  </Link>
                </p>
              </footer>
            </section>

            <p style={{ textAlign: 'center', marginTop: '48px', fontSize: '12px', color: '#73777f', fontWeight: 500, letterSpacing: '0.05em' }}>
              © 2024 HOMIE REAL ESTATE. ALL RIGHTS RESERVED.
            </p>
          </main>
        </div>
      )}
    </div>
  );
}
