# Das Enterprise Frontend

A high-performance, responsive React application for food distribution e-commerce.

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3
- **State Management**: Redux Toolkit + RTK Query
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

## Features
- **Admin Dashboard**: Visual analytics, real-time stock management, and order processing.
- **Customer Storefront**: Premium hero section, category browsing, and optimized layouts.
- **Mock Data Mode**: Toggle `USE_MOCK_DATA` in `src/app/config.js` to preview the dashboard without a live backend connection.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.local.env` based on `.env.example`.

3. **Run Application**
   ```bash
   npm run dev
   ```

4. **Scripts**
   - `npm run build`: Production build
   - `npm run lint`: ESLint check
