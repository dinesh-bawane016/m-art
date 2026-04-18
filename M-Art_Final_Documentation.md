# M-Art — Milestone 6 (Code Review-2) Full Documentation

---

## Chapter 3: Testing

### 3.1 Test Cases with Results

#### Module 1: User Registration
| TC ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|-------|----------------------|------------|-----------------|---------------|--------|
| TC-01 | Register a new Buyer with valid data | Name: "Ravi Kumar", Email: ravi@email.com, Password: pass1234, Role: Buyer | Account created; redirected to `/gallery`; JWT token stored in localStorage | Account created successfully; redirected to `/gallery`; token stored | ✅ Pass |
| TC-02 | Register a new Artist with valid data | Name: "Meera Das", Email: meera@email.com, Password: pass1234, Role: Artist | Account created with `is_verified: false`; redirected to `/artist/dashboard`; verification notice shown | Account created; redirected to dashboard; "Pending Verification" notice displayed | ✅ Pass |
| TC-03 | Register with duplicate email | Email: priya@email.com (already exists) | Error message: "Email already registered" | Error displayed: "Email already registered" | ✅ Pass |
| TC-04 | Register with empty required fields | Name: "", Email: "", Password: "" | Error message: "Please provide name, email, and password" | Error displayed as expected | ✅ Pass |
| TC-05 | Register with password less than 6 characters | Password: "abc" | HTML5 validation prevents submission (minLength=6) | Form not submitted; browser validation shown | ✅ Pass |

#### Module 2: User Login
| TC ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|-------|----------------------|------------|-----------------|---------------|--------|
| TC-06 | Login as Buyer with valid credentials | Email: kiran@email.com, Password: password123 | Redirected to `/gallery`; JWT stored | Redirected to gallery; token stored in localStorage | ✅ Pass |
| TC-07 | Login as Artist with valid credentials | Email: priya@email.com, Password: password123 | Redirected to `/artist/dashboard` | Redirected to artist dashboard | ✅ Pass |
| TC-08 | Login as Admin with valid credentials | Email: admin@m-art.com, Password: admin123, Tab: Admin | Redirected to `/admin`; admin panel rendered | Redirected to admin panel | ✅ Pass |
| TC-09 | Login with invalid password | Email: kiran@email.com, Password: wrong123 | Error: "Invalid email or password" | Error displayed as expected | ✅ Pass |
| TC-10 | Login with non-existent email | Email: fake@email.com | Error: "Invalid email or password" | Error displayed as expected | ✅ Pass |

#### Module 3: Gallery & Artwork Browsing
| TC ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|-------|----------------------|------------|-----------------|---------------|--------|
| TC-11 | View Gallery page (public access) | Navigate to `/gallery` | All artworks from verified artists displayed in grid | Artworks from verified artists loaded and displayed | ✅ Pass |
| TC-12 | Filter artworks by category | Select category: "Oil Painting" | Only Oil Painting artworks shown | Filtered correctly; result count updated | ✅ Pass |
| TC-13 | Filter by price range | Min: ₹10,000, Max: ₹30,000 | Only artworks within ₹10,000–₹30,000 shown | Artworks filtered by price range correctly | ✅ Pass |
| TC-14 | Search by artwork title | Search: "Sunset" | Only artworks with "Sunset" in title shown | "Sunset Over the Ganges" displayed | ✅ Pass |
| TC-15 | View artwork details | Click on "Sunset Over the Ganges" card | Redirected to `/gallery/:id`; full details with image, price, artist info, status shown | Artwork detail page loaded with all info | ✅ Pass |
| TC-16 | Unverified artist's artwork not shown | Arjun Mehta's artwork (unverified) | Artwork not displayed in public gallery | Artwork not visible in gallery results | ✅ Pass |

