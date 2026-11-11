import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Listing from './models/Listing.js';
import RoommateRequest from './models/RoommateRequest.js';
import Message, { threadId } from './models/Message.js';
import Report from './models/Report.js';
import { seedExtendedData } from './seedData.js';

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nestmate');
await Promise.all([User, Listing, RoommateRequest, Message, Report].map((m) => m.deleteMany({})));

const soon = (d) => new Date(Date.now() + d * 864e5);
const mk = (o) => User.create({ password: 'password123', ...o });

const admin = await mk({ name: 'Site Admin', email: 'admin@nestmate.test', password: 'admin123', role: 'admin' });
const ananya = await mk({
  name: 'Ananya Rao', email: 'ananya@nestmate.test', age: 26, gender: 'female', occupation: 'Product designer', city: 'Bengaluru',
  bio: 'Quiet weekdays, board games on weekends. Looking for a tidy, friendly flat near a metro line.',
  seeking: true, budget: { min: 9000, max: 16000 }, moveInDate: soon(14), preferredLocalities: ['Indiranagar', 'HSR Layout'],
  lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
});
const rohan = await mk({
  name: 'Rohan Mehta', email: 'rohan@nestmate.test', age: 28, gender: 'male', occupation: 'Backend engineer', city: 'Bengaluru',
  bio: 'WFH three days a week, weekend cyclist. I cook, you wash up?',
  seeking: true, budget: { min: 12000, max: 20000 }, moveInDate: soon(21), preferredLocalities: ['Koramangala', 'HSR Layout'],
  lifestyle: { smoking: 'outside', pets: 'have', cleanliness: 3, sleep: 'night', guests: 'sometimes', diet: 'any' }
});
const meera = await mk({
  name: 'Meera Iyer', email: 'meera@nestmate.test', age: 24, gender: 'female', occupation: 'Grad student', city: 'Bengaluru',
  bio: 'Early riser, vegetarian, plant person.',
  seeking: true, budget: { min: 7000, max: 12000 }, moveInDate: soon(30), preferredLocalities: ['Jayanagar'],
  lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
});
const karan = await mk({
  name: 'Karan Shah', email: 'karan@nestmate.test', age: 30, gender: 'male', occupation: 'Landlord / consultant', city: 'Bengaluru',
  bio: 'I rent out rooms in flats I live in. Happy to answer questions.'
});
const spammer = await mk({ name: 'Quick Deals', email: 'spam@nestmate.test' });

const base = { city: 'Bengaluru', availableFrom: soon(10) };
const listings = await Listing.insertMany([
  { ...base, owner: karan._id, title: 'Sunny private room in Koramangala 5th Block', type: 'private-room', rent: 14500, deposit: 29000, locality: 'Koramangala',
    description: 'Large room with balcony in a 3BHK shared with two working professionals. 5 minutes from Sony Signal. Fast wifi and a modular kitchen.',
    bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true, amenities: ['wifi', 'ac', 'washing machine', 'kitchen', 'balcony', 'power backup'], genderPreference: 'any' },
  { ...base, owner: karan._id, title: 'Budget shared room near HSR BDA complex', type: 'shared-room', rent: 6500, deposit: 13000, locality: 'HSR Layout',
    description: 'Two-sharing room, bunk beds provided. Home-cooked meals available for a small extra charge. Ideal for early-career folks.',
    bedrooms: 3, bathrooms: 2, currentRoommates: 3, furnished: true, amenities: ['wifi', 'geyser', 'housekeeping', 'power backup'], genderPreference: 'male' },
  { ...base, owner: ananya._id, title: 'Room in women-only flat, Indiranagar 100ft Road', type: 'private-room', rent: 15500, deposit: 31000, locality: 'Indiranagar',
    description: 'Looking for a third flatmate. Walking distance to the metro, cafes, and a gym. We keep the place clean and share groceries.',
    bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true, amenities: ['wifi', 'ac', 'kitchen', 'lift', 'security', 'gym'], genderPreference: 'female' },
  { ...base, owner: rohan._id, title: 'Entire 2BHK in Whitefield, pet friendly', type: 'entire-place', rent: 28000, deposit: 84000, locality: 'Whitefield',
    description: 'Semi-furnished 2BHK in a gated community with a clubhouse and a pool. Close to ITPL. Pets welcome.',
    bedrooms: 2, bathrooms: 2, furnished: false, amenities: ['parking', 'gym', 'lift', 'security', 'power backup'], rules: { pets: true, smoking: false, guests: true } },
  { ...base, owner: karan._id, title: 'Quiet room in Jayanagar 4th Block', type: 'private-room', rent: 11000, deposit: 22000, locality: 'Jayanagar',
    description: 'Ground floor of an independent house with a small garden. Vegetarian household. Great for students and those who like quiet.',
    bedrooms: 2, bathrooms: 1, currentRoommates: 1, furnished: true, amenities: ['wifi', 'geyser', 'kitchen', 'washing machine'], genderPreference: 'any' },
  { ...base, owner: rohan._id, title: 'Attached-bath room in Marathahalli, near ORR', type: 'private-room', rent: 9500, deposit: 19000, locality: 'Marathahalli',
    description: 'Room with attached bathroom in a 2BHK. Easy access to the outer ring road tech parks and the bus stop.',
    bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: false, amenities: ['wifi', 'attached bathroom', 'parking'], genderPreference: 'any' },
  { ...base, owner: spammer._id, title: 'EARN ₹50,000 FAST!!! room available CALL NOW', type: 'shared-room', rent: 1000, locality: 'Electronic City',
    description: 'Pay token advance on WhatsApp to confirm. Limited offer, no visit needed.', amenities: [] }
]);

const rq = await RoommateRequest.create({ from: ananya._id, to: rohan._id, message: 'Hi Rohan, our budgets and move-in dates line up. Want to look at flats together?', status: 'accepted' });
await RoommateRequest.create({ from: meera._id, to: ananya._id, message: 'Hey! Saw your profile. I am also looking around Indiranagar.' });
await Message.create([
  { thread: threadId(ananya._id, rohan._id), sender: ananya._id, recipient: rohan._id, text: 'Hi Rohan, thanks for accepting! Free this Saturday to see a flat in HSR?' },
  { thread: threadId(ananya._id, rohan._id), sender: rohan._id, recipient: ananya._id, text: 'Saturday works. Morning around 11?' }
]);
await Report.create({ reporter: ananya._id, targetType: 'listing', targetListing: listings[6]._id, targetUser: spammer._id, reason: 'scam',
  details: 'Asks for an advance over WhatsApp without a visit. Rent looks unrealistic.' });

await seedExtendedData({
  existingUsers: { admin, ananya, rohan, meera, karan, spammer },
  existingListings: listings,
  soon,
  mk
});

const counts = {
  users: await User.countDocuments(),
  listings: await Listing.countDocuments(),
  requests: await RoommateRequest.countDocuments(),
  messages: await Message.countDocuments(),
  reports: await Report.countDocuments()
};

console.log('Seeded successfully:');
console.log(`  Users: ${counts.users}`);
console.log(`  Listings: ${counts.listings}`);
console.log(`  RoommateRequests: ${counts.requests}`);
console.log(`  Messages: ${counts.messages}`);
console.log(`  Reports: ${counts.reports}`);
console.log('  Admin: admin@nestmate.test / admin123');
console.log('  Demo users: ananya@ / rohan@ / meera@ / karan@nestmate.test / password123');
console.log('  Extended users: password123');
await mongoose.disconnect();
