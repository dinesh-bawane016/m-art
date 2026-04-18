# M-Art Authentication Flow & Security Architecture

The M-Art platform implements a robust, stateless, role-based authentication architecture utilizing **JSON Web Tokens (JWT)** and **bcrypt** encryption. 

The system securely isolates buyers, artists, and administrators using strict middleware boundaries on both the frontend and backend.

---

## 1. Core Technologies
- **JWT (JSON Web Tokens)**: Used for stateless session management.
- **Bcrypt.js**: Used for cryptographically hashing user passwords securely in the database.
- **React Context API API (`AuthContext.jsx`)**: Manages the frontend awareness of the user's active session globally.
- **Express Middleware (`auth.js`)**: Intercepts backend HTTP requests to strictly enforce permissions before reaching the database controllers.

---

## 2. The Registration & Login Flow

### User Registration
1. **Frontend Validation**: A user or artist submits the signup form (`name, email, password, role`). The form inherently restricts passwords to a **strict minimum of 6 characters** before submission.
2. **Backend Validation Validation (`express-validator`)**: Upon reaching `POST /api/auth/register`, the middleware securely verifies that the email is syntactically valid and that the string sent as `password` explicitly satisfies the schema (`isLength({ min: 6 })`), ensuring parity between the client and server.
3. **Backend Hash**: The server generates a dynamic salt buffer of exactly **10 rounds** (`bcrypt.genSalt(10)`). It then merges this salt into the plaintext password via `bcrypt.hash()` to create a computationally expensive, one-way cryptographic signature.
4. **Database Insert**: The user is uniquely stored in the MongoDB `User` collection. **Only the bcrypt hash is saved** (never plaintext), certifying that if the underlying database is compromised, brute-force cracking the user passwords would be virtually impossible.
5. **Token Generation**: The server signs a unique JWT using a server-side secret key (`JWT_SECRET`) embedded with the user's `_id`. This JWT is configured to explicitly expire after 7 days automatically.
6. **Auto-Login**: The token and newly created user model are returned to the client to initialize the session.

### User Login
1. **Frontend**: The user submits their email and plaintext password.
2. **Backend Verification**: The backend route (`POST /api/auth/login`) finds the user by email.
3. **Password Comparison**: The backend runs `bcrypt.compare(plaintext_password, stored_hash)`. If it evaluates to true, the user is authenticated.
4. **Token Generation**: The server signs a fresh JWT and returns it to the React application.
5. **Local Storage**: The `AuthContext` receives the token, stores it securely in the browser's `localStorage` (as `mart_token`), and mounts the user data (as `mart_user`) so the UI updates immediately to a logged-in state.

---

## 3. Role-Based Access Control (RBAC)

The system manages three distinct privilege levels securely:

### Buyer (Default User)
- Has permission to view galleries, add items to the cart, and proceed to the Razorpay Checkout gateway.
- Cannot upload artworks or view the Admin dashboard.

### Artist
- Must be vetted/verified by an administrator. Until `is_verified: true`, their uploaded artworks remain securely hidden from the public gallery.
- Has exclusive access to the `ArtistDashboard` where they can execute `POST`, `PUT`, and `DELETE` requests **only on artworks that they natively own** (enforced by comparing `artwork.artist_id` against the JWT session).

### Administrator
- Operates on a completely separate MongoDB collection (`Admin` vs `User`) to ensure no horizontal privilege escalation is possible.
- Has absolute global read/write privileges.
- Can verify pending Artists and securely delete unapproved artworks via the `ArtworkModeration` panel.

---

## 4. Backend Protection Middleware

The Express server uses two specialized protection functions (`server/middleware/auth.js`):

### 1. `protect`
This interceptor runs before any private route. 
- It extracts the `Authorization` header containing the JWT (e.g. `Bearer eyJhbG...`).
- It verifies the signature against the server's private `JWT_SECRET`.
- If valid, it decodes the payload, finds the user in MongoDB, and cleanly attaches `req.user` to the request lifecycle object. If invalid, the API rejects the request instantly with a `401 Unauthorized`.

### 2. `authorize('Role1', 'Role2')`
This secondary interceptor runs strictly *after* `protect`.
- It looks at the loaded `req.user.role` and strictly asserts whether they have the proper rank to hit the database controller. 
- E.g., `router.delete('/:id', protect, authorize('Admin'))` ensures only Admins can arbitrarily delete an artwork.

---

## 5. Frontend Route Protection
In the React application (`App.jsx`), sensitive views are securely wrapped using the `<ProtectedRoute>` High-Order Component. 

If a user tries to manually manipulate the browser URL to visit `/admin` or `/artist/dashboard`, the `ProtectedRoute` intercepts the render lifecycle:
- Assesses if `user` exists in `AuthContext`.
- Checks if `user.role` matches the route's constraints.
- Automatically kicks them back to the Home or Login page if they fail either check, ensuring the UI remains perfectly insulated.
