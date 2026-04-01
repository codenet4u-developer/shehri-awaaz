# Supabase Setup Guide for Serverless Shehri Awaaz

## 1. Create a New Supabase Project
1. Go to [https://supabase.com/](https://supabase.com/) and create a free project.
2. Save your **Project URL** and **anon public key**.

## 2. Execute SQL Schema
Navigate to the "SQL Editor" in your Supabase dashboard and execute the following snippet. Wait for a success message.

```sql
-- 1. Users Table (Linked to Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Complaints Table
CREATE TABLE complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Attachments Table (File metadata)
CREATE TABLE attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 3. Create Storage Bucket
1. Navigate to the "Storage" section.
2. Click **New Bucket**.
3. Name it exactly: `complaint-files`
4. Toggle it as **Public Bucket** so images display properly on the frontend.

## 4. Setup Authentication
Supabase Auth is enabled by default. Nothing major to change. You can toggle OFF email confirmation for easier local testing under Authentication -> Providers -> Email.

## 5. Add Vercel Environment Variables
You will need to pass these values to the root of your Vercel project when importing:
```env
# Full Service / Backend Access (For `/api/` functions)
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key 

# Frontend Access (For `/frontend/` logic)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
