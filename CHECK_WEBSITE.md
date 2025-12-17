# Website Troubleshooting Guide

## Your website should be accessible at:

**Frontend:** http://localhost:3000 (or check terminal for actual port)
**Backend:** http://localhost:5000

## Quick Checks:

1. **Is the frontend server running?**
   - Open terminal and run: `cd frontend && npm run dev`
   - Look for a message like: "Local: http://localhost:XXXX"

2. **Is the backend server running?**
   - Open a NEW terminal and run: `cd backend && npm start`
   - Should see: "Server running on port 5000"

3. **Check browser console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab to see if API calls are failing

4. **Common Issues:**

   **Issue: "Error loading data" or "Network Error"**
   - Solution: Make sure backend is running on port 5000
   - Run: `cd backend && npm start`

   **Issue: Blank page or "Cannot GET /"**
   - Solution: Make sure frontend dev server is running
   - Run: `cd frontend && npm run dev`

   **Issue: "Module not found" errors**
   - Solution: Install dependencies
   - Run: `cd frontend && npm install`

5. **To start both servers:**

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm start
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Verify backend has data:**
   - Visit: http://localhost:5000/api/restaurants
   - Should return JSON with restaurants
   - If empty, run: `cd backend && node scripts/seed.js`

## If still not working:

1. Check browser console for specific error messages
2. Check terminal output for server errors
3. Verify MongoDB is running (if using local MongoDB)
4. Check that ports 3000 and 5000 are not blocked

