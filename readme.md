# SkillBridge Backend

REST API for the SkillBridge tutoring platform — connects students with expert tutors, handles bookings, payments, and role-based access control.

---

## Live URLs

| Service  | URL                                              |
| -------- | ------------------------------------------------ |
| Backend  | https://skillbridge-tutor-backend.vercel.app     |
| Frontend | https://skillbridge-frontend-ruby.vercel.app     |

---

## Admin Credentials

| Field    | Value             |
| -------- | ----------------- |
| Email    | admin@gmail.com   |
| Password | StrongPassword123 |

> Run `npm run seed:admin` after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` to create the admin account.

---

## Tech Stack

| Technology        | Version  | Purpose                         |
| ----------------- | -------- | ------------------------------- |
| Node.js + Express | ^5.2.1   | HTTP server & routing           |
| TypeScript        | ^5.9.3   | Type safety                     |
| Prisma ORM        | ^7.4.1   | Database modeling & migrations  |
| PostgreSQL (Neon) | —        | Relational database             |
| JWT               | ^9.0.3   | Authentication tokens           |
| Zod               | ^4.3.6   | Request validation              |
| Bcryptjs          | ^3.0.3   | Password hashing                |
| Stripe            | ^22.0.2  | Payment processing              |
| Cloudinary        | ^2.9.0   | Image / avatar uploads          |
| Multer            | ^1.4.5   | File upload middleware           |
| Google AI SDK     | ^0.24.1  | Gemini AI (optional)            |

---

## Project Structure

```
b6a4-backend/
├── prisma/
│   ├── schema.prisma          # Database schema & enums
│   └── migrations/            # Migration history
│
├── generated/prisma/          # Prisma client output
│
├── src/
│   ├── adminSeed/             # Admin user seeder
│   ├── config/                # Env config (PORT, JWT_SECRET, etc.)
│   ├── lib/                   # Prisma client instance (PrismaPg adapter)
│   ├── middlewares/           # Auth, error, notFound, validate middlewares
│   ├── modules/
│   │   ├── auth/              # Register, login, get-me, Google OAuth, GitHub OAuth
│   │   ├── tutor/             # Tutor profile, earnings
│   │   ├── category/          # Course categories (admin-managed)
│   │   ├── course/            # Course CRUD + recommendations
│   │   ├── booking/           # Booking creation & status management
│   │   ├── review/            # Student reviews
│   │   ├── payment/           # Stripe payment intents
│   │   ├── notification/      # In-app notifications
│   │   ├── admin/             # Admin user & booking management
│   │   └── ai/                # AI tutor endpoint (Gemini)
│   ├── routes/
│   │   └── index.ts           # Central route aggregator
│   ├── utils/                 # sendResponse, helper utilities
│   ├── app.ts                 # Express app setup & CORS
│   └── server.ts              # Server entry point
│
├── vercel.json                # Vercel serverless config
├── tsconfig.json
└── package.json
```

---

## Environment Variables

Create a `.env` file in `b6a4-backend/`:

```env
# Server
PORT=5000
APP_URL=https://skillbridge-tutor-backend.vercel.app

# Database (PostgreSQL / Neon)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# Auth
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Admin seed credentials
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=StrongPassword123

# Cloudinary (avatar uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_RESTRICTED_KEY=rk_test_...

# Gemini AI (optional — for AI tutor endpoint)
GEMINI_API_KEY=your-gemini-api-key
```

---

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Seed admin user
npm run seed:admin

# 5. Start development server
npm run dev
```

Server runs at `http://localhost:5000`.

### Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start dev server with hot reload (tsx)   |
| `npm run build`      | Build for production (tsup → `/api`)     |
| `npm run seed:admin` | Seed the default admin user              |
| `npm run lint`       | Lint TypeScript source files             |
| `npm run lint:fix`   | Auto-fix lint errors                     |

---

## API Reference

**Base URL:** `/api/v1`

All responses follow this format:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

---

### Authentication

| Method | Endpoint           | Access  | Description                    |
| ------ | ------------------ | ------- | ------------------------------ |
| POST   | `/auth/register`   | Public  | Register new user              |
| POST   | `/auth/login`      | Public  | Login & receive JWT cookie     |
| POST   | `/auth/google`     | Public  | Google OAuth — find or create user |
| POST   | `/auth/github`     | Public  | GitHub OAuth — find or create user |
| GET    | `/auth/get-me`     | Private | Get current user info          |
| PATCH  | `/auth/profile`    | Private | Update name / email            |
| PATCH  | `/auth/password`   | Private | Change password                |
| POST   | `/auth/avatar`     | Private | Upload avatar to Cloudinary    |

---

### Tutors

| Method | Endpoint               | Access  | Description            |
| ------ | ---------------------- | ------- | ---------------------- |
| POST   | `/tutors/profile`      | Tutor   | Create / update tutor profile |
| GET    | `/tutors/me`           | Tutor   | Get own tutor profile  |
| GET    | `/tutors/profile/:id`  | Public  | Get tutor by user ID   |
| GET    | `/tutors`              | Public  | List all tutors        |
| GET    | `/tutors/earnings`     | Tutor   | Earnings breakdown     |

---

### Categories

| Method | Endpoint              | Access  | Description           |
| ------ | --------------------- | ------- | --------------------- |
| GET    | `/categories`         | Public  | List all categories   |
| POST   | `/categories`         | Admin   | Create category       |
| PUT    | `/categories/:id`     | Admin   | Update category       |
| DELETE | `/categories/:id`     | Admin   | Delete category       |

---

### Courses

