import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { Modal, Pagination, useToast, Empty } from '../components/ui.jsx';
import { fmtDate, money, TYPE_LABEL } from '../utils.js';

export function AdminLayout() {
  return (
    <div className="admin">
      <aside className="admin-nav">
        <h2>Admin</h2>
        <NavLink end to="/admin">Overview</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
        <NavLink to="/admin/listings">Rooms</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
      </aside>
      <div className="admin-main"><Outlet /></div>
    </div>
  );
}

export function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/admin/stats').then((r) => setS(r.data)); }, []);
  if (!s) return <p className="muted">Loading…</p>;
  const tiles = [
    ['Open reports', s.openReports, '/admin/reports', s.openReports > 0],
    ['Users', s.users, '/admin/users'], ['Suspended users', s.banned, '/admin/users?status=banned'],
    ['Live rooms', s.active, '/admin/listings'], ['Removed rooms', s.removed, '/admin/listings?status=removed'],
    ['Pending requests', s.pendingRequests], ['Messages sent', s.messages]
  ];
  return (
    <>
      <h1>Overview</h1>
      <div className="tiles">
        {tiles.map(([label, n, to, hot]) => {
          const inner = <><strong>{n}</strong><span>{label}</span></>;
          return to ? <Link key={label} to={to} className={`tile ${hot ? 'hot' : ''}`}>{inner}</Link> : <div key={label} className="tile">{inner}</div>;
        })}
      </div>
      <h2>Newest members</h2>
      <table className="table"><tbody>
        {s.recentUsers.map((u) => <tr key={u._id}><td>{u.name}</td><td className="muted">{u.email}</td><td className="muted">{fmtDate(u.createdAt)}</td></tr>)}
      </tbody></table>
    </>
  );
}

