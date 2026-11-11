import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { Field, useToast } from '../components/ui.jsx';
import { AMENITIES, TYPE_LABEL, inputDate } from '../utils.js';

const BLANK = {
  title: '', description: '', type: 'private-room', rent: '', deposit: '', city: '', locality: '', address: '',
  bedrooms: 1, bathrooms: 1, currentRoommates: 0, furnished: false, genderPreference: 'any',
  availableFrom: inputDate(new Date()), amenities: [], rules: { smoking: false, pets: false, guests: true }
};

export default function ListingForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [f, setF] = useState(BLANK);
  const [existing, setExisting] = useState([]);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/listings/${id}`).then(({ data }) => {
      setF({ ...BLANK, ...data, availableFrom: inputDate(data.availableFrom) });
      setExisting(data.images);
    }).catch((e) => setError(errMsg(e)));
  }, [id]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const rule = (k) => (e) => setF({ ...f, rules: { ...f.rules, [k]: e.target.checked } });
  const toggleAmenity = (a) => setF({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] });

  const pick = (e) => {
    const chosen = [...e.target.files];
    if (existing.length + files.length + chosen.length > 8) return setError('You can add up to 8 photos');
    setError('');
    setFiles([...files, ...chosen]);
    e.target.value = '';
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const fd = new FormData();
    ['title', 'description', 'type', 'rent', 'deposit', 'city', 'locality', 'address', 'bedrooms', 'bathrooms',
      'currentRoommates', 'furnished', 'genderPreference', 'availableFrom'].forEach((k) => fd.append(k, f[k] ?? ''));
    fd.append('amenities', JSON.stringify(f.amenities));
    fd.append('rules', JSON.stringify(f.rules));
    if (id) fd.append('keepImages', JSON.stringify(existing));
    files.forEach((file) => fd.append('images', file));
    try {
      const { data } = id ? await api.put(`/listings/${id}`, fd) : await api.post('/listings', fd);
      toast(id ? 'Changes saved' : 'Room posted');
      nav(`/rooms/${data._id}`);
    } catch (er) { setError(errMsg(er)); setBusy(false); }
  };

  return (
    <form className="form-page" onSubmit={submit}>
      <h1>{id ? 'Edit your room' : 'Post a room'}</h1>
      {error && <p className="error" role="alert">{error}</p>}

      <fieldset className="panel">
        <legend>The basics</legend>
        <Field label="Title"><input value={f.title} onChange={set('title')} maxLength="120" required placeholder="Sunny room near the metro" /></Field>
        <Field label="Description"><textarea rows="5" value={f.description} onChange={set('description')} required placeholder="Describe the room, the flat, and the people who live there." /></Field>
        <div className="row3">
          <Field label="Type">
            <select value={f.type} onChange={set('type')}>{Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </Field>
          <Field label="Monthly rent (₹)"><input type="number" min="0" value={f.rent} onChange={set('rent')} required /></Field>
          <Field label="Deposit (₹)"><input type="number" min="0" value={f.deposit} onChange={set('deposit')} /></Field>
        </div>
      </fieldset>

      <fieldset className="panel">
        <legend>Location</legend>
        <div className="row3">
          <Field label="City"><input value={f.city} onChange={set('city')} required /></Field>
          <Field label="Locality"><input value={f.locality} onChange={set('locality')} required /></Field>
          <Field label="Street address (optional)"><input value={f.address} onChange={set('address')} /></Field>
        </div>
      </fieldset>

      <fieldset className="panel">
        <legend>The place</legend>
        <div className="row4">
          <Field label="Bedrooms"><input type="number" min="0" value={f.bedrooms} onChange={set('bedrooms')} /></Field>
          <Field label="Bathrooms"><input type="number" min="0" value={f.bathrooms} onChange={set('bathrooms')} /></Field>
          <Field label="Current flatmates"><input type="number" min="0" value={f.currentRoommates} onChange={set('currentRoommates')} /></Field>
          <Field label="Available from"><input type="date" value={f.availableFrom} onChange={set('availableFrom')} /></Field>
        </div>
        <Field label="Suitable for">
          <select value={f.genderPreference} onChange={set('genderPreference')}>
            <option value="any">Anyone</option><option value="male">Men only</option><option value="female">Women only</option>
          </select>
        </Field>
        <label className="check"><input type="checkbox" checked={f.furnished} onChange={set('furnished')} /> Furnished</label>
        <div className="checks wide">
          {AMENITIES.map((a) => <label key={a} className="check"><input type="checkbox" checked={f.amenities.includes(a)} onChange={() => toggleAmenity(a)} /> {a}</label>)}
        </div>
        <div className="checks wide">
          <label className="check"><input type="checkbox" checked={f.rules.smoking} onChange={rule('smoking')} /> Smoking allowed</label>
          <label className="check"><input type="checkbox" checked={f.rules.pets} onChange={rule('pets')} /> Pets allowed</label>
          <label className="check"><input type="checkbox" checked={f.rules.guests} onChange={rule('guests')} /> Guests allowed</label>
        </div>
      </fieldset>

      <fieldset className="panel">
        <legend>Photos</legend>
        <div className="photo-grid">
          {existing.map((src) => (
            <div key={src} className="photo"><img src={src} alt="" /><button type="button" onClick={() => setExisting(existing.filter((s) => s !== src))} aria-label="Remove photo">✕</button></div>
          ))}
          {files.map((file, i) => (
            <div key={i} className="photo"><img src={URL.createObjectURL(file)} alt="" /><button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remove photo">✕</button></div>
          ))}
        </div>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={pick} />
        <small className="muted">JPG, PNG or WebP, up to 5 MB each. Maximum 8 photos.</small>
      </fieldset>

      <div className="form-actions">
        <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes' : 'Post room'}</button>
        <button type="button" className="btn ghost" onClick={() => nav(-1)}>Cancel</button>
      </div>
    </form>
  );
}
