import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { RequireAuth } from './components/ui.jsx';
import Home from './pages/Home.jsx';
import Listings from './pages/Listings.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import ListingForm from './pages/ListingForm.jsx';
import Roommates from './pages/Roommates.jsx';
import PersonProfile from './pages/PersonProfile.jsx';
import { Login, Register } from './pages/Auth.jsx';
import MyProfile from './pages/MyProfile.jsx';
import { MyRooms, Saved } from './pages/MyRooms.jsx';
import Requests from './pages/Requests.jsx';
import Messages from './pages/Messages.jsx';
import { AdminLayout, AdminDashboard, AdminUsers, AdminListings, AdminReports } from './pages/Admin.jsx';

const NotFound = () => <div className="page-pad"><h1>Page not found</h1><p><Link to="/">Go back home</Link></p></div>;
const auth = (el) => <RequireAuth>{el}</RequireAuth>;

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Listings />} />
          <Route path="/rooms/new" element={auth(<ListingForm />)} />
          <Route path="/rooms/:id" element={<ListingDetail />} />
          <Route path="/rooms/:id/edit" element={auth(<ListingForm />)} />
          <Route path="/flatmates" element={<Roommates />} />
          <Route path="/people/:id" element={<PersonProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={auth(<MyProfile />)} />
          <Route path="/my-rooms" element={auth(<MyRooms />)} />
          <Route path="/saved" element={auth(<Saved />)} />
          <Route path="/requests" element={auth(<Requests />)} />
          <Route path="/messages" element={auth(<Messages />)} />
          <Route path="/messages/:userId" element={auth(<Messages />)} />
          <Route path="/admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">Nestmate · Rooms and flatmates, matched with care</footer>
    </>
  );
}
