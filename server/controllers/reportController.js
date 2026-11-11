import Report from '../models/Report.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason, details } = req.body;
  if (!['listing', 'user'].includes(targetType)) return res.status(400).json({ message: 'Invalid report target' });

  const data = { reporter: req.user._id, targetType, reason, details };
  if (targetType === 'listing') {
    const l = await Listing.findById(targetId);
    if (!l) return res.status(404).json({ message: 'Listing not found' });
    if (String(l.owner) === String(req.user._id)) return res.status(400).json({ message: "You can't report your own listing" });
    data.targetListing = l._id;
    data.targetUser = l.owner;
  } else {
    const u = await User.findById(targetId);
    if (!u) return res.status(404).json({ message: 'User not found' });
    if (String(u._id) === String(req.user._id)) return res.status(400).json({ message: "You can't report yourself" });
    data.targetUser = u._id;
  }
  const dup = await Report.exists({
    reporter: req.user._id, status: 'open', targetType,
    ...(targetType === 'listing' ? { targetListing: data.targetListing } : { targetUser: data.targetUser })
  });
  if (dup) return res.status(409).json({ message: "You've already reported this. Our team is reviewing it." });
  await Report.create(data);
  res.status(201).json({ message: 'Report sent. Thanks for helping keep Nestmate safe.' });
});
