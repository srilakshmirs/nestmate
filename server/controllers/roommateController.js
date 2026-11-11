import User from '../models/User.js';
import RoommateRequest from '../models/RoommateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';
import { compatibility } from '../utils/compatibility.js';

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PUBLIC = '-email -favorites -role -isBanned -updatedAt';

// "none" | "sent" | "received" | "accepted" | "rejected" relative to the viewer
async function relationMap(meId, otherIds) {
  const reqs = await RoommateRequest.find({
    $or: [{ from: meId, to: { $in: otherIds } }, { to: meId, from: { $in: otherIds } }],
    status: { $in: ['pending', 'accepted'] }
  });
  const map = {};
  reqs.forEach((r) => {
    const sentByMe = String(r.from) === String(meId);
    const other = String(sentByMe ? r.to : r.from);
    map[other] = { status: r.status === 'accepted' ? 'accepted' : sentByMe ? 'sent' : 'received', requestId: r._id };
  });
  return map;
}

export const findRoommates = asyncHandler(async (req, res) => {
  const { q, city, minBudget, maxBudget, gender, smoking, pets, sleep } = req.query;
  const filter = { seeking: true, isBanned: false };
  if (req.user) filter._id = { $ne: req.user._id };
  if (city) filter.city = new RegExp(`^${esc(city)}`, 'i');
  if (gender) filter.gender = gender;
  if (smoking) filter['lifestyle.smoking'] = smoking;
  if (pets) filter['lifestyle.pets'] = pets;
  if (sleep) filter['lifestyle.sleep'] = sleep;
  if (minBudget) filter['budget.max'] = { $gte: Number(minBudget) }; // their ceiling reaches my floor
  if (maxBudget) filter['budget.min'] = { $lte: Number(maxBudget) };
  if (q) filter.$or = ['name', 'occupation', 'bio'].map((f) => ({ [f]: new RegExp(esc(q), 'i') }));

  let users = (await User.find(filter).select(PUBLIC).limit(100)).map((u) => u.toObject());
  let rel = {};
  if (req.user) {
    rel = await relationMap(req.user._id, users.map((u) => u._id));
    users.forEach((u) => { u.compatibility = compatibility(req.user, u); u.relation = rel[String(u._id)] || { status: 'none' }; });
    users.sort((a, b) => (b.compatibility ?? -1) - (a.compatibility ?? -1));
  }
  res.json(users);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(PUBLIC);
  if (!user || user.isBanned) return res.status(404).json({ message: 'Profile not found' });
  const out = user.toObject();
  if (req.user && String(req.user._id) !== String(user._id)) {
    out.compatibility = compatibility(req.user, user);
    out.relation = (await relationMap(req.user._id, [user._id]))[String(user._id)] || { status: 'none' };
  }
  res.json(out);
});
