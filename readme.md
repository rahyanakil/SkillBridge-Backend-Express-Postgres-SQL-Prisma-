# SkillBridge Backend

REST API for the SkillBridge tutoring platform — connects students with expert tutors, handles bookings, payments, and role-based access control.

---

## Live URLs

| Service  | URL                                                               |
| -------- | ----------------------------------------------------------------- |
| Backend  | https://vercel.com/rahyanakils-projects/skillbridge-tutor-backend |
| Frontend | https://skillbridge-frontend-ruby.vercel.app                     |

---

## Admin Credentials

| Field    | Value             |
| -------- | ----------------- |
| Email    | admin@gmail.com   |
| Password | StrongPassword123 |

> Run `npm run seed:admin` after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` to create the admin account.

---

## Tech Stack

| Technology       | Version  | Purpose                         |
| ---------------- | -------- | ------------------------------- |
| Node.js + Express | ^5.2.1  | HTTP server & routing           |
| TypeScript       | ^5.9.3   | Type safety                     |
| Prisma ORM       | ^7.4.1   | Database modeling & migrations  |
| PostgreSQL       | —        | Relational database             |
| JWT              | ^9.0.3   | Authentication tokens           |
| Zod              | ^4.3.6   | Request validation              |
| Bcrypt           | ^6.0.0   | Password hashing                |
| Stripe           | ^22.0.2  | Payment processing              |
| Cloudinary       | ^2.9.0   | Image/avatar uploads            |
| Multer           | ^1.4.5   | File upload middleware          |
| Cookie-parser    | ^1.4.7   | Cookie handling                 |

---

## Project Structure

```
b6a4-backend/
├── prisma/
│   ├── schema.prisma          # Database schema & enums
│   └── migrations/
│
├── generated/prisma/          # Prisma client output
│
├── src/
│   ├── adminSeed/             # Admin user seeder
│   ├── config/                # Env config (PORT, JWT_SECRET, etc.)
│   ├── errors/                # Custom error classes
│   ├── lib/                   # Prisma client instance
│   ├── middlewares/           # Auth, error, upload middlewares
│   ├── modules/
│   │   ├── auth/              # Register, login, get-me
│   │   ├── tutor/             # Tutor profile management
│   │   ├── category/          # Course categories (admin-managed)
│   │   ├── course/            # Course CRUD
│   │   ├── booking/           # Booking creation & status management
│   │   ├── review/            # Student reviews
│   │   ├── payment/           # Stripe payment intents
│   │   ├── notification/      # In-app notifications
│   │   └── admin/             # Admin user & booking management
│   ├── routes/
│   │   └── index.ts           # Central route aggregator
│   ├── utils/                 # Helper utilities
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
│
├── prisma.config.ts
├── vercel.json
├── tsconfig.json
└── package.json
```

---

## Environment Variables

Create a `.env` file in `b6a4-backend/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key"
PORT=5000
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
STRIPE_SECRET_KEY="sk_test_..."
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

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start dev server with hot reload (tsx)   |
| `npm run build`  | Build for production (tsup → `/api`)     |
| `npm run seed:admin` | Seed the default admin user          |
| `npm run lint`   | Lint TypeScript source files             |
| `npm run lint:fix` | Auto-fix lint errors                   |

---

## API Reference

**Base URL:** `/api/v1`

