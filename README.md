# FestiveRoots — Regional Festive Products & Traditional Artisan Marketplace

> **Tagline:** *Discover the Traditions Behind Every Product.*  
> **Academic Project:** Full Stack Development MERN Capstone Implementation

---

## 1. Project Title & Abstract

**Project Title:** FestiveRoots: An Intermediary Marketplace for Regional Festive Products and Traditional Artisans

**Abstract:**  
FestiveRoots is a full-stack web application designed to connect traditional grassroots artisans, handloom weavers, and folk craftspeople across India directly with urban and global consumers. By acting as a digital intermediary, the platform enables artisans to manage product listings and inventory, receive orders, and coordinate parcel fulfilment without technical barriers. Customers can discover culturally significant festive artifacts categorized by region, festival, craft technique, and certified artisan origin. The system features database-driven dynamic taxonomy and product management, role-based access control (Customer, Artisan, and Administrator), multi-artisan order partitioning, and simulated parcel tracking.

---

## 2. Problem Statement & Proposed Solution

### Problems Addressed:
1. **Limited Online Access for Rural Artisans:** Hereditary craftspeople lack the technical infrastructure and digital marketing reach to list and sell crafts outside their local geographical clusters.
2. **Geographical Discoverability Challenges:** Conscious buyers struggle to locate and purchase authentic regional handicrafts tied to specific Indian festivals (e.g., Kondapalli dolls for Sankranti Bommala Koluvu, Bishnupur terracotta diyas for Durga Puja, or Jaipur Blue Pottery for Diwali).
3. **Exploitative Intermediary Chains:** Multiple layers of physical middlemen take disproportionate margins, leaving genuine artisans undercompensated.
4. **Logistics & Order Coordination Barriers:** Artisans frequently lack automated courier integrations, packaging tracking systems, and structured order management tools.
5. **Authenticity & Provenance Uncertainty:** Consumers need clear transparency distinguishing artisan-declared traditions from independently verified Geographical Indication (GI) clusters.

### Proposed Solution:
FestiveRoots provides a centralized MERN web application:
- **For Artisans:** Dedicated workshop portal to register, submit craft history, list products dynamically with images, manage stock, accept/reject incoming orders, and advance preparation statuses.
- **For Customers:** Rich, cultural marketplace to filter crafts by festival, state, district, craft type, and artisan; real-time shopping cart with server-side price/stock revalidation; checkout with COD and simulated payment; and verified purchase reviews.
- **For Administrators:** Central dashboard to audit and verify artisan credentials, review and approve product listings (which appear dynamically without code redeployment), oversee platform orders, and manage dynamic taxonomies (Categories, Festivals, and Regions).

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6 (Nested and role-guarded routes)
- **HTTP Client:** Axios (Configured with request interceptors for Bearer JWT)
- **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`)
- **Iconography:** Lucide React
- **Styling:** Custom Vanilla CSS Design System with Indian heritage design tokens (Warm Ivory `#FFFDF9`, Terracotta `#C2410C`, Deep Maroon `#6B1D2F`, Muted Saffron `#D97706`, and Charcoal text `#1C1917`)

### Backend
- **Runtime:** Node.js (v20+)
- **Server Framework:** Express.js
- **Database ODM:** Mongoose (v8+)
- **Authentication:** JSON Web Tokens (JWT) with bcrypt password hashing
- **Authorization:** Role-Based Access Control (RBAC) middleware (`customer`, `artisan`, `admin`)
- **File Uploads:** Multer with disk storage and mime-type validation

### Database
- **Database Engine:** MongoDB (Local instance or MongoDB Atlas)
- **Primary Source of Truth:** 10 collections (`users`, `artisanprofiles`, `products`, `orders`, `fulfilments`, `categories`, `festivals`, `regions`, `reviews`, `wishlists`)

---

## 4. System Architecture

FestiveRoots operates on a 3-tier MERN client-server architecture:

