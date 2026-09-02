import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the role selection screen', () => {
    render(<App />);

    expect(screen.getByText('¿Cómo quieres entrar?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Soy jugador/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Soy club/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Soy entrenador/i })).toBeInTheDocument();
  });

  it('opens advanced filters for courts, players, and tournaments', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Buscar' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));

    expect(screen.getByRole('heading', { name: 'Filtros avanzados' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Canchas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jugadores' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Torneos' })).toBeInTheDocument();
  });
});
