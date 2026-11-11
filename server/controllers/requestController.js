import RoommateRequest from '../models/RoommateRequest.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import asyncHandler from '../utils/asyncHandler.js';

const populate = (q) => q
  .populate('from', 'name avatar occupation city')
  .populate('to', 'name avatar occupation city')
  .populate('listing', 'title locality rent images');

export const sendRequest = asyncHandler(async (req, res) => {
  const { to, listing, message } = req.body;
  if (!to) return res.status(400).json({ message: 'Choose who to send the request to' });
  if (String(to) === String(req.user._id)) return res.status(400).json({ message: "You can't send a request to yourself" });

  const target = await User.findById(to);
  if (!target || target.isBanned) return res.status(404).json({ message: 'User not found' });
  if (listing && !(await Listing.exists({ _id: listing, isActive: true }))) return res.status(404).json({ message: 'Listing not found' });

  const existing = await RoommateRequest.findOne({
    $or: [{ from: req.user._id, to }, { from: to, to: req.user._id }],
    status: { $in: ['pending', 'accepted'] }
  });
  if (existing) {
    const msg = existing.status === 'accepted' ? "You're already connected"
      : String(existing.from) === String(req.user._id) ? 'You already have a pending request to this person'
      : 'This person already sent you a request. Check your requests to respond';
    return res.status(409).json({ message: msg });
  }
  const doc = await RoommateRequest.create({ from: req.user._id, to, listing: listing || undefined, message });
  res.status(201).json(await populate(RoommateRequest.findById(doc._id)));
});

export const myRequests = asyncHandler(async (req, res) => {
  const [received, sent] = await Promise.all([
    populate(RoommateRequest.find({ to: req.user._id }).sort({ createdAt: -1 })),
    populate(RoommateRequest.find({ from: req.user._id }).sort({ createdAt: -1 }))
  ]);
  res.json({ received, sent });
});

export const respond = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'accept' | 'reject'
  if (!['accept', 'reject'].includes(action)) return res.status(400).json({ message: 'Action must be accept or reject' });
  const r = await RoommateRequest.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Request not found' });
  if (String(r.to) !== String(req.user._id)) return res.status(403).json({ message: 'Only the recipient can respond' });
  if (r.status !== 'pending') return res.status(400).json({ message: `This request was already ${r.status}` });
  r.status = action === 'accept' ? 'accepted' : 'rejected';
  await r.save();
  res.json(await populate(RoommateRequest.findById(r._id)));
});

export const cancelRequest = asyncHandler(async (req, res) => {
  const r = await RoommateRequest.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Request not found' });
  if (String(r.from) !== String(req.user._id)) return res.status(403).json({ message: 'Only the sender can cancel' });
  if (r.status !== 'pending') return res.status(400).json({ message: `This request was already ${r.status}` });
  r.status = 'cancelled';
  await r.save();
  res.json(r);
});
