import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  type: {
    type: String,
    enum: ['DEBIT', 'CREDIT', 'REFUND'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['NutriWallet', 'UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery', 'Razorpay'],
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'REFUNDED', 'PROCESSING'],
    default: 'PROCESSING'
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);

