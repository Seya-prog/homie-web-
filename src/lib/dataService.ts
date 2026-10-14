import { queryRef, mutationRef, executeQuery, executeMutation } from "firebase/data-connect";
import { dc } from "./firebase";

// ========== PROPERTIES ==========

export async function createProperty(data: {
  title: string; description: string; type: string;
  monthlyRent: number; bedrooms: number; bathrooms: number; squareFootage: number;
  address: string; city: string; state: string; zipCode: string;
  amenities?: string[]; photos?: string[]; latitude?: number; longitude?: number;
  petFriendly?: boolean; parkingSpaces?: number; yearBuilt?: number;
}) {
  const ref = mutationRef(dc, "CreateProperty", data);
  return executeMutation(ref);
}

export async function updateProperty(id: string, data: {
  status?: string; monthlyRent?: number; title?: string; description?: string;
}) {
  const ref = mutationRef(dc, "UpdateProperty", { id, ...data });
  return executeMutation(ref);
}

export async function deleteProperty(id: string) {
  const ref = mutationRef(dc, "DeleteProperty", { id });
  return executeMutation(ref);
}

export async function listAvailableProperties() {
  const ref = queryRef(dc, "ListAvailableProperties");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.properties || [];
}

export async function getProperty(id: string) {
  const ref = queryRef(dc, "GetProperty", { id });
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.property || null;
}

// No userId needed — auth.uid used server-side
export async function listMyProperties() {
  const ref = queryRef(dc, "ListMyProperties");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.properties || [];
}

export async function listFeaturedProperties() {
  const ref = queryRef(dc, "ListFeaturedProperties");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.properties || [];
}

export async function searchProperties(city: string, minPrice?: number, maxPrice?: number, bedrooms?: number) {
  const ref = queryRef(dc, "SearchProperties", { city, minPrice, maxPrice, bedrooms });
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.properties || [];
}

// ========== SAVED PROPERTIES ==========

export async function saveProperty(propertyId: string) {
  const ref = mutationRef(dc, "SaveProperty", { propertyId });
  return executeMutation(ref);
}

export async function unsaveProperty(id: string) {
  const ref = mutationRef(dc, "UnsaveProperty", { id });
  return executeMutation(ref);
}

export async function listSavedProperties() {
  const ref = queryRef(dc, "ListSavedProperties");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.savedProperties || [];
}

// ========== VIEWINGS ==========

export async function createViewing(data: {
  propertyId: string; ownerId: string;
  scheduledDate: string; scheduledTime: string; notes?: string;
}) {
  const ref = mutationRef(dc, "CreateViewing", data);
  return executeMutation(ref);
}

export async function updateViewingStatus(id: string, status: string) {
  const ref = mutationRef(dc, "UpdateViewingStatus", { id, status });
  return executeMutation(ref);
}

export async function listSeekerViewings() {
  const ref = queryRef(dc, "ListSeekerViewings");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.propertyViewings || [];
}

export async function listOwnerViewings() {
  const ref = queryRef(dc, "ListOwnerViewings");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.propertyViewings || [];
}

// ========== APPLICATIONS ==========

export async function createApplication(data: {
  propertyId: string; ownerId: string;
  message?: string; moveInDate?: string; employmentStatus?: string; monthlyIncome?: number;
}) {
  const ref = mutationRef(dc, "CreateApplication", data);
  return executeMutation(ref);
}

export async function updateApplicationStatus(id: string, status: string) {
  const ref = mutationRef(dc, "UpdateApplicationStatus", { id, status });
  return executeMutation(ref);
}

// Alias for component compatibility
export const updateApplication = (id: string, data: { status: string }) =>
  updateApplicationStatus(id, data.status);

export async function listSeekerApplications() {
  const ref = queryRef(dc, "ListSeekerApplications");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.propertyApplications || [];
}

export async function listOwnerApplications() {
  const ref = queryRef(dc, "ListOwnerApplications");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.propertyApplications || [];
}
export async function getApplication(id: string) {
  try {
    const ref = queryRef(dc, "GetApplication", { id });
    const result = await executeQuery(ref);
    return (result.data as any)?.propertyApplication || null;
  } catch (e: any) {
    console.warn("GetApplication query failed, using client-side fallback list filtering:", e);
    // Fallback: query lists that are already registered on the backend
    const [ownerApps, seekerApps] = await Promise.all([
      listOwnerApplications().catch(() => []),
      listSeekerApplications().catch(() => [])
    ]);
    const all = [...ownerApps, ...seekerApps];
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    return all.find((a: any) => norm(a.id) === norm(id)) || null;
  }
}


