import type { CSSProperties } from 'react';
const dockingStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  margin: '1rem',
  borderRadius: '0.75rem',
  border: '1px dashed #334155',
  backgroundColor: '#0f172a',
  color: '#93c5fd',
  fontSize: '1rem'
};

export const Docking = (): JSX.Element => (
  <main style={dockingStyle}>
    <div id="docking-root">Docking container root placeholder</div>
  </main>
);
