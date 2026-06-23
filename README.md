# HunarHub – Indian Artisan Marketplace

HunarHub is a full-stack MERN (MongoDB, Express, React, Node.js) marketplace that connects local Indian micro-entrepreneurs (potters, tailors, cobblers, weavers) with customers. The platform supports both physical product sales and custom service bookings.

## 🚀 Key Features

*   **Multi-Role Authentication**: Buyer, Seller, and Admin roles with secure JWT authentication.
*   **Artisan Dashboard**: Sellers can list crafts, manage inventory, and accept/reject custom service requests.
*   **Service Requests**: Customers can book custom services (e.g., shoe repair, custom tailoring) directly from artisan profiles.
*   **Admin Panel**: Super Admin dashboard to approve new entrepreneurs, manage service categories, and view platform analytics.
*   **Shopping Cart & Checkout**: Fully functional cart using React Context API with local storage persistence.
*   **Modern UI**: Beautiful "Bharat Artisan Modern" design system using clean, responsive CSS.

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite), React Router, Axios, Context API
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose ORM)
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt.js
*   **Deployment Ready**: Configured for Vercel (Frontend) and Render (Backend)

---

## 💻 Local Development Setup

### 1. Prerequisites
*   Node.js installed (v18+)
*   MongoDB database (Local or Atlas URI)

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/hunarhub_v2.git
cd hunarhub_v2

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables
You need two `.env` files. 

**Backend (`server/.env`)**
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

**Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Seed the Database (Optional but Recommended)
Populate the database with sample categories, products, and admin users.
```bash
cd server
node seed.js
```

### 5. Run the Application
You need two terminal windows:

**Terminal 1 (Backend)**
```bash
cd server
npm start
```

**Terminal 2 (Frontend)**
```bash
cd client
npm run dev
```
The app will be running at `http://localhost:5173`.

---

## 🔑 Demo Accounts (If seeded)

*   **Admin**: `admin@hunarhub.com` / `password123`
*   **Seller**: `kala@hunarhub.com` / `password123`
*   **Buyer**: `arjun@example.com` / `password123`

---

## 🌐 Deployment Guide (Vercel + Render)

### 1. Deploy Backend (Render)
1. Push this repository to GitHub.
2. Go to Render.com, create a "Web Service", and connect your GitHub repo.
3. **Root Directory**: `server`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. Add your `MONGO_URI` and `JWT_SECRET` as Environment Variables in Render.
7. Deploy and copy your live backend URL (e.g., `https://hunarhub-api.onrender.com`).

### 2. Deploy Frontend (Vercel)
1. Go to Vercel.com and import your GitHub repository.
2. **Root Directory**: `client`
3. Expand "Environment Variables" and add:
   * **Name**: `VITE_API_URL`
   * **Value**: `[Your Render Backend URL]/api`
4. Click Deploy. Vercel will automatically build the Vite app and give you a live URL.