function useList(path, initial = {}) {
  const [filters, setFilters] = useState({ page: 1, ...initial });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const load = () => {
    setLoading(true);
    return api.get(path, { params: filters }).then((r) => setData(r.data)).catch((e) => toast(errMsg(e), 'err')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [JSON.stringify(filters)]); // eslint-disable-line
  return { data, filters, setFilters, load, loading, toast };
}

export function AdminUsers() {
  const { data, filters, setFilters, load, loading, toast } = useList('/admin/users', Object.fromEntries(new URLSearchParams(window.location.search)));
  const [q, setQ] = useState(filters.q || '');
  const act = async (fn, ok) => { try { await fn(); toast(ok); load(); } catch (e) { toast(errMsg(e), 'err'); } };

  return (
    <>
      <h1>Users <span className="muted">({data.total})</span></h1>
      <form className="toolbar" onSubmit={(e) => { e.preventDefault(); setFilters({ ...filters, q, page: 1 }); }}>
        <input aria-label="Search users" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Status" value={filters.status || ''} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}><option value="">All users</option><option value="banned">Suspended</option></select>
        <button className="btn ghost">Search</button>
      </form>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Rooms</th><th>Joined</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {data.items.map((u) => (
            <tr key={u._id}>
              <td><Link to={`/people/${u._id}`}>{u.name}</Link></td><td className="muted">{u.email}</td><td>{u.listingCount}</td><td className="muted">{fmtDate(u.createdAt)}</td>
              <td>{u.isBanned ? <span className="status bad">Suspended</span> : u.role === 'admin' ? <span className="status good">Admin</span> : <span className="status">Active</span>}</td>
              <td className="actions">
                {u.role !== 'admin' && (u.isBanned
                  ? <button className="btn ghost sm" onClick={() => act(() => api.put(`/admin/users/${u._id}`, { isBanned: false }), 'User reinstated')}>Reinstate</button>
                  : <button className="btn ghost sm" onClick={() => window.confirm(`Suspend ${u.name}? Their rooms will be hidden.`) && act(() => api.put(`/admin/users/${u._id}`, { isBanned: true }), 'User suspended')}>Suspend</button>)}
                {!u.isBanned && <button className="btn ghost sm" onClick={() => act(() => api.put(`/admin/users/${u._id}`, { role: u.role === 'admin' ? 'user' : 'admin' }), u.role === 'admin' ? 'Admin removed' : 'Made admin')}>{u.role === 'admin' ? 'Remove admin' : 'Make admin'}</button>}
                {u.role !== 'admin' && <button className="btn danger-ghost sm" onClick={() => window.confirm(`Permanently delete ${u.name} and all their data?`) && act(() => api.delete(`/admin/users/${u._id}`), 'User deleted')}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      {!loading && data.items.length === 0 && <Empty title="No users found">Try a different search.</Empty>}
      <Pagination page={data.page} pages={data.pages} onChange={(page) => setFilters({ ...filters, page })} />
    </>
  );
}

export function AdminListings() {
  const { data, filters, setFilters, load, loading, toast } = useList('/admin/listings', Object.fromEntries(new URLSearchParams(window.location.search)));
  const [q, setQ] = useState(filters.q || '');
  const [removing, setRemoving] = useState(null);
  const [reason, setReason] = useState('');
  const act = async (fn, ok) => { try { await fn(); toast(ok); load(); } catch (e) { toast(errMsg(e), 'err'); } };

  return (
    <>
      <h1>Rooms <span className="muted">({data.total})</span></h1>
      <form className="toolbar" onSubmit={(e) => { e.preventDefault(); setFilters({ ...filters, q, page: 1 }); }}>
        <input aria-label="Search rooms" placeholder="Search title or area" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Status" value={filters.status || ''} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}><option value="">All rooms</option><option value="active">Live</option><option value="removed">Hidden or removed</option></select>
        <button className="btn ghost">Search</button>
      </form>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Room</th><th>Owner</th><th>Rent</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {data.items.map((l) => (
            <tr key={l._id}>
              <td><Link to={`/rooms/${l._id}`}>{l.title}</Link><p className="muted small">{TYPE_LABEL[l.type]} · {l.locality}, {l.city}</p></td>
              <td className="muted">{l.owner?.name}<p className="small">{l.owner?.email}</p></td><td>{money(l.rent)}</td>
              <td>{l.isActive ? <span className="status good">Live</span> : <span className="status bad" title={l.removedReason}>{l.removedReason ? 'Removed' : 'Paused'}</span>}</td>
              <td className="actions">
                {l.isActive
                  ? <button className="btn ghost sm" onClick={() => { setRemoving(l); setReason(''); }}>Remove</button>
                  : <button className="btn ghost sm" onClick={() => act(() => api.put(`/admin/listings/${l._id}/status`, { isActive: true }), 'Listing restored')}>Restore</button>}
                <button className="btn danger-ghost sm" onClick={() => window.confirm('Permanently delete this listing?') && act(() => api.delete(`/admin/listings/${l._id}`), 'Listing deleted')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      {!loading && data.items.length === 0 && <Empty title="No rooms found">Try a different search.</Empty>}
      <Pagination page={data.page} pages={data.pages} onChange={(page) => setFilters({ ...filters, page })} />
      {removing && (
        <Modal title="Remove listing" onClose={() => setRemoving(null)}>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); act(() => api.put(`/admin/listings/${removing._id}/status`, { isActive: false, reason }), 'Listing removed').then(() => setRemoving(null)); }}>
            <p>"{removing.title}" will be hidden from search. The owner will see your reason.</p>
            <label className="field"><span>Reason</span><textarea rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Misleading price" required /></label>
            <button className="btn danger">Remove listing</button>
          </form>
        </Modal>
      )}
    </>
  );
}

export function AdminReports() {
  const { data, filters, setFilters, load, loading, toast } = useList('/admin/reports', { status: 'open' });
  const resolve = async (r, status, action) => {
    try {
      await api.put(`/admin/reports/${r._id}`, { status, action, note: action === 'remove-listing' ? `Removed after report: ${r.reason}` : '' });
      toast(status === 'dismissed' ? 'Report dismissed' : 'Report resolved');
      load();
    } catch (e) { toast(errMsg(e), 'err'); }
  };
  return (
    <>
      <h1>Reports <span className="muted">({data.total})</span></h1>
      <div className="tabs">
        {[['open', 'Open'], ['resolved', 'Resolved'], ['dismissed', 'Dismissed'], ['', 'All']].map(([v, l]) => (
          <button key={l} className={(filters.status || '') === v ? 'on' : ''} onClick={() => setFilters({ ...filters, status: v, page: 1 })}>{l}</button>
        ))}
      </div>
      {!loading && data.items.length === 0 && <Empty title="No reports here">Nothing needs your attention.</Empty>}
      <div className="rows">
        {data.items.map((r) => (
          <div className="row-card top" key={r._id}>
            <div className="grow">
              <p><span className={`status ${r.status === 'open' ? 'warn' : r.status === 'resolved' ? 'good' : ''}`}>{r.status}</span> <strong className="cap">{r.reason}</strong> · reported {r.targetType} · {fmtDate(r.createdAt)}</p>
              {r.targetType === 'listing' && r.targetListing && <p>Room: <Link to={`/rooms/${r.targetListing._id}`}>{r.targetListing.title}</Link> {!r.targetListing.isActive && <span className="status bad">hidden</span>}</p>}
              {r.targetUser && <p>User: {r.targetUser.name} <span className="muted">({r.targetUser.email})</span> {r.targetUser.isBanned && <span className="status bad">suspended</span>}</p>}
              {r.details && <p className="quote">{r.details}</p>}
              <p className="muted small">Reported by {r.reporter?.name || 'a deleted user'}{r.adminNote ? ` · Note: ${r.adminNote}` : ''}</p>
            </div>
            {r.status === 'open' && (
              <div className="row-actions col">
                {r.targetType === 'listing' && r.targetListing?.isActive && <button className="btn danger sm" onClick={() => resolve(r, 'resolved', 'remove-listing')}>Remove listing</button>}
                {r.targetUser && !r.targetUser.isBanned && <button className="btn danger-ghost sm" onClick={() => window.confirm(`Suspend ${r.targetUser.name}?`) && resolve(r, 'resolved', 'ban-user')}>Suspend user</button>}
                <button className="btn ghost sm" onClick={() => resolve(r, 'resolved')}>Mark resolved</button>
                <button className="btn ghost sm" onClick={() => resolve(r, 'dismissed')}>Dismiss</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Pagination page={data.page} pages={data.pages} onChange={(page) => setFilters({ ...filters, page })} />
    </>
  );
}
