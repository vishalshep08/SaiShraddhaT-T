# Sai Shraddha Tours & Travels (Shirdi)

> **Official Website & Fleet Operations Platform**  
> Established in 2014 • Sai Ashram (Bhakta Niwas), Shirdi, Maharashtra  
> Owned & Managed by **Ramesh Shep** (Contact: `+91 98900 73081`)

---

## 🚗 About The Platform

Sai Shraddha Tours & Travels is a premier car rental, pilgrimage taxi, and outstation tour provider based in Shirdi since 2014. This platform is built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

### Key Features
- **Pilgrimage & Outstation Taxi Booking**: Routes covering Nashik, Trimbakeshwar, Shani Shingnapur, Pune, Mumbai, Aurangabad/Ellora, Bhimashankar, and Grishneshwar.
- **Fleet Showcase**: Dedicated fleet management for owned Maruti Suzuki Ertiga and Chevrolet Tavera vehicles.
- **Direct WhatsApp & Instant Quote System**: Seamless customer enquiry dispatch directly to the Shirdi desk.
- **Operational Admin Workspace**:
  - Daily dispatch schedule & live operations tracking.
  - Analytics, booking assignment, and driver management.
  - CMS management for services, routes, destinations, packages, reviews, and FAQs.
  - Global Business Branding & Logo manager with Supabase Storage integration.
- **Enterprise Security**: Server-side edge route protection via Next.js Middleware and Supabase Auth with Row Level Security (RLS).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend & Auth**: Supabase (Database, Auth, Storage)
- **Deployment**: Vercel ready

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Server-only
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the customer website or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the Admin Workspace.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📄 License & Ownership
Copyright © 2014–2026 **Sai Shraddha Tours & Travels, Shirdi**. All rights reserved.  
Proprietor: **Ramesh Shep**.
