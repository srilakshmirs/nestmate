import { Router } from 'express';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as auth from '../controllers/authController.js';
import * as listing from '../controllers/listingController.js';
import * as roommate from '../controllers/roommateController.js';
import * as request from '../controllers/requestController.js';
import * as message from '../controllers/messageController.js';
import * as report from '../controllers/reportController.js';
import * as admin from '../controllers/adminController.js';

const r = Router();

// auth + profile
r.post('/auth/register', auth.register);
r.post('/auth/login', auth.login);
r.get('/auth/me', protect, auth.me);
r.put('/auth/me', protect, auth.updateMe);
r.post('/auth/me/avatar', protect, upload.single('avatar'), auth.uploadAvatar);
r.put('/auth/password', protect, auth.changePassword);

// rooms
r.get('/listings', listing.searchListings);
r.get('/listings/mine', protect, listing.myListings);
r.get('/listings/favorites', protect, listing.myFavorites);
r.get('/listings/:id', optionalAuth, listing.getListing);
r.post('/listings', protect, upload.array('images', 8), listing.createListing);
r.put('/listings/:id', protect, upload.array('images', 8), listing.updateListing);
r.delete('/listings/:id', protect, listing.deleteListing);
r.post('/listings/:id/favorite', protect, listing.toggleFavorite);

// roommates
r.get('/roommates', optionalAuth, roommate.findRoommates);
r.get('/roommates/:id', optionalAuth, roommate.getProfile);

// requests
r.post('/requests', protect, request.sendRequest);
r.get('/requests', protect, request.myRequests);
r.put('/requests/:id/respond', protect, request.respond);
r.delete('/requests/:id', protect, request.cancelRequest);

// chat
r.get('/messages/unread', protect, message.unreadCount);
r.get('/messages/conversations', protect, message.conversations);
r.get('/messages/thread/:userId', protect, message.thread);
r.post('/messages', protect, message.sendMessage);

// reports
r.post('/reports', protect, report.createReport);

// admin
const a = Router();
a.use(protect, adminOnly);
a.get('/stats', admin.stats);
a.get('/users', admin.listUsers);
a.put('/users/:id', admin.updateUser);
a.delete('/users/:id', admin.deleteUser);
a.get('/listings', admin.listListings);
a.put('/listings/:id/status', admin.setListingStatus);
a.delete('/listings/:id', admin.deleteListing);
a.get('/reports', admin.listReports);
a.put('/reports/:id', admin.resolveReport);
r.use('/admin', a);

export default r;
