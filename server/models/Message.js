import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    thread: { type: String, required: true, index: true }, // sorted "userA_userB"
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const threadId = (a, b) => [String(a), String(b)].sort().join('_');

export default mongoose.model('Message', messageSchema);
