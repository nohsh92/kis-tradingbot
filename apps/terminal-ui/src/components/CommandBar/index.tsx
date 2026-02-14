import type { CSSProperties } from 'react';
const commandBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  borderTop: '1px solid #243244',
  padding: '0.75rem 1rem',
  backgroundColor: '#111827'
};

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: '0.5rem',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: '#e5e7eb',
  padding: '0.65rem 0.85rem'
};

export const CommandBar = (): JSX.Element => (
  <footer style={commandBarStyle}>
    <input style={inputStyle} placeholder="Global command bar mount point" readOnly />
  </footer>
);
