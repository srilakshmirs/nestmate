import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api.get('/auth/me').then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const { data } = await api.post(path, body);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };
  const login = (email, password) => authenticate('/auth/login', { email, password });
  const register = (name, email, password) => authenticate('/auth/register', { name, email, password });
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const refresh = useCallback(() => api.get('/auth/me').then((r) => { setUser(r.data); return r.data; }), []);
  const toggleFav = async (id) => {
    const { data } = await api.post(`/listings/${id}/favorite`);
    setUser((u) => ({ ...u, favorites: data.favorites }));
    return data.favorited;
  };

  return <Ctx.Provider value={{ user, setUser, loading, login, register, logout, refresh, toggleFav }}>{children}</Ctx.Provider>;
}
