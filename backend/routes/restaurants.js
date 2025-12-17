import express from 'express';
import Restaurant from '../models/Restaurant.js';
import Dish from '../models/Dish.js';

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true })
      .populate({
        path: 'menu',
        match: { isAvailable: true }
      })
      .sort({ rating: -1 });
    
    // Filter out restaurants with no available dishes
    const restaurantsWithMenu = restaurants.filter(r => r.menu && r.menu.length > 0);
    res.json(restaurantsWithMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('menu');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search restaurants
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const restaurants = await Restaurant.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { cuisine: { $regex: query, $options: 'i' } }
      ]
    }).populate('menu');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create restaurant (Admin only - add auth middleware later)
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

