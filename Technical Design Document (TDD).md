# Technical Design Document (TDD)

## Project Name

Pempek Palembang Cek Lis Website

## Version

1.1

## Status

Approved

## Last Updated

June 2026

---

# 1. Overview

## Purpose

Membangun website katalog produk untuk Pempek Palembang Cek Lis yang berfungsi sebagai:

* Media branding
* Katalog produk online
* Informasi lokasi dan jam operasional
* Pengarah pelanggan ke WhatsApp
* Pengarah pelanggan ke Instagram
* Pengarah pelanggan ke Gojek

Website tidak menangani:

* Keranjang belanja
* Checkout
* Pembayaran online

---

# 2. Architecture

## Architecture Style

Monorepo

## Deployment Architecture

```text
Web Frontend
      │
      ▼
Firebase Services
      │
      ├── Firebase Authentication
      ├── Cloud Firestore
      └── Firebase Storage
```

---

# 3. Technology Stack

## Frontend

### Framework

Next.js 15 (App Router)

### Language

TypeScript

### Styling

Tailwind CSS

### UI Components

shadcn/ui

### Forms

React Hook Form

### Validation

Zod

### Icons

Lucide React

---

## Backend Services

### Authentication

Firebase Authentication

### Database

Cloud Firestore

### Storage

Firebase Storage

---

## Analytics

### Traffic Analytics

Google Analytics 4

### Heatmap Analytics

Microsoft Clarity

---

## Hosting

### Website

Vercel

### Admin Dashboard

Vercel

---

# 4. Repository Structure

```text
pempek-ceklis/

├── apps/
│   ├── web/
│   └── admin/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── lib/
│   └── config/
│
├── docs/
│   ├── PRD.md
│   ├── TDD.md
│   ├── ERD.md
│   ├── DATABASE.md
│   └── API.md
│
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

---

# 5. Domain Structure

## Development

```text
web.localhost:3000

admin.localhost:3001
```

## Production

```text
pempekceklis.com