All responses follow this format:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "...",
  "data": {}
}
```

---

### Authentication

| Method | Endpoint              | Access  | Description                      |
| ------ | --------------------- | ------- | -------------------------------- |
| POST   | `/auth/register`      | Public  | Register new user                |
| POST   | `/auth/login`         | Public  | Login & receive JWT cookie       |
| GET    | `/auth/get-me`        | Private | Get current user info            |
| PATCH  | `/auth/profile`       | Private | Update name / bio / email        |
| PATCH  | `/auth/password`      | Private | Change password (requires old)   |
| POST   | `/auth/avatar`        | Private | Upload avatar to Cloudinary      |

---

### Tutors

| Method | Endpoint               | Access  | Description            |
| ------ | ---------------------- | ------- | ---------------------- |
| POST   | `/tutors/profile`      | Tutor   | Create tutor profile   |
| GET    | `/tutors/profile/:id`  | Public  | Get tutor by ID        |
| GET    | `/tutors`              | Public  | List all tutors        |

---

### Categories

| Method | Endpoint            | Access  | Description           |
| ------ | ------------------- | ------- | --------------------- |
| GET    | `/categories`       | Public  | List all categories   |
| POST   | `/categories`       | Admin   | Create category       |
| PUT    | `/categories/:id`   | Admin   | Update category       |
| DELETE | `/categories/:id`   | Admin   | Delete category       |

---

### Courses

| Method | Endpoint         | Access  | Description           |
| ------ | ---------------- | ------- | --------------------- |
| GET    | `/courses`       | Public  | List all courses      |
| GET    | `/courses/:id`   | Public  | Get course by ID      |
| POST   | `/courses`       | Tutor   | Create course         |
| PUT    | `/courses/:id`   | Tutor   | Update course         |
| DELETE | `/courses/:id`   | Tutor   | Delete course         |

---

### Bookings

| Method | Endpoint                    | Access   | Description                      |
| ------ | --------------------------- | -------- | -------------------------------- |
| POST   | `/bookings`                 | Student  | Create booking                   |
| GET    | `/bookings/my-bookings`     | Student  | Get student's own bookings       |
| GET    | `/bookings/tutor-bookings`  | Tutor    | Get tutor's incoming bookings    |
| PATCH  | `/bookings/:id/status`      | Tutor    | Accept / reject / complete       |

---

### Reviews

| Method | Endpoint                    | Access   | Description              |
| ------ | --------------------------- | -------- | ------------------------ |
| POST   | `/reviews`                  | Student  | Submit review            |
| GET    | `/reviews`                  | Public   | All reviews              |
| GET    | `/reviews/course/:courseId` | Public   | Reviews for a course     |
| GET    | `/reviews/tutor/:tutorId`   | Public   | Reviews for a tutor      |

---

### Payments (Stripe)

| Method | Endpoint                           | Access   | Description                      |
| ------ | ---------------------------------- | -------- | -------------------------------- |
| POST   | `/payments/create-payment-intent`  | Student  | Create Stripe PaymentIntent      |
| POST   | `/payments/confirm`                | Student  | Confirm payment & update booking |

---

### Notifications

| Method | Endpoint                       | Access   | Description              |
| ------ | ------------------------------ | -------- | ------------------------ |
| GET    | `/notifications`               | Private  | Get user notifications   |
| PATCH  | `/notifications/:id/read`      | Private  | Mark notification read   |

---

### Admin

| Method | Endpoint                      | Access  | Description              |
| ------ | ----------------------------- | ------- | ------------------------ |
| GET    | `/admin/users`                | Admin   | List all users           |
| PATCH  | `/admin/users/:userId`        | Admin   | Ban or unban a user      |
| GET    | `/admin/bookings`             | Admin   | List all bookings        |
| DELETE | `/admin/courses/:courseId`    | Admin   | Remove any course        |

---

## Database Models

### Enums

```prisma
enum Role          { STUDENT  TUTOR  ADMIN }
enum BookingStatus { PENDING  ACCEPTED  REJECTED  COMPLETED  CANCELLED }
enum PaymentStatus { UNPAID  PAID  REFUNDED }
```

### Models

| Model        | Key Fields                                                              |
| ------------ | ----------------------------------------------------------------------- |
| User         | id, name, email, password, role, avatar, isBanned                       |
| Tutor        | id, userId (FK), bio, expertise, hourlyRate, experience                 |
| Category     | id, name (unique)                                                       |
| Course       | id, tutorId, categoryId, title, description, price                      |
| Booking      | id, studentId, tutorId, courseId, date, status, paymentStatus, classroomLink |
| Review       | id, rating, comment, studentId, tutorId, courseId, bookingId (unique)  |
| Notification | id, userId, type, title, message, isRead                                |

---

## Authentication Flow

- JWT is generated on login and sent as an **httpOnly cookie**
- Frontend sends the raw token (no `Bearer` prefix) in the `Authorization` header
- `auth.middleware.ts` verifies the token and attaches `req.user`
- Role-based guards (`requireRole`) protect tutor, student, and admin routes

---

## Deployment

Deployed to **Vercel** using `vercel.json` with the built output in `/api`.

```bash
# Build for production
npm run build

# Apply migrations on production DB
npx prisma migrate deploy
```

---

## License

MIT — for educational use.
