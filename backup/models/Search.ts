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
  lastRun: {
    type: String,
    default: 'Never'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Search = mongoose.models.Search || mongoose.model('Search', searchSchema);

export default Search;

