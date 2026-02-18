# SkillBridge Backend

Full-Stack Tutoring Platform API  
(Node.js + Express + PostgreSQL + Prisma)

SkillBridge is a platform that connects students with expert tutors.  
This backend handles authentication, tutor profiles, bookings, reviews, categories, and admin operations.

---

## 🚀 Tech Stack

| Technology        | Purpose                  |
| ----------------- | ------------------------ |
| Node.js + Express | Backend API              |
| PostgreSQL        | Database                 |
| Prisma ORM        | DB modeling + migrations |
| JWT               | Authentication           |
| Zod / Validator   | Validation               |
| Cors + Helmet     | Security                 |

---

## 📁 Project Structure

```
skillbridge-backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key"
PORT=5000
```

---

## 🛠️ Installation

### 1️⃣ Clone Repo

```
git clone https://github.com/rahyanakil/skillbridge-backend
cd skillbridge-backend
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Setup Prisma

```
npx prisma generate
npx prisma migrate dev --name init
```

### 4️⃣ Start Server

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

# 👤 User Roles

- Student
- Tutor
- Admin (seeded)

Users choose role during registration.

---

# 🧪 API Base URL

Local:

```
http://localhost:5000/api
```

Production example:

```
https://skillbridge-api.vercel.app/api
```

---

# 📘 API Documentation

## 🔐 Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register (student/tutor) |
| POST   | `/api/auth/login`    | Login                    |
| GET    | `/api/auth/me`       | Current user             |

---

## 🎓 Tutors (Public)

| Method | Endpoint          | Description   |
| ------ | ----------------- | ------------- |
| GET    | `/api/tutors`     | All tutors    |
| GET    | `/api/tutors/:id` | Tutor profile |

---

## 📂 Categories

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/categories` | List categories         |
| POST   | `/api/categories` | Create category (admin) |

---

## 🧑‍🏫 Tutor Management

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| PUT    | `/api/tutor/profile`      | Update tutor profile |
| PUT    | `/api/tutor/availability` | Set availability     |

---

## 📅 Bookings

| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| POST   | `/api/bookings`            | Create booking  |
| GET    | `/api/bookings`            | User bookings   |
| GET    | `/api/bookings/:id`        | Booking details |
| PATCH  | `/api/bookings/:id/status` | Update status   |

---

## ⭐ Reviews

| Method | Endpoint       | Description |
| ------ | -------------- | ----------- |
| POST   | `/api/reviews` | Add review  |

---

## 🛡️ Admin Routes

| Method | Endpoint               | Description    |
| ------ | ---------------------- | -------------- |
| GET    | `/api/admin/users`     | All users      |
| PATCH  | `/api/admin/users/:id` | Ban/unban user |
| GET    | `/api/admin/bookings`  | All bookings   |
| GET    | `/api/admin/stats`     | Analytics      |

---

# 🗄️ Database Models (Prisma)

```
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String   // student | tutor | admin
  isBanned  Boolean  @default(false)

  tutorProfile TutorProfile?
  bookings     Booking[]
  reviews      Review[]
}

model TutorProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  bio         String?
  experience  Int?
  price       Int
  subjects    String[]
  availability Json?

  user        User   @relation(fields: [userId], references: [id])
  reviews     Review[]
}

model Booking {
  id          String   @id @default(uuid())
  studentId   String
  tutorId     String
  date        DateTime
  status      String   // confirmed | completed | cancelled

  student     User @relation("StudentBookings", fields: [studentId], references: [id])
  tutor       User @relation("TutorBookings", fields: [tutorId], references: [id])
}

model Category {
  id       String @id @default(uuid())
  name     String @unique
}

model Review {
  id        String   @id @default(uuid())
  studentId String
  tutorId   String
  rating    Int
  comment   String

  tutor   TutorProfile @relation(fields: [tutorId], references: [id])
  student User         @relation(fields: [studentId], references: [id])
}
```

---

# 🔐 Seed Admin User

Create seed script:

```
npx prisma db seed
```

Example seed:

```js
await prisma.user.create({
  data: {
    name: "Admin",
    email: "admin@skillbridge.com",
    password: hashedPassword,
    role: "admin",
  },
});
```

---

# 🧰 Error Handling

Includes:

- Global error middleware
- Validation (Zod / custom)
- Clean 4xx / 5xx responses
- Try/catch powered controllers

---

# 🚀 Deployment Steps

## Render Deployment

1. Create Web Service
2. Connect GitHub Repo
3. Add Environment Variables
4. Start Command:

```
npm start
```

### Prisma Deployment:

```
npx prisma migrate deploy
```

---

# 🧾 Required for Assignment Submission

```
Frontend Repo:
Backend Repo:
Frontend Live URL:
Backend Live URL:
Demo Video:
Admin Email:
Admin Password:
```

---

# 📄 License

MIT License – for educational use.

---