#### Module 4: Shopping Cart & Razorpay Checkout
| TC ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|-------|----------------------|------------|-----------------|---------------|--------|
| TC-17 | Add artwork to cart | Click "Add to Cart" on an available artwork | Artwork added; button text changes to "✓ In Cart" | Artwork added to cart; button state updated | ✅ Pass |
| TC-18 | View cart page | Navigate to `/cart` | Cart items displayed with image, title, artist, price, and order summary | All cart items displayed correctly with totals | ✅ Pass |
| TC-19 | Remove item from cart | Click "Remove" on a cart item | Item removed; total updated | Item removed; subtotal recalculated | ✅ Pass |
| TC-20 | Clear entire cart | Click "Clear Cart" | All items removed; empty cart message shown | Cart emptied; "Your cart is empty" displayed | ✅ Pass |
| TC-21 | Proceed to checkout (logged-in Buyer) | Click "Checkout" on cart page | Redirected to `/checkout`; Razorpay Secure Checkout area shown | Checkout page displayed with items and summary | ✅ Pass |
| TC-22 | Place order successfully (Razorpay Integration) | Click "Place Order" on checkout page | Razorpay payment window opens. After payment success, order created; artwork marked "Sold"; success message shown; cart cleared | Razorpay window functional; order confirmed successfully | ✅ Pass |
| TC-23 | Checkout without login | Access `/checkout` without authentication | Redirected to `/login` | Redirected to login page by ProtectedRoute | ✅ Pass |

#### Module 5: Artist Dashboard & Verification
| TC ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|-------|----------------------|------------|-----------------|---------------|--------|
| TC-24 | Upload new artwork | Title: "River at Dawn", Price: ₹20,000, Category: Watercolour, Image: Local File Upload | Artwork created; appears in "My Artworks" tab | Artwork uploaded securely (Cloudinary) and visible in dashboard | ✅ Pass |
| TC-25 | Edit own artwork | Change title from "River at Dawn" to "River at Dusk" | Title updated in list | Title updated successfully | ✅ Pass |
| TC-26 | Delete own artwork | Click "Delete" on an artwork → Confirm | Artwork removed from list | Artwork deleted; list refreshed | ✅ Pass |
| TC-27 | View sales statistics | Navigate to "My Sales" tab | Sales table with buyer name, amount, and status shown | Sales data displayed correctly | ✅ Pass |
| TC-28 | Unverified artist sees notice | Login as arjun@email.com (unverified) | "Pending Verification" warning banner displayed | Warning banner displayed on dashboard | ✅ Pass |

#### Module 6: Admin Panel
| TC ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|-------|----------------------|------------|-----------------|---------------|--------|
| TC-29 | View admin dashboard overview | Login as admin → `/admin` | Stats cards showing Total Users, Pending Reviews, Revenue, Total Orders | All stat cards rendered with correct data | ✅ Pass |
| TC-30 | Approve an unverified artist | Click "Approve" on Arjun Mehta | Artist's `is_verified` set to true; removed from pending list | Artist approved; artworks now visible in gallery | ✅ Pass |
| TC-31 | Reject an unverified artist | Click "Reject" on Deepika Rao | Artist account deleted; removed from pending list | Artist removed from database | ✅ Pass |
| TC-32 | View all artworks (admin moderation) | Navigate to Artwork Moderation section | All artworks shown (including from unverified artists) | Full artwork list displayed | ✅ Pass |
| TC-33 | Admin deletes an artwork | Click "Delete" on an artwork in moderation | Artwork removed from database | Artwork deleted; list refreshed | ✅ Pass |
| TC-34 | View all transactions | Navigate to Transactions section | All orders listed with Razorpay payment details | Transaction table displayed correctly | ✅ Pass |

#### Module 7: Route Protection & Access Control
| TC ID | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|-------|----------------------|------------|-----------------|---------------|--------|
| TC-35 | Buyer accesses `/artist/dashboard` | Logged in as Buyer → navigate to `/artist/dashboard` | Redirected to `/login` | Redirected to login by ProtectedRoute | ✅ Pass |
| TC-36 | Artist accesses `/admin` | Logged in as Artist → navigate to `/admin` | Redirected to `/login` | Redirected to login by ProtectedRoute | ✅ Pass |
| TC-37 | Guest accesses `/checkout` | Not logged in → navigate to `/checkout` | Redirected to `/login` | Redirected to login by ProtectedRoute | ✅ Pass |

---

### 3.2 Defect Report / Test Log

