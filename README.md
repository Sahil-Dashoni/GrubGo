

# GrubGo – Food Delivery Web Application

GrubGo is a MERN stack–based food delivery platform that connects Customers, Restaurant Owners, and Delivery Personnel. The application provides real-time order tracking, secure authentication, and role-based dashboards to simulate a complete food delivery ecosystem.

---

## Features

* Three role-based user systems: Customer, Restaurant Owner, and Delivery Personnel
* Browse restaurants, manage cart, and place orders
* Restaurant dashboard for menu and order management
* Delivery dashboard for accepting and completing deliveries
* Real-time delivery tracking using WebSockets
* OTP-based order confirmation for secure delivery
* Email/password authentication and Google OAuth login
* Forgot password and reset password functionality
* Online payments using Razorpay
* Centralized state management using Redux Toolkit

---

## Tech Stack

* Frontend: React.js, Redux Toolkit
* Backend: Node.js, Express.js
* Database: MongoDB
* Real-Time Communication: Socket.io
* Authentication: JWT, Google OAuth
* Payments: Razorpay

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/your-username/grubgo-food-delivery.git
cd grubgo-food-delivery
```

### Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
RAZORPAY_API_KEY=your_key
RAZORPAY_API_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Run Application

```bash
cd server && npm start
cd client && npm start
```