| Method | Endpoint                       | Access   | Description                          |
| ------ | ------------------------------ | -------- | ------------------------------------ |
| GET    | `/courses`                     | Public   | List courses (search, filter, limit) |
| GET    | `/courses/:id`                 | Public   | Get course with reviews              |
| POST   | `/courses`                     | Tutor    | Create course                        |
| PUT    | `/courses/:id`                 | Tutor    | Update course                        |
| DELETE | `/courses/:id`                 | Tutor    | Delete course                        |
| GET    | `/courses/recommendations/me`  | Student  | Personalised recommendations         |

> Supports query params: `?q=`, `?categoryId=`, `?minPrice=`, `?maxPrice=`, `?limit=`, `?page=`

---

### Bookings

| Method | Endpoint                    | Access   | Description                        |
| ------ | --------------------------- | -------- | ---------------------------------- |
| POST   | `/bookings`                 | Student  | Create booking (status: PENDING)   |
| GET    | `/bookings/my-bookings`     | Student  | Student's own bookings             |
| GET    | `/bookings/completed`       | Student  | Completed bookings with reviews    |
| PATCH  | `/bookings/:id/cancel`      | Student  | Cancel a pending booking           |
| GET    | `/bookings/tutor-bookings`  | Tutor    | All incoming bookings              |
| PATCH  | `/bookings/:id/status`      | Tutor    | Accept / Reject / Complete         |
| GET    | `/bookings/:id/classroom`   | Both     | Get or generate Jitsi Meet link    |

---

### Reviews

| Method | Endpoint                    | Access   | Description          |
| ------ | --------------------------- | -------- | -------------------- |
| POST   | `/reviews`                  | Student  | Submit review        |
| GET    | `/reviews`                  | Public   | All reviews          |
| GET    | `/reviews/course/:courseId` | Public   | Reviews for a course |
| GET    | `/reviews/tutor/:tutorId`   | Public   | Reviews for a tutor  |

---

### Payments (Stripe)

| Method | Endpoint                          | Access   | Description                      |
| ------ | --------------------------------- | -------- | -------------------------------- |
| POST   | `/payments/create-payment-intent` | Student  | Create Stripe PaymentIntent      |
| POST   | `/payments/confirm`               | Student  | Confirm payment & mark PAID      |

---

### Notifications

| Method | Endpoint                    | Access   | Description              |
| ------ | --------------------------- | -------- | ------------------------ |
| GET    | `/notifications`            | Private  | Get user notifications   |
| PATCH  | `/notifications/:id/read`   | Private  | Mark notification read   |
| PATCH  | `/notifications/read-all`   | Private  | Mark all as read         |

---

### AI Tutor

| Method | Endpoint   | Access   | Description                   |
| ------ | ---------- | -------- | ----------------------------- |
| POST   | `/ai/ask`  | Private  | Ask Gemini AI a tutor question |

---

### Admin

| Method | Endpoint                   | Access  | Description            |
| ------ | -------------------------- | ------- | ---------------------- |
| GET    | `/admin/users`             | Admin   | List all users         |
| PATCH  | `/admin/users/:userId`     | Admin   | Ban or unban a user    |
| DELETE | `/admin/users/:userId`     | Admin   | Delete a user          |
| GET    | `/admin/bookings`          | Admin   | List all bookings      |
| PATCH  | `/admin/bookings/:id/status` | Admin | Update booking status  |
| DELETE | `/admin/courses/:courseId` | Admin   | Remove any course      |
| POST   | `/admin/categories`        | Admin   | Create category        |
| DELETE | `/admin/categories/:id`    | Admin   | Delete category        |
| GET    | `/admin/stats`             | Admin   | Platform statistics    |

---

## Database Models

### Enums

```prisma
enum Role          { STUDENT  TUTOR  ADMIN }
enum BookingStatus { PENDING  ACCEPTED  REJECTED  COMPLETED  CANCELLED }
enum PaymentStatus { UNPAID  PAID  REFUNDED }
```

### Models

| Model        | Key Fields                                                                   |
| ------------ | ---------------------------------------------------------------------------- |
| User         | id, name, email, password, role, avatar, isBanned                            |
| Tutor        | id, userId (FK), bio, expertise, hourlyRate, experience                      |
| Category     | id, name (unique)                                                             |
| Course       | id, tutorId, categoryId, title, description, price                           |
| Booking      | id, studentId, tutorId, courseId, date, status, paymentStatus, classroomLink |
| Review       | id, rating, comment, studentId, tutorId, courseId, bookingId (unique)        |
| Notification | id, userId, type, title, message, isRead                                     |

---

## Authentication Flow

- JWT is generated on login / OAuth and sent as an **httpOnly cookie**
- Frontend sends the raw token (no `Bearer` prefix) in the `Authorization` header
- `auth.middleware.ts` verifies the token and attaches `req.user`
- **Google & GitHub OAuth** — `POST /auth/google` and `POST /auth/github` accept email/name/avatar, find or create the user, and return a JWT

---

## Module Pattern

Every feature lives in `src/modules/<feature>/` with four files:

```
*.controller.ts   — Express request/response handlers
*.service.ts      — Business logic (Prisma queries)
*.routes.ts       — Express router
*.validation.ts   — Zod schemas used by validateRequest middleware
```

All routes are aggregated in `src/routes/index.ts` and mounted at `/api/v1`.

---

## Deployment (Vercel)

Deployed as a serverless function using `vercel.json`.

```bash
# Build for production
npm run build

# Apply migrations to production DB
npx prisma migrate deploy
```

Set all environment variables in **Vercel → skillbridge-tutor-backend → Settings → Environment Variables** before deploying.

---

## License

MIT — for educational use.