// ========== LEASES ==========

export async function createLease(data: {
  tenantId: string; propertyId: string;
  startDate: string; endDate: string; monthlyRent: number; securityDeposit?: number;
}) {
  const ref = mutationRef(dc, "CreateLease", data);
  return executeMutation(ref);
}

export async function updateLeaseStatus(id: string, status: string) {
  const ref = mutationRef(dc, "UpdateLeaseStatus", { id, status });
  return executeMutation(ref);
}

export async function listTenantLeases() {
  const ref = queryRef(dc, "ListTenantLeases");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.leases || [];
}

export async function listOwnerLeases() {
  const ref = queryRef(dc, "ListOwnerLeases");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.leases || [];
}

export async function getLease(id: string) {
  const ref = queryRef(dc, "GetLease", { id });
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.lease || null;
}

// ========== MAINTENANCE ==========

export async function createMaintenanceRequest(data: {
  propertyId: string; title: string;
  description: string; priority: string; category?: string; photos?: string[];
}) {
  const ref = mutationRef(dc, "CreateMaintenanceRequest", data);
  return executeMutation(ref);
}

export async function updateMaintenanceRequest(id: string, data: {
  status?: string; assignedToId?: string;
}) {
  const ref = mutationRef(dc, "UpdateMaintenanceRequest", { id, ...data });
  return executeMutation(ref);
}

export async function listTenantMaintenanceRequests() {
  const ref = queryRef(dc, "ListTenantMaintenanceRequests");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.maintenanceRequests || [];
}

export async function listOwnerMaintenanceRequests() {
  const ref = queryRef(dc, "ListOwnerMaintenanceRequests");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.maintenanceRequests || [];
}

// ========== PAYMENTS ==========

export async function createPayment(data: {
  leaseId: string; amount: number;
  dueDate: string; type: string; paymentMethod?: string;
}) {
  const ref = mutationRef(dc, "CreatePayment", data);
  return executeMutation(ref);
}

export async function markPaymentPaid(id: string, paidDate: string, transactionId?: string, paymentMethod?: string) {
  const ref = mutationRef(dc, "MarkPaymentPaid", { id, paidDate, transactionId, paymentMethod });
  return executeMutation(ref);
}

export async function listTenantPayments() {
  const ref = queryRef(dc, "ListTenantPayments");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.payments || [];
}

export async function listOwnerPayments() {
  const ref = queryRef(dc, "ListOwnerPayments");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.payments || [];
}

// ========== MESSAGES ==========

export async function sendMessage(receiverId: string, content: string, propertyId?: string) {
  const ref = mutationRef(dc, "SendMessage", { receiverId, content, propertyId });
  return executeMutation(ref);
}

export async function markMessageRead(id: string) {
  const ref = mutationRef(dc, "MarkMessageRead", { id });
  return executeMutation(ref);
}

export async function listMessages() {
  const ref = queryRef(dc, "ListMessages");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.messages || [];
}

export async function listConversation(otherUserId: string) {
  const ref = queryRef(dc, "ListConversation", { otherUserId });
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.messages || [];
}

// ========== NOTIFICATIONS ==========

export async function createNotification(userId: string, title: string, body: string, type: string, referenceId?: string) {
  const ref = mutationRef(dc, "CreateNotification", { userId, title, body, type, referenceId });
  return executeMutation(ref);
}

export async function markNotificationRead(id: string) {
  const ref = mutationRef(dc, "MarkNotificationRead", { id });
  return executeMutation(ref);
}

export async function listNotifications() {
  const ref = queryRef(dc, "ListNotifications");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.notifications || [];
}

export async function getUnreadNotificationCount(): Promise<number> {
  const ref = queryRef(dc, "UnreadNotificationCount");
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifications = (result.data as any)?.notifications || [];
  return notifications.length;
}

// ========== REVIEWS ==========

export async function createReview(propertyId: string, rating: number, comment?: string) {
  const ref = mutationRef(dc, "CreateReview", { propertyId, rating, comment });
  return executeMutation(ref);
}

export async function listPropertyReviews(propertyId: string) {
  const ref = queryRef(dc, "ListPropertyReviews", { propertyId });
  const result = await executeQuery(ref);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data as any)?.reviews || [];
}

export async function updateUserProfile(data: {
  displayName?: string;
  photoUrl?: string;
  phoneNumber?: string;
  bio?: string;
  address?: string;
}) {
  const ref = mutationRef(dc, "UpdateUser", data);
  return executeMutation(ref);
}
