import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar, Field, useToast } from '../components/ui.jsx';
import { inputDate } from '../utils.js';

export default function MyProfile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const loc = useLocation();
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    setF({
      name: user.name, bio: user.bio || '', age: user.age || '', gender: user.gender || '', occupation: user.occupation || '', city: user.city || '',
      seeking: !!user.seeking, budgetMin: user.budget?.min || '', budgetMax: user.budget?.max || '', moveInDate: inputDate(user.moveInDate),
      localities: (user.preferredLocalities || []).join(', '), lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 3, sleep: 'flexible', guests: 'sometimes', diet: 'any', ...user.lifestyle }
    });
  }, []); // eslint-disable-line
  if (!f) return null;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const life = (k) => (e) => setF({ ...f, lifestyle: { ...f.lifestyle, [k]: k === 'cleanliness' ? Number(e.target.value) : e.target.value } });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put('/auth/me', {
        name: f.name, bio: f.bio, age: f.age, gender: f.gender, occupation: f.occupation, city: f.city, seeking: f.seeking,
        budget: { min: Number(f.budgetMin) || 0, max: Number(f.budgetMax) || 0 }, moveInDate: f.moveInDate || null,
        preferredLocalities: f.localities.split(',').map((s) => s.trim()).filter(Boolean), lifestyle: f.lifestyle
      });
      setUser(data);
      toast('Profile saved');
    } catch (er) { toast(errMsg(er), 'err'); }
    setBusy(false);
  };

  const avatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try { setUser((await api.post('/auth/me/avatar', fd)).data); toast('Photo updated'); } catch (er) { toast(errMsg(er), 'err'); }
  };

  const changePw = async (e) => {
    e.preventDefault();
    try { await api.put('/auth/password', pw); setPw({ currentPassword: '', newPassword: '' }); toast('Password updated'); } catch (er) { toast(errMsg(er), 'err'); }
  };

  return (
    <div className="form-page">
      <h1>My profile</h1>
      {loc.state?.welcome && <div className="banner">Welcome to Nestmate. Fill in your details and turn on Flatmates to be found by people looking for a place.</div>}
      <div className="panel avatar-row">
        <Avatar user={user} size={84} />
        <label className="btn ghost sm">Change photo<input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={avatar} /></label>
      </div>

      <form onSubmit={save} className="stack-lg">
        <fieldset className="panel">
          <legend>About you</legend>
          <div className="row2">
            <Field label="Full name"><input value={f.name} onChange={set('name')} required /></Field>
            <Field label="Occupation"><input value={f.occupation} onChange={set('occupation')} placeholder="e.g. Software engineer" /></Field>
          </div>
          <div className="row3">
            <Field label="Age"><input type="number" min="18" max="99" value={f.age} onChange={set('age')} /></Field>
            <Field label="Gender">
              <select value={f.gender} onChange={set('gender')}>
                <option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="City"><input value={f.city} onChange={set('city')} /></Field>
          </div>
          <Field label="Bio"><textarea rows="3" maxLength="600" value={f.bio} onChange={set('bio')} placeholder="A few lines about your routine and what you want from a home." /></Field>
        </fieldset>

        <fieldset className="panel">
          <legend>Flatmate search</legend>
          <label className="check"><input type="checkbox" checked={f.seeking} onChange={set('seeking')} /> Show me in Flatmates so people can find and contact me</label>
          <div className="row3">
            <Field label="Budget from (₹)"><input type="number" min="0" step="500" value={f.budgetMin} onChange={set('budgetMin')} /></Field>
            <Field label="Budget up to (₹)"><input type="number" min="0" step="500" value={f.budgetMax} onChange={set('budgetMax')} /></Field>
            <Field label="Move-in date"><input type="date" value={f.moveInDate} onChange={set('moveInDate')} /></Field>
          </div>
          <Field label="Preferred areas" hint="Separate with commas"><input value={f.localities} onChange={set('localities')} placeholder="Indiranagar, HSR Layout" /></Field>
        </fieldset>

        <fieldset className="panel">
          <legend>Living habits (used for compatibility)</legend>
          <div className="row3">
            <Field label="Smoking"><select value={f.lifestyle.smoking} onChange={life('smoking')}><option value="no">Non-smoker</option><option value="outside">Smoke outside only</option><option value="yes">Smoker</option></select></Field>
            <Field label="Pets"><select value={f.lifestyle.pets} onChange={life('pets')}><option value="no">No pets please</option><option value="ok">Fine with pets</option><option value="have">I have a pet</option></select></Field>
            <Field label="Sleep schedule"><select value={f.lifestyle.sleep} onChange={life('sleep')}><option value="early">Early riser</option><option value="flexible">Flexible</option><option value="night">Night owl</option></select></Field>
            <Field label="Guests"><select value={f.lifestyle.guests} onChange={life('guests')}><option value="rarely">Rarely</option><option value="sometimes">Sometimes</option><option value="often">Often</option></select></Field>
            <Field label="Diet"><select value={f.lifestyle.diet} onChange={life('diet')}><option value="any">Eats anything</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option></select></Field>
            <Field label={`Tidiness: ${f.lifestyle.cleanliness} of 5`}><input type="range" min="1" max="5" value={f.lifestyle.cleanliness} onChange={life('cleanliness')} /></Field>
          </div>
        </fieldset>
        <div className="form-actions"><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></div>
      </form>

      <form onSubmit={changePw} className="panel stack">
        <h2>Change password</h2>
        <div className="row2">
          <Field label="Current password"><input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required /></Field>
          <Field label="New password"><input type="password" minLength="6" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required /></Field>
        </div>
        <div><button className="btn ghost">Update password</button></div>
      </form>
    </div>
  );
}