```
┌────────────────────────────────────────────────────────┐
│             React / Vite Frontend (Port 5173)          │
│   AuthContext  │  CartContext  │  WishlistContext     │
└───────────────────────────┬────────────────────────────┘
                            │ (JSON REST / Bearer JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Express.js Backend (Port 5000)            │
│  Controllers │ RBAC Middleware │ Multer Uploads │ Seed │
└───────────────────────────┬────────────────────────────┘
                            │ (Mongoose ODM / TCP 27017)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   MongoDB Database                     │
│  Users │ Products │ Orders │ Fulfilments │ Taxonomies  │
└────────────────────────────────────────────────────────┘
```

### Multi-Artisan Order Partitioning Flow:
```
Customer Checkout (Cart with Items from Artisan A & Artisan B)
                           │
             Server Validates Live Prices & Stock
                           │
             Parent Order Created (Overall Status: PLACED)
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
Fulfilment Sub-Order 1               Fulfilment Sub-Order 2
(Assigned to Artisan A)              (Assigned to Artisan B)
        │                                     │
Artisan A Accepts/Prepares           Artisan B Accepts/Prepares
        │                                     │
Simulated Dispatch & Tracking        Simulated Dispatch & Tracking
        └──────────────────┬──────────────────┘
                           ▼
          Parent Order Updates to DELIVERED
```

---

## 5. Database Models & Schema Design

| Model Name | Key Fields & Relationships | Purpose |
| :--- | :--- | :--- |
| **User** | `name`, `email` (unique), `password` (hashed), `role` (`customer`, `artisan`, `admin`), `phone`, `address`, `isBlocked` | Core authentication and authorization account |
| **ArtisanProfile** | `user` (ref), `businessName`, `craftSpecialization`, `state`, `district`, `townVillage`, `bio`, `verificationStatus` (`PENDING`, `VERIFIED`, `REJECTED`), `claimedTraditionHistory` | Workshop details and verification audit |
| **Category** | `name` (unique), `slug`, `description`, `image`, `isActive`, `sortOrder` | Dynamic admin-managed craft classification |
| **Festival** | `name` (unique), `slug`, `description`, `approximateMonth`, `image`, `isActive` | Dynamic admin-managed sacred celebrations |
| **Region** | `state`, `district`, `townVillage`, `craftHeritage`, `description`, `image`, `isActive` | Geographic craft clusters and regional storytelling |
| **Product** | `name`, `description`, `price`, `images`, `artisan` (ref), `category` (ref), `festival` (ref), `state`, `district`, `craftType`, `claimedOrigin`, `originVerificationStatus`, `stock`, `isMadeToOrder`, `approvalStatus` (`PENDING`, `APPROVED`, `REJECTED`), `ratingAverage`, `numReviews` | Handcrafted inventory with origin provenance |
| **Order** | `orderNumber` (unique), `customer` (ref), `orderItems` (snapshots), `shippingAddress`, `paymentMethod` (`COD`, `ONLINE_DEMO`), `paymentStatus`, `subtotal`, `deliveryCharge`, `totalAmount`, `overallStatus` | Customer parent purchase record |
| **Fulfilment** | `order` (ref), `artisan` (ref), `items`, `subtotal`, `fulfilmentStatus`, `simulatedTrackingCode`, `trackingHistory` (events array) | Sub-order allocated per artisan workshop |
| **Review** | `product` (ref), `user` (ref), `order` (ref), `rating` (1-5), `title`, `comment`, `isVerifiedPurchase` | Verified purchase reviews with rating aggregation |
| **Wishlist** | `user` (ref), `products` (array of product refs) | Customer saved favorites |

---

## 6. REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a customer account
- `POST /api/auth/register-artisan` — Register an artisan account with workshop profile
- `POST /api/auth/login` — Login user (Customer, Artisan, Admin)
- `GET /api/auth/me` — Get authenticated user details
- `PUT /api/auth/profile` — Update customer contact and address details

### Products (`/api/products`)
- `GET /api/products` — Public catalog with search, category, festival, state, craftType, price range filters, sorting, and pagination
- `GET /api/products/:id` — Single product details with artisan and taxonomy populates
- `POST /api/products` — Artisan creates product listing (initial status: `PENDING`)
- `PUT /api/products/:id` — Artisan edits own product / Admin updates product
- `DELETE /api/products/:id` — Artisan deletes own product / Admin deletes product
- `GET /api/products/artisan/my-products` — Artisan views their complete product list
- `POST /api/products/upload-image` — Upload product photograph via Multer

