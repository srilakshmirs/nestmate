import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const getToken = (req) => {
  const h = req.headers.authorization;
  return h && h.startsWith('Bearer ') ? h.split(' ')[1] : null;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Please log in to continue' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    if (user.isBanned) return res.status(403).json({ message: 'This account has been suspended' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again' });
  }
});

// Attaches req.user if a valid token is present, but never blocks.
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (token) {
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id);
    } catch { /* ignore */ }
  }
  next();
});

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const adminOnly = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admin access required' });
