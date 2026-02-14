import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from '../app/AppShell';

describe('AppShell', () => {
  it('renders baseline layout placeholders', () => {
    render(<AppShell />);

    expect(screen.getByText('ENV: Local')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Global command bar mount point')).toBeInTheDocument();
    expect(screen.getByText('Docking container root placeholder')).toBeInTheDocument();
  });
});
