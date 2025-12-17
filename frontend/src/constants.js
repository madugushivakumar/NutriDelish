// Constants for fallback data and enums

export const Tag = {
  VEG: 'Veg',
  NON_VEG: 'Non-Veg',
  VEGAN: 'Vegan',
  HIGH_PROTEIN: 'High Protein',
  LOW_CARB: 'Low Carb',
  SPICY: 'Spicy',
  SWEET: 'Sweet',
  OILY: 'Oily',
  GLUTEN_FREE: 'Gluten Free',
  STREET_FOOD: 'Street Food',
  SEAFOOD: 'Seafood',
  BEVERAGE: 'Beverage',
  FAST_FOOD: 'Fast Food'
};

export const HealthCondition = {
  NONE: 'None',
  DIABETES: 'Diabetes',
  HIGH_BP: 'High BP',
  PCOD: 'PCOD',
  THYROID: 'Thyroid'
};

export const PaymentMethod = {
  WALLET: 'NutriWallet',
  UPI: 'UPI',
  CARD: 'Credit/Debit Card',
  NET_BANKING: 'Net Banking',
  COD: 'Cash on Delivery',
  RAZORPAY: 'Razorpay'
};

// Fallback mock data (used if API fails)
export const MOCK_COUPONS = [
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

