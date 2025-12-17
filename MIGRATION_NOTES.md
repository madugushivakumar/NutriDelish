# Migration Notes

The project has been converted to a MERN stack. Here are the key changes:

## Structure
- `backend/` - Express.js API server with MongoDB
- `frontend/` - React application

## Key Changes Needed in App.tsx

The `frontend/src/App.tsx` file still references mock data. To complete the migration:

1. **Remove mock imports:**
   - Remove `import { MOCK_RESTAURANTS, MOCK_DISHES, MOCK_COUPONS } from './constants';`
   - Add `import * as api from './services/api';`

2. **Add state for API data:**
   ```typescript
   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
   const [dishes, setDishes] = useState<Dish[]>([]);
   const [coupons, setCoupons] = useState<Coupon[]>([]);
   const [loading, setLoading] = useState(true);
   ```

3. **Add useEffect to fetch data:**
   ```typescript
   useEffect(() => {
     const fetchData = async () => {
       try {
         const [restaurantsRes, dishesRes, couponsRes] = await Promise.all([
           api.getRestaurants(),
           api.getDishes(),
           api.getCoupons()
         ]);
         setRestaurants(restaurantsRes.data);
         setDishes(dishesRes.data);
         setCoupons(couponsRes.data);
       } catch (error) {
         console.error('Error fetching data:', error);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, []);
   ```

4. **Replace MOCK_RESTAURANTS with `restaurants`**
5. **Replace MOCK_DISHES with `dishes`**
6. **Replace MOCK_COUPONS with `coupons`**
7. **Update AI recommendation to use API:**
   ```typescript
   const result = await api.getFoodRecommendation({ mood, weather, goal });
   ```

8. **Update dish lookups to use `_id` instead of `id`** (MongoDB uses `_id`)

## Next Steps

1. Update `frontend/src/App.tsx` to use API calls
2. Test the integration
3. Add error handling
4. Add loading states

