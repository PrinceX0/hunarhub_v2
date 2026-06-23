# HunarHub – Indian Artisan Marketplace

HunarHub is a full-stack MERN marketplace built to connect local Indian micro-entrepreneurs—such as potters, tailors, cobblers, and weavers—directly with customers. It's designed to bring traditional craftsmanship into the modern digital space, supporting both physical product sales and custom service bookings.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://hunarhub-v2.vercel.app](https://hunarhub-v2.vercel.app)
- **Backend API (Render):** [https://hunarhub-api.onrender.com](https://hunarhub-api.onrender.com)

## ✨ Key Features

- **Role-Based Access**: Distinct experiences for Buyers, Sellers (Artisans), and Admins, secured via JWT authentication.
- **Artisan Dashboard**: Sellers get a dedicated space to list their crafts, manage inventory, and handle incoming service requests.
- **Service Bookings**: Beyond buying products, customers can directly book artisans for custom work (e.g., shoe repair, custom tailoring, bulk pottery orders).
- **Admin Panel**: A centralized dashboard for approving new artisan applications, managing service categories, and tracking platform analytics.
- **Shopping Experience**: A fully functional cart built with React Context API, featuring local storage persistence for a seamless checkout flow.
- **Modern UI/UX**: Clean, responsive design inspired by the rich heritage of Indian crafts, built entirely with custom CSS.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), React Router v6, Context API, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT & bcryptjs
- **Deployment**: Vercel (Client) & Render (Server)

## 💻 Running Locally

If you want to run this project on your own machine, follow these steps:

### 1. Prerequisites
Make sure you have Node.js (v18+) installed and a MongoDB database available (either locally or via MongoDB Atlas).

### 2. Setup
Clone the repository and install the dependencies for both the frontend and backend:

```bash
git clone https://github.com/PrinceX0/hunarhub_v2.git
cd hunarhub_v2

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Seeding the Database (Optional)
To test the platform, you can populate the database with sample categories, users, and admin accounts:
```bash
cd server
node seed.js
```

### 5. Start the Application
You'll need two terminal windows to run the stack concurrently:

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🌐 How This Project is Deployed

This project uses a decoupled deployment architecture, enabling Continuous Deployment (CD) directly from the GitHub `main` branch.

### Backend (Render)
1. The Node.js/Express server is hosted as a **Web Service** on [Render](https://render.com/).
2. The root directory is configured to `server`.
3. Build command is `npm install` and Start command is `node server.js`.
4. Environment variables (`MONGO_URI`, `JWT_SECRET`) are securely injected via the Render dashboard.

### Frontend (Vercel)
1. The React (Vite) client is deployed on [Vercel](https://vercel.com/).
2. The root directory is configured to `client`.
3. An environment variable `VITE_API_URL` is set to point to the live Render backend API (`https://hunarhub-api.onrender.com/api`).
4. Vercel automatically handles the Vite build process and serves the static assets globally.

*Whenever new code is pushed to GitHub, both Render and Vercel automatically detect the changes and trigger new builds to update the live site.*
