import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { RoommateCard } from '../components/Cards.jsx';
import { Empty, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const BLANK = { q: '', city: '', minBudget: '', maxBudget: '', gender: '', smoking: '', pets: '', sleep: '' };

export default function Roommates() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [f, setF] = useState({ ...BLANK, ...Object.fromEntries(params) });
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const key = params.toString();

  const load = () => api.get('/roommates', { params: Object.fromEntries(params) })
    .then((r) => { setPeople(r.data); setError(''); }).catch((e) => setError(errMsg(e))).finally(() => setLoading(false));
  useEffect(() => { setLoading(true); load(); }, [key, user?._id]); // eslint-disable-line

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const apply = (e) => { e.preventDefault(); setParams(Object.fromEntries(Object.entries(f).filter(([, v]) => v))); };

  return (
    <div className="page-pad wide">
      <div className="results-head">
        <div>
          <h1>Find a flatmate</h1>
          <p className="muted">{user ? 'Sorted by how well each person fits your budget, habits and move-in date.' : 'Log in to see your compatibility with each person.'}</p>
        </div>
      </div>
      {user && !user.seeking && (
        <div className="banner">You're not listed here yet. <Link to="/profile">Turn on "show me in Flatmates" in your profile</Link> so others can find you.</div>
      )}
      <form className="filter-bar" onSubmit={apply}>
        <Field label="Search"><input value={f.q} onChange={set('q')} placeholder="Name, job, interests" /></Field>
        <Field label="City"><input value={f.city} onChange={set('city')} /></Field>
        <Field label="Budget from"><input type="number" min="0" step="500" value={f.minBudget} onChange={set('minBudget')} /></Field>
        <Field label="Budget up to"><input type="number" min="0" step="500" value={f.maxBudget} onChange={set('maxBudget')} /></Field>
        <Field label="Gender">
          <select value={f.gender} onChange={set('gender')}><option value="">Any</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option></select>
        </Field>
        <Field label="Smoking">
          <select value={f.smoking} onChange={set('smoking')}><option value="">Any</option><option value="no">Non-smoker</option><option value="outside">Outside only</option><option value="yes">Smoker</option></select>
        </Field>
        <Field label="Sleep">
          <select value={f.sleep} onChange={set('sleep')}><option value="">Any</option><option value="early">Early riser</option><option value="flexible">Flexible</option><option value="night">Night owl</option></select>
        </Field>
        <div className="filter-actions">
          <button className="btn primary">Search</button>
          <button type="button" className="btn ghost" onClick={() => { setF(BLANK); setParams({}); }}>Clear</button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {loading ? <p className="muted">Loading…</p> : people.length === 0 ? (
        <Empty title="No flatmates match yet">Try removing a filter, or check back soon as new people join.</Empty>
      ) : <div className="grid">{people.map((p) => <RoommateCard key={p._id} person={p} onChange={load} />)}</div>}
    </div>
  );
}