admin.pempekceklis.com
```

---

# 6. User Roles

## Developer

Permissions:

* Full Access
* User Management
* Settings Management
* Content Management

---

## Admin

Permissions:

* Product Management
* Gallery Management
* Testimonial Management
* Banner Management

Restrictions:

* Cannot Manage Users
* Cannot Change System Configuration

---

# 7. Firestore Collections

## users

```typescript
{
  uid: string;
  email: string;
  role: "developer" | "admin";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## products

```typescript
{
  id: string;

  name: string;

  slug: string;

  description: string;

  price: number;

  featured: boolean;

  status: "draft" | "published";

  seoTitle: string;

  seoDescription: string;

  images: string[];

  createdAt: Timestamp;

  updatedAt: Timestamp;
}
```

Note:

Karena jumlah produk hanya sekitar 10 item, gambar disimpan sebagai array URL di dokumen produk.

---

## testimonials

```typescript
{
  id: string;

  customerName: string;

  content: string;

  published: boolean;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}
```

---

## gallery

```typescript
{
  id: string;

  type: "product" | "store";

  imageUrl: string;

  caption: string;

  sortOrder: number;

  createdAt: Timestamp;
}
```

---

## banners

```typescript
{
  id: string;

  title: string;

  desktopImage: string;

  mobileImage: string;

  buttonText: string;

  buttonUrl: string;

  active: boolean;

  startDate: Timestamp;

  endDate: Timestamp;

  sortOrder: number;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}
```

---

## settings

Document ID:

```text
website
```

Schema:

```typescript
{
  siteName: string;

  heroTitle: string;

  heroSubtitle: string;

  phone: string;

  whatsapp: string;

  instagram: string;

  address: string;

  googleMapsUrl: string;

  businessHours: string;

  updatedAt: Timestamp;
}
```

---

# 8. Firebase Storage Structure

```text
logos/

products/

gallery/

banners/

thumbnails/
```

---

# 9. Public Routes

```text
/

/produk

/produk/[slug]

/tentang

/galeri

/testimoni

/kontak
```

---

# 10. Admin Routes

```text
/login

/dashboard

/products

/products/create

/products/[id]

/gallery

/testimonials

/banners

/settings

/users
```

---

# 11. Authentication Flow

```text
User Login
     │
     ▼
Firebase Authentication
     │
     ▼
Get User Role
     │
     ▼
Role Validation
     │
     ▼
Dashboard Access
```

---

# 12. Authorization Matrix

| Feature             | Developer | Admin |
| ------------------- | --------- | ----- |
| View Dashboard      | Yes       | Yes   |
| Manage Products     | Yes       | Yes   |
| Manage Gallery      | Yes       | Yes   |
| Manage Testimonials | Yes       | Yes   |
| Manage Banners      | Yes       | Yes   |
| Manage Users        | Yes       | No    |
| Manage Settings     | Yes       | No    |

---

# 13. Homepage Component Structure

```text
Navbar

HeroSection

FeaturedProducts

PromoBannerSlider

AllProducts

Testimonials

GalleryPreview

ServiceAreas

GoogleMaps

Footer

FloatingButtons
```

---

# 14. Product Detail Structure

```text
Breadcrumb

ImageGallery

ProductInfo

Price

Description

AvailabilityStatus

WhatsAppButton

InstagramButton

RelatedProducts
```

---

# 15. Image Processing Pipeline

```text
Upload
  ↓
Validation
  ↓
Crop 1:1
  ↓
Resize
  ↓
Compress
  ↓
Convert WebP
  ↓
Generate Thumbnail
  ↓
Upload Firebase Storage
  ↓
Save Metadata
```

---

# 16. Upload Rules

## Product Images

* Ratio: 1:1
* Max Size: 5 MB

---

## Gallery Images

* Max Size: 10 MB

---

## Banner Images

* Max Size: 8 MB

---

## Allowed Formats

```text
jpg
jpeg
png
webp
```

---

## Blocked Formats

```text
svg
exe
js
html
```

---

# 17. Dashboard Metrics

Dashboard menampilkan:

* Total Products
* Published Products
* Active Banners
* Published Testimonials

---

# 18. SEO Implementation

## Technical SEO

* Sitemap XML
* Robots.txt
* Canonical URL
* Meta Title
* Meta Description
* Open Graph Tags

---

## Structured Data

### Homepage

LocalBusiness Schema

### Product Detail

Product Schema

---

## URL Structure

Example:

```text
/produk/pempek-kapal-selam
```

---

# 19. Analytics

## Google Analytics 4

Track:

* Page Views
* Sessions
* Product Views
* WhatsApp Clicks
* Instagram Clicks
* Maps Clicks

---

## Microsoft Clarity

Track:

* Heatmaps
* Scroll Depth
* Session Recording

---

# 20. Security

## Authentication

Firebase Authentication

---

## Authorization

Role Based Access Control

---

## Validation

Zod Validation

---

## Upload Validation

Validate:

* File Type
* File Size
* Image Ratio

---

# 21. Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_GA_ID=

NEXT_PUBLIC_CLARITY_ID=
```

---

# 22. CI/CD

```text
Developer Push
      │
      ▼
GitHub
      │
      ▼
Vercel Build
      │
      ▼
Automatic Deployment
```

Deployment Trigger:

* Push to main
* Pull Request Merge

---

# 23. Performance Requirements

| Metric                    | Target      |
| ------------------------- | ----------- |
| Lighthouse Performance    | > 90        |
| Lighthouse SEO            | > 90        |
| Lighthouse Accessibility  | > 90        |
| Lighthouse Best Practices | > 90        |
| Initial Load Time         | < 3 Seconds |

---

# 24. Development Phases

## Sprint 1

* Monorepo Setup
* Firebase Setup
* Authentication Setup
* Admin Layout

---

## Sprint 2

* Product Module
* Product Images
* Product Detail Page

---

## Sprint 3

* Gallery Module
* Testimonial Module
* Banner Module

---

## Sprint 4

* Homepage
* SEO
* Analytics

---

## Sprint 5

* QA Testing
* Bug Fixing
* Production Deployment

---

# 25. Launch Criteria

Website dianggap siap produksi apabila:

* Seluruh halaman publik selesai
* Dashboard admin selesai
* Produk selesai
* Banner selesai
* Galeri selesai
* Testimoni selesai
* SEO aktif
* Analytics aktif
* Responsive di seluruh device
* Lighthouse > 90
* Deployment production berhasil
* Domain production aktif
* SSL aktif

```
```