### Artisans (`/api/artisans`)
- `GET /api/artisans` — Public directory of verified artisans
- `GET /api/artisans/:id` — Artisan profile and their approved products
- `GET /api/artisans/me/profile` — Logged-in artisan views profile
- `PUT /api/artisans/me/profile` — Logged-in artisan updates profile

### Taxonomies (`/api/categories`, `/api/festivals`, `/api/regions`)
- `GET /api/categories` — Public active categories
- `POST /api/categories` — Admin adds new category dynamically
- `PUT /api/categories/:id` — Admin updates category
- `DELETE /api/categories/:id` — Admin toggles category active status
- `GET /api/festivals` — Public active festivals
- `POST /api/festivals` — Admin adds new festival dynamically
- `GET /api/regions` — Public active regions
- `POST /api/regions` — Admin adds new region cluster dynamically

### Orders & Fulfilments (`/api/orders`, `/api/fulfilments`)
- `POST /api/orders` — Customer places order (server revalidates prices and inventory, decrements stock, splits sub-orders)
- `GET /api/orders/my-orders` — Customer views their order history with fulfilment statuses
- `GET /api/orders/:id` — Order details (accessible only by owner, assigned artisans, or admin)
- `POST /api/orders/:id/cancel` — Customer cancels eligible order (restores stock)
- `GET /api/fulfilments/artisan/my-orders` — Artisan views incoming assigned sub-orders
- `PATCH /api/fulfilments/:id/status` — Artisan updates status (`CONFIRMED`, `PREPARING`, `READY_FOR_COLLECTION`, `SHIPPED`, `DELIVERED`, `REJECTED`)

### Reviews & Wishlist (`/api/reviews`, `/api/wishlist`)
- `POST /api/reviews` — Submit review (enforces verified delivered purchase)
- `GET /api/reviews/product/:productId` — Public reviews for product
- `GET /api/wishlist` — Get customer wishlist
- `POST /api/wishlist/:productId` — Add item to wishlist
- `DELETE /api/wishlist/:productId` — Remove item from wishlist

### Admin Management (`/api/admin`)
- `GET /api/admin/dashboard` — Platform overview metrics (users, revenue, orders, pending approvals)
- `GET /api/admin/products/pending` — Queue of products awaiting approval
- `PATCH /api/admin/products/:id/approval` — Admin approves or rejects product with reason
- `GET /api/admin/artisans/pending` — Queue of artisans awaiting verification
- `PATCH /api/admin/artisans/:id/verification` — Admin verifies or rejects artisan with reason
- `GET /api/admin/orders` — Platform-wide order oversight

---

## 7. Demo Accounts & Seed Credentials

The database includes pre-configured demonstration accounts for testing all user roles:

| Role | Email Address | Password | Account Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@festiveroots.com` | `Admin@123` | Full access to approvals, verifications, taxonomies, and metrics |
| **Artisan (Verified)** | `ramesh.kondapalli@festiveroots.com` | `Artisan@123` | Master softwood artisan (Kondapalli, AP) managing live products and orders |
| **Artisan (Verified)** | `meera.jaipur@festiveroots.com` | `Artisan@123` | Blue pottery artisan (Jaipur, Rajasthan) managing orders |
| **Artisan (Pending)** | `suresh.toys@festiveroots.com` | `Artisan@123` | Channapatna artisan pending verification (demonstrates admin review) |
| **Customer** | `priya.sharma@example.com` | `Customer@123` | Customer with address and existing delivered order for testing reviews |

*Tip: The Login page features 1-click quick credentials fillers for instant testing!*

---

## 8. Installation & Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB running locally at `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/festiveroots
JWT_SECRET=festiveroots_super_secure_jwt_secret_dev_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the Database
Populate the database with initial regional products, categories, festivals, regions, seed artisans, and demo orders:
```bash
cd server
npm run seed
```

