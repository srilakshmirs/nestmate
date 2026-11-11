import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar, Empty } from '../components/ui.jsx';
import { timeAgo } from '../utils.js';

export default function Messages() {
  const { userId } = useParams();
  const [search] = useSearchParams();
  const listingId = search.get('listing') || undefined;
  const { user } = useAuth();
  const [convos, setConvos] = useState([]);
  const [thread, setThread] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const bottom = useRef(null);

  const loadConvos = () => api.get('/messages/conversations').then((r) => setConvos(r.data)).catch(() => {});
  const loadThread = () => userId && api.get(`/messages/thread/${userId}`).then((r) => { setThread(r.data); }).catch((e) => setError(errMsg(e)));

  useEffect(() => { loadConvos(); const t = setInterval(loadConvos, 10000); return () => clearInterval(t); }, []);
  useEffect(() => {
    setThread(null); setError('');
    loadThread();
    const t = setInterval(loadThread, 5000);
    return () => clearInterval(t);
  }, [userId]); // eslint-disable-line
  useEffect(() => { bottom.current?.scrollIntoView({ block: 'end' }); }, [thread?.messages?.length]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post('/messages', { recipient: userId, text, listing: listingId });
      setText(''); setError('');
      await loadThread(); loadConvos();
    } catch (er) { setError(errMsg(er)); }
  };

  return (
    <div className={`chat ${userId ? 'has-thread' : ''}`}>
      <aside className="chat-list">
        <h1>Messages</h1>
        {convos.length === 0 && <p className="muted pad">No conversations yet. Message a lister from a room page, or accept a roommate request.</p>}
        {convos.map((c) => (
          <Link key={c.thread} to={`/messages/${c.user._id}`} className={`convo ${c.user._id === userId ? 'on' : ''}`}>
            <Avatar user={c.user} size={42} />
            <div className="grow">
              <strong>{c.user.name}</strong>
              <p className="muted small clip">{c.last.mine ? 'You: ' : ''}{c.last.text}</p>
            </div>
            {c.unread > 0 && <span className="badge">{c.unread}</span>}
          </Link>
        ))}
      </aside>

      <section className="chat-thread">
        {!userId ? <Empty title="Select a conversation">Your chats with flatmates and listers appear here.</Empty> : (
          <>
            <header className="thread-head">
              <Link to="/messages" className="back" aria-label="Back to conversations">←</Link>
              {thread && <><Avatar user={thread.user} size={36} /><Link to={`/people/${thread.user._id}`}><strong>{thread.user.name}</strong></Link></>}
            </header>
            <div className="bubbles">
              {thread?.messages.length === 0 && <p className="muted center">No messages yet. {thread.canChat ? 'Say hello!' : ''}</p>}
              {thread?.messages.map((m) => (
                <div key={m._id} className={`bubble ${String(m.sender) === String(user._id) ? 'mine' : ''}`}>
                  <p>{m.text}</p><small>{timeAgo(m.createdAt)}</small>
                </div>
              ))}
              <div ref={bottom} />
            </div>
            {error && <p className="error pad" role="alert">{error}</p>}
            {thread && !thread.canChat && !listingId && thread.messages.length === 0 && (
              <p className="banner">You can chat once this person accepts your <Link to={`/people/${userId}`}>roommate request</Link>.</p>
            )}
            <form className="composer" onSubmit={send}>
              <input aria-label="Message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" maxLength="2000" />
              <button className="btn primary">Send</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
