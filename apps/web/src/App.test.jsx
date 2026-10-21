import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const mockAuthenticatedPlayer = ({ notifications = [] } = {}) => {
  localStorage.setItem('zonapadel_token', 'test-player-token');
  const fetchMock = vi.fn((url, options = {}) => {
    const method = options.method || 'GET';
    const jsonResponse = (body, status = 200) => Promise.resolve({ ok: status < 400, status, json: async () => body });

    if (url === '/api/auth/login') return jsonResponse({ token: 'test-player-token', user: { id: 9, nombre: 'Jugador Test', email: 'jugador@example.com', rol: 'jugador' } });
    if (url === '/api/partidos' && method === 'GET') return jsonResponse([]);
    if (url === '/api/partidos' && method === 'POST') {
      const body = JSON.parse(options.body);
      return jsonResponse({
        id: 44,
        ...body,
        cancha: 'Cancha 1',
        ciudad: 'Funes',
        jugadores_faltantes: null,
        estado: 'Publicada',
        es_propio: true,
      }, 201);
    }
    if (url === '/api/partidos/preferencias' && method === 'GET') return jsonResponse({ categoria: '6ta', genero: 'femenino', ciudad: 'Funes', dia_semana: 'vie', hora_desde: '18:00:00', hora_hasta: '22:00:00', disponible: false, telefono_whatsapp: '', whatsapp_consentimiento: false });
    if (url === '/api/partidos/preferencias' && method === 'PUT') return jsonResponse(JSON.parse(options.body));
    if (url === '/api/partidos/notificaciones') return jsonResponse(notifications);
    if (url === '/api/partidos/44/necesidad-jugadores' && method === 'PATCH') {
      const body = JSON.parse(options.body);
      const missingPlayers = body.drive_faltantes + body.reves_faltantes;
      return jsonResponse({
        id: 44,
        cancha_id: 1,
        cancha: 'Cancha 1',
        ciudad: 'Funes',
        genero: 'femenino',
        categoria: '5ta',
        fecha: '2026-10-20',
        hora: '20:00:00',
        estado: 'Confirmada',
        jugadores_faltantes: missingPlayers,
        drive_faltantes: body.drive_faltantes,
        reves_faltantes: body.reves_faltantes,
        notificados: missingPlayers ? 2 : 0,
      });
    }
    if (String(url).startsWith('/api/reservas/disponibilidad')) return jsonResponse({ available: true });
    if (String(url).startsWith('/api/partidos/') && method === 'DELETE') {
      return Promise.resolve({ ok: true, status: 204 });
    }
    return jsonResponse([]);
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const loginAsTestPlayer = async (fetchMock) => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jugador@example.com' } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Pass123!' } });
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', expect.anything()));
};