### 5. Start the Application
In terminal 1 (Backend):
```bash
cd server
npm run dev
# Server listens on http://localhost:5000
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
# Vite runs on http://localhost:5173
```

---

## 9. Automated Testing & Verification

FestiveRoots includes an automated end-to-end integration test suite (`server/scripts/testE2E.js`) verifying all critical full-stack operations:

```bash
cd server
node scripts/testE2E.js
```

### Test Suite Results:
- `✓ [PASS] 1. Backend server health check responds 200 OK`
- `✓ [PASS] 2. Catalog products fetched from MongoDB`
- `✓ [PASS] 3. Customer authentication and JWT token issuance`
- `✓ [PASS] 4. Invalid credentials correctly rejected with HTTP 401`
- `✓ [PASS] 5. Artisan authentication succeeds with artisan role`
- `✓ [PASS] 6. Admin authentication succeeds with admin role`
- `✓ [PASS] 7. RBAC security: Customer forbidden from admin endpoints (HTTP 403)`
- `✓ [PASS] 8. Admin dashboard metrics successfully calculated`
- `✓ [PASS] 9. Admin dynamically creates new category in MongoDB`
- `✓ [PASS] 10. Admin dynamically creates new festival in MongoDB`
- `✓ [PASS] 11. Artisan dynamically adds new product (initial status: PENDING)`
- `✓ [PASS] 12. Unapproved product is hidden from public customer catalogue`
- `✓ [PASS] 13. Admin reviews and approves the pending product listing`
- `✓ [PASS] 14. DYNAMIC CATALOGUE SUCCESS: Newly approved product appears in public search & filters without code change`
- `✓ [PASS] 15. Customer places order with server-side inventory deduction`
- `✓ [PASS] 16. Inventory decremented from 10 to 8 units in MongoDB`
- `✓ [PASS] 17. Artisan confirms incoming sub-order`
- `✓ [PASS] 18. Artisan marks package as SHIPPED (simulated tracking code auto-generated)`
- `✓ [PASS] 19. Artisan marks package as DELIVERED`
- `✓ [PASS] 20. Verified customer review successfully posted and aggregated`
- `✓ [PASS] 21. Product average rating and review count aggregated in MongoDB`
- **Result: 21 of 21 tests passed with 100% success.**

---

## 10. Deployment Guide

### MongoDB Atlas Setup:
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your server IP (or `0.0.0.0/0`).
3. Set `MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/festiveroots?retryWrites=true&w=majority`.

### Backend Deployment (Render / Railway / AWS):
1. Build command: `npm install`
2. Start command: `npm start`
3. Environment variables: `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend-domain.com`.

### Frontend Deployment (Vercel / Netlify):
1. Build command: `npm run build`
2. Output directory: `dist`
3. Configure API proxy or rewrite rule routing `/api/*` to the backend deployment domain.

---

## 11. Known Limitations & Simulated Features

- **Simulated Payment Gateways:** In accordance with academic scope, online payments are simulated test-mode transactions (`ONLINE_DEMO`) and Cash on Delivery (`COD`). Card details and CVVs are never collected or stored.
- **Simulated Courier Dispatch:** Logistics pickup schedules and tracking codes (`FR-SHIP-...`) are simulated events representing the intermediary delivery lifecycle. External shipping APIs (e.g., Delhivery, Shiprocket) can be plugged directly into `fulfilmentController.js`.
- **Image Storage:** Product images support public web URLs and local disk storage through Multer in `server/uploads/`. Cloudinary SDK integration can be configured by adding API keys to environment variables.

---

## 12. Future Enhancements

1. **Multilingual Regional Support:** Translation into Indian vernacular languages (Telugu, Hindi, Bengali, Tamil, Kannada, Marathi).
2. **Audio/Video Craft Stories:** Direct video demonstrations of artisans shaping clay, carving wood, or weaving zari.
3. **Third-Party Logistics (3PL) Webhooks:** Webhook listeners from actual courier partners for automated GPS dispatch updates.
4. **Artisan Escrow Payouts:** Milestone-based direct bank transfers (NEFT/UPI) to artisans upon successful delivery verification.
