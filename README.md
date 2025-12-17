# NutriDelish - AI Food Platform

A full-stack MERN (MongoDB, Express, React, Node.js) food delivery platform with AI-powered recommendations.

## Project Structure

```
nutridelish---ai-food-platform/
├── backend/          # Express.js API server
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   ├── scripts/     # Database seeding scripts
│   └── server.js    # Server entry point
├── frontend/         # React frontend
│   ├── src/         # React source code
│   │   ├── services/ # API service functions
│   │   └── types.ts  # TypeScript types
│   └── public/       # Static assets
└── README.md         # This file
```

## Features

- 🍔 Restaurant browsing and search
- 🍕 Dish details with nutrition information
- 🛒 Shopping cart functionality
- 💳 Multiple payment methods (Wallet, UPI, Card, COD)
- 🤖 AI-powered food recommendations using Google Gemini
- 👥 Group ordering with bill splitting
- 💰 Wallet management
- 📦 Order tracking
- 🎟️ Coupon system
- 📊 Price history tracking

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Gemini AI

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Recharts
- Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key (optional, for AI features)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nutridelish
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
```

4. Seed the database (optional):
```bash
node scripts/seed.js
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/search/:query` - Search restaurants

### Dishes
- `GET /api/dishes` - Get all dishes
- `GET /api/dishes/:id` - Get dish by ID

### Orders
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/wallet/add` - Add money to wallet

### Payments
- `POST /api/payments/coupon/validate` - Validate coupon
- `GET /api/payments/coupons` - Get all coupons

### AI
- `POST /api/ai/recommend` - Get AI food recommendation

## Demo User

After seeding the database, you can use:
- Email: `demo@nutridelish.com`
- Password: `demo123`

## Development

### Running Both Servers

In separate terminals:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## License

ISC
