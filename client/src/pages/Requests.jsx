import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { Avatar, Empty, useToast } from '../components/ui.jsx';
import { timeAgo } from '../utils.js';

export default function Requests() {
  const [tab, setTab] = useState('received');
  const [data, setData] = useState(null);
  const toast = useToast();
  const load = () => api.get('/requests').then((r) => setData(r.data)).catch((e) => toast(errMsg(e), 'err'));
  useEffect(() => { load(); }, []); // eslint-disable-line

  const respond = async (id, action) => {
    try { await api.put(`/requests/${id}/respond`, { action }); toast(action === 'accept' ? 'Request accepted. You can chat now.' : 'Request declined'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };
  const cancel = async (id) => {
    try { await api.delete(`/requests/${id}`); toast('Request cancelled'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };

  if (!data) return <div className="page-pad muted">Loading…</div>;
  const list = data[tab];
  const pending = data.received.filter((r) => r.status === 'pending').length;

  return (
    <div className="page-pad">
      <h1>Roommate requests</h1>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'received'} className={tab === 'received' ? 'on' : ''} onClick={() => setTab('received')}>Received{pending ? ` (${pending})` : ''}</button>
        <button role="tab" aria-selected={tab === 'sent'} className={tab === 'sent' ? 'on' : ''} onClick={() => setTab('sent')}>Sent</button>
      </div>
      {list.length === 0 ? (
        <Empty title={tab === 'received' ? 'No requests yet' : "You haven't sent any requests"}>
          {tab === 'received' ? 'Complete your profile and turn on Flatmates so people can find you.' : <>Find someone on the <Link to="/flatmates">Flatmates</Link> page.</>}
        </Empty>
      ) : (
        <div className="rows">
          {list.map((r) => {
            const other = tab === 'received' ? r.from : r.to;
            return (
              <div className="row-card top" key={r._id}>
                <Avatar user={other} size={48} />
                <div className="grow">
                  <Link to={`/people/${other._id}`}><strong>{other.name}</strong></Link>
                  <span className="muted small"> · {timeAgo(r.createdAt)}</span>
                  {r.listing && <p className="muted small">About: <Link to={`/rooms/${r.listing._id}`}>{r.listing.title}</Link></p>}
                  {r.message && <p className="quote">{r.message}</p>}
                  <span className={`status ${r.status === 'accepted' ? 'good' : r.status === 'pending' ? 'warn' : ''}`}>{r.status}</span>
                </div>
                <div className="row-actions">
                  {tab === 'received' && r.status === 'pending' && (<>
                    <button className="btn primary sm" onClick={() => respond(r._id, 'accept')}>Accept</button>
                    <button className="btn ghost sm" onClick={() => respond(r._id, 'reject')}>Decline</button>
                  </>)}
                  {tab === 'sent' && r.status === 'pending' && <button className="btn ghost sm" onClick={() => cancel(r._id)}>Cancel</button>}
                  {r.status === 'accepted' && <Link className="btn primary sm" to={`/messages/${other._id}`}>Open chat</Link>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
