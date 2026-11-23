-- ============================================================
-- HOMIE REAL ESTATE - SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- ============================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- to set up all tables, foreign keys, RLS security policies,
-- auto-profile creation triggers, and storage configuration.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. USERS (Public Profiles linked to auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "displayName" TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'seeker' CHECK (role IN ('owner', 'seeker')),
  "photoUrl" TEXT,
  "phoneNumber" TEXT,
  bio TEXT,
  address TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Backward-compatibility view for profiles if needed
CREATE OR REPLACE VIEW public.profiles AS SELECT * FROM public.users;

-- ============================================================
-- 3. PROPERTIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ownerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Apartment', 'House', 'Condo', 'Townhouse', 'Studio'
  "monthlyRent" NUMERIC NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms NUMERIC NOT NULL,
  "squareFootage" INT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  "zipCode" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available', -- 'Available', 'Rented', 'Pending', 'Maintenance'
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  latitude NUMERIC,
  longitude NUMERIC,
  "petFriendly" BOOLEAN DEFAULT false,
  "parkingSpaces" INT DEFAULT 0,
  "yearBuilt" INT,
  featured BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for searching and listing available properties
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties("ownerId");
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured);

-- ============================================================
-- 4. SAVED PROPERTIES (Favorites)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "propertyId" UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  "savedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE("userId", "propertyId")
);

CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON public.saved_properties("userId");

-- ============================================================
-- 5. PROPERTY VIEWINGS (Book a Walk)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.property_viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "propertyId" UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  "seekerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "ownerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "scheduledDate" DATE NOT NULL,
  "scheduledTime" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Completed', 'Canceled'
  notes TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_viewings_seeker ON public.property_viewings("seekerId");
CREATE INDEX IF NOT EXISTS idx_viewings_owner ON public.property_viewings("ownerId");

-- ============================================================
-- 6. PROPERTY APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.property_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "propertyId" UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  "applicantId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "ownerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Withdrawn'
  message TEXT,
  "moveInDate" DATE,
  "employmentStatus" TEXT,
  "monthlyIncome" NUMERIC,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.property_applications("applicantId");
CREATE INDEX IF NOT EXISTS idx_applications_owner ON public.property_applications("ownerId");

-- ============================================================
-- 7. LEASES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ownerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "tenantId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "propertyId" UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "monthlyRent" NUMERIC NOT NULL,
  "securityDeposit" NUMERIC,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Active', 'Pending', 'Ended', 'Terminated'
  documents TEXT[] DEFAULT '{}',
  "autoRenew" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leases_owner ON public.leases("ownerId");
CREATE INDEX IF NOT EXISTS idx_leases_tenant ON public.leases("tenantId");

-- ============================================================
-- 8. MAINTENANCE REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "propertyId" UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  "requesterId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "assignedToId" UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL, -- 'Low', 'Medium', 'High', 'Urgent'
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'In Progress', 'Completed', 'Canceled'
  category TEXT, -- 'Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other'
  photos TEXT[] DEFAULT '{}',
  "estimatedCost" NUMERIC,
  "actualCost" NUMERIC,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "resolvedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_maintenance_requester ON public.maintenance_requests("requesterId");

-- ============================================================
-- 9. PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "leaseId" UUID NOT NULL REFERENCES public.leases(id) ON DELETE CASCADE,
  "payerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  "dueDate" DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Paid', 'Pending', 'Overdue', 'Failed'
  type TEXT NOT NULL, -- 'Rent', 'Deposit', 'Fee', 'Maintenance', 'Utility'
  "paidDate" DATE,
  "transactionId" TEXT,
  "paymentMethod" TEXT, -- 'Card', 'Bank Transfer', 'Mobile Money'
  "lateFee" NUMERIC DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_payer ON public.payments("payerId");
CREATE INDEX IF NOT EXISTS idx_payments_lease ON public.payments("leaseId");

-- ============================================================
-- 10. MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "senderId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "receiverId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "propertyId" UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages("senderId");
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages("receiverId");

-- ============================================================
-- 11. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL, -- 'payment', 'maintenance', 'lease', 'message', 'viewing', 'application', 'system'
  "referenceId" TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications("userId", read);

-- ============================================================
-- 12. REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "reviewerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "propertyId" UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_property ON public.reviews("propertyId");

-- ============================================================
-- 13. AUTOMATIC USER PROFILE TRIGGER
-- ============================================================
-- Whenever a user signs up via Supabase Auth (Email or OAuth),
-- this trigger automatically creates their record in public.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, "displayName", email, role, "photoUrl", "phoneNumber")
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'displayName',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'seeker'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'photoURL'),
    NEW.raw_user_meta_data->>'phone_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    "displayName" = COALESCE(EXCLUDED."displayName", public.users."displayName");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Public users can view profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- PROPERTIES POLICIES
CREATE POLICY "Anyone can view available or featured properties" ON public.properties
  FOR SELECT USING (true);

