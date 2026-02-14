import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { resolvePanelRoute } from '../../app/routes';
import { parseCommand } from './parser';

const commandBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  borderTop: '1px solid #243244',
  padding: '0.75rem 1rem',
  backgroundColor: '#111827',
  gap: '0.75rem'
};

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: '0.5rem',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: '#e5e7eb',
  padding: '0.65rem 0.85rem'
};

const resultStyle: CSSProperties = {
  color: '#93c5fd',
  minWidth: '280px',
  fontSize: '0.875rem'
};

export const CommandBar = (): JSX.Element => {
  const [value, setValue] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setActive(true);
        requestAnimationFrame(() => {
          (document.getElementById('terminal-command-input') as HTMLInputElement | null)?.focus();
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const preview = useMemo(() => {
    const intent = parseCommand(value);
    if (!intent) {
      return 'Ready';
    }

    const route = resolvePanelRoute(intent);
    return route.symbol ? `Open ${route.panel} (${route.symbol})` : `Open ${route.panel}`;
  }, [value]);

  return (
    <footer style={commandBarStyle}>
      <input
        id="terminal-command-input"
        style={inputStyle}
        placeholder="Ctrl+K → enter symbol or GO command (e.g. 005930 QUOTE)"
        value={value}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onChange={(event) => setValue(event.target.value)}
      />
      <div style={resultStyle}>{active ? preview : 'Press Ctrl+K'}</div>
    </footer>
  );
};
