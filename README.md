# Nestmate: room rental and roommate finder (MERN)

MongoDB · Express · React (Vite) · Node. JWT auth, role-based access, REST API.

## Run it

Requires Node 18+ and a running MongoDB (local, or an Atlas URI).

```bash
npm run install-all          # installs root, server and client deps
cp server/.env.example server/.env   # set MONGO_URI and a long random JWT_SECRET
npm run seed                 # optional demo data
npm run dev                  # API on :5000, web on :5173
```

Open http://localhost:5173.

| Role  | Login                       | Password      |
|-------|-----------------------------|---------------|
| Admin | admin@nestmate.test         | admin123      |
| Demo Users | ananya@nestmate.test (also rohan@, meera@, karan@) | password123 |
| Extended Users (40) | `<firstname>.<lastname>@nestmate.test` (e.g. aditya.nair@, aryan.malhotra@, nikhil.kulkarni@, karthik.varma@, varun.aggarwal@) | password123 |

Production: `npm run build` then `npm start`. Express serves `client/dist` itself.

## Features

**Users**
- Register / log in (JWT, bcrypt), edit profile, avatar upload, change password
- Post, edit, pause and delete rooms with up to 8 photos
- Search rooms: keyword, city, locality, type, rent range, furnished, gender suitability, amenities, availability date, sorting, pagination
- Save favourite rooms
- Flatmate finder: filter by city, budget overlap, gender, smoking, sleep schedule; results ranked by a 0–100 compatibility score
- Roommate requests: send, accept, decline, cancel (duplicate and reverse-duplicate protection)
- Chat: unlocked by an accepted request, by enquiring about someone's listing, or by replying to someone who messaged you
- Report a listing or a user

**Admin** (`/admin`, role-checked on the server)
- Overview stats
- Users: search, suspend / reinstate, promote / demote, delete with all their data
- Rooms: view everything, remove with a reason (shown to the owner), restore, delete
- Reports: review, dismiss, resolve, or resolve and remove the listing / suspend the user in one click

## API summary

```
POST   /api/auth/register | /login          GET/PUT /api/auth/me     POST /api/auth/me/avatar
GET    /api/listings?q&city&locality&type&minRent&maxRent&furnished&gender&amenities&availableBy&sort&page
GET    /api/listings/mine | /favorites | /:id
POST   /api/listings    PUT/DELETE /api/listings/:id    POST /api/listings/:id/favorite
GET    /api/roommates?city&minBudget&maxBudget&gender&smoking&pets&sleep    GET /api/roommates/:id
POST   /api/requests    GET /api/requests    PUT /api/requests/:id/respond    DELETE /api/requests/:id
GET    /api/messages/conversations | /thread/:userId | /unread     POST /api/messages
POST   /api/reports
# admin only
GET    /api/admin/stats | /users | /listings | /reports
PUT    /api/admin/users/:id   DELETE /api/admin/users/:id
PUT    /api/admin/listings/:id/status   DELETE /api/admin/listings/:id
PUT    /api/admin/reports/:id
```

## Layout

```
server/  models/ controllers/ routes/ middleware/ utils/compatibility.js seed.js seedData.js server.js
client/  src/pages/ src/components/ src/context/ src/styles.css
```

## Notes
- Admins can't be created through registration. Promote someone from the Users page, or use the seeded admin.
- Uploaded images are stored on local disk in `server/uploads`. For production, swap `middleware/upload.js` for S3 or Cloudinary.
- Currency is ₹ and seeded demo data spans 5 major Indian tech hubs: Bengaluru, Mumbai, Pune, Hyderabad, and Delhi NCR; change `money()` in `client/src/utils.js` for other markets.
