import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  cleaningFee: {
    type: Number,
    required: true,
    default: 0
  },
  checkinDate: {
    type: String, // Format: YYYY-MM-DD
    default: null
  },
  checkoutDate: {
    type: String, // Format: YYYY-MM-DD (for reference, will be calculated)
    default: null
  },
  lastRun: {
    type: String,
    default: 'Never'
  },
  status: {
    type: String,
    enum: ['idle', 'running', 'completed', 'error'],
    default: 'idle'
  },
  pricingData: {
    oneNight: [{
      checkin: String,
      checkout: String,
      price: Number,
      date: String
    }],
    twoNights: [{
      checkin: String,
      checkout: String,
      price: Number,
      date: String
    }],
    threeNights: [{
      checkin: String,
      checkout: String,
      price: Number,
      date: String
    }],
    fourteenNights: {
      checkin: String,
      checkout: String,
      price: Number,
      date: String
    },
    thirtyNights: {
      checkin: String,
      checkout: String,
      price: Number,
      date: String
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Search = mongoose.models.Search || mongoose.model('Search', searchSchema);

export default Search;

