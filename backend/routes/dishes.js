import express from 'express';
import Dish from '../models/Dish.js';

const router = express.Router();

// Get all dishes
router.get('/', async (req, res) => {
  try {
    const { restaurant, tag, search } = req.query;
    let query = { isAvailable: true };
    
    if (restaurant) {
      query.restaurant = restaurant;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const dishes = await Dish.find(query)
      .populate('restaurant', 'name cuisine')
      .sort({ rating: -1 });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dish by ID
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('restaurant');
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create dish (Admin only - add auth middleware later)
router.post('/', async (req, res) => {
  try {
    const dish = new Dish(req.body);
    await dish.save();
    res.status(201).json(dish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

