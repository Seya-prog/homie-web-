/* eslint-disable @typescript-eslint/no-explicit-any */
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type UserRole = "owner" | "seeker";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  address?: string | null;
  createdAt?: string;
}

export interface User {
  id: string;
  uid: string; // alias for full backward compatibility with components using user.uid
  email?: string;
  displayName?: string | null;
  photoURL?: string | null;
  user_metadata?: Record<string, any>;
}

export function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  const meta = supabaseUser.user_metadata || {};
  const displayName =
    meta.displayName ||
    meta.full_name ||
    meta.name ||
    (supabaseUser.email ? supabaseUser.email.split("@")[0] : "User");
  const photoURL = meta.avatar_url || meta.photoURL || null;

  return {
    id: supabaseUser.id,
    uid: supabaseUser.id,
    email: supabaseUser.email || "",
    displayName,
    photoURL,
    user_metadata: meta,
  };
}

// ========== Database Helpers ==========

async function createUserInDB(user: User, role: UserRole, fullName?: string): Promise<void> {
  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      displayName: fullName || user.displayName || "User",
      email: user.email || "",
      role,
      photoUrl: user.photoURL || null,
      phoneNumber: user.user_metadata?.phone_number || null,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Error creating user profile in database:", error);
  }
}

async function getUserFromDB(uid: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", uid)
      .maybeSingle();

    if (error || !data) return null;

    return {
      uid: data.id,
      email: data.email,
      displayName: data.displayName || data.display_name || "User",
      role: (data.role || "seeker") as UserRole,
      photoUrl: data.photoUrl || data.photo_url || null,
      phoneNumber: data.phoneNumber || data.phone_number || null,
      bio: data.bio || null,
      address: data.address || null,
      createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}

// ========== Auth Functions ==========

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole
): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: fullName,
        full_name: fullName,
        role,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error("Sign up failed: no user returned");

  const mappedUser = mapSupabaseUser(data.user)!;
  await createUserInDB(mappedUser, role, fullName);
  return mappedUser;
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("Sign in failed");

  return mapSupabaseUser(data.user)!;
}

export async function signInWithGoogle(): Promise<{ user: User; isNewUser: boolean }> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/dashboard`,
    },
  });

  if (error) throw error;

  // With OAuth, browser redirects to Google. A placeholder user object is returned for callers
  const placeholderUser: User = {
    id: "",
    uid: "",
    email: "",
    displayName: "",
    photoURL: null,
  };
  return { user: placeholderUser, isNewUser: false };
}

export async function createGoogleUserProfile(user: User, role: UserRole): Promise<void> {
  if (!user || !user.id) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await createUserInDB(mapSupabaseUser(data.user)!, role);
      return;
    }
  }
  await createUserInDB(user, role);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return getUserFromDB(uid);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
  }
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  // First check active session
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(mapSupabaseUser(session?.user || null));
  });

  // Listen to live auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapSupabaseUser(session?.user || null));
  });

  return () => {
    subscription.unsubscribe();
  };
}
