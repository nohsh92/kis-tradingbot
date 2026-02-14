import type { CSSProperties } from 'react';
import { CommandBar } from '../components/CommandBar';
import { Docking } from '../components/Docking';
import { StatusBar } from '../components/StatusBar';

const shellStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: '56px 1fr 64px',
  height: '100vh',
  backgroundColor: '#0b1220',
  color: '#e5e7eb',
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
};

export const AppShell = (): JSX.Element => {
  return (
    <div style={shellStyle}>
      <StatusBar />
      <Docking />
      <CommandBar />
    </div>
  );
};
