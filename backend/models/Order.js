import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 5
  },
  gst: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 40
  },
  discount: {
    type: Number,
    default: 0
  },
  couponCode: String,
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['NutriWallet', 'UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery', 'Razorpay'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  deliveryAddress: {
    address: String,
    lat: Number,
    lng: Number
  },
  trackingNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate tracking number before saving
orderSchema.pre('save', async function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = `#${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);

