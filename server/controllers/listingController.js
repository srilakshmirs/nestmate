import Listing from '../models/Listing.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { removeUploads } from '../middleware/upload.js';

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const FIELDS = ['title', 'description', 'type', 'rent', 'deposit', 'city', 'locality', 'address', 'bedrooms',
  'bathrooms', 'currentRoommates', 'furnished', 'amenities', 'genderPreference', 'rules', 'availableFrom'];

// multipart bodies arrive as strings: parse JSON fields, whitelist the rest
const pick = (body) => {
  const out = {};
  FIELDS.forEach((f) => { if (body[f] !== undefined) out[f] = body[f]; });
  ['amenities', 'rules'].forEach((k) => {
    if (typeof out[k] === 'string') { try { out[k] = JSON.parse(out[k]); } catch { delete out[k]; } }
  });
  return out;
};

export const searchListings = asyncHandler(async (req, res) => {
  const { q, city, locality, type, minRent, maxRent, furnished, gender, amenities, availableBy, sort = 'newest' } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 12, 50);

  const filter = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (city) filter.city = new RegExp(`^${esc(city)}`, 'i');
  if (locality) filter.locality = new RegExp(esc(locality), 'i');
  if (type) filter.type = type;
  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }
  if (furnished === 'true') filter.furnished = true;
  if (gender) filter.genderPreference = { $in: [gender, 'any'] };
  if (amenities) filter.amenities = { $all: String(amenities).split(',').filter(Boolean) };
  if (availableBy) filter.availableFrom = { $lte: new Date(availableBy) };

  const sorts = { newest: { createdAt: -1 }, price_asc: { rent: 1 }, price_desc: { rent: -1 }, available: { availableFrom: 1 } };
  const [items, total] = await Promise.all([
    Listing.find(filter).sort(sorts[sort] || sorts.newest).skip((page - 1) * limit).limit(limit)
      .populate('owner', 'name avatar'),
    Listing.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('owner', 'name avatar occupation city bio createdAt');
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  const canSee = listing.isActive || req.user?.role === 'admin' || String(listing.owner._id) === String(req.user?._id);
  if (!canSee) return res.status(404).json({ message: 'This listing is no longer available' });
  res.json(listing);
});

export const createListing = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const listing = await Listing.create({ ...pick(req.body), owner: req.user._id, images });
  res.status(201).json(listing);
});

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (String(listing.owner) !== String(req.user._id)) return res.status(403).json({ message: 'You can only edit your own listings' });

  listing.set(pick(req.body));
  if (req.body.keepImages !== undefined) {
    let keep = [];
    try { keep = JSON.parse(req.body.keepImages); } catch { /* ignore */ }
    removeUploads(listing.images.filter((i) => !keep.includes(i)));
    listing.images = listing.images.filter((i) => keep.includes(i));
  }
  listing.images.push(...(req.files || []).map((f) => `/uploads/${f.filename}`));
  if (req.body.isActive !== undefined && !listing.removedReason) listing.isActive = req.body.isActive === 'true' || req.body.isActive === true;
  await listing.save();
  res.json(listing);
});

export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (String(listing.owner) !== String(req.user._id)) return res.status(403).json({ message: 'You can only delete your own listings' });
  removeUploads(listing.images);
  await listing.deleteOne();
  res.json({ message: 'Listing deleted' });
});

export const myListings = asyncHandler(async (req, res) =>
  res.json(await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 })));

export const toggleFavorite = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  const has = req.user.favorites.some((f) => String(f) === req.params.id);
  req.user.favorites = has ? req.user.favorites.filter((f) => String(f) !== req.params.id) : [...req.user.favorites, listing._id];
  await req.user.save();
  res.json({ favorited: !has, favorites: req.user.favorites });
});

export const myFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites', match: { isActive: true }, populate: { path: 'owner', select: 'name avatar' }
  });
  res.json(user.favorites);
});
