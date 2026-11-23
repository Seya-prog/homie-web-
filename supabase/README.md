# Supabase Setup Guide for Homie

## 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account or log in.
2. Click **New Project**, choose your organization, name the project (e.g., `homie`), and set a strong database password.
3. Select your preferred region and click **Create new project**.

## 2. Run Database Migration Script
1. In your Supabase Dashboard, navigate to the **SQL Editor** on the left navigation bar.
2. Click **New Query**.
3. Copy the entire contents of [`supabase/schema.sql`](./schema.sql) and paste it into the editor.
4. Click **Run** (or press `Ctrl+Enter`).
5. Verify that all tables, foreign keys, triggers, and RLS policies were created successfully.

## 3. Storage Bucket Configuration
The migration script automatically creates a public bucket named `homie-media` with appropriate upload/read policies.
You can verify it under **Storage** in the Supabase Dashboard:
- Bucket name: `homie-media`
- Public bucket: **Yes**

## 4. Google OAuth Configuration (Optional)
If you want to enable Google Sign-In:
1. In your Supabase Dashboard, go to **Authentication** -> **Providers** -> **Google**.
2. Enable Google provider.
3. Enter your Google Client ID and Google Client Secret (from Google Cloud Console).
4. Add the Supabase Redirect URL to your authorized redirect URIs in Google Cloud Console:
   `https://<project-ref>.supabase.co/auth/v1/callback`

## 5. Configure Local Environment Variables
In your project root, create or update `.env.local`:

```env
# Supabase Credentials (found in Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```