| Defect ID | Module | Description | Severity | Steps to Reproduce | Status | Resolution |
|-----------|--------|-------------|----------|---------------------|--------|------------|
| D-01 | Cart | Cart data persists after logout — items from one user's session remain visible if another user logs in on the same browser. | Low | 1. Login as Buyer A → add items. 2. Logout. 3. Login as Buyer B. | Resolved | Cart logic updated to clear `localStorage` cart upon user logout. |
| D-02 | Checkout | `alert()` used for error feedback during checkout failure instead of inline UI error message. | Low | 1. Fail Razorpay verification. 2. Observe browser `alert()` pop-up. | Open | Planned replacement with Toast notifications. |
| D-03 | Gallery | GSAP library loaded dynamically inside `useEffect` — if it fails to load, 3D tilt silently fails without fallback. | Low | 1. Block GSAP CDN. 2. Hover over artwork card. | Open | Add graceful degradation to static CSS hover states. |
| D-04 | Artwork Detail | Invalid artwork ID navigates to `/gallery` but shows no user feedback. | Low | 1. Navigate to `/gallery/invalidid123`. 2. User is redirected silently. | Open | Inject a toast notification reading "Artwork not found" before redirect. |
| D-05 | Artist Dashboard | `confirm()` dialog for artwork deletion uses native browser dialog instead of a sleek modal. | Low | 1. Login as Artist. 2. Click "Delete". | Open | Replace `confirm()` with a custom React modal component. |
| D-06 | Admin Panel | Action log (Approved/Rejected artists) is stored in local React state — data lost on page refresh. | Low | 1. Approve artist. 2. Refresh page. 3. Action log is empty. | Open | Shift log storage to the backend database or Redux state. |
| D-07 | Registration | No complex email format validation in backend beyond HTML5 types. | Medium | 1. POST `/api/auth/register` with malformed email via API client. | Open | Introduce a validation logic library (like `validator`) on server-side. |

---

## Chapter 4: Limitations of Proposed System

1. **Limited Razorpay Test Mode**: The checkout integration currently utilizes Razorpay Test Mode keys exclusively without extending into robust live merchant capabilities yet.
2. **Simulated Analytics Tracking**: The artist dashboard limits sales statistics to basic aggregations without complex time-series data or graphical charting mechanisms.
3. **Single-Browser Cart Configuration**: The shopping cart operates entirely via the browser's `localStorage` and does not synchronize with the backend database. Switching devices results in an empty cart.
4. **Absence of Real-Time Notifications**: Users and artists are not proactively alerted (via websockets) when artwork status changes, when profiles are verified, or when an order succeeds.
5. **No Password Recovery Mechanism**: The platform lacks an email-based password reset architecture ("Forgot Password" feature).
6. **No Verification for Registered Emails**: Users can register utilizing unverified emails without an OTP or magic link confirmation step.
7. **Lack of Results Pagination**: The Gallery page pulls and maps all database artworks simultaneously, which will degrade performance as inventory scales significantly.
8. **Static User Profiles**: Following registration, users cannot edit account details, update their password, or upload a custom avatar.

---

## Chapter 5: Proposed Enhancements

1. **Live Payment Processing Transition**: Migrate from Razorpay Test credentials to Live credentials and an integrated webhook architecture for actual merchant transaction settlements.
2. **Advanced Image Processing Pipelines**: Expand the existing Cloudinary upload infrastructure to automatically watermark artist uploads and aggressively compress responsive image sizes for the gallery.
3. **AI-Powered Artwork Recommendations**: Utilize machine learning to analyze user viewing habits and cart history to propose customized gallery collections.
4. **Progressive Web App (PWA) Support**: Transmute the React web app into an installable PWA for offline browsing, mobile home-screen access, and native push notifications.
5. **Interactive Real-Time Architecture**: Employ Socket.io to push real-time updates—such as instant "Sold" badging for concurrent shoppers or immediate sales alerts to Artist dashboards.
6. **Server-Side Cart Synchronization**: Persist shopping bags to MongoDB so consumers can start browsing on a mobile device and complete Razorpay checkout universally across a desktop environment.
7. **Robust Search & Filtering Algorithms**: Introduce tag-querying, advanced sorting algorithms (e.g., highly rated, newest first), and auto-complete search functionality.

---

## Chapter 6: References

