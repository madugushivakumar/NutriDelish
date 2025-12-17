import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';
import Dish from '../models/Dish.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutridelish';

const dishesData = [
  {
    name: 'Grilled Chicken Quinoa Bowl',
    price: 350,
    originalPrice: 350,
    description: 'High protein grilled chicken with quinoa, steamed broccoli, and lemon dressing.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'High Protein', 'Low Carb', 'Gluten Free'],
    calories: 450,
    protein: 40,
    carbs: 30,
    fats: 10,
    sodium: 400,
    rating: 4.8,
    preparationTime: 20,
  },
  {
    name: 'Butter Chicken & Naan',
    price: 450,
    originalPrice: 600,
    description: 'Rich creamy tomato gravy with tender chicken pieces served with butter naan.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'Oily', 'Spicy'],
    calories: 850,
    protein: 25,
    carbs: 60,
    fats: 50,
    sodium: 900,
    rating: 4.5,
    preparationTime: 30,
  },
  {
    name: 'Paneer Tikka Salad',
    price: 280,
    originalPrice: 280,
    description: 'Fresh garden salad topped with smokey grilled paneer cubes and mint chutney.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'High Protein', 'Gluten Free'],
    calories: 300,
    protein: 18,
    carbs: 15,
    fats: 15,
    sodium: 300,
    rating: 4.6,
    preparationTime: 15,
  },
  {
    name: 'Double Cheese Burger',
    price: 199,
    originalPrice: 250,
    description: 'Juicy beef/chicken patty with double cheddar cheese, caramelized onions and mayo.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'Oily', 'Street Food', 'Fast Food'],
    calories: 900,
    protein: 20,
    carbs: 50,
    fats: 60,
    sodium: 1200,
    rating: 4.2,
    preparationTime: 25,
  },
  {
    name: 'Oats & Berries Smoothie',
    price: 220,
    originalPrice: 220,
    description: 'Sugar-free almond milk smoothie with rolled oats, mixed berries and chia seeds.',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Vegan', 'Sweet', 'Gluten Free', 'Beverage'],
    calories: 250,
    protein: 8,
    carbs: 40,
    fats: 5,
    sodium: 50,
    rating: 4.9,
    preparationTime: 10,
  },
  {
    name: 'Grilled Salmon with Asparagus',
    price: 550,
    originalPrice: 600,
    description: 'Omega-3 rich atlantic salmon fillet grilled to perfection with roasted asparagus.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'High Protein', 'Low Carb', 'Gluten Free', 'Seafood'],
    calories: 400,
    protein: 35,
    carbs: 5,
    fats: 20,
    sodium: 350,
    rating: 4.9,
    preparationTime: 25,
  },
  {
    name: 'Pepperoni Pizza',
    price: 399,
    originalPrice: 450,
    description: 'Classic pepperoni pizza with mozzarella cheese and tomato basil sauce.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'Oily', 'Spicy', 'Fast Food'],
    calories: 1200,
    protein: 30,
    carbs: 100,
    fats: 65,
    sodium: 1500,
    rating: 4.4,
    preparationTime: 35,
  },
  {
    name: 'Dal Makhani & Jeera Rice',
    price: 320,
    originalPrice: 350,
    description: 'Slow cooked black lentils with cream and butter, served with cumin rice.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Oily'],
    calories: 600,
    protein: 15,
    carbs: 80,
    fats: 25,
    sodium: 600,
    rating: 4.7,
    preparationTime: 20,
  },
  {
    name: 'Spicy Chicken Tacos',
    price: 290,
    originalPrice: 290,
    description: 'Soft shell tacos filled with spicy shredded chicken, salsa and guacamole.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'Spicy', 'Street Food'],
    calories: 450,
    protein: 22,
    carbs: 35,
    fats: 20,
    sodium: 700,
    rating: 4.5,
    preparationTime: 15,
  },
  {
    name: 'Exotic Fruit Bowl',
    price: 250,
    originalPrice: 300,
    description: 'Seasonal mix of kiwi, dragon fruit, papaya, and watermelon.',
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Vegan', 'Sweet', 'Gluten Free'],
    calories: 150,
    protein: 2,
    carbs: 35,
    fats: 0,
    sodium: 10,
    rating: 4.8,
    preparationTime: 5,
  },
  {
    name: 'Spaghetti Aglio e Olio',
    price: 380,
    originalPrice: 420,
    description: 'Classic Italian pasta with garlic, olive oil, parsley, and chili flakes.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91b1d3116c?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Oily', 'Spicy'],
    calories: 550,
    protein: 12,
    carbs: 70,
    fats: 25,
    sodium: 400,
    rating: 4.6,
    preparationTime: 20,
  },
  {
    name: 'Schezwan Noodles',
    price: 260,
    originalPrice: 260,
    description: 'Stir-fried hakka noodles tossed in spicy schezwan sauce with vegetables.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Vegan', 'Spicy', 'Oily', 'Street Food'],
    calories: 600,
    protein: 10,
    carbs: 85,
    fats: 22,
    sodium: 950,
    rating: 4.3,
    preparationTime: 15,
  },
  {
    name: 'Mysore Masala Dosa',
    price: 180,
    originalPrice: 200,
    description: 'Crispy fermented crepe smeared with red chutney and filled with potato masala.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Spicy', 'Gluten Free'],
    calories: 350,
    protein: 8,
    carbs: 60,
    fats: 12,
    sodium: 450,
    rating: 4.7,
    preparationTime: 10,
  },
  {
    name: 'Veg Dim Sum Basket',
    price: 320,
    originalPrice: 350,
    description: 'Steamed dumplings filled with finely chopped bok choy, mushroom and corn.',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Vegan', 'Low Carb'],
    calories: 200,
    protein: 6,
    carbs: 30,
    fats: 5,
    sodium: 300,
    rating: 4.5,
    preparationTime: 15,
  },
  {
    name: 'Hyderabadi Mutton Biryani',
    price: 550,
    originalPrice: 650,
    description: 'Aromatic basmati rice cooked with marinated mutton spices and saffron.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'Spicy', 'Oily'],
    calories: 950,
    protein: 35,
    carbs: 90,
    fats: 45,
    sodium: 1100,
    rating: 4.9,
    preparationTime: 45,
  },
  {
    name: 'Belgian Chocolate Waffle',
    price: 240,
    originalPrice: 280,
    description: 'Warm crispy waffle topped with melted dark chocolate and vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Sweet'],
    calories: 650,
    protein: 8,
    carbs: 85,
    fats: 30,
    sodium: 200,
    rating: 4.8,
    preparationTime: 10,
  },
  {
    name: 'Sushi Platter',
    price: 899,
    originalPrice: 1000,
    description: 'Assorted maki rolls including Salmon Avocado, Tuna and California Rolls.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    tags: ['Non-Veg', 'High Protein', 'Gluten Free', 'Seafood'],
    calories: 450,
    protein: 25,
    carbs: 60,
    fats: 10,
    sodium: 600,
    rating: 4.8,
    preparationTime: 25,
  },
  {
    name: 'Tofu Poke Bowl',
    price: 420,
    originalPrice: 450,
    description: 'Marinated tofu, edamame, cucumber, and avocado over brown rice.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tags: ['Veg', 'Vegan', 'High Protein', 'Gluten Free'],
    calories: 400,
    protein: 20,
    carbs: 45,
    fats: 15,
    sodium: 350,
    rating: 4.6,
    preparationTime: 15,
  },
];

