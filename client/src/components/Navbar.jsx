import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from './ui.jsx';
import api from '../api.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [counts, setCounts] = useState({ messages: 0, requests: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = () => api.get('/messages/unread').then((r) => setCounts(r.data)).catch(() => {});
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [user]);

  const close = () => setOpen(false);
  const Badge = ({ n }) => (n > 0 ? <span className="badge">{n}</span> : null);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={close}>
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M4 15 16 5l12 10v12H4z" fill="var(--pine)" />
            <circle cx="12.5" cy="19" r="3" fill="var(--marigold)" /><circle cx="19.5" cy="19" r="3" fill="#fff" />
          </svg>
          nestmate
        </Link>
        <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">☰</button>
        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={close}>
          <NavLink to="/rooms">Rooms</NavLink>
          <NavLink to="/flatmates">Flatmates</NavLink>
          {user ? (
            <>
              <NavLink to="/requests">Requests <Badge n={counts.requests} /></NavLink>
              <NavLink to="/messages">Messages <Badge n={counts.messages} /></NavLink>
              <Link className="btn primary sm" to="/rooms/new">Post a room</Link>
              <details className="user-menu" onClick={(e) => e.stopPropagation()}>
                <summary><Avatar user={user} size={34} /></summary>
                <div className="menu">
                  <strong>{user.name}</strong>
                  <Link to="/profile" onClick={(e) => e.currentTarget.closest('details').removeAttribute('open')}>My profile</Link>
                  <Link to="/my-rooms" onClick={(e) => e.currentTarget.closest('details').removeAttribute('open')}>My rooms</Link>
                  <Link to="/saved" onClick={(e) => e.currentTarget.closest('details').removeAttribute('open')}>Saved rooms</Link>
                  {user.role === 'admin' && <Link to="/admin" onClick={(e) => e.currentTarget.closest('details').removeAttribute('open')}>Admin panel</Link>}
                  <button onClick={() => { logout(); nav('/'); }}>Log out</button>
                </div>
              </details>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link className="btn primary sm" to="/register">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
