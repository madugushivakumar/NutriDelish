import express from 'express';
import Transaction from '../models/Transaction.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// Validate coupon
router.post('/coupon/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }
    
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({ 
        message: `Minimum order value must be ₹${coupon.minOrder}` 
      });
    }
    
    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    
    let discountAmount = 0;
    if (coupon.discountType === 'FLAT') {
      discountAmount = coupon.value;
    } else {
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    }
    
    res.json({ coupon, discountAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all coupons
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create transaction
router.post('/transaction', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