CREATE POLICY "Owners can create properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = "ownerId");

CREATE POLICY "Owners can update their own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = "ownerId");

CREATE POLICY "Owners can delete their own properties" ON public.properties
  FOR DELETE USING (auth.uid() = "ownerId");

-- SAVED PROPERTIES POLICIES
CREATE POLICY "Users can view their saved properties" ON public.saved_properties
  FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "Users can save properties" ON public.saved_properties
  FOR INSERT WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can unsave properties" ON public.saved_properties
  FOR DELETE USING (auth.uid() = "userId");

-- VIEWINGS POLICIES
CREATE POLICY "Seekers and owners can view their viewings" ON public.property_viewings
  FOR SELECT USING (auth.uid() = "seekerId" OR auth.uid() = "ownerId");

CREATE POLICY "Seekers can create viewings" ON public.property_viewings
  FOR INSERT WITH CHECK (auth.uid() = "seekerId");

CREATE POLICY "Seekers and owners can update viewing status" ON public.property_viewings
  FOR UPDATE USING (auth.uid() = "seekerId" OR auth.uid() = "ownerId");

-- APPLICATIONS POLICIES
CREATE POLICY "Applicants and owners can view applications" ON public.property_applications
  FOR SELECT USING (auth.uid() = "applicantId" OR auth.uid() = "ownerId");

CREATE POLICY "Applicants can create applications" ON public.property_applications
  FOR INSERT WITH CHECK (auth.uid() = "applicantId");

CREATE POLICY "Owners and applicants can update applications" ON public.property_applications
  FOR UPDATE USING (auth.uid() = "ownerId" OR auth.uid() = "applicantId");

-- LEASES POLICIES
CREATE POLICY "Owners and tenants can view leases" ON public.leases
  FOR SELECT USING (auth.uid() = "ownerId" OR auth.uid() = "tenantId");

CREATE POLICY "Owners can create leases" ON public.leases
  FOR INSERT WITH CHECK (auth.uid() = "ownerId");

CREATE POLICY "Owners and tenants can update leases" ON public.leases
  FOR UPDATE USING (auth.uid() = "ownerId" OR auth.uid() = "tenantId");

-- MAINTENANCE POLICIES
CREATE POLICY "Requesters, owners, and assignees can view maintenance requests" ON public.maintenance_requests
  FOR SELECT USING (
    auth.uid() = "requesterId" OR
    auth.uid() = "assignedToId" OR
    EXISTS (SELECT 1 FROM public.properties WHERE properties.id = maintenance_requests."propertyId" AND properties."ownerId" = auth.uid())
  );

CREATE POLICY "Requesters can create maintenance requests" ON public.maintenance_requests
  FOR INSERT WITH CHECK (auth.uid() = "requesterId");

CREATE POLICY "Requesters and owners can update maintenance requests" ON public.maintenance_requests
  FOR UPDATE USING (
    auth.uid() = "requesterId" OR
    EXISTS (SELECT 1 FROM public.properties WHERE properties.id = maintenance_requests."propertyId" AND properties."ownerId" = auth.uid())
  );

-- PAYMENTS POLICIES
CREATE POLICY "Payers and owners can view payments" ON public.payments
  FOR SELECT USING (
    auth.uid() = "payerId" OR
    EXISTS (SELECT 1 FROM public.leases WHERE leases.id = payments."leaseId" AND leases."ownerId" = auth.uid())
  );

CREATE POLICY "Payers and owners can create payments" ON public.payments
  FOR INSERT WITH CHECK (
    auth.uid() = "payerId" OR
    EXISTS (SELECT 1 FROM public.leases WHERE leases.id = payments."leaseId" AND leases."ownerId" = auth.uid())
  );

CREATE POLICY "Payers and owners can update payments" ON public.payments
  FOR UPDATE USING (
    auth.uid() = "payerId" OR
    EXISTS (SELECT 1 FROM public.leases WHERE leases.id = payments."leaseId" AND leases."ownerId" = auth.uid())
  );

-- MESSAGES POLICIES
CREATE POLICY "Participants can view their messages" ON public.messages
  FOR SELECT USING (auth.uid() = "senderId" OR auth.uid() = "receiverId");

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = "senderId");

CREATE POLICY "Receivers can update message read status" ON public.messages
  FOR UPDATE USING (auth.uid() = "receiverId");

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "System/users can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can mark notifications read" ON public.notifications
  FOR UPDATE USING (auth.uid() = "userId");

-- REVIEWS POLICIES
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = "reviewerId");

CREATE POLICY "Reviewers can update their reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = "reviewerId");

-- ============================================================
-- 15. STORAGE CONFIGURATION
-- ============================================================
-- Create public storage bucket for photos and documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('homie-media', 'homie-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public media access" ON storage.objects
  FOR SELECT USING (bucket_id = 'homie-media');

CREATE POLICY "Authenticated user media upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'homie-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated user media update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'homie-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated user media delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'homie-media' AND auth.role() = 'authenticated');
