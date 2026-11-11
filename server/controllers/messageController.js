import mongoose from 'mongoose';
import Message, { threadId } from '../models/Message.js';
import RoommateRequest from '../models/RoommateRequest.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Chat is allowed when: a request between you was accepted, you're enquiring about
// the other person's listing, or they've already messaged you first.
async function canChat(meId, otherId, listingId) {
  if (await RoommateRequest.exists({
    status: 'accepted',
    $or: [{ from: meId, to: otherId }, { from: otherId, to: meId }]
  })) return true;
  if (listingId && await Listing.exists({ _id: listingId, owner: otherId, isActive: true })) return true;
  return !!(await Message.exists({ thread: threadId(meId, otherId), sender: otherId }));
}

export const sendMessage = asyncHandler(async (req, res) => {
  const { recipient, text, listing } = req.body;
  if (!recipient || !text?.trim()) return res.status(400).json({ message: 'Write a message first' });
  if (String(recipient) === String(req.user._id)) return res.status(400).json({ message: "You can't message yourself" });
  const other = await User.findById(recipient);
  if (!other || other.isBanned) return res.status(404).json({ message: 'User not found' });
  if (!(await canChat(req.user._id, recipient, listing)))
    return res.status(403).json({ message: 'Send a roommate request first. You can chat once it is accepted.' });

  const msg = await Message.create({
    thread: threadId(req.user._id, recipient), sender: req.user._id, recipient,
    listing: listing || undefined, text
  });
  res.status(201).json(msg);
});

export const conversations = asyncHandler(async (req, res) => {
  const me = new mongoose.Types.ObjectId(req.user._id);
  const rows = await Message.aggregate([
    { $match: { $or: [{ sender: me }, { recipient: me }] } },
    { $sort: { createdAt: -1 } },
    { $group: {
        _id: '$thread', last: { $first: '$$ROOT' },
        unread: { $sum: { $cond: [{ $and: [{ $eq: ['$recipient', me] }, { $eq: ['$read', false] }] }, 1, 0] } }
    } },
    { $sort: { 'last.createdAt': -1 } }
  ]);
  const otherIds = rows.map((r) => (String(r.last.sender) === String(me) ? r.last.recipient : r.last.sender));
  const users = await User.find({ _id: { $in: otherIds } }).select('name avatar');
  const byId = Object.fromEntries(users.map((u) => [String(u._id), u]));
  res.json(rows.map((r, i) => ({
    thread: r._id,
    user: byId[String(otherIds[i])],
    last: { text: r.last.text, createdAt: r.last.createdAt, mine: String(r.last.sender) === String(me) },
    unread: r.unread
  })).filter((r) => r.user));
});

export const thread = asyncHandler(async (req, res) => {
  const other = await User.findById(req.params.userId).select('name avatar');
  if (!other) return res.status(404).json({ message: 'User not found' });
  const t = threadId(req.user._id, other._id);
  await Message.updateMany({ thread: t, recipient: req.user._id, read: false }, { read: true });
  const messages = await Message.find({ thread: t }).sort({ createdAt: 1 }).limit(300);
  res.json({ user: other, messages, canChat: await canChat(req.user._id, other._id) });
});

export const unreadCount = asyncHandler(async (req, res) => {
  const [messages, requests] = await Promise.all([
    Message.countDocuments({ recipient: req.user._id, read: false }),
    RoommateRequest.countDocuments({ to: req.user._id, status: 'pending' })
  ]);
  res.json({ messages, requests });
});
