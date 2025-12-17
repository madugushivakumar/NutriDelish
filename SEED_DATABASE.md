# How to Seed the Database with Restaurants

## Quick Steps

1. **Make sure MongoDB is running** (or use MongoDB Atlas)

2. **Make sure backend server is NOT running** (stop it if it is)

3. **Run the seed script:**
   ```powershell
   cd backend
   node scripts/seed.js
   ```

4. **You should see:**
   ```
   ✅ Connected to MongoDB
   🗑️  Cleared existing data
   ✅ Created 18 dishes
   ✅ Created 9 restaurants
   ✅ Created 3 coupons
   ✅ Created demo user: demo@nutridelish.com
   
   🎉 Database seeded successfully!
   ```

5. **Start the backend server:**
   ```powershell
   npm run dev
   ```

6. **Refresh your frontend** - You should now see all 9 restaurants!

## What Gets Created

- **9 Restaurants:**
  - FitBite Kitchen
  - Punjabi Tadka
  - The Italian Job
  - Wok & Roll
  - Dosa Plaza
  - Sweet Tooth
  - Grill & Chill
  - The Caffeine Fix
  - Spice Route

- **18 Dishes** (distributed across restaurants)

- **3 Coupons:**
  - WELCOME50
  - TRYNEW
  - HEALTHY10

- **Demo User:**
  - Email: demo@nutridelish.com
  - Password: demo123
  - Wallet: ₹2500

## Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is installed and running
- Or use MongoDB Atlas and update MONGODB_URI in `.env`

### "No restaurants showing"
- Make sure you ran the seed script
- Check backend console for errors
- Verify restaurants exist: Visit http://localhost:5000/api/restaurants

