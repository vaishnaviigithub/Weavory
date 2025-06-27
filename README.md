# Weavory

Weavory is a full-stack web application designed to digitize and empower India's handloom weaving community. It bridges the gap between traditional artisans and modern consumers by providing a verified online marketplace with role-based access for both weavers and customers.

---

## Features

* Weaver onboarding and set up of digital storefronts
* Customer-facing product catalog with filters by region
* Secure authentication via Supabase
* Basic analytics for weavers (orders, product views)
* Fully responsive UI for mobile and desktop

---

## Tech Stack

* **Frontend**: Next.js (App Router) with Tailwind CSS v4
* **Backend**: Supabase (PostgreSQL, Auth, Storage)

---

## 🚀 How to Run Weavory Locally

Follow the steps below to set up and run the project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weavory.git
cd weavory/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a new file called `.env.local` in the root of the `/client` directory.

Copy the contents of `.env.example` into `.env.local`.

Add your Supabase project URL and anon key to `.env.local`:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ If you're reviewing this project (e.g., as a teacher), please contact the developer for valid Supabase credentials and database access. The credentials are not public for security reasons.

### 4. Start the Development Server

```bash
npm run dev
```

The app will start on: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Developer Notes

* Folder-based routing is used via Next.js App Router.
* Role-based logic is handled via Supabase Auth claims.
* UI is modular with shared components in `/components`.
* Pages are organized under `/app` (e.g., `/app/weaverdb`, `/app/home`).

## 📜 License

MIT License © 2025 Vaishnavi Chada and Team

