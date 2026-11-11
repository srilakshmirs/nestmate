import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { Cover, ListingCard } from '../components/Cards.jsx';
import { Empty, useToast } from '../components/ui.jsx';
import { money } from '../utils.js';

export function MyRooms() {
  const [items, setItems] = useState(null);
  const toast = useToast();
  const load = () => api.get('/listings/mine').then((r) => setItems(r.data)).catch((e) => toast(errMsg(e), 'err'));
  useEffect(() => { load(); }, []); // eslint-disable-line

  const toggle = async (l) => {
    const fd = new FormData();
    fd.append('isActive', String(!l.isActive));
    try { await api.put(`/listings/${l._id}`, fd); toast(l.isActive ? 'Listing paused' : 'Listing is live'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };
  const del = async (l) => {
    if (!window.confirm(`Delete "${l.title}"? This can't be undone.`)) return;
    try { await api.delete(`/listings/${l._id}`); toast('Listing deleted'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };

  if (!items) return <div className="page-pad muted">Loading…</div>;
  return (
    <div className="page-pad">
      <div className="results-head"><h1>My rooms</h1><Link className="btn primary" to="/rooms/new">Post a room</Link></div>
      {items.length === 0 ? <Empty title="You haven't posted a room yet">Add photos, rent and house rules to start getting enquiries.</Empty> : (
        <div className="rows">
          {items.map((l) => (
            <div className="row-card" key={l._id}>
              <Cover listing={l} className="thumb" />
              <div className="grow">
                <Link to={`/rooms/${l._id}`}><strong>{l.title}</strong></Link>
                <p className="muted small">{l.locality}, {l.city} · {money(l.rent)}/month</p>
                {l.removedReason
                  ? <span className="status bad">Removed by admin: {l.removedReason}</span>
                  : <span className={`status ${l.isActive ? 'good' : ''}`}>{l.isActive ? 'Live' : 'Paused'}</span>}
              </div>
              <div className="row-actions">
                <Link className="btn ghost sm" to={`/rooms/${l._id}/edit`}>Edit</Link>
                {!l.removedReason && <button className="btn ghost sm" onClick={() => toggle(l)}>{l.isActive ? 'Pause' : 'Publish'}</button>}
                <button className="btn danger-ghost sm" onClick={() => del(l)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Saved() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get('/listings/favorites').then((r) => setItems(r.data)).catch(() => setItems([])); }, []);
  if (!items) return <div className="page-pad muted">Loading…</div>;
  return (
    <div className="page-pad wide">
      <h1>Saved rooms</h1>
      {items.length === 0 ? <Empty title="Nothing saved yet">Tap the heart on any room to keep it here.</Empty>
        : <div className="grid">{items.map((l) => <ListingCard key={l._id} listing={l} />)}</div>}
    </div>
  );
}
