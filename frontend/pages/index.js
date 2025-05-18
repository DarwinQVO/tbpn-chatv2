import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState([]);
  const [chatReady, setChatReady] = useState(false);

  const handleProcess = async () => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    setLogs(l => [...l, `Job ${data.id} creado`]);
  };

  return (
    <div style={{ background: '#111', color: '#fff', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Audio-Text Tool</h1>
      <div>
        <input style={{ width: '60%' }} value={url} onChange={e => setUrl(e.target.value)} placeholder="URL de video/canal/playlist" />
        <button onClick={handleProcess}>Procesar</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h2>Logs</h2>
        <pre>{logs.join('\n')}</pre>
      </div>
      {chatReady && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Chat</h2>
          {/* TODO: implementar chat */}
        </div>
      )}
    </div>
  );
}
