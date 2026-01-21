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
- **API Platform:** Postman 

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
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('USER', 'ADMIN', 'SUPERADMIN')) DEFAULT 'USER',
  is_admin BOOLEAN DEFAULT false,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

## Setup Instructions

Clone the repository
```
git clone https://github.com/realking46/NGO-Registration-and-Donation-Management-System
```

Install backend dependencies
``` npm install ```

Create a .env file in the root:
* .env has already been createed needing only slight changes.

Run database migrations (PostgreSQL)
Create users and donations tables as above
Start the server

```npm run dev```

## API Endpoints
| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | /auth/register | User registration |
| POST   | /auth/login    | User login        |

Donations

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | /donation/initiate     | Initiate donation       |
| POST   | /donation/mock-payment | Simulate payment status |
| GET    | /donation/my           | Get user donations      |

Admin
| Method | Endpoint                         | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| GET    | /admin/dashboard                 | Dashboard stats                |
| GET    | /admin/users                     | List all users                 |
| GET    | /admin/donations                 | List all donations             |
| PATCH  | /admin/users/make-admin          | Grant admin (Superadmin only)  |
| PATCH  | /admin/users/revoke-admin        | Revoke admin (Superadmin only) |
| PATCH  | /admin/users/:email/permissions  | Update admin permissions       |

## User Roles & Permissions
Roles
Superadmin: Full control, can grant/revoke admin roles
Admin: Controlled access via permissions
User: Default, can register and donate

## Testing Payments
Dummy Credentials are used for Demo version.




