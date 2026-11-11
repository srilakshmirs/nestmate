import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { ListingCard } from '../components/Cards.jsx';
import { Pagination, Empty, Field } from '../components/ui.jsx';
import { AMENITIES, TYPE_LABEL } from '../utils.js';

const BLANK = { q: '', city: '', locality: '', type: '', minRent: '', maxRent: '', furnished: '', gender: '', amenities: '', sort: 'newest' };

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [f, setF] = useState({ ...BLANK, ...Object.fromEntries(params) });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const key = params.toString();

  useEffect(() => {
    setLoading(true);
    api.get('/listings', { params: Object.fromEntries(params) })
      .then((r) => { setData(r.data); setError(''); })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0 });
  }, [key]); // eslint-disable-line

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target.checked ? 'true' : '') : e.target.value });
  const apply = (e, extra = {}) => {
    e?.preventDefault();
    const merged = { ...f, ...extra };
    setParams(Object.fromEntries(Object.entries(merged).filter(([k, v]) => v && !(k === 'sort' && v === 'newest'))));
  };
  const toggleAmenity = (a) => {
    const cur = f.amenities ? f.amenities.split(',') : [];
    const next = cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a];
    setF({ ...f, amenities: next.join(',') });
  };
  const reset = () => { setF(BLANK); setParams({}); };

  return (
    <div className="layout">
      <aside className="filters">
        <form onSubmit={apply} className="stack">
          <h2>Filters</h2>
          <Field label="Search"><input value={f.q} onChange={set('q')} placeholder="Keyword, e.g. balcony" /></Field>
          <Field label="City"><input value={f.city} onChange={set('city')} placeholder="Bengaluru" /></Field>
          <Field label="Locality"><input value={f.locality} onChange={set('locality')} placeholder="Koramangala" /></Field>
          <Field label="Room type">
            <select value={f.type} onChange={set('type')}>
              <option value="">Any</option>
              {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <div className="row2">
            <Field label="Min rent"><input type="number" min="0" step="500" value={f.minRent} onChange={set('minRent')} /></Field>
            <Field label="Max rent"><input type="number" min="0" step="500" value={f.maxRent} onChange={set('maxRent')} /></Field>
          </div>
          <Field label="Suitable for">
            <select value={f.gender} onChange={set('gender')}>
              <option value="">Anyone</option><option value="male">Men</option><option value="female">Women</option>
            </select>
          </Field>
          <label className="check"><input type="checkbox" checked={f.furnished === 'true'} onChange={set('furnished')} /> Furnished only</label>
          <fieldset>
            <legend>Amenities</legend>
            <div className="checks">
              {AMENITIES.map((a) => (
                <label key={a} className="check"><input type="checkbox" checked={f.amenities.split(',').includes(a)} onChange={() => toggleAmenity(a)} /> {a}</label>
              ))}
            </div>
          </fieldset>
          <button className="btn primary">Apply filters</button>
          <button type="button" className="btn ghost" onClick={reset}>Clear all</button>
        </form>
      </aside>

      <section className="results">
        <div className="results-head">
          <h1>{data.total} {data.total === 1 ? 'room' : 'rooms'}</h1>
          <label className="inline">Sort
            <select value={f.sort} onChange={(e) => { setF({ ...f, sort: e.target.value }); apply(null, { sort: e.target.value }); }}>
              <option value="newest">Newest</option><option value="price_asc">Rent: low to high</option>
              <option value="price_desc">Rent: high to low</option><option value="available">Available soonest</option>
            </select>
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        {loading ? <p className="muted">Loading rooms…</p> : data.items.length === 0 ? (
          <Empty title="No rooms match these filters">Try a wider rent range or remove a few amenities.</Empty>
        ) : (
          <div className="grid">{data.items.map((l) => <ListingCard key={l._id} listing={l} />)}</div>
        )}
        <Pagination page={data.page} pages={data.pages} onChange={(p) => setParams({ ...Object.fromEntries(params), page: p })} />
      </section>
    </div>
  );
}
