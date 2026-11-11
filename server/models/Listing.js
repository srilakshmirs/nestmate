import mongoose from 'mongoose';

export const AMENITIES = [
  'wifi', 'ac', 'parking', 'washing machine', 'kitchen', 'geyser', 'power backup',
  'gym', 'housekeeping', 'attached bathroom', 'balcony', 'lift', 'security', 'tv'
];

const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], maxlength: 3000 },
    type: { type: String, enum: ['private-room', 'shared-room', 'entire-place'], required: true },
    rent: { type: Number, required: [true, 'Rent is required'], min: 0 },
    deposit: { type: Number, default: 0, min: 0 },
    city: { type: String, required: [true, 'City is required'], trim: true },
    locality: { type: String, required: [true, 'Locality is required'], trim: true },
    address: { type: String, trim: true, default: '' },
    bedrooms: { type: Number, default: 1, min: 0 },
    bathrooms: { type: Number, default: 1, min: 0 },
    currentRoommates: { type: Number, default: 0, min: 0 },
    furnished: { type: Boolean, default: false },
    amenities: [{ type: String, enum: AMENITIES }],
    genderPreference: { type: String, enum: ['any', 'male', 'female'], default: 'any' },
    rules: {
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      guests: { type: Boolean, default: true }
    },
    availableFrom: { type: Date, default: Date.now },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    removedReason: { type: String, default: '' } // set when an admin takes a listing down
  },
  { timestamps: true }
);

listingSchema.index({ title: 'text', description: 'text', locality: 'text', city: 'text' });
listingSchema.index({ city: 1, rent: 1 });

export default mongoose.model('Listing', listingSchema);
