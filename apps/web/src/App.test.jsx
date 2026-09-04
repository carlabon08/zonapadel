import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the role selection screen', () => {
    render(<App />);

    expect(screen.getByText('¿Cómo quieres entrar?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Soy jugador/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Soy club/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Soy entrenador/i })).toBeInTheDocument();
  });

  it('opens the selected search filters directly', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));

    expect(screen.getByRole('heading', { name: 'Filtros de pool de partidos' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Pool de partidos' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Canchas' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Jugadores' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Género del partido' })).toHaveValue('femenino');
    expect(screen.getByText('Jugadores disponibles dentro de un radio de 10 km.')).toBeInTheDocument();
    expect(screen.queryByText('Agustín Tapia')).not.toBeInTheDocument();
    expect(screen.getAllByText('Delfi Brea').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByRole('combobox', { name: 'Género del partido' }), { target: { value: 'mixto' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Nivel del partido' }), { target: { value: '7ma' } });

    fireEvent.click(screen.getByRole('tab', { name: 'Jugadores' }));
    expect(screen.getByRole('combobox', { name: 'Nivel' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Género del jugador' })).toHaveValue('mixto');
    expect(screen.getByText('Agustín Tapia')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Nivel' })).toHaveValue('7ma');
    expect(screen.getByRole('option', { name: '5ta' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '7ma' })).toBeInTheDocument();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    fireEvent.click(screen.getByRole('button', { name: 'Consultar disponibilidad' }));
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'), '_blank', 'noopener,noreferrer');
    expect(decodeURIComponent(openSpy.mock.calls[0][0])).toContain('vi tu perfil en ZonaPadel');
    openSpy.mockRestore();

    fireEvent.click(screen.getByRole('tab', { name: 'Canchas' }));
    expect(screen.getByRole('combobox', { name: 'Apertura' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Clubes incluidos' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Club del Padel Norte' }));
    expect(screen.getByRole('button', { name: 'Club del Padel Norte' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Padel Arena' }));
    expect(screen.getByRole('button', { name: 'Padel Arena' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Padel Arena · 4.2 km/)).toBeInTheDocument();
    expect(screen.getByLabelText('Hora inicial')).toHaveValue('18:00');
    expect(screen.getByLabelText('Hora final')).toHaveValue('22:00');
    expect(screen.getAllByRole('heading', { name: 'Canchas disponibles' }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: 'Pool de partidos' })).not.toBeInTheDocument();
    expect(screen.getAllByText(/Club del Padel Norte/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Abierta').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Valoración 4.8 de 5 estrellas').length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: /Inicio/ })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Ver mapa' }));
    expect(screen.getByRole('heading', { name: 'Mapa de canchas' })).toBeInTheDocument();
  });

  it('applies court filters to the search fields', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getByRole('tab', { name: 'Canchas' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Apertura' }), { target: { value: 'abierta' } });
    fireEvent.change(screen.getByLabelText('Fecha de disponibilidad'), { target: { value: '2026-09-03' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));

    expect(screen.getByRole('heading', { name: 'Filtros de canchas' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Canchas disponibles' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('combobox', { name: 'Apertura' })).toHaveValue('abierta');
    expect(screen.getByLabelText('Fecha de disponibilidad')).toHaveValue('2026-09-03');
    expect(screen.getByText('Cancha 1')).toBeInTheDocument();
    expect(screen.queryByText('Cancha 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancha 3')).not.toBeInTheDocument();
    expect(screen.getByText('Filtros aplicados')).toBeInTheDocument();
    expect(screen.getByText(/Apertura: Abierta.*03\/09\/2026/)).toBeInTheDocument();
  });

  it('does not allow joining the same training twice', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrenamiento' })[0]);

    const joinButton = screen.getAllByRole('button', { name: 'Unirme' })[0];
    fireEvent.click(joinButton);

    expect(screen.getByRole('button', { name: 'Cancelar inscripción' })).toBeEnabled();
    expect(screen.getByRole('status')).toHaveTextContent('Inscripción confirmada.');
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar inscripción' }));
    expect(screen.getAllByRole('button', { name: 'Unirme' })[0]).toBeEnabled();
    expect(screen.getByRole('status')).toHaveTextContent('Inscripción cancelada.');
  });

  it('blocks a coach request that overlaps a joined group class', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrenamiento' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Unirme' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Reservar' })[0]);

    expect(screen.getByRole('status')).toHaveTextContent('se superpone con otra clase');
    expect(screen.getAllByRole('button', { name: 'Reservar' })[0]).toBeEnabled();
  });

  it('allows cancelling an individual class request', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrenamiento' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Reservar' })[0]);

    expect(screen.getByRole('button', { name: 'Cancelar solicitud' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar solicitud' }));
    expect(screen.getByRole('status')).toHaveTextContent('Solicitud de clase individual cancelada.');
    expect(screen.getAllByRole('button', { name: 'Reservar' })[0]).toBeEnabled();
  });

  it('shows tournament capacity and updates participants when joining', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Torneos' })[0]);

    expect(screen.getAllByText('16 plazas totales').length).toBeGreaterThan(0);
    expect(screen.getByText('8 disponibles')).toBeInTheDocument();
    expect(screen.getByText('18:00 - 20:00')).toBeInTheDocument();
    expect(screen.getByText(/Lucía P\., Mateo G\./)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Sumarme' })[0]);
    expect(screen.getAllByRole('button', { name: 'Ya estás inscripto' })[0]).toBeDisabled();
    expect(screen.getByText('7 disponibles')).toBeInTheDocument();
    expect(screen.getByText(/Vos/)).toBeInTheDocument();
  });

  it('rejects joining a tournament with an overlapping schedule', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Torneos' })[0]);
    const firstTournament = screen.getByText('Copa Funes').closest('.tournament-card');
    const overlappingTournament = screen.getByText('Copa Funes Nocturna').closest('.tournament-card');
    fireEvent.click(within(firstTournament).getByRole('button', { name: 'Sumarme' }));
    fireEvent.click(within(overlappingTournament).getByRole('button', { name: 'Sumarme' }));

    expect(screen.getByRole('status')).toHaveTextContent('se superpone con otro torneo');
    expect(screen.getAllByRole('button', { name: 'Sumarme' }).length).toBeGreaterThan(0);
  });

  it('opens a formatted WhatsApp invitation for a tournament teammate', () => {
    render(<App />);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Torneos' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Invitar compañero' })[0]);
    fireEvent.change(screen.getByRole('combobox', { name: 'Compañero' }), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }));

    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'), '_blank', 'noopener,noreferrer');
    expect(decodeURIComponent(openSpy.mock.calls[0][0])).toContain('Copa Funes');
    expect(decodeURIComponent(openSpy.mock.calls[0][0])).toContain('Club del Padel Norte');
    openSpy.mockRestore();
  });
});
