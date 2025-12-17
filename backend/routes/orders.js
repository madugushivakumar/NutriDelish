import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('restaurant', 'name address')
      .populate('items.dish')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant')
      .populate('items.dish')
      .populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { user, restaurant, items, subtotal, discount, couponCode, total, paymentMethod, deliveryAddress } = req.body;
    
    const platformFee = 5;
    const gst = subtotal * 0.05;
    const deliveryFee = 40;
    
    const order = new Order({
      user,
      restaurant,
      items,
      subtotal,
      platformFee,
      gst,
      deliveryFee,
      discount: discount || 0,
      couponCode,
      total,
      paymentMethod,
      deliveryAddress,
      status: 'PENDING',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'SUCCESS'
    });
    
    await order.save();
    
    // If wallet payment, deduct from user balance
    if (paymentMethod === 'NutriWallet') {
      await User.findByIdAndUpdate(user, {
        $inc: { walletBalance: -total }
      });
    }
    
    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant')
      .populate('items.dish');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('restaurant').populate('items.dish');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

