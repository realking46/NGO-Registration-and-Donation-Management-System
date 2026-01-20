# NGO Registration and Donation Management System

A backend-driven system to manage **NGO user registrations** and **donations** securely and transparently. Users can register, optionally donate, and admins can monitor registrations, donations, and manage access with permissions.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [System Architecture](#system-architecture)  
- [Database Schema](#database-schema)  
- [Setup Instructions](#setup-instructions)  
- [API Endpoints](#api-endpoints)  
- [Testing Payments](#testing-payments)  
- [User Roles & Permissions](#user-roles--permissions)  

---

## Features

### User Features
- Register and login securely
- Donate any amount via **sandbox payment gateway**
- Track donation status: `success`, `pending`, `failed`
- View personal registration details and donation history

### Admin Features
- Dashboard showing total registrations and donations
- View all registered users with filters
- View all donation records with status and timestamps
- Grant or revoke **admin roles** (Superadmin only)
- Update fine-grained **permissions** for admins
- Export registration and donation data

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **Payment Gateway:** PayHere (Sandbox mode)  
- **Frontend:** React.js (optional, for future extension)  

---

## System Architecture

[User] ---> [Express Backend] ---> [PostgreSQL DB]

---> [Payment Gateway (Sandbox)]
[Admin] ---> [Backend APIs] ---> [Dashboard & Permissions]


- Authentication & authorization via JWT  
- Superadmin role for granting admin access  
- Permissions stored as JSONB in PostgreSQL  
- Donations tracked independently of payment status

---

## Database Schema

### Users Table

```sql
CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role DEFAULT 'user',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status VARCHAR(10) DEFAULT 'pending', -- success, failed, pending
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

Clone the repository
```
git clone <repo-url>
cd ngo-donation-system
```

Install backend dependencies
``` npm install ```

Create a .env file in the root:
```
PORT=5000
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ngo_db
JWT_SECRET=your_jwt_secret
SUPERADMIN_EMAIL=superadmin@example.com
```

Run database migrations (PostgreSQL)
Create users and donations tables as above
Start the server

```npm run dev```

## API Endpoints
| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | User registration |
| POST   | /api/auth/login    | User login        |

Donations

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | /api/donation/initiate     | Initiate donation       |
| POST   | /api/donation/mock-payment | Simulate payment status |
| GET    | /api/donation/my           | Get user donations      |

Admin
| Method | Endpoint                             | Description                    |
| ------ | ------------------------------------ | ------------------------------ |
| GET    | /api/admin/dashboard                 | Dashboard stats                |
| GET    | /api/admin/users                     | List all users                 |
| GET    | /api/admin/donations                 | List all donations             |
| PATCH  | /api/admin/users/:email/make-admin   | Grant admin (Superadmin only)  |
| PATCH  | /api/admin/users/:email/revoke-admin | Revoke admin (Superadmin only) |
| PATCH  | /api/admin/users/:email/permissions  | Update admin permissions       |

## User Roles & Permissions
Roles
Superadmin: Full control, can grant/revoke admin roles
Admin: Controlled access via permissions
User: Default, can register and donate

## Testing Payments
Dummy Credentials are used for Demo version.

