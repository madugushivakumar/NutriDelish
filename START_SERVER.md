# How to Start the Backend Server

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Make sure MongoDB is running

### Option A: Local MongoDB
If you have MongoDB installed locally, make sure it's running:
```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# Or start it manually:
mongod
```

### Option B: MongoDB Atlas (Cloud)
If you want to use MongoDB Atlas (cloud), update the `MONGODB_URI` in `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutridelish
```

## Step 3: Seed the Database (Optional but Recommended)

This will populate the database with sample restaurants and dishes:
```bash
cd backend
node scripts/seed.js
```

## Step 4: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running on port 5000
```

## Step 5: Start the Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Make sure MongoDB is installed and running
- Check if MongoDB is running on port 27017
- Or use MongoDB Atlas (cloud) and update the connection string

### Error: "Port 5000 already in use"
- Change the PORT in `backend/.env` to a different port (e.g., 5001)
- Update `frontend/src/services/api.js` to use the new port

### Error: "Module not found"
- Run `npm install` in the backend folder
- Make sure all dependencies are installed

