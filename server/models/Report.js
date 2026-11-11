import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['listing', 'user'], required: true },
    targetListing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: {
      type: String, required: true,
      enum: ['spam', 'scam', 'inappropriate', 'fake', 'harassment', 'other']
    },
    details: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
    adminNote: { type: String, default: '' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
