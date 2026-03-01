# Supabase Setup Guide

## Step 1: Create Tables in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Create a new query and copy-paste all SQL from `supabase_schema.sql`
5. Click **RUN** to create all tables

## Step 2: Your Connection Details

```
URL: https://lsrtscmguepoumwsenme.supabase.co
API Key: sb_publishable_XAZdDAaUIEt6ngIdw-8pvw_mc7o0pA2
```

✓ Already configured in `backend/.env`

## Step 3: API Endpoints (Test These)

### Health Check
```
GET http://localhost:5000/api/health
Response: {"status":"API is running"}
```

### Register User
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {token: "...", user: {...}}
```

### Create Complaint (needs Authorization header with token)
```
POST http://localhost:5000/api/complaints
Headers: Authorization: Bearer <your_token>
Body: {
  "title": "Pothole on Main Street",
  "description": "Deep pothole blocking traffic",
  "category": "Roads",
  "location": "Main Street, Downtown"
}
```

### Get All Complaints
```
GET http://localhost:5000/api/complaints
Headers: Authorization: Bearer <your_token>
```

## Server Status
✓ Backend running on http://localhost:5000
✓ Database connected to Supabase
✓ All APIs configured and ready

## Next Action
1. Run the SQL from `supabase_schema.sql` in Supabase dashboard
2. Test endpoints using Postman or Thunder Client
3. All should work perfectly!
