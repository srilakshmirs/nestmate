import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../middleware/auth.js';

const send = (res, user, status = 200) =>
  res.status(status).json({ token: signToken(user._id), user });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  const user = await User.create({ name, email, password }); // role is never taken from the request
  send(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password || '')))
    return res.status(401).json({ message: 'Email or password is incorrect' });
  if (user.isBanned) return res.status(403).json({ message: 'This account has been suspended' });
  send(res, user);
});

export const me = asyncHandler(async (req, res) => res.json(req.user));

const PROFILE_FIELDS = [
  'name', 'bio', 'age', 'gender', 'occupation', 'city', 'seeking',
  'budget', 'moveInDate', 'preferredLocalities', 'lifestyle'
];

export const updateMe = asyncHandler(async (req, res) => {
  PROFILE_FIELDS.forEach((f) => {
    if (req.body[f] !== undefined) req.user.set(f, req.body[f] === '' && f === 'age' ? undefined : req.body[f]);
  });
  await req.user.save();
  res.json(req.user);
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose an image to upload' });
  req.user.avatar = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json(req.user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword || '')))
    return res.status(400).json({ message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});
