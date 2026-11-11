import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar, ScoreRing } from '../components/ui.jsx';
import { ConnectButton, ReportModal } from '../components/Cards.jsx';
import { money, fmtDate, LIFESTYLE_LABEL, cleanLabel } from '../utils.js';

export default function PersonProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [report, setReport] = useState(false);
  const load = () => api.get(`/roommates/${id}`).then((r) => setP(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, [id, user?._id]); // eslint-disable-line

  if (error) return <div className="page-pad"><p className="error">{error}</p></div>;
  if (!p) return <div className="page-pad muted">Loading…</div>;
  const l = p.lifestyle || {};
  const self = user && String(user._id) === String(p._id);

  return (
    <div className="page-pad">
      <div className="profile-head">
        <Avatar user={p} size={96} />
        <div className="grow">
          <h1>{p.name}</h1>
          <p className="muted">{[p.age, p.gender, p.occupation].filter(Boolean).join(' · ')}</p>
          <p className="muted">{p.city || 'Location not shared'}{p.seeking ? ' · Looking for a place' : ''}</p>
        </div>
        <ScoreRing value={p.compatibility} size={88} />
      </div>

      <div className="profile-actions">
        {self ? <Link className="btn primary" to="/profile">Edit my profile</Link> : (
          <>
            <ConnectButton person={p} onChange={load} />
            {p.relation?.status === 'accepted'
              ? null
              : <button className="btn ghost sm" onClick={() => (user ? nav(`/messages/${p._id}`) : nav('/login'))}>Message</button>}
            {user && <button className="linkish" onClick={() => setReport(true)}>Report</button>}
          </>
        )}
      </div>

      {p.bio && <><h2>About</h2><p className="prewrap">{p.bio}</p></>}

      {p.seeking && (
        <>
          <h2>What they're looking for</h2>
          <dl className="facts-list">
            <div><dt>Budget</dt><dd>{money(p.budget?.min)} – {money(p.budget?.max)} per month</dd></div>
            <div><dt>Moving in</dt><dd>{fmtDate(p.moveInDate)}</dd></div>
            {p.preferredLocalities?.length > 0 && <div><dt>Areas</dt><dd>{p.preferredLocalities.join(', ')}</dd></div>}
          </dl>
        </>
      )}

      <h2>Living habits</h2>
      <div className="chips big">
        <span className="chip">{LIFESTYLE_LABEL.smoking[l.smoking]}</span>
        <span className="chip">{LIFESTYLE_LABEL.pets[l.pets]}</span>
        <span className="chip">{LIFESTYLE_LABEL.sleep[l.sleep]}</span>
        <span className="chip">{LIFESTYLE_LABEL.guests[l.guests]}</span>
        <span className="chip">{LIFESTYLE_LABEL.diet[l.diet]}</span>
        <span className="chip">Tidiness: {cleanLabel[l.cleanliness]}</span>
      </div>
      {report && <ReportModal targetType="user" targetId={p._id} onClose={() => setReport(false)} />}
    </div>
  );
}