const restaurantsData = [
  {
    name: 'FitBite Kitchen',
    cuisine: ['Healthy', 'Salads', 'Continental'],
    rating: 4.7,
    deliveryTime: 25,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 300 },
      { day: 'Tue', avgPrice: 300 },
      { day: 'Wed', avgPrice: 310 },
      { day: 'Thu', avgPrice: 300 },
      { day: 'Fri', avgPrice: 320 },
      { day: 'Sat', avgPrice: 350 },
      { day: 'Sun', avgPrice: 350 },
    ],
    coordinates: { lat: 28.6328, lng: 77.2197 },
    address: "Block A, Connaught Place, New Delhi"
  },
  {
    name: 'Punjabi Tadka',
    cuisine: ['North Indian', 'Mughlai'],
    rating: 4.3,
    deliveryTime: 40,
    priceRange: '$$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 400 },
      { day: 'Tue', avgPrice: 400 },
      { day: 'Wed', avgPrice: 400 },
      { day: 'Thu', avgPrice: 420 },
      { day: 'Fri', avgPrice: 550 },
      { day: 'Sat', avgPrice: 550 },
      { day: 'Sun', avgPrice: 500 },
    ],
    coordinates: { lat: 28.6506, lng: 77.2304 },
    address: "Chandni Chowk, Old Delhi"
  },
  {
    name: 'The Italian Job',
    cuisine: ['Italian', 'Continental'],
    rating: 4.5,
    deliveryTime: 35,
    priceRange: '$$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 380 },
      { day: 'Tue', avgPrice: 380 },
      { day: 'Wed', avgPrice: 390 },
      { day: 'Thu', avgPrice: 400 },
      { day: 'Fri', avgPrice: 420 },
      { day: 'Sat', avgPrice: 450 },
      { day: 'Sun', avgPrice: 450 },
    ],
    coordinates: { lat: 28.5921, lng: 77.2272 },
    address: "Khan Market, New Delhi"
  },
  {
    name: 'Wok & Roll',
    cuisine: ['Asian', 'Chinese', 'Japanese'],
    rating: 4.4,
    deliveryTime: 30,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 250 },
      { day: 'Tue', avgPrice: 250 },
      { day: 'Wed', avgPrice: 260 },
      { day: 'Thu', avgPrice: 260 },
      { day: 'Fri', avgPrice: 280 },
      { day: 'Sat', avgPrice: 300 },
      { day: 'Sun', avgPrice: 300 },
    ],
    coordinates: { lat: 28.5677, lng: 77.2433 },
    address: "Central Market, Lajpat Nagar II"
  },
  {
    name: 'Dosa Plaza',
    cuisine: ['South Indian'],
    rating: 4.6,
    deliveryTime: 20,
    priceRange: '$',
    priceHistory: [
      { day: 'Mon', avgPrice: 150 },
      { day: 'Tue', avgPrice: 150 },
      { day: 'Wed', avgPrice: 150 },
      { day: 'Thu', avgPrice: 160 },
      { day: 'Fri', avgPrice: 180 },
      { day: 'Sat', avgPrice: 200 },
      { day: 'Sun', avgPrice: 200 },
    ],
    coordinates: { lat: 28.6219, lng: 77.2811 },
    address: "Vikas Marg, Laxmi Nagar"
  },
  {
    name: 'Sweet Tooth',
    cuisine: ['Desserts', 'Bakery'],
    rating: 4.8,
    deliveryTime: 15,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 200 },
      { day: 'Tue', avgPrice: 200 },
      { day: 'Wed', avgPrice: 220 },
      { day: 'Thu', avgPrice: 220 },
      { day: 'Fri', avgPrice: 250 },
      { day: 'Sat', avgPrice: 250 },
      { day: 'Sun', avgPrice: 250 },
    ],
    coordinates: { lat: 28.6448, lng: 77.1896 },
    address: "Ajmal Khan Road, Karol Bagh"
  },
  {
    name: 'Grill & Chill',
    cuisine: ['American', 'Fast Food'],
    rating: 4.2,
    deliveryTime: 30,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 220 },
      { day: 'Tue', avgPrice: 220 },
      { day: 'Wed', avgPrice: 240 },
      { day: 'Thu', avgPrice: 240 },
      { day: 'Fri', avgPrice: 280 },
      { day: 'Sat', avgPrice: 300 },
      { day: 'Sun', avgPrice: 300 },
    ],
    coordinates: { lat: 28.5448, lng: 77.2066 },
    address: "Hauz Khas Village, New Delhi"
  },
  {
    name: 'The Caffeine Fix',
    cuisine: ['Cafe', 'Beverages'],
    rating: 4.9,
    deliveryTime: 15,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 180 },
      { day: 'Tue', avgPrice: 180 },
      { day: 'Wed', avgPrice: 180 },
      { day: 'Thu', avgPrice: 180 },
      { day: 'Fri', avgPrice: 200 },
      { day: 'Sat', avgPrice: 220 },
      { day: 'Sun', avgPrice: 220 },
    ],
    coordinates: { lat: 28.5244, lng: 77.1855 },
    address: "Select Citywalk, Saket"
  },
  {
    name: 'Spice Route',
    cuisine: ['Indian', 'Curry', 'Mughlai'],
    rating: 4.7,
    deliveryTime: 45,
    priceRange: '$$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 450 },
      { day: 'Tue', avgPrice: 450 },
      { day: 'Wed', avgPrice: 480 },
      { day: 'Thu', avgPrice: 480 },
      { day: 'Fri', avgPrice: 550 },
      { day: 'Sat', avgPrice: 600 },
      { day: 'Sun', avgPrice: 600 },
    ],
    coordinates: { lat: 28.6139, lng: 77.2090 },
    address: "Sansad Marg, New Delhi"
  },
  {
    name: 'Burger King',
    cuisine: ['Fast Food', 'American', 'Burgers'],
    rating: 4.4,
    deliveryTime: 20,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 240 },
      { day: 'Tue', avgPrice: 240 },
      { day: 'Wed', avgPrice: 250 },
      { day: 'Thu', avgPrice: 250 },
      { day: 'Fri', avgPrice: 280 },
      { day: 'Sat', avgPrice: 300 },
      { day: 'Sun', avgPrice: 300 },
    ],
    coordinates: { lat: 28.5355, lng: 77.3910 },
    address: "Sector 18, Noida"
  },
  {
    name: 'Tandoor Express',
    cuisine: ['North Indian', 'Tandoor', 'Mughlai'],
    rating: 4.6,
    deliveryTime: 35,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 320 },
      { day: 'Tue', avgPrice: 320 },
      { day: 'Wed', avgPrice: 330 },
      { day: 'Thu', avgPrice: 340 },
      { day: 'Fri', avgPrice: 380 },
      { day: 'Sat', avgPrice: 400 },
      { day: 'Sun', avgPrice: 380 },
    ],
    coordinates: { lat: 28.6000, lng: 77.2200 },
    address: "Rajouri Garden, New Delhi"
  },
  {
    name: 'Tandoor Express',
    cuisine: ['North Indian', 'Tandoor', 'Mughlai'],
    rating: 4.6,
    deliveryTime: 35,
    priceRange: '$$',
    priceHistory: [
      { day: 'Mon', avgPrice: 320 },
      { day: 'Tue', avgPrice: 320 },
      { day: 'Wed', avgPrice: 330 },
      { day: 'Thu', avgPrice: 340 },
      { day: 'Fri', avgPrice: 380 },
      { day: 'Sat', avgPrice: 400 },
      { day: 'Sun', avgPrice: 380 },
    ],
    coordinates: { lat: 28.6000, lng: 77.2200 },
    address: "Rajouri Garden, New Delhi"
  },
];

