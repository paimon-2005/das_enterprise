# Das Enterprise Backend API

Modular Node.js/Express solution for food distributors with MongoDB, Stripe, and Cloudinary integrations.

## Features
- JWT Authentication (Access & Refresh Tokens)
- RBAC (Admin & Customer roles)
- Product & Category Management
- Order Processing with Stripe
- Multi-image upload with Cloudinary
- Statistical aggregation for Admin Dashboard

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file based on `.env.example` and fill in your credentials.

3. **Database Seeding**
   Populate the database with sample categories and products:
   ```bash
   npm run seed
   ```

4. **Run Server**
   ```bash
   # Development
   npm run dev
   # Production
   npm start
   ```

## API Documentation (v1)
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Authenticate user
- `GET /api/v1/admin/stats` - Dashboard KPIs (Admin)
- `GET /api/v1/products` - List all products (Public)
- `POST /api/v1/orders` - Place new order (Customer)
