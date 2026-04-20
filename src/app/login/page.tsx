"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signInWithGoogle, createGoogleUserProfile } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      await refreshProfile();
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (firebaseError.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(firebaseError.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const { user, isNewUser } = await signInWithGoogle();
      if (isNewUser) {
        // New Google user — default to seeker, they can change later
        await createGoogleUserProfile(user, "seeker");
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
    <div style={{ backgroundColor: '#f8f9fa', color: '#191c1d', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        backgroundColor: 'rgba(248,249,250,0.8)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', maxWidth: '80rem', margin: '0 auto' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#191c1d' }}>Homie</span>
          </Link>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="#" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>Features</Link>
            <Link href="#" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <Link href="#" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>About</Link>
            <Link href="/signup" style={{
              backgroundColor: '#002446', color: '#ffffff', padding: '8px 20px',
              borderRadius: '8px', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
            }}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 16px 48px' }}>
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          {/* Login Container */}
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px',
            boxShadow: '0 12px 40px -4px rgba(25,28,29,0.06)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 className="font-headline" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#191c1d', letterSpacing: '-0.025em', marginBottom: '8px' }}>Login</h1>
              <p style={{ color: '#43474e' }}>Welcome back to your digital estate.</p>
            </div>

            {/* Error */}
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
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#43474e', marginBottom: '8px', paddingLeft: '4px' }}>Email Address</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#191c1d', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '4px', paddingRight: '4px', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#43474e' }}>Password</label>
                  <Link href="#" style={{ fontSize: '12px', fontWeight: 600, color: '#002446', textDecoration: 'none' }}>Forgot Password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', backgroundColor: '#e7e8e9', border: 'none', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#191c1d', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#73777f' }}>
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{
                  width: '100%', backgroundColor: loading ? '#64748b' : '#002446', color: '#ffffff',
                  padding: '16px', borderRadius: '8px', fontWeight: 700, border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px',
                  boxShadow: '0 4px 16px rgba(0,36,70,0.1)', transition: 'all 0.15s',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '32px 0' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '1px solid rgba(195,198,207,0.3)' }} />
              </div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <span style={{ padding: '0 16px', backgroundColor: '#ffffff', color: '#73777f', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Or continue with</span>
              </div>
            </div>

            {/* Social */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={handleGoogleSignIn} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid rgba(195,198,207,0.2)', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600, color: '#191c1d' }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button disabled
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid rgba(195,198,207,0.2)', cursor: 'not-allowed', fontSize: '14px', fontWeight: 600, color: '#191c1d', opacity: 0.5 }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                Apple
              </button>
            </div>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: '#43474e', fontSize: '14px' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#002446', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Sign up</Link>
            </p>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#fafbfc', padding: '32px 0', borderTop: '1px solid rgba(226,232,240,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', maxWidth: '80rem', margin: '0 auto' }}>
          <p style={{ color: '#475569', fontSize: '14px' }}>© 2024 Homie Architectural Management. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="#" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="#" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="#" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
