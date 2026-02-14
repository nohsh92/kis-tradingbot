import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from '../app/AppShell';

describe('AppShell', () => {
  it('renders baseline terminal shell areas', () => {
    render(<AppShell />);

    expect(screen.getByText('ENV: Local')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ctrl\+K/)).toBeInTheDocument();
    expect(document.querySelector('.flexlayout__layout')).toBeInTheDocument();
  });
});
