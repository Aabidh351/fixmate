# 🔧 FixMate
### Smart Device & Home Appliance Repair Platform

FixMate connects customers with skilled technicians for reliable device and home appliance repairs. Customers can request services, track repair progress, and pay securely after the job is completed.

🌐 **Live Website: https://fixmate-ochre.vercel.app** 

---

## ✨ Key Features

- **Role-based Authentication** – Customer, Technician, and Admin dashboards.
- **Service Management** – Technicians can create, update, and manage repair services.
- **Service Approval** – Admins review and approve technician listings.
- **Repair Booking** – Customers can request and track repair services.
- **Job Tracking** – Technicians manage requests from acceptance to completion.
- **Online Payments** – Secure Stripe Checkout after service completion.
- **User Management** – Admins can manage users and monitor platform activity.
- **Profile Management** – Update personal information and profile photos.

## 🛠️ Tech Stack

| Frontend | Backend & Database | Services |
|---|---|---|
| Next.js | Express.js | Better Auth |
| TypeScript | MongoDB | Stripe |
| Tailwind CSS | Node.js | ImgBB |

## 🚀 Getting Started

**1. Clone the repositories**

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
git clone YOUR_SERVER_REPOSITORY_URL
```

**2. Install dependencies**

```bash
npm install
```

Run this inside both the client and server directories.

**3. Configure environment variables**

Create `.env.local` for the frontend and `.env` for the backend. Add the required API URLs, MongoDB credentials, Better Auth secrets, ImgBB API key, and Stripe keys.

**4. Start the development servers**

```bash
npm run dev
```

Start the frontend and backend separately using their respective scripts.

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@ali.com | Aa12345678 |
| Technician | karim@uddin.com | Ku12345678 |
| Customer | tractor@uddin.com | Tu12345678 |

## 👨‍💻 Developer

Aabid H.

Built with ❤️ as a full-stack web development project.
