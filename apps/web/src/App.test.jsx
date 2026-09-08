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

  it('shows the user registration form', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Crear una cuenta' }));

    expect(screen.getByRole('textbox', { name: 'Nombre' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Ingresar como' })).toHaveValue('jugador');
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
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

  it('creates a tournament with club, court, day, and time block', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Torneos/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Torneos' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }));
    fireEvent.change(screen.getByLabelText('Nombre del torneo'), { target: { value: 'Copa Primavera' } });
    fireEvent.change(screen.getByLabelText('Día'), { target: { value: '2026-10-10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verificar y crear' }));

    expect(screen.getByText('Copa Primavera')).toBeInTheDocument();
    expect(screen.getByText('Torneo creado y cancha bloqueada.')).toBeInTheDocument();
  });

  it('rejects a tournament block that overlaps an existing one', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Torneos/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Torneos' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }));
    fireEvent.change(screen.getByLabelText('Nombre del torneo'), { target: { value: 'Bloque ocupado' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verificar y crear' }));

    expect(screen.getByText('La cancha ya está bloqueada por otro torneo en ese horario.')).toBeInTheDocument();
    expect(screen.queryByText('Bloque ocupado')).not.toBeInTheDocument();
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
    expect(screen.getAllByText('18:00 - 20:00').length).toBeGreaterThan(0);
    expect(screen.getByText(/Lucía P\., Mateo G\./)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Sumarme' })[0]);
    expect(screen.getAllByRole('button', { name: 'Cancelar inscripción' })[0]).toBeEnabled();
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

  it('filters the club calendar by status', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy club/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club del Padel Norte/ }));
    expect(screen.getByRole('combobox', { name: 'Vista del calendario' })).toHaveValue('Día');
    expect(screen.getByLabelText('Fecha del calendario')).toHaveValue('2026-09-04');
    expect(screen.getByText('No hay reservas de MySQL para esta fecha y estado.')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Vista del calendario' }), { target: { value: 'Semana' } });
    expect(screen.getByText('No hay reservas de MySQL para esta fecha y estado.')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Estado del calendario' }), { target: { value: 'Mantenimiento' } });

    expect(screen.getByText('No hay reservas de MySQL para esta fecha y estado.')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: 'Estado del calendario' }), { target: { value: 'Reservada' } });
    expect(screen.getByText('No hay reservas de MySQL para esta fecha y estado.')).toBeInTheDocument();
  });

  it('allows the club to edit the individual court price', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy club/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club del Padel Norte/ }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Canchas' })[0]);
    const priceInput = screen.getAllByLabelText('Costo por hora')[0];
    fireEvent.change(priceInput, { target: { value: '30000' } });

    expect(priceInput).toHaveValue('$30.000/h');
  });

  it('opens the club data editor', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy club/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club del Padel Norte/ }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Perfil' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));

    expect(screen.getByRole('textbox', { name: 'Nombre' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Ciudad' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Dirección' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Teléfono' })).toBeInTheDocument();
  });

  it('allows the club to schedule maintenance for a court and time range', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy club/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club del Padel Norte/ }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Canchas' })[0]);
    fireEvent.change(screen.getByLabelText('Cancha'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-09-04' } });
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '14:00' } });
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '16:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar mantenimiento' }));

    expect(screen.getByRole('combobox', { name: 'Vista del calendario' })).toHaveValue('Día');
    expect(screen.getByLabelText('Fecha del calendario')).toHaveValue('2026-09-04');
    expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument();
    expect(screen.getAllByText('Mantenimiento').length).toBeGreaterThan(0);
  });
});
