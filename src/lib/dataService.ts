/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "./supabase";

/**
 * Helper to get currently logged in user ID
 */
async function getAuthUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

/**
 * Normalizes PostgREST join relations that default to arrays in client typings
 * while preserving actual array columns like photos, amenities, documents.
 */
function normalizeRelations<T = any>(obj: any): T {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(normalizeRelations) as any;
  }
  const result: any = { ...obj };
  const singleRelationKeys = [
    "owner",
    "seeker",
    "applicant",
    "tenant",
    "payer",
    "reviewer",
    "assignedTo",
    "requester",
    "property",
    "lease",
    "sender",
    "receiver",
  ];
  for (const key of singleRelationKeys) {
    if (key in result && Array.isArray(result[key])) {
      result[key] = result[key].length > 0 ? normalizeRelations(result[key][0]) : null;
    }
  }
  return result;
}

// ========== PROPERTIES ==========

export async function createProperty(data: {
  title: string;
  description: string;
  type: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  amenities?: string[];
  photos?: string[];
  latitude?: number;
  longitude?: number;
  petFriendly?: boolean;
  parkingSpaces?: number;
  yearBuilt?: number;
}): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("properties")
    .insert({
      ownerId: userId,
      title: data.title,
      description: data.description,
      type: data.type,
      monthlyRent: data.monthlyRent,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      squareFootage: data.squareFootage,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      amenities: data.amenities || [],
      photos: data.photos || [],
      latitude: data.latitude,
      longitude: data.longitude,
      petFriendly: data.petFriendly ?? false,
      parkingSpaces: data.parkingSpaces ?? 0,
      yearBuilt: data.yearBuilt,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { property_insert: { id: result.id } } };
}

export async function updateProperty(
  id: string,
  data: {
    status?: string;
    monthlyRent?: number;
    title?: string;
    description?: string;
  }
): Promise<any> {
  const { data: result, error } = await supabase
    .from("properties")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { property_update: result } };
}

export async function deleteProperty(id: string): Promise<any> {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
  return { data: { property_delete: true } };
}