// Restaurant menu assignments (dish indices in dishesData array)
const restaurantMenus = [
  [0, 2, 4, 5, 9, 29, 3, 6, 10, 11],   // FitBite Kitchen: 10 dishes
  [1, 7, 14, 27, 2, 8, 20, 28, 30],    // Punjabi Tadka: 9 dishes
  [6, 10, 19, 20, 4, 5, 12, 13, 17],   // The Italian Job: 9 dishes
  [11, 13, 16, 25, 1, 7, 14, 17, 21],  // Wok & Roll: 9 dishes
  [12, 18, 22, 0, 2, 4, 5, 6],         // Dosa Plaza: 8 dishes
  [15, 19, 4, 29, 9, 23, 24, 26, 30, 31], // Sweet Tooth: 10 dishes
  [3, 24, 31, 0, 1, 6, 8, 10, 25],     // Grill & Chill: 9 dishes
  [22, 23, 24, 15, 19, 26, 29, 30, 31, 32], // The Caffeine Fix: 10 dishes
  [20, 27, 32, 1, 7, 14, 21, 28, 30],  // Spice Route: 9 dishes
  [3, 8, 25, 31, 0, 1, 6, 10, 24, 30], // Burger King: 10 dishes
  [1, 7, 20, 28, 2, 14, 21, 27, 30, 32], // Tandoor Express: 10 dishes
];

