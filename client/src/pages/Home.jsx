import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';
import { ListingCard, RoommateCard } from '../components/Cards.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState('rooms');
  const [city, setCity] = useState('Bengaluru');
  const [budget, setBudget] = useState('');
  const [rooms, setRooms] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    api.get('/listings', { params: { limit: 6 } }).then((r) => setRooms(r.data.items)).catch(() => {});
    api.get('/roommates').then((r) => setPeople(r.data.slice(0, 3))).catch(() => {});
  }, [user]);

  const go = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (city) p.set('city', city);
    if (budget) p.set(mode === 'rooms' ? 'maxRent' : 'maxBudget', budget);
    nav(`${mode === 'rooms' ? '/rooms' : '/flatmates'}?${p}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1>A room is easy to find.<br />The right people to share it with take a little more care.</h1>
          <p className="lead">Browse rooms, then see who is also looking. Every flatmate profile shows how well your habits and budget line up before you say hello.</p>
          <form className="searchbar" onSubmit={go}>
            <div className="seg" role="tablist" aria-label="Search for">
              <button type="button" role="tab" aria-selected={mode === 'rooms'} className={mode === 'rooms' ? 'on' : ''} onClick={() => setMode('rooms')}>Rooms</button>
              <button type="button" role="tab" aria-selected={mode === 'people'} className={mode === 'people' ? 'on' : ''} onClick={() => setMode('people')}>Flatmates</button>
            </div>
            <input aria-label="City" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <input aria-label={mode === 'rooms' ? 'Max rent' : 'Max budget'} type="number" min="0" step="500" placeholder={mode === 'rooms' ? 'Max rent per month (₹)' : 'Max budget (₹)'} value={budget} onChange={(e) => setBudget(e.target.value)} />
            <button className="btn primary">Search</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>New rooms</h2><Link to="/rooms">See all rooms</Link></div>
        <div className="grid">{rooms.map((l) => <ListingCard key={l._id} listing={l} />)}</div>
      </section>

      {people.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>{user ? 'People who fit you best' : 'People looking for a place'}</h2>
            <Link to="/flatmates">Browse flatmates</Link>
          </div>
          <div className="grid">{people.map((p) => <RoommateCard key={p._id} person={p} />)}</div>
          {!user && <p className="muted note">Log in to see how compatible you are with each person.</p>}
        </section>
      )}
    </>
  );
}
