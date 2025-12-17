# Quick Start Guide

## 🚀 Start Backend Server

### Windows PowerShell:
```powershell
# Navigate to backend
cd backend

# Install dependencies (if not done)
npm install

# Start server
npm run dev
```

### If MongoDB is not installed:
The server will still start, but you'll see a MongoDB connection error. You can:
1. **Install MongoDB locally** - Download from https://www.mongodb.com/try/download/community
2. **Use MongoDB Atlas (Free Cloud)** - Sign up at https://www.mongodb.com/cloud/atlas and get a connection string
3. **For testing without MongoDB** - The server will start but API calls will fail

## 🎨 Start Frontend

Open a **new terminal**:
```powershell
# Navigate to frontend
cd frontend

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

## ✅ Verify Backend is Running

Open your browser and go to:
- http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "NutriDelish API is running"
}
```

## 📝 Seed Database (Optional)

To add sample data:
```powershell
cd backend
node scripts/seed.js
```

This creates:
- Sample restaurants
- Sample dishes
- Demo user (email: demo@nutridelish.com, password: demo123)
- Sample coupons

## 🔧 Common Issues

### Backend won't start:
- Check if port 5000 is already in use
- Make sure `node_modules` exists (run `npm install`)

### Frontend shows "Network Error":
- Make sure backend is running on port 5000
- Check browser console for detailed error
- Verify CORS is enabled (it should be in server.js)

### MongoDB connection error:
- MongoDB is optional for basic testing
- Server will still start, but database operations will fail
- Install MongoDB or use MongoDB Atlas

