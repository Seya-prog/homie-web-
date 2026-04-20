import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import { queryRef, mutationRef, executeQuery, executeMutation } from "firebase/data-connect";
import { auth, dc } from "./firebase";

export type UserRole = "owner" | "seeker";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  createdAt: string;
}

// ========== Data Connect Helpers ==========

async function createUserInDB(user: User, role: UserRole): Promise<void> {
  const ref = mutationRef(dc, "CreateUser", {
    id: user.uid,
    displayName: user.displayName || "User",
    email: user.email || "",
    role,
    photoUrl: user.photoURL || null,
    phoneNumber: user.phoneNumber || null,
  });
  await executeMutation(ref);
}

async function getUserFromDB(uid: string): Promise<UserProfile | null> {
  try {
    const ref = queryRef(dc, "GetUser", { id: uid });
    const result = await executeQuery(ref);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (result.data as any)?.user;
    if (!data) return null;
    return {
      uid: data.id,
      email: data.email,
      displayName: data.displayName,
      role: data.role as UserRole,
      photoUrl: data.photoUrl,
      phoneNumber: data.phoneNumber,
      createdAt: data.createdAt,
    };
  } catch {
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
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  await updateProfile(user, { displayName: fullName });
  await createUserInDB(user, role);
  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signInWithGoogle(): Promise<{ user: User; isNewUser: boolean }> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;
  const profile = await getUserFromDB(user.uid);
  return { user, isNewUser: !profile };
}

export async function createGoogleUserProfile(user: User, role: UserRole): Promise<void> {
  await createUserInDB(user, role);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return getUserFromDB(uid);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