const couponsData = [
  {
    code: 'WELCOME50',
    discountType: 'PERCENTAGE',
    value: 50,
    minOrder: 150,
    maxDiscount: 100,
    description: 'Get 50% off up to ₹100 on your first order'
  },
  {
    code: 'TRYNEW',
    discountType: 'FLAT',
    value: 50,
    minOrder: 300,
    description: 'Flat ₹50 off on orders above ₹300'
  },
  {
    code: 'HEALTHY10',
    discountType: 'PERCENTAGE',
    value: 10,
    minOrder: 200,
    maxDiscount: 50,
    description: '10% off on healthy meals'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Dish.deleteMany({});
    await Restaurant.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create restaurants first (with empty menus)
    const restaurants = [];
    for (const restaurantData of restaurantsData) {
      const restaurant = await Restaurant.create({
        ...restaurantData,
        menu: [],
        isActive: true
      });
      restaurants.push(restaurant);
    }
    console.log(`✅ Created ${restaurants.length} restaurants`);

    // Create dishes and assign to restaurants based on menu assignments
    const allDishes = [];
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      const menuIndices = restaurantMenus[i] || [];
      const restaurantDishes = [];
      
      for (const idx of menuIndices) {
        if (idx < dishesData.length) {
          const dishData = {
            ...dishesData[idx],
            restaurant: restaurant._id,
            isAvailable: true
          };
          const dish = await Dish.create(dishData);
          restaurantDishes.push(dish);
          allDishes.push(dish);
        }
      }
      
      // Update restaurant menu
      restaurant.menu = restaurantDishes.map(d => d._id);
      await restaurant.save();
    }
    console.log(`✅ Created ${allDishes.length} dishes`);
    console.log(`✅ Created ${restaurants.length} restaurants`);

    // Create coupons
    const coupons = await Coupon.insertMany(couponsData.map(c => ({ ...c, isActive: true })));
    console.log(`✅ Created ${coupons.length} coupons`);

    // Create a demo user
    const existingUser = await User.findOne({ email: 'demo@nutridelish.com' });
    if (!existingUser) {
      const demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@nutridelish.com',
        password: 'demo123',
        walletBalance: 2500,
        conditions: ['None']
      });
      console.log('✅ Created demo user:', demoUser.email);
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${restaurants.length} Restaurants`);
    console.log(`   - ${allDishes.length} Dishes`);
    console.log(`   - ${coupons.length} Coupons`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