describe('App', () => {
  it('renders the role selection screen', () => {
    render(<App />);

    expect(screen.queryByText('¿Cómo quieres entrar?')).not.toBeInTheDocument();
    expect(screen.queryByText('Elige tu perfil para descubrir jugadores, canchas y torneos según tu estilo de juego.')).not.toBeInTheDocument();
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

  it('toggles password visibility on the authentication form', () => {
    render(<App />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('autocomplete', 'username');
    const passwordInput = screen.getByLabelText('Contraseña');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('saves weekly availability day and from/to hours', async () => {
    const fetchMock = mockAuthenticatedPlayer();
    await loginAsTestPlayer(fetchMock);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos/preferencias', expect.anything()));
    fireEvent.click(screen.getAllByRole('button', { name: 'Perfil' })[0]);
    fireEvent.change(screen.getByLabelText('Día disponible'), { target: { value: 'sab' } });
    fireEvent.change(screen.getByLabelText('Disponible desde'), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText('Disponible hasta'), { target: { value: '13:00' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Quiero recibir notificaciones de partidos compatibles' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar disponibilidad' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos/preferencias', expect.objectContaining({ method: 'PUT' })));
    const saveCall = fetchMock.mock.calls.find(([url, options]) => url === '/api/partidos/preferencias' && options?.method === 'PUT');
    expect(JSON.parse(saveCall[1].body)).toMatchObject({
      dia_semana: 'sab', hora_desde: '10:00', hora_hasta: '13:00', disponible: true,
    });
  });

  it('shows in-app match notifications and marks them as read', async () => {
    const fetchMock = mockAuthenticatedPlayer({ notifications: [{ id: 71, mensaje: 'Nuevo partido 6ta en Funes, 23/10/2026 a las 19:00.', leida: false }] });
    await loginAsTestPlayer(fetchMock);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos/notificaciones', expect.anything()));
    fireEvent.click(screen.getByRole('button', { name: 'Notificaciones (1 sin leer)' }));
    expect(screen.getByText('Nuevo partido 6ta en Funes, 23/10/2026 a las 19:00.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Marcar leída' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos/notificaciones/71/leida', expect.objectContaining({ method: 'PATCH' })));
    expect(screen.getByRole('button', { name: 'Notificaciones (0 sin leer)' })).toBeInTheDocument();
  });

  it('opens the selected search filters directly', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));

    expect(screen.getByRole('heading', { name: 'Filtros de partidos' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Partidos' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Canchas' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Jugadores' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Género del partido' })).toHaveValue('femenino');
    expect(screen.getByLabelText('Fecha del partido')).toHaveAttribute('type', 'date');
    expect(screen.getByText('Jugadores disponibles dentro de un radio de 10 km.')).toBeInTheDocument();
    expect(screen.queryByText('Agustín Tapia')).not.toBeInTheDocument();
    expect(screen.getAllByText('Delfi Brea').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByRole('combobox', { name: 'Género del partido' }), { target: { value: 'mixto' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Categoría del partido' }), { target: { value: '7ma' } });

    fireEvent.click(screen.getByRole('tab', { name: 'Jugadores' }));
    expect(screen.getByRole('combobox', { name: 'Categoría del jugador' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Género del jugador' })).toHaveValue('mixto');
    expect(screen.getByText('Agustín Tapia')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Categoría del jugador' })).toHaveValue('');
    expect(screen.getByRole('option', { name: '1ra' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '7ma' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '8va' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Posición del jugador' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Nivel de juego' })).toBeInTheDocument();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    fireEvent.click(screen.getAllByRole('button', { name: 'Consultar disponibilidad' })[0]);
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
    expect(screen.queryByRole('heading', { name: 'Partidos' })).not.toBeInTheDocument();
    expect(screen.getAllByText(/Club del Padel Norte/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Abierta').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Valoración 4.8 de 5 estrellas').length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: /Inicio/ })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Ver mapa' }));
    expect(screen.getByRole('heading', { name: 'Mapa de canchas' })).toBeInTheDocument();
    expect(screen.getByTitle('Mapa de Cancha 1, Club del Padel Norte')).toHaveAttribute('src', expect.stringContaining('output=embed'));
    fireEvent.click(screen.getByRole('button', { name: 'Volver a Inicio' }));
    expect(screen.queryByRole('heading', { name: 'Busca tu próximo partido' })).not.toBeInTheDocument();
  });

  it('filters players by category, court side, and broad skill level', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getByRole('tab', { name: 'Jugadores' }));
    fireEvent.change(screen.getByLabelText('Género del jugador'), { target: { value: 'mixto' } });
    fireEvent.change(screen.getByLabelText('Categoría del jugador'), { target: { value: '5ta' } });
    fireEvent.change(screen.getByLabelText('Posición del jugador'), { target: { value: 'drive' } });
    fireEvent.change(screen.getByLabelText('Nivel de juego'), { target: { value: 'alta' } });

    expect(screen.getByText('Arturo Coelho')).toBeInTheDocument();
    expect(screen.queryByText('Delfi Brea')).not.toBeInTheDocument();
    expect(screen.queryByText('Agustín Tapia')).not.toBeInTheDocument();
  });

  it('allows cancelling a match draft without publishing it', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    expect(screen.getByLabelText('Cancha del partido')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Club del Padel Norte · Cancha 1 · Abierta' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Club del Padel Norte · Cancha 3 · Cerrada' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Categoría del partido')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha del nuevo partido')).toBeInTheDocument();
    expect(screen.getByLabelText('Hora del partido')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publicar partido' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('button', { name: 'Publicar partido' })).not.toBeInTheDocument();
    expect(screen.getAllByText('Buscando rival')).toHaveLength(1);
  });

  it('hides court times that already passed today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 9, 18, 30));
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-10-09' } });

    expect(screen.queryByRole('option', { name: '18:00' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: '19:00' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument();
  });

  it('requires login before persisting a match', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
    fireEvent.change(screen.getAllByLabelText('Categoría del partido').at(-1), { target: { value: '5ta' } });
    fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-10-20' } });
    await waitFor(() => expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Hora del partido'), { target: { value: '20:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publicar partido' }));

    expect(screen.getByRole('status')).toHaveTextContent('Iniciá sesión para guardar');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('persists a match with its selected date and time', async () => {
    const fetchMock = mockAuthenticatedPlayer();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos', expect.anything()));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
    fireEvent.change(screen.getAllByLabelText('Categoría del partido').at(-1), { target: { value: '5ta' } });
    fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-10-20' } });
    await waitFor(() => expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Hora del partido'), { target: { value: '20:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publicar partido' }));

    expect(await screen.findByText(/Cancha 1 · 5ta · 20\/10\/2026 · 20:00/)).toBeInTheDocument();
    expect(screen.getByText('Pendiente de confirmación del club')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/partidos', expect.objectContaining({ method: 'POST' }));
  });

  it('asks how many players are needed only after the club confirms the court', async () => {
    const fetchMock = mockAuthenticatedPlayer();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos', expect.anything()));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
    fireEvent.change(screen.getAllByLabelText('Categoría del partido').at(-1), { target: { value: '5ta' } });
    fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-10-20' } });
    await waitFor(() => expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Hora del partido'), { target: { value: '20:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publicar partido' }));

    const driveMissing = await screen.findByRole('combobox', { name: 'Jugadores de drive para Cancha 1' });
    const revesMissing = screen.getByRole('combobox', { name: 'Jugadores de revés para Cancha 1' });
    expect(driveMissing).toHaveValue('1');
    expect(revesMissing).toHaveValue('0');
    fireEvent.change(driveMissing, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar que ya está completo' }));

    expect(await screen.findByText('Ya tenés los jugadores necesarios')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No se publicó en el pool');
    expect(fetchMock).toHaveBeenCalledWith('/api/partidos/44/necesidad-jugadores', expect.objectContaining({ method: 'PATCH' }));
  });

  it('publishes the requested drive and reves positions after confirmation', async () => {
    const fetchMock = mockAuthenticatedPlayer();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos', expect.anything()));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
    fireEvent.change(screen.getAllByLabelText('Categoría del partido').at(-1), { target: { value: '5ta' } });
    fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-10-20' } });
    await waitFor(() => expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Hora del partido'), { target: { value: '20:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publicar partido' }));

    const driveMissing = await screen.findByRole('combobox', { name: 'Jugadores de drive para Cancha 1' });
    const revesMissing = screen.getByRole('combobox', { name: 'Jugadores de revés para Cancha 1' });
    fireEvent.change(driveMissing, { target: { value: '1' } });
    fireEvent.change(revesMissing, { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar jugadores' }));

    expect(await screen.findByText(/Faltan 1 de drive y 1 de revés/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/partidos/44/necesidad-jugadores', expect.objectContaining({
      method: 'PATCH',
      body: JSON.stringify({ drive_faltantes: 1, reves_faltantes: 1 }),
    }));
  });

  it('cancels a persisted match and removes it from active results', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fetchMock = mockAuthenticatedPlayer();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos', expect.anything()));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Categoría del partido'), { target: { value: '5ta' } });
    fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-10-20' } });
    await waitFor(() => expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Hora del partido'), { target: { value: '20:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publicar partido' }));

    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar partido en Cancha 1 el 20/10/2026' }));

    expect(confirmSpy).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('/api/partidos/44', expect.objectContaining({ method: 'DELETE' }));
    await waitFor(() => expect(screen.queryByText(/Cancha 1 · 5ta · 20\/10\/2026 · 20:00/)).not.toBeInTheDocument());
  });

  it('allows publishing another match in a cancelled match timeslot', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fetchMock = mockAuthenticatedPlayer();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos', expect.anything()));

    const publishMatch = async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
      fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
      fireEvent.change(screen.getAllByLabelText('Categoría del partido').at(-1), { target: { value: '5ta' } });
      fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-10-20' } });
      await waitFor(() => expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument());
      fireEvent.change(screen.getByLabelText('Hora del partido'), { target: { value: '20:00' } });
      fireEvent.click(screen.getByRole('button', { name: 'Publicar partido' }));
    };

    await publishMatch();
    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar partido en Cancha 1 el 20/10/2026' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partidos/44', expect.objectContaining({ method: 'DELETE' })));

    await publishMatch();
    await waitFor(() => {
      expect(fetchMock.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(2);
    });
  });

  it('opens an individual WhatsApp invitation with the match details for a selected player', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    const match = screen.getByText(/Funes · 6ta · 10\/10\/2026 · 18:30/).closest('.match-card');
    fireEvent.click(within(match).getByRole('checkbox', { name: 'Delfi Brea' }));
    fireEvent.click(within(match).getByRole('button', { name: 'Invitar a Delfi Brea por WhatsApp' }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toContain('https://wa.me/34698765432?text=');
    expect(new URL(openSpy.mock.calls[0][0]).searchParams.get('text')).toContain('Cancha: Funes');
    expect(new URL(openSpy.mock.calls[0][0]).searchParams.get('text')).toContain('Categoría: 6ta');
    expect(within(match).getByText('Buscando rival')).toBeInTheDocument();
    openSpy.mockRestore();
  });

  it('hides match slots blocked by a tournament on the selected court', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 1, 12, 0));
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Crear partido' }));
    fireEvent.change(screen.getByLabelText('Cancha del partido'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Fecha del nuevo partido'), { target: { value: '2026-09-12' } });

    expect(screen.queryByRole('option', { name: '18:00' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '19:00' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: '20:00' })).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText('Precio de inscripción'), { target: { value: '$15.000' } });
    fireEvent.change(screen.getByLabelText('Premio'), { target: { value: '$300.000' } });
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
    fireEvent.change(screen.getByLabelText('Precio de inscripción'), { target: { value: '$15.000' } });
    fireEvent.change(screen.getByLabelText('Premio'), { target: { value: '$300.000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verificar y crear' }));

    expect(screen.getByText('La cancha ya está bloqueada por otro torneo en ese horario.')).toBeInTheDocument();
    expect(screen.queryByText('Bloque ocupado')).not.toBeInTheDocument();
  });

  it('waits for trainer confirmation before enrolling in group class', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrenamiento' })[0]);

    fireEvent.click(screen.getAllByRole('button', { name: 'Solicitar lugar' })[0]);

    expect(screen.getByRole('button', { name: 'Cancelar solicitud' })).toBeEnabled();
    expect(screen.getByRole('status')).toHaveTextContent('El entrenador debe confirmar');
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar solicitud' }));
    expect(screen.getAllByRole('button', { name: 'Solicitar lugar' })[0]).toBeEnabled();
    expect(screen.getByRole('status')).toHaveTextContent('Solicitud cancelada.');
  });

  it('lets the trainer confirm a pending group-class request', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrenamiento' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Solicitar lugar' })[0]);
    expect(screen.getByRole('button', { name: 'Cancelar solicitud' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Volver al logueo' }));
    fireEvent.click(screen.getByRole('button', { name: /Soy entrenador/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club del Padel Norte/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Clases' })[0]);

    expect(screen.getByRole('heading', { name: 'Solicitudes pendientes' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Solicitud confirmada.');

    fireEvent.click(screen.getByRole('button', { name: 'Volver al logueo' }));
    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrenamiento' })[0]);
    expect(screen.getByRole('button', { name: 'Cancelar inscripción' })).toBeInTheDocument();
  });

  it('blocks a coach request that overlaps a joined group class', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Soy jugador/i }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrenamiento' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Solicitar lugar' })[0]);
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
