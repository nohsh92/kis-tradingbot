import type { CSSProperties } from 'react';
const statusStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #243244',
  backgroundColor: '#111827'
};

const chipsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  fontSize: '0.875rem'
};

const chipStyle: CSSProperties = {
  border: '1px solid #334155',
  borderRadius: '999px',
  padding: '0.25rem 0.75rem',
  backgroundColor: '#0f172a'
};

export const StatusBar = (): JSX.Element => (
  <header style={statusStyle}>
    <strong>Terminal UI</strong>
    <div style={chipsStyle}>
      <span style={chipStyle}>ENV: Local</span>
      <span style={chipStyle}>Backend: Unknown</span>
      <span style={chipStyle}>WS: Disconnected</span>
      <span style={chipStyle}>Platform: {window.desktop?.platform ?? 'web'}</span>
    </div>
  </header>
);
