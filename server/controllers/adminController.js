import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Report from '../models/Report.js';
import RoommateRequest from '../models/RoommateRequest.js';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import { removeUploads } from '../middleware/upload.js';

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const paging = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 15, 100);
  return { page, limit, skip: (page - 1) * limit };
};

async function suspendUser(user, reason = 'Account suspended') {
  user.isBanned = true;
  await user.save();
  await Listing.updateMany({ owner: user._id, isActive: true }, { isActive: false, removedReason: reason });
}

export const stats = asyncHandler(async (_req, res) => {
  const [users, banned, listings, active, openReports, pendingRequests, messages] = await Promise.all([
    User.countDocuments(), User.countDocuments({ isBanned: true }),
    Listing.countDocuments(), Listing.countDocuments({ isActive: true }),
    Report.countDocuments({ status: 'open' }),
    RoommateRequest.countDocuments({ status: 'pending' }), Message.countDocuments()
  ]);
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt');
  res.json({ users, banned, listings, active, removed: listings - active, openReports, pendingRequests, messages, recentUsers });
});

/* ---- users ---- */
export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req);
  const filter = {};
  if (req.query.q) filter.$or = ['name', 'email'].map((f) => ({ [f]: new RegExp(esc(req.query.q), 'i') }));
  if (req.query.status === 'banned') filter.isBanned = true;
  if (req.query.role) filter.role = req.query.role;
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit), User.countDocuments(filter)
  ]);
  const counts = await Listing.aggregate([{ $match: { owner: { $in: items.map((u) => u._id) } } }, { $group: { _id: '$owner', n: { $sum: 1 } } }]);
  const byOwner = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json({ items: items.map((u) => ({ ...u.toJSON(), listingCount: byOwner[String(u._id)] || 0 })), total, page, pages: Math.ceil(total / limit) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (String(user._id) === String(req.user._id)) return res.status(400).json({ message: "You can't change your own role or status" });
  if (req.body.role && ['user', 'admin'].includes(req.body.role)) user.role = req.body.role;
  if (req.body.isBanned === true) { if (user.role === 'admin') return res.status(400).json({ message: 'Demote this admin before suspending' }); await suspendUser(user); }
  else if (req.body.isBanned === false) { user.isBanned = false; await user.save(); }
  else await user.save();
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (String(user._id) === String(req.user._id) || user.role === 'admin')
    return res.status(400).json({ message: "Admin accounts can't be deleted here" });
  const listings = await Listing.find({ owner: user._id });
  listings.forEach((l) => removeUploads(l.images));
  removeUploads([user.avatar]);
  await Promise.all([
    Listing.deleteMany({ owner: user._id }),
    RoommateRequest.deleteMany({ $or: [{ from: user._id }, { to: user._id }] }),
    Message.deleteMany({ $or: [{ sender: user._id }, { recipient: user._id }] }),
    Report.deleteMany({ reporter: user._id }),
    user.deleteOne()
  ]);
  res.json({ message: 'User and their data deleted' });
});

/* ---- listings ---- */
export const listListings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req);
  const filter = {};
  if (req.query.q) filter.$or = ['title', 'city', 'locality'].map((f) => ({ [f]: new RegExp(esc(req.query.q), 'i') }));
  if (req.query.status === 'removed') filter.isActive = false;
  if (req.query.status === 'active') filter.isActive = true;
  const [items, total] = await Promise.all([
    Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('owner', 'name email isBanned'),
    Listing.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const setListingStatus = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  const remove = req.body.isActive === false;
  listing.isActive = !remove;
  listing.removedReason = remove ? (req.body.reason || 'Removed for violating our listing guidelines') : '';
  await listing.save();
  res.json(listing);
});

export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  removeUploads(listing.images);
  await listing.deleteOne();
  res.json({ message: 'Listing deleted' });
});

/* ---- reports ---- */
export const listReports = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('reporter', 'name email')
      .populate('targetUser', 'name email isBanned')
      .populate('targetListing', 'title city locality isActive'),
    Report.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const resolveReport = asyncHandler(async (req, res) => {
  const { status, note, action } = req.body; // status: resolved | dismissed ; action: remove-listing | ban-user
  if (!['resolved', 'dismissed', 'open'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found' });

  if (action === 'remove-listing' && report.targetListing) {
    await Listing.findByIdAndUpdate(report.targetListing, { isActive: false, removedReason: note || `Removed after report: ${report.reason}` });
  }
  if (action === 'ban-user' && report.targetUser) {
    const u = await User.findById(report.targetUser);
    if (u && u.role !== 'admin') await suspendUser(u, `Account suspended after report: ${report.reason}`);
  }
  report.status = status;
  report.adminNote = note || '';
  report.resolvedBy = status === 'open' ? undefined : req.user._id;
  await report.save();
  res.json(report);
});
