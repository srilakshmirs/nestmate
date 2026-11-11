import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar, ScoreRing, Modal, useToast, Field } from './ui.jsx';
import api, { errMsg } from '../api.js';
import { money, TYPE_LABEL, fmtDate, LIFESTYLE_LABEL } from '../utils.js';

export function Cover({ listing, className = '' }) {
  const src = listing?.images?.[0];
  return src
    ? <img className={`cover ${className}`} src={src} alt="" loading="lazy" />
    : <div className={`cover placeholder ${className}`} aria-hidden="true">
        <svg viewBox="0 0 64 64" width="52" height="52"><path d="M8 30 32 10l24 20v24H8z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" /><path d="M26 54V38h12v16" fill="none" stroke="currentColor" strokeWidth="3" /></svg>
      </div>;
}

export function ListingCard({ listing }) {
  const { user, toggleFav } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const faved = user?.favorites?.includes(listing._id);

  const fav = async (e) => {
    e.preventDefault();
    if (!user) return nav('/login');
    try { toast((await toggleFav(listing._id)) ? 'Saved to your list' : 'Removed from saved'); } catch (er) { toast(errMsg(er), 'err'); }
  };

  return (
    <Link to={`/rooms/${listing._id}`} className="card listing-card">
      <div className="cover-wrap">
        <Cover listing={listing} />
        <button className={`fav ${faved ? 'on' : ''}`} onClick={fav} aria-label={faved ? 'Remove from saved' : 'Save room'} aria-pressed={!!faved}>{faved ? '♥' : '♡'}</button>
        <span className="tag">{TYPE_LABEL[listing.type]}</span>
      </div>
      <div className="card-body">
        <div className="price">{money(listing.rent)}<small>/month</small></div>
        <h3>{listing.title}</h3>
        <p className="muted">{listing.locality}, {listing.city}</p>
        <p className="muted small">Available {fmtDate(listing.availableFrom)}{listing.furnished ? ' · Furnished' : ''}</p>
      </div>
    </Link>
  );
}

export function RequestModal({ person, listingId, onClose, onSent }) {
  const toast = useToast();
  const [message, setMessage] = useState(`Hi ${person.name.split(' ')[0]}, `);
  const [busy, setBusy] = useState(false);
  const send = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/requests', { to: person._id, listing: listingId, message });
      toast('Request sent');
      onSent?.();
      onClose();
    } catch (er) { toast(errMsg(er), 'err'); setBusy(false); }
  };
  return (
    <Modal title={`Send a roommate request to ${person.name}`} onClose={onClose}>
      <form onSubmit={send} className="stack">
        <Field label="Introduce yourself" hint="They can accept or decline. Once accepted, you can chat.">
          <textarea rows="4" maxLength="500" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </Field>
        <button className="btn primary" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
      </form>
    </Modal>
  );
}

export function ReportModal({ targetType, targetId, onClose }) {
  const toast = useToast();
  const [reason, setReason] = useState('inappropriate');
  const [details, setDetails] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/reports', { targetType, targetId, reason, details });
      toast(data.message);
      onClose();
    } catch (er) { toast(errMsg(er), 'err'); }
  };
  return (
    <Modal title={`Report this ${targetType}`} onClose={onClose}>
      <form onSubmit={submit} className="stack">
        <Field label="What's wrong?">
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="inappropriate">Inappropriate content</option>
            <option value="scam">Looks like a scam</option>
            <option value="fake">Fake or misleading</option>
            <option value="spam">Spam</option>
            <option value="harassment">Harassment</option>
            <option value="other">Something else</option>
          </select>
        </Field>
        <Field label="Details (optional)"><textarea rows="3" maxLength="1000" value={details} onChange={(e) => setDetails(e.target.value)} /></Field>
        <button className="btn danger">Send report</button>
      </form>
    </Modal>
  );
}

// Connect button that reflects the current relationship (none / sent / received / accepted)
export function ConnectButton({ person, onChange, listingId }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const status = person.relation?.status || 'none';

  if (user && String(user._id) === String(person._id)) return null;
  if (status === 'accepted') return <Link className="btn primary sm" to={`/messages/${person._id}`}>Chat</Link>;
  if (status === 'sent') return <button className="btn ghost sm" disabled>Request sent</button>;
  if (status === 'received') return <Link className="btn accent sm" to="/requests">Respond to request</Link>;
  return (
    <>
      <button className="btn primary sm" onClick={() => (user ? setOpen(true) : nav('/login'))}>Send request</button>
      {open && <RequestModal person={person} listingId={listingId} onClose={() => setOpen(false)} onSent={onChange} />}
    </>
  );
}

export function RoommateCard({ person, onChange }) {
  const l = person.lifestyle || {};
  return (
    <article className="card person-card">
      <div className="person-top">
        <Avatar user={person} size={56} />
        <div className="grow">
          <h3><Link to={`/people/${person._id}`}>{person.name}</Link></h3>
          <p className="muted small">{[person.age, person.occupation].filter(Boolean).join(', ') || 'Flatmate hunter'}</p>
          <p className="muted small">{person.city || 'Location not set'}</p>
        </div>
        <ScoreRing value={person.compatibility} />
      </div>
      {person.bio && <p className="bio">{person.bio}</p>}
      <p className="budget">Budget {money(person.budget?.min)} – {money(person.budget?.max)}</p>
      <div className="chips">
        {l.smoking && <span className="chip">{LIFESTYLE_LABEL.smoking[l.smoking]}</span>}
        {l.sleep && <span className="chip">{LIFESTYLE_LABEL.sleep[l.sleep]}</span>}
        {l.pets && <span className="chip">{LIFESTYLE_LABEL.pets[l.pets]}</span>}
      </div>
      <div className="person-actions">
        <Link className="btn ghost sm" to={`/people/${person._id}`}>View profile</Link>
        <ConnectButton person={person} onChange={onChange} />
      </div>
    </article>
  );
}
