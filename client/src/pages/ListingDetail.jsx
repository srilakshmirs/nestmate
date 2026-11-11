import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar, useToast } from '../components/ui.jsx';
import { Cover, ReportModal, RequestModal } from '../components/Cards.jsx';
import { money, TYPE_LABEL, fmtDate } from '../utils.js';

export default function ListingDetail() {
  const { id } = useParams();
  const { user, toggleFav } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [l, setL] = useState(null);
  const [error, setError] = useState('');
  const [img, setImg] = useState(0);
  const [report, setReport] = useState(false);
  const [request, setRequest] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`).then((r) => { setL(r.data); setImg(0); }).catch((e) => setError(errMsg(e)));
  }, [id, user?._id]);

  if (error) return <div className="page-pad"><p className="error">{error}</p><Link to="/rooms">Back to rooms</Link></div>;
  if (!l) return <div className="page-pad muted">Loading…</div>;

  const mine = user && String(user._id) === String(l.owner._id);
  const faved = user?.favorites?.includes(l._id);
  const needLogin = (fn) => () => (user ? fn() : nav('/login', { state: { from: `/rooms/${id}` } }));
  const owner = l.owner;

  return (
    <div className="detail">
      {!l.isActive && <div className="banner warn">{l.removedReason ? `This listing was taken down: ${l.removedReason}` : 'This listing is paused and hidden from search.'}</div>}
      <div className="gallery">
        <div className="gallery-main">
          {l.images.length ? <img className="cover" src={l.images[img]} alt={`${l.title}, photo ${img + 1}`} /> : <Cover listing={l} />}
        </div>
        {l.images.length > 1 && (
          <div className="thumbs">
            {l.images.map((src, i) => (
              <button key={src} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`Show photo ${i + 1}`}><img src={src} alt="" /></button>
            ))}
          </div>
        )}
      </div>

      <div className="detail-cols">
        <div className="detail-main">
          <p className="muted">{TYPE_LABEL[l.type]} · {l.locality}, {l.city}</p>
          <h1>{l.title}</h1>
          <div className="facts">
            <div><strong>{money(l.rent)}</strong><span>per month</span></div>
            <div><strong>{money(l.deposit)}</strong><span>deposit</span></div>
            <div><strong>{fmtDate(l.availableFrom)}</strong><span>available from</span></div>
            <div><strong>{l.bedrooms} bed · {l.bathrooms} bath</strong><span>{l.currentRoommates} current flatmates</span></div>
          </div>
          <h2>About this place</h2>
          <p className="prewrap">{l.description}</p>
          {l.address && <p className="muted">Address: {l.address}</p>}
          <h2>Amenities</h2>
          <div className="chips">
            {l.furnished && <span className="chip">furnished</span>}
            {l.amenities.map((a) => <span key={a} className="chip">{a}</span>)}
            {!l.furnished && !l.amenities.length && <span className="muted">None listed</span>}
          </div>
          <h2>House rules</h2>
          <ul className="rules">
            <li>{l.rules?.smoking ? 'Smoking allowed' : 'No smoking'}</li>
            <li>{l.rules?.pets ? 'Pets welcome' : 'No pets'}</li>
            <li>{l.rules?.guests === false ? 'No overnight guests' : 'Guests allowed'}</li>
            <li>{l.genderPreference === 'any' ? 'Open to anyone' : `For ${l.genderPreference === 'male' ? 'men' : 'women'} only`}</li>
          </ul>
        </div>

        <aside className="contact card">
          <div className="price big">{money(l.rent)}<small>/month</small></div>
          <Link to={`/people/${owner._id}`} className="owner">
            <Avatar user={owner} size={48} />
            <div><strong>{owner.name}</strong><p className="muted small">{owner.occupation || 'Lister'}</p></div>
          </Link>
          {mine ? (
            <>
              <Link className="btn primary" to={`/rooms/${l._id}/edit`}>Edit listing</Link>
              <Link className="btn ghost" to="/my-rooms">Manage my rooms</Link>
            </>
          ) : (
            <>
              <button className="btn primary" onClick={needLogin(() => nav(`/messages/${owner._id}?listing=${l._id}`))}>Message {owner.name.split(' ')[0]}</button>
              <button className="btn ghost" onClick={needLogin(() => setRequest(true))}>Send roommate request</button>
              <button className="btn ghost" aria-pressed={!!faved} onClick={needLogin(async () => {
                try { toast((await toggleFav(l._id)) ? 'Saved to your list' : 'Removed from saved'); } catch (e) { toast(errMsg(e), 'err'); }
              })}>{faved ? '♥ Saved' : '♡ Save room'}</button>
              <button className="linkish" onClick={needLogin(() => setReport(true))}>Report this listing</button>
            </>
          )}
        </aside>
      </div>
      {report && <ReportModal targetType="listing" targetId={l._id} onClose={() => setReport(false)} />}
      {request && <RequestModal person={owner} listingId={l._id} onClose={() => setRequest(false)} />}
    </div>
  );
}