1. **MongoDB Documentation**: Referencing NoSQL database collections schemas and data mapping. [https://docs.mongodb.com/](https://docs.mongodb.com/)
2. **Express.js API Reference**: Foundational architecture for the backend API logic. [https://expressjs.com/](https://expressjs.com/)
3. **React.js Official Documentation**: For constructing state-driven UI components. [https://react.dev/](https://react.dev/)
4. **Node.js**: The core runtime environment. [https://nodejs.org/](https://nodejs.org/)
5. **Razorpay Node.js & React Integration**: Developer documentation utilized to integrate secure checkout test modes. [https://razorpay.com/docs/](https://razorpay.com/docs/)
6. **Cloudinary Integration**: Cloud-based media management for secure artwork image hosting and file uploads via Multer. [https://cloudinary.com/](https://cloudinary.com/)
7. **Tailwind CSS Utility Framework**: Global design and layout execution. [https://tailwindcss.com/](https://tailwindcss.com/)
8. **GreenSock Animation Platform (GSAP)**: Leveraged for the premium 3D tilt hover animations on the Artwork gallery cards. [https://gsap.com/](https://gsap.com/)
9. **JSON Web Tokens (JWT)**: Security documentation used for stateless authentication route protection. [https://jwt.io/](https://jwt.io/)

---

## Chapter 7: User Manual

### 7.1 Getting Started (Default System Accounts)
For evaluation, use the following pre-seeded test data accounts:
*   **Admin Access:** `admin@m-art.com` | Password: `admin123`
*   **Buyer Access:** `kiran@email.com` | Password: `password123`
*   **Artist Access (Verified):** `priya@email.com` | Password: `password123`

### 7.2 Buyer Flow
**1. Registration / Login**
Navigate to `/login`. Sign in using `kiran@email.com`.
`[Insert Screenshot: User Login Terminal/Form]`

**2. Browsing The Gallery**
Navigate to `/gallery`. Utilize the category pills (e.g., "Digital Art") to dynamically filter the M-Art collection. Click any Artwork to load its unique detail URL.
`[Insert Screenshot: Main Gallery Interface with Active Search/Filters]`

**3. Utilizing the Cart**
Inside the Artwork Detail view, click **"Add to Cart"**. In the top navigation, click the Cart icon to proceed to the review screen. Add, clear, or monitor itemized calculations.
`[Insert Screenshot: Unified Shopping Cart Page]`

**4. Razorpay Checkout Integration**
Click **"Checkout"**. The system prepares a Secure Razorpay Checkout invoice. Hit **"Place Order"**. 
A Razorpay overlay will emerge autonomously. Supply default testing data (e.g., generic UPI or testing Card parameters) to execute the payment simulator securely.
`[Insert Screenshot: Razorpay Payment Gateway Modal overlaid on the App]`

Upon validation, the Buyer explores the "Order Confirmed" success layout, and the procured item transforms its global state to "Sold".
`[Insert Screenshot: Order Confirmation Success View]`

### 7.3 Artist Flow
**1. Accessing Dashboard Operations**
Sign in with `priya@email.com`. Select `Dashboard` from the navigational header to trigger `/artist/dashboard`. 

**2. Financial and Inventory Monitoring**
Review the top quantitative statistics: Total Artworks, Gross Revenue (₹), and Itemized Sales Records bridging exact buyers to their purchased artworks.
`[Insert Screenshot: Artist Dashboard Analytics and Overview tab]`

**3. Listing Administration**
Click **"+ Upload Artwork"**. Input the exact meta-data components (`Title`, `Price (₹)`, direct local file upload to `Cloudinary`, and a `Category` target). Click **Upload** to synthesize the piece into the live Marketplace.
`[Insert Screenshot: Upload Artwork Database Form Modal]`

**Note on Unverified Accounts:** New Artists confront a mandatory **"Pending Verification"** block. Artworks injected by unverified actors remain isolated from public viewership until Admin endorsement via the verification logic block.
`[Insert Screenshot: Artist Dashboard Warning Banner for Unverified State]`

### 7.4 Admin Flow
**1. Operating the Administrative Layout**
Log in with `admin@m-art.com`. The application shifts to an isolated Sidebar Dashboard environment at `/admin`.
`[Insert Screenshot: Admin Sidebar Navigating Interface]`

**2. Verifying Independent Artists**
Execute the **Verify Artists** tab. Analyze unverified marketplace applicants. Select **"Approve"** to liberate their securely hosted inventory to active statuses.
`[Insert Screenshot: Pending Verifications Action Log and Table]`

**3. Content and Marketplace Moderation**
Within the **Artwork Moderation** screen, independently visualize the entirety of the database content.
`[Insert Screenshot: Global Administrative Artwork Moderation Table]`

**4. Tracking Financial Success (Transactions)**
Observe the master transactional log, isolating precise invoice amounts directly paired to Buyers, the exact Artwork distributed, and their absolute Razorpay checkout status. 
`[Insert Screenshot: Complete Transaction and Payment Table History]`
