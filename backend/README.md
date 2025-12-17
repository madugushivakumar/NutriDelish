# NutriDelish Backend API

Backend server for NutriDelish AI Food Platform built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nutridelish
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
```

3. Seed the database (optional):
```bash
node scripts/seed.js
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/search/:query` - Search restaurants

### Dishes
- `GET /api/dishes` - Get all dishes (with optional query params: restaurant, tag, search)
- `GET /api/dishes/:id` - Get dish by ID

### Orders
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile
- `POST /api/users/:id/wallet/add` - Add money to wallet
- `GET /api/users/:id/transactions` - Get user transactions

### Payments
- `POST /api/payments/coupon/validate` - Validate coupon code
- `GET /api/payments/coupons` - Get all coupons
- `POST /api/payments/transaction` - Create transaction

### AI
- `POST /api/ai/recommend` - Get AI food recommendation

## Database Models

- **User**: User accounts and profiles
- **Restaurant**: Restaurant information
- **Dish**: Menu items
- **Order**: Order details
- **Transaction**: Payment transactions
- **Coupon**: Discount coupons