export async function listAvailableProperties(): Promise<any[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      id, title, description, type, monthlyRent, bedrooms, bathrooms, squareFootage,
      address, city, state, zipCode, status, amenities, photos, latitude, longitude,
      petFriendly, parkingSpaces, createdAt, featured,
      owner:users!ownerId(id, displayName, photoUrl)
    `)
    .eq("status", "Available")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listAvailableProperties:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function getProperty(id: string): Promise<any | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      id, title, description, type, monthlyRent, bedrooms, bathrooms, squareFootage,
      address, city, state, zipCode, status, amenities, photos, latitude, longitude,
      petFriendly, parkingSpaces, yearBuilt, createdAt, featured,
      owner:users!ownerId(id, displayName, email, photoUrl, phoneNumber)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error in getProperty:", error);
    return null;
  }
  return normalizeRelations(data);
}

export async function listMyProperties(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("properties")
    .select(`
      id, title, type, monthlyRent, bedrooms, bathrooms, squareFootage,
      address, city, state, status, photos, createdAt
    `)
    .eq("ownerId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listMyProperties:", error);
    return [];
  }
  return data || [];
}

export async function listFeaturedProperties(): Promise<any[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      id, title, type, monthlyRent, bedrooms, bathrooms, squareFootage,
      address, city, state, photos, latitude, longitude,
      owner:users!ownerId(id, displayName, photoUrl)
    `)
    .eq("featured", true)
    .eq("status", "Available")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listFeaturedProperties:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function searchProperties(
  city: string,
  minPrice?: number,
  maxPrice?: number,
  bedrooms?: number
): Promise<any[]> {
  let query = supabase
    .from("properties")
    .select(`
      id, title, type, monthlyRent, bedrooms, bathrooms, squareFootage,
      address, city, state, photos, latitude, longitude, petFriendly,
      owner:users!ownerId(id, displayName, photoUrl)
    `)
    .eq("status", "Available");

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }
  if (minPrice !== undefined) {
    query = query.gte("monthlyRent", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("monthlyRent", maxPrice);
  }
  if (bedrooms !== undefined) {
    query = query.gte("bedrooms", bedrooms);
  }

  const { data, error } = await query.order("monthlyRent", { ascending: true });

  if (error) {
    console.error("Error in searchProperties:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

// ========== SAVED PROPERTIES ==========

export async function saveProperty(propertyId: string): Promise<any> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("saved_properties")
    .insert({
      userId,
      propertyId,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { savedProperty_insert: data } };
}

export async function unsaveProperty(id: string): Promise<any> {
  const userId = await getAuthUserId();
  const { error } = await supabase
    .from("saved_properties")
    .delete()
    .or(`id.eq.${id},and(propertyId.eq.${id},userId.eq.${userId})`);

  if (error) throw error;
  return { data: { savedProperty_delete: true } };
}

export async function listSavedProperties(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("saved_properties")
    .select(`
      id, savedAt,
      property:properties(
        id, title, type, monthlyRent, bedrooms, bathrooms, squareFootage,
        address, city, state, photos, status,
        owner:users!ownerId(id, displayName)
      )
    `)
    .eq("userId", userId)
    .order("savedAt", { ascending: false });

  if (error) {
    console.error("Error in listSavedProperties:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

// ========== VIEWINGS ==========

export async function createViewing(data: {
  propertyId: string;
  ownerId: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("property_viewings")
    .insert({
      propertyId: data.propertyId,
      seekerId: userId,
      ownerId: data.ownerId,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { propertyViewing_insert: result } };
}

export async function updateViewingStatus(id: string, status: string): Promise<any> {
  const { data: result, error } = await supabase
    .from("property_viewings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { propertyViewing_update: result } };
}

export async function listSeekerViewings(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("property_viewings")
    .select(`
      id, scheduledDate, scheduledTime, status, notes, createdAt,
      property:properties(id, title, address, city, photos),
      owner:users!ownerId(id, displayName, phoneNumber)
    `)
    .eq("seekerId", userId)
    .order("scheduledDate", { ascending: true });

  if (error) {
    console.error("Error in listSeekerViewings:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function listOwnerViewings(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("property_viewings")
    .select(`
      id, scheduledDate, scheduledTime, status, notes, createdAt,
      property:properties(id, title, address),
      seeker:users!seekerId(id, displayName, email, phoneNumber)
    `)
    .eq("ownerId", userId)
    .order("scheduledDate", { ascending: true });

  if (error) {
    console.error("Error in listOwnerViewings:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

// ========== APPLICATIONS ==========

export async function createApplication(data: {
  propertyId: string;
  ownerId: string;
  message?: string;
  moveInDate?: string;
  employmentStatus?: string;
  monthlyIncome?: number;
}): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("property_applications")
    .insert({
      propertyId: data.propertyId,
      applicantId: userId,
      ownerId: data.ownerId,
      message: data.message || null,
      moveInDate: data.moveInDate || null,
      employmentStatus: data.employmentStatus || null,
      monthlyIncome: data.monthlyIncome || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { propertyApplication_insert: result } };
}

export async function updateApplicationStatus(id: string, status: string): Promise<any> {
  const { data: result, error } = await supabase
    .from("property_applications")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { propertyApplication_update: result } };
}

export const updateApplication = (id: string, data: { status: string }): Promise<any> =>
  updateApplicationStatus(id, data.status);

export async function listSeekerApplications(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("property_applications")
    .select(`
      id, status, message, moveInDate, createdAt,
      property:properties(id, title, address, city, photos, monthlyRent)
    `)
    .eq("applicantId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listSeekerApplications:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function listOwnerApplications(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("property_applications")
    .select(`
      id, status, message, moveInDate, employmentStatus, monthlyIncome, createdAt,
      property:properties(id, title, address),
      applicant:users!applicantId(id, displayName, email, phoneNumber)
    `)
    .eq("ownerId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listOwnerApplications:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function getApplication(id: string): Promise<any | null> {
  const { data, error } = await supabase
    .from("property_applications")
    .select(`
      id, status, message, moveInDate, employmentStatus, monthlyIncome, createdAt,
      property:properties(id, title, address, city, photos, monthlyRent, bedrooms, bathrooms, squareFootage, type),
      applicant:users!applicantId(id, displayName, email, phoneNumber, photoUrl),
      owner:users!ownerId(id, displayName, email)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error in getApplication:", error);
    return null;
  }
  return normalizeRelations(data);
}

// ========== LEASES ==========

export async function createLease(data: {
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit?: number;
}): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("leases")
    .insert({
      ownerId: userId,
      tenantId: data.tenantId,
      propertyId: data.propertyId,
      startDate: data.startDate,
      endDate: data.endDate,
      monthlyRent: data.monthlyRent,
      securityDeposit: data.securityDeposit || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { lease_insert: result } };
}

export async function updateLeaseStatus(id: string, status: string): Promise<any> {
  const { data: result, error } = await supabase
    .from("leases")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { lease_update: result } };
}

export async function listTenantLeases(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("leases")
    .select(`
      id, startDate, endDate, monthlyRent, securityDeposit, status, documents, autoRenew, createdAt,
      property:properties(id, title, address, city, photos),
      owner:users!ownerId(id, displayName, email, phoneNumber)
    `)
    .eq("tenantId", userId)
    .order("startDate", { ascending: false });

  if (error) {
    console.error("Error in listTenantLeases:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function listOwnerLeases(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("leases")
    .select(`
      id, startDate, endDate, monthlyRent, securityDeposit, status, documents, autoRenew, createdAt,
      property:properties(id, title, address, city, photos),
      tenant:users!tenantId(id, displayName, email, phoneNumber)
    `)
    .eq("ownerId", userId)
    .order("startDate", { ascending: false });

  if (error) {
    console.error("Error in listOwnerLeases:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function getLease(id: string): Promise<any | null> {
  const { data, error } = await supabase
    .from("leases")
    .select(`
      id, startDate, endDate, monthlyRent, securityDeposit, status, documents, autoRenew, createdAt,
      property:properties(id, title, address, city, state, photos, type),
      owner:users!ownerId(id, displayName, email, phoneNumber, photoUrl),
      tenant:users!tenantId(id, displayName, email, phoneNumber, photoUrl)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error in getLease:", error);
    return null;
  }
  return normalizeRelations(data);
}

// ========== MAINTENANCE ==========

export async function createMaintenanceRequest(data: {
  propertyId: string;
  title: string;
  description: string;
  priority: string;
  category?: string;
  photos?: string[];
}): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("maintenance_requests")
    .insert({
      propertyId: data.propertyId,
      requesterId: userId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category || null,
      photos: data.photos || [],
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { maintenanceRequest_insert: result } };
}

export async function updateMaintenanceRequest(
  id: string,
  data: {
    status?: string;
    assignedToId?: string;
  }
): Promise<any> {
  const { data: result, error } = await supabase
    .from("maintenance_requests")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { maintenanceRequest_update: result } };
}

export async function listTenantMaintenanceRequests(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(`
      id, title, description, priority, status, category, photos, createdAt, estimatedCost,
      property:properties(id, title, address),
      assignedTo:users!assignedToId(id, displayName)
    `)
    .eq("requesterId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listTenantMaintenanceRequests:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function listOwnerMaintenanceRequests(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(`
      id, title, description, priority, status, category, photos, createdAt, estimatedCost, actualCost,
      property:properties!inner(id, title, address, ownerId),
      requester:users!requesterId(id, displayName, email, phoneNumber)
    `)
    .eq("property.ownerId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listOwnerMaintenanceRequests:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

// ========== PAYMENTS ==========

export async function createPayment(data: {
  leaseId: string;
  amount: number;
  dueDate: string;
  type: string;
  paymentMethod?: string;
}): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("payments")
    .insert({
      leaseId: data.leaseId,
      payerId: userId,
      amount: data.amount,
      dueDate: data.dueDate,
      type: data.type,
      paymentMethod: data.paymentMethod || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { payment_insert: result } };
}

export async function markPaymentPaid(
  id: string,
  paidDate: string,
  transactionId?: string,
  paymentMethod?: string
): Promise<any> {
  const { data: result, error } = await supabase
    .from("payments")
    .update({
      status: "Paid",
      paidDate,
      transactionId: transactionId || null,
      paymentMethod: paymentMethod || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { payment_update: result } };
}

export async function listTenantPayments(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id, amount, dueDate, paidDate, status, type, paymentMethod, transactionId, lateFee, createdAt,
      lease:leases(
        id,
        owner:users!ownerId(id, displayName, bio),
        property:properties(id, title, address)
      )
    `)
    .eq("payerId", userId)
    .order("dueDate", { ascending: false });

  if (error) {
    console.error("Error in listTenantPayments:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function listOwnerPayments(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id, amount, dueDate, paidDate, status, type, paymentMethod, lateFee, createdAt,
      payer:users!payerId(id, displayName, email),
      lease:leases!inner(
        id,
        ownerId,
        property:properties(id, title, address)
      )
    `)
    .eq("lease.ownerId", userId)
    .order("dueDate", { ascending: false });

  if (error) {
    console.error("Error in listOwnerPayments:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

// ========== MESSAGES ==========

export async function sendMessage(receiverId: string, content: string, propertyId?: string): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("messages")
    .insert({
      senderId: userId,
      receiverId,
      content,
      propertyId: propertyId || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { message_insert: result } };
}

export async function markMessageRead(id: string): Promise<any> {
  const { data: result, error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { message_update: result } };
}

export async function listMessages(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id, content, read, createdAt,
      sender:users!senderId(id, displayName, photoUrl),
      property:properties(id, title)
    `)
    .eq("receiverId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listMessages:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function listConversation(otherUserId: string): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id, content, read, createdAt,
      sender:users!senderId(id, displayName, photoUrl)
    `)
    .or(
      `and(senderId.eq.${userId},receiverId.eq.${otherUserId}),and(senderId.eq.${otherUserId},receiverId.eq.${userId})`
    )
    .order("createdAt", { ascending: true });

  if (error) {
    console.error("Error in listConversation:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

// ========== NOTIFICATIONS ==========

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  type: string,
  referenceId?: string
): Promise<any> {
  const { data: result, error } = await supabase
    .from("notifications")
    .insert({
      userId,
      title,
      body,
      type,
      referenceId: referenceId || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { notification_insert: result } };
}

export async function markNotificationRead(id: string): Promise<any> {
  const { data: result, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data: { notification_update: result } };
}

export async function listNotifications(): Promise<any[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, body, type, referenceId, read, createdAt")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listNotifications:", error);
    return [];
  }
  return data || [];
}

export async function getUnreadNotificationCount(): Promise<number> {
  const userId = await getAuthUserId();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId)
    .eq("read", false);

  if (error) {
    console.error("Error in getUnreadNotificationCount:", error);
    return 0;
  }
  return count || 0;
}

// ========== REVIEWS ==========

export async function createReview(propertyId: string, rating: number, comment?: string): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("reviews")
    .insert({
      propertyId,
      reviewerId: userId,
      rating,
      comment: comment || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { data: { review_insert: result } };
}

export async function listPropertyReviews(propertyId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, rating, comment, createdAt,
      reviewer:users!reviewerId(id, displayName, photoUrl)
    `)
    .eq("propertyId", propertyId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error in listPropertyReviews:", error);
    return [];
  }
  return normalizeRelations(data || []);
}

export async function updateUserProfile(data: {
  displayName?: string;
  photoUrl?: string;
  phoneNumber?: string;
  bio?: string;
  address?: string;
}): Promise<any> {
  const userId = await getAuthUserId();
  const { data: result, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return { data: { user_update: result } };
}
