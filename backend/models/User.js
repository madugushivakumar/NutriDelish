import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  conditions: [{
    type: String,
    enum: ['None', 'Diabetes', 'High BP', 'PCOD', 'Thyroid']
  }],
  location: {
    address: String,
    lat: Number,
    lng: Number
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('User', userSchema);

