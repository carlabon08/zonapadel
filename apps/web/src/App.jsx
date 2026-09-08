import { useEffect, useMemo, useState } from 'react';

const navItems = ['Inicio', 'Entrenamiento', 'Torneos', 'Perfil'];
const clubNavItems = ['Inicio', 'Canchas', 'Reservas', 'Perfil'];
const trainerNavItems = ['Inicio', 'Clases', 'Canchas', 'Reservas', 'Perfil'];
const tournamentNavItems = ['Inicio', 'Torneos', 'Canchas', 'Inscripciones', 'Perfil'];

const navIcons = {
  Inicio: 'home',
  Buscar: 'search',
  Canchas: 'court',
  Entrenamiento: 'training',
  Clases: 'training',
  Torneos: 'tournament',
  Inscripciones: 'calendar',
  Reservas: 'calendar',
  Calendario: 'calendar',
  Perfil: 'profile',
};

function NavIcon({ name, active }) {
  const commonProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: active ? '#0f172a' : '#475569',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...commonProps}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M10 20v-7h4v7" />
        </svg>
      );
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="5.5" />
          <path d="M16 16l4 4" />
        </svg>
      );
    case 'court':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="6" />
          <path d="M12 5v14M5 12h14" />
          <path d="M7 7l10 10M17 7L7 17" />
        </svg>
      );
    case 'tournament':
      return (
        <svg {...commonProps}>
          <path d="M8 6h8v3a4 4 0 0 1-8 0V6Z" />
          <path d="M8 9H5a2 2 0 0 0 0 4h3M16 9h3a2 2 0 0 1 0 4h-3" />
          <path d="M12 13v5" />
          <path d="M9 18h6" />
          <circle cx="12" cy="9" r="1.7" fill={active ? '#0f172a' : '#475569'} stroke="none" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" />
        </svg>
      );
    case 'profile':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
        </svg>
      );
    case 'training':
      return (
        <svg {...commonProps}>
          <path d="M7 9h10M9 7v4M15 7v4M7 15h10M5 11h2M17 11h2" />
          <path d="M12 5v2M12 17v2" />
          <path d="M8 20h8" />
          <path d="M5 20v-7M19 20v-7" />
        </svg>
      );
    default:
      return null;
  }
}

const courts = [
  { id: 1, name: 'Cancha 1', clubId: 'club-padel-norte', club: 'Club del Padel Norte', distance: '0.8 km', price: '$18.000/h', precio_partido: '$18.000/h', precio_clase: '$22.000/h', precio_torneo: '$25.000/h', rating: 4.8, slots: ['18:00', '19:00', '20:00'], status: 'Abierta', address: 'Club del Padel Norte', mapPosition: { left: '25%', top: '35%' }, openingHours: '08:00 - 23:00' },
  { id: 2, name: 'Cancha 2', clubId: 'club-padel-norte', club: 'Club del Padel Norte', distance: '1.3 km', price: '$22.000/h', precio_partido: '$22.000/h', precio_clase: '$26.000/h', precio_torneo: '$30.000/h', rating: 4.5, slots: ['17:30', '18:30', '21:00'], status: 'Semicerrada', address: 'Club del Padel Norte', mapPosition: { left: '58%', top: '48%' }, openingHours: '12:00 - 22:00' },
  { id: 3, name: 'Cancha 3', clubId: 'club-padel-norte', club: 'Club del Padel Norte', distance: '2.4 km', price: '$25.000/h', precio_partido: '$25.000/h', precio_clase: '$29.000/h', precio_torneo: '$34.000/h', rating: 4.2, slots: ['16:00', '18:00', '19:30'], status: 'Cerrada', address: 'Club del Padel Norte', mapPosition: { left: '70%', top: '60%' }, openingHours: 'Sin horario activo' },
  { id: 4, name: 'Cancha 4', clubId: 'padel-arena', club: 'Padel Arena', distance: '4.2 km', price: '$20.000/h', rating: 4.7, slots: ['17:00', '19:00', '20:00'], status: 'Abierta', address: 'Padel Arena', mapPosition: { left: '35%', top: '62%' }, openingHours: '09:00 - 23:00' },
  { id: 5, name: 'Cancha 5', clubId: 'padel-arena', club: 'Padel Arena', distance: '4.8 km', price: '$24.000/h', rating: 4.4, slots: ['18:00', '19:30', '21:00'], status: 'Abierta', address: 'Padel Arena', mapPosition: { left: '80%', top: '30%' }, openingHours: '10:00 - 22:30' },
  { id: 6, name: 'Cancha 6', clubId: 'sunset-club', club: 'Sunset Club', distance: '6.1 km', price: '$19.000/h', rating: 4.6, slots: ['16:30', '18:00', '19:00'], status: 'Abierta', address: 'Sunset Club', mapPosition: { left: '50%', top: '75%' }, openingHours: '08:00 - 22:00' },
  { id: 7, name: 'Cancha 7', clubId: 'sunset-club', club: 'Sunset Club', distance: '6.5 km', price: '$26.000/h', rating: 4.1, slots: ['17:00', '18:30', '20:00'], status: 'Semicerrada', address: 'Sunset Club', mapPosition: { left: '88%', top: '65%' }, openingHours: '11:00 - 21:00' },
];

const players = [
  { id: 1, name: 'Agustín Tapia', gender: 'masculino', level: '7ma', distanceKm: 8, style: 'Ataque / velocidad', availability: 'Hoy 18:00-21:00', city: 'Buenos Aires', accent: '#7dd3fc', phoneVisible: false, phone: '+5491123456789' },
  { id: 2, name: 'Arturo Coelho', gender: 'masculino', level: '5ta', distanceKm: 14, style: 'Volea / control', availability: 'Mañana 19:00', city: 'Madrid', accent: '#dfeef9', phoneVisible: true, phone: '+34612345678' },
  { id: 3, name: 'Delfi Brea', gender: 'femenino', level: '6ta', distanceKm: 6, style: 'Defensa / precisión', availability: 'Viernes 20:00', city: 'Barcelona', accent: '#f9a8d4', phoneVisible: true, phone: '+34698765432' },
  { id: 4, name: 'Gema Triay', gender: 'femenino', level: '5ta', distanceKm: 11, style: 'All court / potencia', availability: 'Sábado 17:30', city: 'Valencia', accent: '#f4d7d7', phoneVisible: true, phone: '+34654321876' },
];

const tournaments = [
  { id: 1, name: 'Copa Funes', clubId: 'club-padel-norte', city: 'Funes', date: '12 Sep', startTime: '18:00', endTime: '20:00', category: 'Premier Padel', totalSeats: 16, availableSeats: 8, participants: ['Lucía P.', 'Mateo G.', 'Sofía R.', 'Bruno C.', 'Nina M.', 'Diego S.', 'Paula T.', 'Tomás D.'], image: 'https://www.padelfip.com/wp-content/uploads/2026/06/Roma-Champions-1024x682.jpeg' },
  { id: 2, name: 'Liga local', clubId: 'padel-arena', city: 'Santa Fe', date: '18 Sep', startTime: '19:00', endTime: '21:00', category: 'Premier Padel', totalSeats: 20, availableSeats: 12, participants: ['Agustín T.', 'Arturo C.', 'Delfi B.', 'Gema T.', 'Julián V.', 'Carla M.', 'Martín R.', 'Sofía C.'], image: 'https://cdn.premierpadel.com/uploads/hero/original/31969ff297d31a1918217f1ce0b94d546d4f8c33b4d4000052dc81c22895c2c3.jpg' },
  { id: 3, name: 'Premier Tour', clubId: 'sunset-club', city: 'Rafaela', date: '20 Sep', startTime: '20:00', endTime: '22:00', category: 'FIP Tour', totalSeats: 12, availableSeats: 10, participants: ['Julián V.', 'Paula T.'], image: 'https://damcdn.premierpadel.com/pendularupload/abstracts/12495/thumbnail.jpg' },
  { id: 4, name: 'Copa Funes Nocturna', clubId: 'club-padel-norte', city: 'Funes', date: '12 Sep', startTime: '18:00', endTime: '20:00', category: '6ta', totalSeats: 16, availableSeats: 10, participants: ['Carla M.', 'Martín R.', 'Sofía C.', 'Diego V.', 'Nina M.', 'Julián V.'], image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80' },
];

const coaches = [
  { id: 1, name: 'Martín Ruiz', specialty: 'Mejora de drive', rating: '4.9', price: '$12.000', availability: 'Hoy 18:00', dayKey: 'hoy', startTime: '18:00', endTime: '19:00' },
  { id: 2, name: 'Sofía Costa', specialty: 'Volea y red', rating: '4.8', price: '$10.000', availability: 'Mañana 17:30', dayKey: 'manana', startTime: '17:30', endTime: '18:15' },
  { id: 3, name: 'Diego Vera', specialty: 'Táctica defensiva', rating: '4.7', price: '$11.500', availability: 'Viernes 19:00', dayKey: 'viernes', startTime: '19:00', endTime: '20:00' },
];

const trainerClassesByClub = {
  'club-padel-norte': [
    { id: 1, title: 'Clases de drive', court: 'Cancha 1', time: 'Hoy · 18:00', students: 6, status: 'Disponible' },
    { id: 2, title: 'Volea y red', court: 'Cancha 2', time: 'Mañana · 17:30', students: 4, status: 'Queda 1 plaza' },
  ],
  'padel-arena': [
    { id: 1, title: 'Táctica defensiva', court: 'Cancha 1', time: 'Hoy · 19:00', students: 5, status: 'Disponible' },
    { id: 2, title: 'Saque y remate', court: 'Cancha 2', time: 'Jueves · 18:30', students: 3, status: 'Queda 2 plazas' },
  ],
  'sunset-club': [
    { id: 1, title: 'Iniciación pádel', court: 'Cancha 1', time: 'Mañana · 17:00', students: 8, status: 'Completo' },
    { id: 2, title: 'Perfeccionamiento', court: 'Cancha 3', time: 'Viernes · 20:00', students: 4, status: 'Disponible' },
  ],
};

const tournamentEvents = [
  { id: 1, name: 'Copa Funes', clubId: 'club-padel-norte', clubName: 'Club del Padel Norte', courtId: '1', date: '2026-09-12', from: '18:00', to: '20:00', court: 'Cancha 1', teams: 8, status: 'Abierta', budget: '$180.000' },
  { id: 2, name: 'Liga local', clubId: 'padel-arena', clubName: 'Padel Arena', courtId: '2', date: '2026-09-18', from: '19:00', to: '21:00', court: 'Cancha 2', teams: 10, status: 'Confirmada', budget: '$220.000' },
  { id: 3, name: 'Mini torneos', clubId: 'sunset-club', clubName: 'Sunset Club', courtId: '3', date: '2026-09-22', from: '20:00', to: '22:00', court: 'Cancha 3', teams: 6, status: 'Pendiente', budget: '$120.000' },
];

const avatarOptions = {
  rosa: [
    { id: 'delfi-brea', name: 'Delfi Brea', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80' },
    { id: 'gema-triay', name: 'Gema Triay', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
  ],
  celeste: [
    { id: 'arturo-coelho', name: 'Arturo Coelho', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
    { id: 'agustin-tapia', name: 'Agustín Tapia', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
  ],
  verde: [
    { id: 'delfi-brea', name: 'Delfi Brea', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80' },
    { id: 'arturo-coelho', name: 'Arturo Coelho', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  ],
};

const stats = [
  { label: 'Partidos', value: '142' },
  { label: 'Victorias', value: '78%' },
  { label: 'Disponibilidad', value: '18:00' },
  { label: 'Ranking', value: '#12' },
];

const clubBookings = [
  { id: 1, player: 'Lucía P.', court: 'Cancha 1', time: '18:00', status: 'Confirmada', amount: '$40.000' },
  { id: 2, player: 'Mateo G.', court: 'Cancha 2', time: '19:30', status: 'Pendiente', amount: '$35.000' },
  { id: 3, player: 'Diego S.', court: 'Cancha 3', time: '21:00', status: 'Cancelada', amount: '$0' },
];

const clubs = [
  {
    id: 'club-padel-norte',
    name: 'Club del Padel Norte',
    city: 'Funes',
    address: 'Ruta 20 y Av. Libertador',
    image: 'https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'padel-arena',
    name: 'Padel Arena',
    city: 'Santa Fe',
    address: 'San Jerónimo 1900',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sunset-club',
    name: 'Sunset Club',
    city: 'Rafaela',
    address: 'Calle del Sol 45',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
  },
];

const clubCourtSchedule = [
  {
    id: 1,
    name: 'Cancha 1',
    status: 'Disponible',
    week: {
      Lun: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '10:00 - 11:30', status: 'Reservada' }, { time: '13:00 - 15:00', status: 'Disponible' }],
      Mar: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '12:00 - 13:30', status: 'Clase' }, { time: '18:00 - 19:30', status: 'Disponible' }],
      Mié: [{ time: '08:30 - 10:00', status: 'Reservada' }, { time: '14:00 - 15:00', status: 'Disponible' }, { time: '19:00 - 20:30', status: 'Torneo' }],
      Jue: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '11:00 - 12:30', status: 'Reservada' }, { time: '20:30 - 22:00', status: 'Disponible' }],
      Vie: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '10:00 - 11:30', status: 'Reservada' }, { time: '18:30 - 20:00', status: 'Disponible' }],
      Sáb: [{ time: '09:30 - 11:00', status: 'Disponible' }, { time: '16:00 - 17:30', status: 'Reservada' }],
      Dom: [{ time: '10:00 - 11:30', status: 'Disponible' }, { time: '18:00 - 19:30', status: 'Disponible' }],
    },
  },
  {
    id: 2,
    name: 'Cancha 2',
    status: 'Reservada',
    week: { Lun: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '20:00 - 21:30', status: 'Reservada' }], Mar: [{ time: '09:00 - 10:30', status: 'Reservada' }, { time: '18:30 - 20:00', status: 'Disponible' }], Mié: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '19:30 - 21:00', status: 'Reservada' }], Jue: [{ time: '12:00 - 13:30', status: 'Clase' }, { time: '21:00 - 22:30', status: 'Disponible' }], Vie: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '20:00 - 21:30', status: 'Reservada' }], Sáb: [{ time: '11:00 - 12:30', status: 'Disponible' }], Dom: [{ time: '12:00 - 13:30', status: 'Disponible' }] },
  },
  {
    id: 3,
    name: 'Cancha 3',
    status: 'Disponible',
    week: { Lun: [{ time: '08:30 - 10:00', status: 'Reservada' }, { time: '17:30 - 19:00', status: 'Disponible' }], Mar: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '19:00 - 20:30', status: 'Clase' }], Mié: [{ time: '10:00 - 11:30', status: 'Disponible' }, { time: '18:00 - 19:30', status: 'Reservada' }], Jue: [{ time: '09:00 - 10:30', status: 'Disponible' }, { time: '19:30 - 21:00', status: 'Reservada' }], Vie: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '20:30 - 22:00', status: 'Reservada' }], Sáb: [{ time: '08:30 - 10:00', status: 'Disponible' }], Dom: [{ time: '09:00 - 10:30', status: 'Disponible' }] },
  },
  {
    id: 4,
    name: 'Cancha 4',
    status: 'Mantenimiento',
    week: { Lun: [{ time: '07:00 - 23:00', status: 'Mantenimiento' }], Mar: [{ time: '07:00 - 23:00', status: 'Mantenimiento' }], Mié: [{ time: '07:00 - 09:00', status: 'Mantenimiento' }, { time: '19:00 - 20:30', status: 'Mantenimiento' }], Jue: [{ time: '07:00 - 23:00', status: 'Mantenimiento' }], Vie: [{ time: '07:00 - 18:00', status: 'Mantenimiento' }, { time: '18:00 - 23:00', status: 'Disponible' }], Sáb: [{ time: '07:00 - 23:00', status: 'Mantenimiento' }], Dom: [{ time: '07:00 - 23:00', status: 'Mantenimiento' }] },
  },
  {
    id: 5,
    name: 'Cancha 5',
    status: 'Disponible',
    week: { Lun: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '20:00 - 21:30', status: 'Reservada' }], Mar: [{ time: '11:00 - 12:30', status: 'Disponible' }, { time: '21:00 - 22:30', status: 'Reservada' }], Mié: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '18:30 - 20:00', status: 'Clase' }], Jue: [{ time: '10:00 - 11:30', status: 'Disponible' }, { time: '20:00 - 21:30', status: 'Reservada' }], Vie: [{ time: '07:00 - 08:30', status: 'Disponible' }, { time: '19:00 - 20:30', status: 'Reservada' }], Sáb: [{ time: '10:00 - 11:30', status: 'Disponible' }], Dom: [{ time: '11:00 - 12:30', status: 'Disponible' }] },
  },
];

const clubBookingsByClub = {
  'club-padel-norte': [
    { id: 1, player: 'Lucía P.', court: 'Cancha 1', time: '18:00', status: 'Confirmada', amount: '$40.000' },
    { id: 2, player: 'Mateo G.', court: 'Cancha 2', time: '19:30', status: 'Pendiente', amount: '$35.000' },
    { id: 3, player: 'Diego S.', court: 'Cancha 3', time: '21:00', status: 'Cancelada', amount: '$0' },
  ],
  'padel-arena': [
    { id: 1, player: 'Sofía R.', court: 'Cancha 1', time: '17:30', status: 'Confirmada', amount: '$45.000' },
    { id: 2, player: 'Bruno C.', court: 'Cancha 2', time: '18:45', status: 'Confirmada', amount: '$42.000' },
    { id: 3, player: 'Nina M.', court: 'Cancha 3', time: '20:15', status: 'Pendiente', amount: '$38.000' },
  ],
  'sunset-club': [
    { id: 1, player: 'Julián V.', court: 'Cancha 1', time: '19:00', status: 'Confirmada', amount: '$48.000' },
    { id: 2, player: 'Paula T.', court: 'Cancha 2', time: '20:00', status: 'Pendiente', amount: '$40.000' },
    { id: 3, player: 'Tomás D.', court: 'Cancha 3', time: '21:30', status: 'Mantenimiento', amount: '$0' },
  ],
};

const trainerBookingsByClub = {
  'club-padel-norte': [
    { id: 1, court: 'Cancha 1', time: 'Hoy · 18:00', status: 'Confirmada', note: 'Clase de drive' },
    { id: 2, court: 'Cancha 2', time: 'Mañana · 17:30', status: 'Pendiente', note: 'Clase de volea' },
  ],
  'padel-arena': [
    { id: 1, court: 'Cancha 1', time: 'Hoy · 19:00', status: 'Confirmada', note: 'Clase táctica' },
    { id: 2, court: 'Cancha 2', time: 'Jueves · 18:30', status: 'Pendiente', note: 'Entrenamiento individual' },
  ],
  'sunset-club': [
    { id: 1, court: 'Cancha 1', time: 'Mañana · 17:00', status: 'Confirmada', note: 'Clase de iniciación' },
    { id: 2, court: 'Cancha 3', time: 'Viernes · 20:00', status: 'Cancelada', note: 'Perfeccionamiento' },
  ],
};

const clubCourtsByClub = {
  'club-padel-norte': [
    { id: 1, name: 'Cancha 1', price: '$18.000/h', slots: ['18:00', '19:00', '20:00'], status: 'Abierta', openingHours: '08:00 - 23:00' },
    { id: 2, name: 'Cancha 2', price: '$22.000/h', slots: ['17:30', '18:30', '21:00'], status: 'Semicerrada', openingHours: '12:00 - 22:00' },
    { id: 3, name: 'Cancha 3', price: '$25.000/h', slots: ['16:00', '18:00', '19:30'], status: 'Cerrada', openingHours: 'Sin horario activo' },
  ],
  'padel-arena': [
    { id: 1, name: 'Cancha 1', price: '$20.000/h', slots: ['17:00', '19:00', '20:00'], status: 'Abierta', openingHours: '09:00 - 23:00' },
    { id: 2, name: 'Cancha 2', price: '$24.000/h', slots: ['18:00', '19:30', '21:00'], status: 'Abierta', openingHours: '10:00 - 22:30' },
  ],
  'sunset-club': [
    { id: 1, name: 'Cancha 1', price: '$19.000/h', slots: ['16:30', '18:00', '19:00'], status: 'Abierta', openingHours: '08:00 - 22:00' },
    { id: 2, name: 'Cancha 3', price: '$26.000/h', slots: ['17:00', '18:30', '20:00'], status: 'Semicerrada', openingHours: '11:00 - 21:00' },
  ],
};

const userThemes = [
  { id: 'rosa', label: 'Rosa', accent: '#f5d5df', accentAlt: '#f9d3df' },
  { id: 'celeste', label: 'Celeste', accent: '#dfeef9', accentAlt: '#cfe9ff' },
  { id: 'verde', label: 'Verde', accent: '#d7f0dd', accentAlt: '#bde3c7' },
];

function App() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('jugador');
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [trainerServiceClubs, setTrainerServiceClubs] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('rosa');
  const [selectedAvatarId, setSelectedAvatarId] = useState('delfi-brea');
  const [selectedShot, setSelectedShot] = useState('drive');
  const [activeTab, setActiveTab] = useState('Inicio');
  const [selectedCourt, setSelectedCourt] = useState(courts[0]);
  const [isCourtPhotoOpen, setIsCourtPhotoOpen] = useState(false);
  const [courtStates, setCourtStates] = useState(courts.map((court) => ({ ...court })));
  const [userLocation, setUserLocation] = useState({
    lat: -31.8667,
    lng: -60.7933,
    label: 'Funes, Santa Fe, Argentina',
  });
  const [matchPool, setMatchPool] = useState([
    { id: 1, format: 'Pádel', gender: 'femenino', city: 'Funes', level: '6ta', time: '18:30', missingPlayers: 1, status: 'Buscando rival', notified: false },
    { id: 2, format: 'Pádel', gender: 'mixto', city: 'Santa Fe', level: '5ta', time: '20:00', missingPlayers: 1, status: 'Disponible', notified: true },
    { id: 3, format: 'Pádel', gender: 'masculino', city: 'Rafaela', level: '7ma', time: '21:00', missingPlayers: 1, status: 'Pendiente', notified: false },
  ]);
  const [trainingPool, setTrainingPool] = useState([
    { id: 1, coach: 'Martín Ruiz', specialty: 'Drive y precisión', time: 'Hoy · 18:00', dayKey: 'hoy', startTime: '18:00', endTime: '19:00', duration: '60 min', available: 2, students: ['Lucía', 'Mateo', 'Sofía'], status: 'Plazas abiertas' },
    { id: 2, coach: 'Sofía Costa', specialty: 'Volea y red', time: 'Mañana · 17:30', dayKey: 'manana', startTime: '17:30', endTime: '18:15', duration: '45 min', available: 1, students: ['Diego', 'Carla'], status: 'Última plaza' },
    { id: 3, coach: 'Diego Vera', specialty: 'Táctica defensiva', time: 'Viernes · 19:00', dayKey: 'viernes', startTime: '19:00', endTime: '20:00', duration: '60 min', available: 3, students: ['Tomás', 'Nina', 'Juli'], status: 'Disponible' },
  ]);
  const [joinedTrainingIds, setJoinedTrainingIds] = useState([]);
  const [trainingNotice, setTrainingNotice] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [advancedFilterType, setAdvancedFilterType] = useState('Pool de partidos');
  const [appliedCourtFilters, setAppliedCourtFilters] = useState({
    opening: '',
    date: '',
    from: '18:00',
    to: '22:00',
  });
  const [draftCourtFilters, setDraftCourtFilters] = useState(appliedCourtFilters);
  const loggedInProfile = { gender: 'femenino' };
  const [selectedGender, setSelectedGender] = useState(loggedInProfile.gender);
  const verifiedPlayerLevel = '6ta';
  const availablePlayerLevels = ['5ta', '6ta', '7ma'];
  const [selectedPlayerLevel, setSelectedPlayerLevel] = useState(verifiedPlayerLevel);
  const [includedClubIds, setIncludedClubIds] = useState([]);
  const [requestedCoachIds, setRequestedCoachIds] = useState([]);
  const [joinedTournamentIds, setJoinedTournamentIds] = useState([]);
  const [tournamentList, setTournamentList] = useState(tournaments);
  const [tournamentInviteId, setTournamentInviteId] = useState(null);
  const [tournamentInvitePlayerId, setTournamentInvitePlayerId] = useState('');
  const [tournamentNotice, setTournamentNotice] = useState('');
  const [showTournamentForm, setShowTournamentForm] = useState(false);
  const [tournamentDraft, setTournamentDraft] = useState({
    name: '', clubId: 'club-padel-norte', courtId: '1', date: '2026-09-12', from: '18:00', to: '20:00',
  });
  const [tournamentEventsList, setTournamentEventsList] = useState(tournamentEvents);
  const [calendarStatusFilter, setCalendarStatusFilter] = useState('Todos');
  const [calendarView, setCalendarView] = useState('Día');
  const [calendarDate, setCalendarDate] = useState('2026-09-04');
  const [calendarSchedule, setCalendarSchedule] = useState(clubCourtSchedule);
  const [maintenanceDraft, setMaintenanceDraft] = useState({ courtId: '4', date: '2026-09-04', from: '14:00', to: '16:00' });
  const [apiReservations, setApiReservations] = useState([]);
  const [isClubEditing, setIsClubEditing] = useState(false);
  const [clubProfileDraft, setClubProfileDraft] = useState({ name: '', city: '', address: '', phone: '' });
  const [apiReservationsLoaded, setApiReservationsLoaded] = useState(false);
  const [hasLocalCalendarChanges, setHasLocalCalendarChanges] = useState(false);

  const avatarSet = avatarOptions[selectedTheme] || avatarOptions.rosa;
  const selectedAvatar = avatarSet.find((avatar) => avatar.id === selectedAvatarId) || avatarSet[0];
  const selectedClub = clubs.find((club) => club.id === selectedClubId) || clubs[0];
  const trainerAvailableClubs = clubs.filter((club) => trainerServiceClubs.includes(club.id));
  const trainerActiveClub = clubs.find((club) => club.id === selectedClubId) || trainerAvailableClubs[0] || clubs[0];
  const currentLocationLabel = userLocation.label || 'Funes, Santa Fe, Argentina';
  const selectedClubBookings = clubBookingsByClub[selectedClubId] || clubBookingsByClub['club-padel-norte'];
  const selectedCourtClub = clubs.find((club) => club.name === selectedCourt.club) || clubs[0];
  const trainerActiveClubId = trainerActiveClub?.id;
  const trainerClubCourts = clubCourtsByClub[trainerActiveClubId] || clubCourtsByClub['club-padel-norte'];
  const trainerClubClasses = trainerClassesByClub[trainerActiveClubId] || trainerClassesByClub['club-padel-norte'];
  const trainerClubBookings = trainerBookingsByClub[trainerActiveClubId] || trainerBookingsByClub['club-padel-norte'];
  const rankedCourtStates = [...courtStates]
    .filter((court) => includedClubIds.length === 0 || includedClubIds.includes(court.clubId))
    .sort((firstCourt, secondCourt) => {
    const ratingDifference = secondCourt.rating - firstCourt.rating;
    if (ratingDifference !== 0) return ratingDifference;
    return Number.parseFloat(firstCourt.distance) - Number.parseFloat(secondCourt.distance);
  });
  const filteredCourtStates = rankedCourtStates.filter((court) => {
    const normalizedStatus = court.status.toLowerCase().replace('semicerrada', 'semi-cerrada');
    const matchesOpening = !appliedCourtFilters.opening || normalizedStatus === appliedCourtFilters.opening;
    const matchesTime = court.slots.some((slot) => slot >= appliedCourtFilters.from && slot <= appliedCourtFilters.to);
    return matchesOpening && matchesTime;
  });
  const visibleMatches = matchPool.filter((match) =>
    (match.gender === selectedGender || match.gender === 'mixto') && match.level === selectedPlayerLevel
  );
  const visiblePlayers = players.filter((player) =>
    (selectedGender === 'mixto' || player.gender === selectedGender) && player.level === selectedPlayerLevel
  );
  const visibleCalendarCourts = calendarSchedule.filter((court) =>
    calendarStatusFilter === 'Todos' || court.status === calendarStatusFilter
  );
  const calendarDayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const selectedCalendarDay = calendarDayLabels[new Date(`${calendarDate}T12:00:00`).getDay()];
  const useRealCalendarData = selectedRole === 'club' && Boolean(selectedClubId) && !hasLocalCalendarChanges;
  const calendarBaseSchedule = useRealCalendarData
    ? calendarSchedule.map((court) => ({
        ...court,
        week: Object.fromEntries(calendarDayLabels.map((day) => [day, []])),
      }))
    : calendarSchedule;
  const calendarScheduleWithReservations = calendarBaseSchedule.map((court) => {
    const reservations = apiReservations.filter((reservation) =>
      Number(reservation.cancha_id) === court.id && String(reservation.fecha).slice(0, 10) === calendarDate
    );
    if (!reservations.length) return court;

    return {
      ...court,
      week: {
        ...court.week,
        [selectedCalendarDay]: [
          ...(court.week[selectedCalendarDay] || []),
          ...reservations.map((reservation) => ({
            time: reservation.hora,
            status: reservation.estado === 'Confirmada' ? 'Reservada' : reservation.estado,
          })),
        ],
      },
    };
  });
  const visibleCalendarCourtsWithReservations = calendarScheduleWithReservations.filter((court) =>
    calendarStatusFilter === 'Todos'
    || court.status === calendarStatusFilter
    || court.week[selectedCalendarDay]?.some((slot) => slot.status === calendarStatusFilter)
  );
  const calendarCourtsByBlockStatus = calendarScheduleWithReservations
    .map((court) => ({
      ...court,
      week: Object.fromEntries(Object.entries(court.week).map(([day, slots]) => [
        day,
        slots.filter((slot) => calendarStatusFilter === 'Todos' || slot.status === calendarStatusFilter),
      ])),
    }))
    .filter((court) => calendarView === 'Semana'
      ? Object.values(court.week).some((slots) => slots.length > 0)
      : court.week[selectedCalendarDay]?.length > 0);
  const nearbyPoolPlayers = visiblePlayers.filter((player) => player.distanceKm <= 10);

  const addMaintenanceBlock = () => {
    const day = calendarDayLabels[new Date(`${maintenanceDraft.date}T12:00:00`).getDay()];
    setCalendarSchedule((current) => current.map((court) => {
      if (String(court.id) !== maintenanceDraft.courtId) return court;

      return {
        ...court,
        status: 'Mantenimiento',
        week: {
          ...court.week,
          [day]: [
            ...court.week[day],
            { time: `${maintenanceDraft.from} - ${maintenanceDraft.to}`, status: 'Mantenimiento' },
          ],
        },
      };
    }));
    setCalendarDate(maintenanceDraft.date);
    setCalendarView('Día');
    setHasLocalCalendarChanges(true);
    setActiveTab('Inicio');
  };

  useEffect(() => {
    if (selectedRole !== 'club' || !selectedClubId) return;

    const token = authenticatedUser?.token || localStorage.getItem('zonapadel_token') || localStorage.getItem('token');
    if (!token) return;

    setApiReservationsLoaded(false);

    fetch(`/api/reservas?club_id=${encodeURIComponent(selectedClubId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.ok ? response.json() : [])
      .then((reservas) => {
        setApiReservations(reservas);
        setApiReservationsLoaded(true);
      })
      .catch(() => {
        setApiReservations([]);
        setApiReservationsLoaded(true);
      });
  }, [authenticatedUser, selectedRole, selectedClubId]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          label: 'Tu ubicación actual',
        });
      },
      () => {
        setUserLocation((current) => ({
          ...current,
          label: current.label || 'Funes, Santa Fe, Argentina',
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const navItemsToRender = useMemo(() => {
    if (selectedRole === 'club') return clubNavItems;
    if (selectedRole === 'entrenador') return trainerNavItems;
    if (selectedRole === 'torneos') return tournamentNavItems;
    return navItems;
  }, [selectedRole]);

  const updateCourtStatus = (courtId, nextStatus) => {
    setCourtStates((current) =>
      current.map((court) => (court.id === courtId ? { ...court, status: nextStatus } : court))
    );
  };

  const updateCourtHours = (courtId, nextHours) => {
    setCourtStates((current) =>
      current.map((court) => (court.id === courtId ? { ...court, openingHours: nextHours } : court))
    );
  };

  const formatHourlyPrice = (value) => {
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '';

    return `$${Number(digits).toLocaleString('es-AR')}/h`;
  };

  const updateCourtPrice = (courtId, nextPrice) => {
    setCourtStates((current) =>
      current.map((court) => (court.id === courtId ? { ...court, price: formatHourlyPrice(nextPrice) } : court))
    );
  };

  const updateCourtRate = (courtId, field, value) => {
    setCourtStates((current) => current.map((court) => court.id === courtId ? { ...court, [field]: formatHourlyPrice(value) } : court));
  };

  const handleReserveClick = () => {
    const newMatch = {
      id: Date.now(),
      format: 'Pádel',
      city: currentLocationLabel.includes('Funes') ? 'Funes' : 'Tu zona',
      level: '3ra',
      time: '19:00',
      missingPlayers: 1,
      status: 'Buscando rival',
      notified: false,
      gender: loggedInProfile.gender,
    };

    setMatchPool((current) => [newMatch, ...current]);
    setActiveTab('Buscar');
  };

  const handleRoleCourtBooking = (roleLabel, timeLabel) => {
    setCourtStates((current) =>
      current.map((court) =>
        court.id === selectedCourt.id ? { ...court, status: 'Reservada' } : court
      )
    );

    if (selectedRole === 'entrenador') {
      setActiveTab('Clases');
      return;
    }

    if (selectedRole === 'torneos') {
      setActiveTab('Torneos');
      return;
    }

    setActiveTab('Canchas');
  };

  const handleLogout = () => {
    localStorage.removeItem('zonapadel_token');
    setAuthenticatedUser(null);
    setApiReservations([]);
    setApiReservationsLoaded(false);
    setAuthEmail('');
    setAuthPassword('');
    setSelectedRole(null);
    setSelectedClubId(null);
    setTrainerServiceClubs([]);
    setActiveTab('Inicio');
    setSelectedCourt(courts[0]);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || 'No se pudo iniciar sesión');
        return;
      }

      localStorage.setItem('zonapadel_token', data.token);
      setAuthenticatedUser({ ...data.user, token: data.token });
      setSelectedRole(data.user.rol);
      if (data.user.club_id && clubs.some((club) => club.id === data.user.club_id)) {
        setSelectedClubId(data.user.club_id);
      }
    } catch (error) {
      setAuthError('No se pudo conectar con el servidor');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: authName, email: authEmail, password: authPassword, rol: authRole }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || 'No se pudo crear la cuenta');
        return;
      }

      localStorage.setItem('zonapadel_token', data.token);
      setAuthenticatedUser({ ...data.user, token: data.token });
      setSelectedRole(data.user.rol);
      setAuthMode('login');
      if (data.user.rol !== 'club') setActiveTab('Inicio');
    } catch (error) {
      setAuthError('No se pudo conectar con el servidor');
    }
  };

  const toggleTrainerClub = (clubId) => {
    setTrainerServiceClubs((current) => {
      const exists = current.includes(clubId);
      const next = exists
        ? current.filter((id) => id !== clubId)
        : [...current, clubId];

      setSelectedClubId(next[0] || null);
      return next;
    });
  };

  const toggleRecipient = (matchId, playerId) => {
    setSelectedRecipients((current) => {
      const currentSelection = current[matchId] || [];
      const nextSelection = currentSelection.includes(playerId)
        ? currentSelection.filter((id) => id !== playerId)
        : [...currentSelection, playerId];

      return {
        ...current,
        [matchId]: nextSelection,
      };
    });
  };

  const notifyPlayers = (matchId) => {
    const selectedPlayerIds = selectedRecipients[matchId] || [];
    const selectedPlayers = players.filter((player) => selectedPlayerIds.includes(player.id));

    if (selectedPlayers.length === 0) {
      return;
    }

    const whatsappNumbers = selectedPlayers
      .map((player) => player.phone)
      .filter(Boolean)
      .join(',');

    const message = encodeURIComponent(
      `Hola! Te invitamos a jugar un partido de pádel a las ${matchPool.find((match) => match.id === matchId)?.time || '19:00'}. ¿Te sumás?`
    );

    if (whatsappNumbers) {
      const url = `https://wa.me/${whatsappNumbers.replace(/\D/g, '')}?text=${message}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    setMatchPool((current) =>
      current.map((match) =>
        match.id === matchId
          ? { ...match, notified: true, status: 'Notificación enviada' }
          : match
      )
    );
  };

  const contactPlayerOnWhatsApp = (player) => {
    if (!player.phone) return;

    const message = encodeURIComponent(
      `Hola ${player.name}, vi tu perfil en ZonaPadel. Estoy buscando jugar en categoría ${player.level}. ¿Qué disponibilidad tenés para jugar?`
    );
    const url = `https://wa.me/${player.phone.replace(/\D/g, '')}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleJoinTraining = (trainingId) => {
    if (joinedTrainingIds.includes(trainingId)) {
      setTrainingNotice('Ya estás inscripto en esta clase.');
      return;
    }

    const selectedTraining = trainingPool.find((session) => session.id === trainingId);
    const hasOverlap = trainingPool.some((session) =>
      joinedTrainingIds.includes(session.id)
      && session.dayKey === selectedTraining?.dayKey
      && session.startTime < selectedTraining.endTime
      && session.endTime > selectedTraining.startTime
    );

    if (hasOverlap) {
      setTrainingNotice('No podés inscribirte: el horario se superpone con otra clase.');
      return;
    }

    setJoinedTrainingIds((current) => [...current, trainingId]);
    setTrainingNotice('Inscripción confirmada.');
    setTrainingPool((current) =>
      current.map((session) =>
        session.id === trainingId && session.available > 0
          ? {
              ...session,
              available: session.available - 1,
              students: [...session.students, 'Tú'],
              status: session.available - 1 === 0 ? 'Clase completa' : 'Plazas abiertas',
            }
          : session
      )
    );
  };

  const handleCancelTraining = (trainingId) => {
    setJoinedTrainingIds((current) => current.filter((id) => id !== trainingId));
    setTrainingPool((current) => current.map((session) => {
      if (session.id !== trainingId) return session;

      return {
        ...session,
        available: session.available + 1,
        students: session.students.filter((student) => student !== 'Tú'),
        status: 'Plazas abiertas',
      };
    }));
    setTrainingNotice('Inscripción cancelada.');
  };

  const requestCoachBooking = (coachId) => {
    if (requestedCoachIds.includes(coachId)) {
      setRequestedCoachIds((current) => current.filter((id) => id !== coachId));
      setTrainingNotice('Solicitud de clase individual cancelada.');
      return;
    }

    const selectedCoach = coaches.find((coach) => coach.id === coachId);
    const hasGroupOverlap = trainingPool.some((session) =>
      joinedTrainingIds.includes(session.id)
      && session.dayKey === selectedCoach?.dayKey
      && session.startTime < selectedCoach.endTime
      && session.endTime > selectedCoach.startTime
    );
    const hasCoachOverlap = coaches.some((coach) =>
      requestedCoachIds.includes(coach.id)
      && coach.dayKey === selectedCoach?.dayKey
      && coach.startTime < selectedCoach.endTime
      && coach.endTime > selectedCoach.startTime
    );

    if (hasGroupOverlap || hasCoachOverlap) {
      setTrainingNotice('No podés enviar la solicitud: el horario se superpone con otra clase.');
      return;
    }

    setRequestedCoachIds((current) => [...current, coachId]);
    setTrainingNotice('Solicitud de clase enviada.');
  };

  const joinTournament = (tournamentId) => {
    if (joinedTournamentIds.includes(tournamentId)) return;

    const selectedTournament = tournamentList.find((tournament) => tournament.id === tournamentId);
    const hasOverlap = tournamentList.some((tournament) =>
      joinedTournamentIds.includes(tournament.id)
      && tournament.date === selectedTournament?.date
      && tournament.startTime < selectedTournament.endTime
      && tournament.endTime > selectedTournament.startTime
    );

    if (hasOverlap) {
      setTournamentNotice('No podés inscribirte: el horario se superpone con otro torneo.');
      return;
    }

    setJoinedTournamentIds((current) => [...current, tournamentId]);
    setTournamentNotice('Inscripción al torneo confirmada.');
    setTournamentList((current) => current.map((tournament) => tournament.id === tournamentId
      ? {
          ...tournament,
          availableSeats: Math.max(0, tournament.availableSeats - 1),
          participants: [...tournament.participants, 'Vos'],
        }
      : tournament));
  };

  const cancelTournament = (tournamentId) => {
    if (!joinedTournamentIds.includes(tournamentId)) return;

    setJoinedTournamentIds((current) => current.filter((id) => id !== tournamentId));
    setTournamentList((current) => current.map((tournament) => tournament.id === tournamentId
      ? {
          ...tournament,
          availableSeats: tournament.availableSeats + 1,
          participants: tournament.participants.filter((participant) => participant !== 'Vos'),
        }
      : tournament));
    setTournamentNotice('Inscripción al torneo cancelada.');
  };

  const createTournament = () => {
    const { name, clubId, courtId, date, from, to } = tournamentDraft;
    if (!name || !date || !from || !to || from >= to) {
      setTournamentNotice('Completá nombre, día y un horario válido.');
      return;
    }

    const conflict = tournamentEventsList.some((event) =>
      event.clubId === clubId && String(event.courtId) === String(courtId)
      && event.date === date && event.from < to && event.to > from
    );
    if (conflict) {
      setTournamentNotice('La cancha ya está bloqueada por otro torneo en ese horario.');
      return;
    }

    const club = clubs.find((item) => item.id === clubId);
    const court = courts.find((item) => String(item.id) === String(courtId));
    setTournamentEventsList((current) => [{
      id: Date.now(), name, clubId, courtId, date, from, to,
      displayDate: new Date(`${date}T12:00:00`).toLocaleDateString('es-AR'),
      court: court?.name || 'Cancha', teams: 0, status: 'Pendiente', clubName: club?.name || clubId,
    }, ...current]);
    setTournamentNotice('Torneo creado y cancha bloqueada.');
    setShowTournamentForm(false);
  };

  const invitePlayerToTournament = () => {
    const tournament = tournamentList.find((item) => item.id === tournamentInviteId);
    const player = players.find((item) => String(item.id) === String(tournamentInvitePlayerId));
    if (!tournament || !player?.phone) return;

    const clubName = clubs.find((club) => club.id === tournament.clubId)?.name || tournament.city;
    const message = encodeURIComponent(
      `Hola ${player.name}, te invito a inscribirte conmigo en ${tournament.name}. Club: ${clubName}. Fecha: ${tournament.date}. Categoría: ${tournament.category}. Quedan ${tournament.availableSeats} plazas disponibles. ¿Te sumás?`
    );
    window.open(`https://wa.me/${player.phone.replace(/\D/g, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
    setTournamentInviteId(null);
    setTournamentInvitePlayerId('');
  };

  const openMaps = (court, provider = 'google') => {
    const query = encodeURIComponent(`${court.name} ${court.address}`);
    const url = provider === 'apple'
      ? `https://maps.apple.com/?q=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const updateCourtFilter = (field, value) => {
    setDraftCourtFilters((current) => ({ ...current, [field]: value }));
  };

  const toggleIncludedClub = (clubId) => {
    setIncludedClubIds((current) => current.includes(clubId)
      ? current.filter((id) => id !== clubId)
      : [...current, clubId]);
  };

  const formatFilterDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatOpeningFilter = (opening) => ({
    abierta: 'Abierta',
    'semi-cerrada': 'Semi-cerrada',
    cerrada: 'Cerrada',
  }[opening] || 'Cualquiera');

  const applyCourtFilters = () => {
    setAppliedCourtFilters(draftCourtFilters);
  };

  const activeFilterSummary = [
    appliedCourtFilters.opening ? `Apertura: ${formatOpeningFilter(appliedCourtFilters.opening)}` : '',
    appliedCourtFilters.date ? `Fecha: ${formatFilterDate(appliedCourtFilters.date)}` : '',
    `Horario: ${appliedCourtFilters.from} - ${appliedCourtFilters.to}`,
  ].filter(Boolean);

  const renderPlayerTabContent = (tab = activeTab) => {
    switch (tab) {
      case 'Buscar':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="advanced-filters" aria-label="Filtros avanzados">
                  <div className="section-header filter-header">
                    <h3>Filtros de {advancedFilterType.toLowerCase()}</h3>
                  </div>
                  <div className="filter-tabs" role="tablist" aria-label="Tipo de búsqueda">
                      {['Pool de partidos', 'Canchas', 'Jugadores'].map((filterType) => (
                      <button
                        key={filterType}
                        type="button"
                        role="tab"
                        aria-selected={advancedFilterType === filterType}
                        className={advancedFilterType === filterType ? 'filter-tab active' : 'filter-tab'}
                        onClick={() => setAdvancedFilterType(filterType)}
                      >
                        {filterType}
                      </button>
                    ))}
                  </div>
                  <div className="filter-fields">
                    {advancedFilterType === 'Pool de partidos' ? (
                      <>
                        <label>Género
                          <select value={selectedGender} onChange={(event) => setSelectedGender(event.target.value)} aria-label="Género del partido">
                            <option value="femenino">Femenino</option>
                            <option value="masculino">Masculino</option>
                            <option value="mixto">Mixto</option>
                          </select>
                        </label>
                        <label>Fecha
                          <input type="date" value={draftCourtFilters.date} onChange={(event) => updateCourtFilter('date', event.target.value)} aria-label="Fecha del partido" />
                        </label>
                        <label>Desde
                          <input type="time" value={draftCourtFilters.from} onChange={(event) => updateCourtFilter('from', event.target.value)} aria-label="Hora inicial del partido" />
                        </label>
                        <label>Hasta
                          <input type="time" value={draftCourtFilters.to} onChange={(event) => updateCourtFilter('to', event.target.value)} aria-label="Hora final del partido" />
                        </label>
                        <label>Nivel
                          <select value={selectedPlayerLevel} onChange={(event) => setSelectedPlayerLevel(event.target.value)} aria-label="Nivel del partido">
                            {availablePlayerLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                          </select>
                        </label>
                      </>
                    ) : null}
                    {advancedFilterType === 'Canchas' ? (
                      <>
                        <div className="club-filter-field">
                          <span>Clubes incluidos</span>
                          <div className="club-filter-options" role="group" aria-label="Clubes incluidos">
                            {clubs.map((club) => (
                              <button
                                key={club.id}
                                type="button"
                                className={includedClubIds.includes(club.id) ? 'club-filter-option selected' : 'club-filter-option'}
                                aria-pressed={includedClubIds.includes(club.id)}
                                onClick={() => toggleIncludedClub(club.id)}
                              >
                                {club.name}
                              </button>
                            ))}
                          </div>
                          <small className="filter-hint">Sin selección: se incluyen todos los clubes.</small>
                        </div>
                        <label>Estado de la cancha
                          <select value={draftCourtFilters.opening} onChange={(event) => updateCourtFilter('opening', event.target.value)} aria-label="Apertura">
                            <option value="">Cualquiera</option>
                            <option value="abierta">Abierta</option>
                            <option value="semi-cerrada">Semi-cerrada</option>
                            <option value="cerrada">Cerrada</option>
                          </select>
                          <small className="filter-hint">Se construye con opiniones de usuarios.</small>
                        </label>
                        <label>Fecha
                          <input type="date" value={draftCourtFilters.date} onChange={(event) => updateCourtFilter('date', event.target.value)} aria-label="Fecha de disponibilidad" />
                        </label>
                        <label>Desde
                          <input type="time" value={draftCourtFilters.from} onChange={(event) => updateCourtFilter('from', event.target.value)} aria-label="Hora inicial" />
                        </label>
                        <label>Hasta
                          <input type="time" value={draftCourtFilters.to} onChange={(event) => updateCourtFilter('to', event.target.value)} aria-label="Hora final" />
                        </label>
                        <label>Valoración de jugadores
                          <select defaultValue="">
                            <option value="">Cualquier valoración</option>
                            <option value="1">1 estrella o más</option>
                            <option value="2">2 estrellas o más</option>
                            <option value="3">3 estrellas o más</option>
                            <option value="4">4 estrellas o más</option>
                            <option value="5">5 estrellas</option>
                          </select>
                          <small className="filter-hint">Basada en opiniones de jugadores.</small>
                        </label>
                      </>
                    ) : null}
                    {advancedFilterType === 'Jugadores' ? (
                      <>
                        <label>Género
                          <select value={selectedGender} onChange={(event) => setSelectedGender(event.target.value)} aria-label="Género del jugador">
                            <option value="femenino">Femenino</option>
                            <option value="masculino">Masculino</option>
                            <option value="mixto">Mixto</option>
                          </select>
                        </label>
                        <label>Nivel
                          <select value={selectedPlayerLevel} onChange={(event) => setSelectedPlayerLevel(event.target.value)} aria-label="Nivel">
                            {availablePlayerLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                          </select>
                        </label>
                        <label>Estilo
                          <select defaultValue="">
                            <option value="">Cualquier estilo</option>
                            <option value="defensa">Defensa</option>
                            <option value="volea">Volea y red</option>
                            <option value="ataque">Ataque</option>
                          </select>
                        </label>
                        <label>Disponibilidad
                          <select defaultValue="">
                            <option value="">Cualquier momento</option>
                            <option value="hoy">Hoy</option>
                            <option value="manana">Mañana</option>
                            <option value="fin-semana">Fin de semana</option>
                          </select>
                        </label>
                      </>
                    ) : null}
                  </div>
                  <button type="button" className="primary-btn small-btn" onClick={applyCourtFilters}>Aplicar filtros</button>
              </div>

              <div className="applied-filter-summary" aria-live="polite">
                <strong>Filtros aplicados</strong>
                <span>{activeFilterSummary.join(' · ')}</span>
              </div>
            </section>

            {advancedFilterType === 'Canchas' ? (
              <section className="panel">
                <div className="section-header">
                  <h3>Canchas disponibles</h3>
                  <span className="filter-result-label">Ordenadas por valoración</span>
                </div>
                <div className="court-list">
                  {filteredCourtStates.map((court) => (
                    <button
                      key={court.id}
                      type="button"
                      className={selectedCourt.id === court.id ? 'court-card active' : 'court-card'}
                      onClick={() => setSelectedCourt(court)}
                    >
                      <div className="court-top">
                        <div>
                          <strong>{court.name}</strong>
                          <small>{court.club} · {court.distance}</small>
                        </div>
                        <span>{court.price}</span>
                      </div>
                      <span className="court-rating" aria-label={`Valoración ${court.rating} de 5 estrellas`}>★ {court.rating.toFixed(1)} · Opiniones de jugadores</span>
                      <div className="slot-row">
                        {court.slots.map((slot) => <span key={slot}>{slot}</span>)}
                      </div>
                      <span className={`status-pill ${court.status.toLowerCase().replace(/\s+/g, '-')}`}>{court.status}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {advancedFilterType === 'Pool de partidos' ? (
            <section className="panel pool-panel">
              <div className="section-header">
                <h3>Pool de partidos</h3>
                <button type="button" className="link-btn" onClick={handleReserveClick}>Crear partido</button>
              </div>
              <p className="pool-distance-hint">Jugadores disponibles dentro de un radio de 10 km.</p>

              <div className="match-pool">
                {visibleMatches.map((match) => (
                  <div key={match.id} className="match-card">
                    <div className="match-header">
                      <strong>{match.format}</strong>
                      <span className={match.notified ? 'match-status ok' : 'match-status'}>{match.status}</span>
                    </div>
                    <p>{match.city} · {match.level} · {match.time}</p>
                    <small>Faltan {match.missingPlayers} jugador/es para completar la pareja</small>

                    <div className="recipient-picker">
                      <span>Jugadores disponibles en ese horario</span>
                      <div className="recipient-list">
                        {nearbyPoolPlayers.map((player) => (
                          <label key={`${match.id}-${player.id}`} className="recipient-option">
                            <input
                              type="checkbox"
                              checked={(selectedRecipients[match.id] || []).includes(player.id)}
                              onChange={() => toggleRecipient(match.id, player.id)}
                            />
                            <span>{player.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button type="button" className="primary-btn small-btn" onClick={() => notifyPlayers(match.id)}>
                      {match.notified ? 'Notificados' : 'Enviar WhatsApp'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
            ) : null}

            {advancedFilterType === 'Jugadores' ? (
            <section className="panel">
              <div className="section-header">
                <h3>Resultados</h3>
                <span className="filter-result-label">Contactá para coordinar</span>
              </div>

              <div className="result-list">
                {visiblePlayers.map((player) => (
                  <div key={player.id} className="result-item">
                    <div className="player-badge" style={{ background: player.accent }}>{player.name.slice(0, 1)}</div>
                    <div>
                      <strong>{player.name}</strong>
                      <p>{player.city} · {player.level}</p>
                    </div>
                    <span>{player.phoneVisible ? 'Contacto visible' : player.availability}</span>
                    <button type="button" className="whatsapp-btn" onClick={() => contactPlayerOnWhatsApp(player)}>
                      Consultar disponibilidad
                    </button>
                  </div>
                ))}
              </div>
            </section>
            ) : null}
          </div>
        );
      case 'Canchas':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Listado de canchas</h3>
                <button type="button" className="link-btn">Mapa</button>
              </div>
              <div className="court-list">
                {rankedCourtStates.map((court) => (
                  <button
                    key={court.id}
                    type="button"
                    className={selectedCourt.id === court.id ? 'court-card active' : 'court-card'}
                    onClick={() => setSelectedCourt(court)}
                  >
                    <div className="court-top">
                      <div>
                        <strong>{court.name}</strong>
                        <small>{court.distance}</small>
                      </div>
                      <span>{court.price}</span>
                    </div>
                    <p className="court-club">{court.club}</p>
                    <span className="court-rating" aria-label={`Valoración ${court.rating} de 5 estrellas`}>★ {court.rating.toFixed(1)} · Opiniones de jugadores</span>
                    <div className="slot-row">
                      {court.slots.map((slot) => (
                        <span key={slot}>{slot}</span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={`status-pill court-opening ${court.status.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsCourtPhotoOpen(true);
                      }}
                      aria-label={`Ver foto de la cancha. Apertura: ${court.status}`}
                    >
                      {court.status}
                    </button>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Mapa de canchas</h3>
                <button type="button" className="link-btn">Cerca de ti</button>
              </div>

              <div className="map-card">
                {rankedCourtStates.map((court) => (
                  <button
                    key={court.id}
                    type="button"
                    className={selectedCourt.id === court.id ? 'map-pin active' : 'map-pin'}
                    style={{ left: court.mapPosition.left, top: court.mapPosition.top }}
                    onClick={() => setSelectedCourt(court)}
                    aria-label={`Seleccionar ${court.name}`}
                    title={court.name}
                  />
                ))}
                <div className="map-center">
                  <span>{selectedCourt.name}</span>
                  <strong>{selectedCourt.distance}</strong>
                </div>
                <div className="map-actions">
                  <button type="button" className="mini-map-btn" onClick={() => openMaps(selectedCourt, 'google')}>
                    Google Maps
                  </button>
                  <button type="button" className="mini-map-btn" onClick={() => openMaps(selectedCourt, 'apple')}>
                    Apple Maps
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      case 'Entrenamiento':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Clasificado por entrenador</h3>
                <button type="button" className="link-btn">Ver todos</button>
              </div>

              <div className="training-grid">
                {trainingPool.map((session) => (
                  <div key={session.id} className="training-card">
                    <div className="training-header">
                      <div>
                        <p className="eyebrow">Entrenador</p>
                        <strong>{session.coach}</strong>
                      </div>
                      <span className={`training-status ${session.available === 0 ? 'full' : session.available === 1 ? 'almost' : 'open'}`}>
                        {session.status}
                      </span>
                    </div>

                    <div className="training-meta">
                      <span>{session.specialty}</span>
                      <span>{session.time}</span>
                      <span>{session.duration}</span>
                    </div>

                    <div className="training-footer">
                      <div>
                        <small>Plazas libres</small>
                        <strong>{session.available}</strong>
                      </div>
                      <button
                        type="button"
                        className="primary-btn small-btn"
                        onClick={() => joinedTrainingIds.includes(session.id)
                          ? handleCancelTraining(session.id)
                          : handleJoinTraining(session.id)}
                        disabled={session.available === 0 && !joinedTrainingIds.includes(session.id)}
                      >
                        {joinedTrainingIds.includes(session.id)
                          ? 'Cancelar inscripción'
                          : session.available === 0 ? 'Completa' : 'Unirme'}
                      </button>
                    </div>

                    <div className="student-block">
                      <small>Alumnos que tomarían la clase</small>
                      <div className="student-list">
                        {session.students.map((student) => (
                          <span key={`${session.id}-${student}`} className="student-chip">{student}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {trainingNotice ? <p className="training-notice" role="status">{trainingNotice}</p> : null}
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Profesores disponibles</h3>
                <button type="button" className="link-btn">Filtrar</button>
              </div>

              <div className="coach-list">
                {coaches.map((coach) => (
                  <div key={coach.id} className="coach-card">
                    <div className="coach-avatar">{coach.name.slice(0, 1)}</div>
                    <div className="coach-info">
                      <strong>{coach.name}</strong>
                      <span>{coach.specialty}</span>
                      <small>{coach.availability}</small>
                    </div>
                    <div className="coach-meta">
                      <strong>{coach.rating}</strong>
                      <span>{coach.price}</span>
                    </div>
                    <button
                      type="button"
                      className="primary-btn small-btn"
                      onClick={() => requestCoachBooking(coach.id)}
                      disabled={false}
                    >
                      {requestedCoachIds.includes(coach.id) ? 'Cancelar solicitud' : 'Reservar'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'Torneos':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Torneos</h3>
                <button type="button" className="link-btn">Calendario</button>
              </div>

              <div className="tournament-list">
                {tournamentList.map((tournament) => (
                  <div key={tournament.id} className="tournament-card">
                    <div className="tournament-image">
                      <img src={tournament.image} alt={tournament.name} />
                    </div>
                    <div>
                      <strong>{tournament.name}</strong>
                      <p>{clubs.find((club) => club.id === tournament.clubId)?.name || tournament.city}</p>
                      <small>{tournament.city}</small>
                    </div>
                    <div className="tournament-date">
                      <span>{tournament.date}</span>
                      <small>{tournament.startTime} - {tournament.endTime}</small>
                      <small>{tournament.category}</small>
                    </div>
                    <div className="tournament-capacity">
                      <strong>{tournament.availableSeats} disponibles</strong>
                      <span>{tournament.totalSeats} plazas totales</span>
                    </div>
                    <div className="tournament-participants">
                      <small>Jugadores inscriptos</small>
                      <span>{tournament.participants.join(', ')}</span>
                    </div>
                    <button
                      type="button"
                      className="primary-btn small-btn"
                      onClick={() => joinedTournamentIds.includes(tournament.id)
                        ? cancelTournament(tournament.id)
                        : joinTournament(tournament.id)}
                      disabled={tournament.availableSeats === 0 && !joinedTournamentIds.includes(tournament.id)}
                    >
                      {joinedTournamentIds.includes(tournament.id)
                        ? 'Cancelar inscripción'
                        : tournament.availableSeats === 0 ? 'Completo' : 'Sumarme'}
                    </button>
                    <button
                      type="button"
                      className="secondary-btn small-btn"
                      onClick={() => setTournamentInviteId(tournament.id)}
                      disabled={tournament.availableSeats === 0}
                    >
                      Invitar compañero
                    </button>
                    {tournamentInviteId === tournament.id ? (
                      <div className="tournament-invite" aria-label={`Invitar a un compañero a ${tournament.name}`}>
                        <label>Compañero
                          <select value={tournamentInvitePlayerId} onChange={(event) => setTournamentInvitePlayerId(event.target.value)}>
                            <option value="">Seleccionar jugador</option>
                            {players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
                          </select>
                        </label>
                        <button type="button" className="primary-btn small-btn" onClick={invitePlayerToTournament} disabled={!tournamentInvitePlayerId}>
                          Enviar por WhatsApp
                        </button>
                        <button type="button" className="link-btn" onClick={() => setTournamentInviteId(null)}>
                          Cancelar
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              {tournamentNotice ? <p className="training-notice" role="status">{tournamentNotice}</p> : null}
            </section>
          </div>
        );
      case 'Perfil':
        return (
          <div className="tab-content">
            <section className="panel profile-panel">
              <div className="profile-header">
                <div className={`avatar photo-frame shot-${selectedShot}`}>
                  <img src={selectedAvatar.image} alt={selectedAvatar.name} />
                </div>
                <div>
                  <h3>{selectedAvatar.name}</h3>
                  <p>Perfil deportivo</p>
                </div>
              </div>

              <div className="profile-meta">
                <span>Nivel 4.2</span>
                <span className={selectedShot === 'drive' ? 'active-shot' : ''}>Drive</span>
                <span className={selectedShot === 'reves' ? 'active-shot' : ''}>Revés</span>
              </div>

              <div className="avatar-controls">
                <div className="selector-group">
                  <label>Avatar</label>
                  <div className="avatar-options">
                    {avatarSet.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        className={selectedAvatar.id === avatar.id ? 'avatar-option active' : 'avatar-option'}
                        onClick={() => setSelectedAvatarId(avatar.id)}
                      >
                        <img src={avatar.image} alt={avatar.name} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="selector-group">
                  <label>Estilo</label>
                  <div className="shot-options">
                    {['drive', 'reves'].map((shot) => (
                      <button
                        key={shot}
                        type="button"
                        className={selectedShot === shot ? 'shot-option active' : 'shot-option'}
                        onClick={() => setSelectedShot(shot)}
                      >
                        {shot === 'drive' ? 'Drive' : 'Revés'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="profile-details">
                <div>
                  <label>Disponibilidad</label>
                  <strong>18:00 - 22:00</strong>
                </div>
                <div>
                  <label>Ciudad</label>
                  <strong>{currentLocationLabel}</strong>
                </div>
                <div>
                  <label>Contacto</label>
                  <strong>{players[1].phoneVisible ? '+34 612 345 678' : 'Oculto por privacidad'}</strong>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Mi Actividad</h3>
                <button type="button" className="link-btn">Ver más</button>
              </div>
              <div className="stats-grid">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-box">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'Inicio':
      default:
        return (
          <>
            <section className="hero-banner">
              <div>
                <p className="eyebrow light">Premium</p>
                <h2>Descubre rivales y canchas cercanas</h2>
                <p>Filtra por nivel, horario y estilo de juego para reservar en pocos clics.</p>
              </div>
              <button type="button" className="primary-btn" onClick={() => setActiveTab('Canchas')}>Ver mapa</button>
            </section>

            {activeTab !== 'Inicio' ? (
            <div className="main-grid">
              <div className="main-column">
                <section className="panel">
                  <div className="section-header">
                    <h3>Canchas disponibles</h3>
                    <button type="button" className="link-btn">Ver todas</button>
                  </div>

                  <div className="court-list">
                    {rankedCourtStates.map((court) => (
                      <button
                        key={court.id}
                        type="button"
                        className={selectedCourt.id === court.id ? 'court-card active' : 'court-card'}
                        onClick={() => setSelectedCourt(court)}
                      >
                        <div className="court-top">
                          <div>
                            <strong>{court.name}</strong>
                            <small>{court.distance}</small>
                          </div>
                          <span>{court.price}</span>
                        </div>
                        <p className="court-club">{court.club}</p>
                        <span className="court-rating" aria-label={`Valoración ${court.rating} de 5 estrellas`}>★ {court.rating.toFixed(1)} · Opiniones de jugadores</span>
                        <div className="slot-row">
                          {court.slots.map((slot) => (
                            <span key={slot}>{slot}</span>
                          ))}
                        </div>
                        <button
                          type="button"
                          className={`status-pill court-opening ${court.status.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setIsCourtPhotoOpen(true);
                          }}
                          aria-label={`Ver foto de la cancha. Apertura: ${court.status}`}
                        >
                          {court.status}
                        </button>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="panel">
                  <div className="section-header">
                    <h3>Mapa de canchas</h3>
                    <button type="button" className="link-btn">Cerca de ti</button>
                  </div>

                  <div className="map-card">
                    {rankedCourtStates.map((court) => (
                      <button
                        key={court.id}
                        type="button"
                        className={selectedCourt.id === court.id ? 'map-pin active' : 'map-pin'}
                        style={{ left: court.mapPosition.left, top: court.mapPosition.top }}
                        onClick={() => setSelectedCourt(court)}
                        aria-label={`Seleccionar ${court.name}`}
                        title={court.name}
                      />
                    ))}
                    <div className="map-center">
                      <span>{selectedCourt.name}</span>
                      <strong>{selectedCourt.distance}</strong>
                    </div>
                    <div className="map-actions">
                      <button type="button" className="mini-map-btn" onClick={() => openMaps(selectedCourt, 'google')}>
                        Google Maps
                      </button>
                      <button type="button" className="mini-map-btn" onClick={() => openMaps(selectedCourt, 'apple')}>
                        Apple Maps
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="side-column">
                <section className="panel activity-panel">
                  <div className="section-header">
                    <h3>Mi Actividad</h3>
                    <button type="button" className="link-btn">Ver más</button>
                  </div>

                  <div className="stats-grid">
                    {stats.map((stat) => (
                      <div key={stat.label} className="stat-box">
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel player-panel">
                  <div className="section-header">
                    <h3>Jugadores cerca</h3>
                    <button type="button" className="link-btn">Buscar</button>
                  </div>

                  <div className="player-list">
                    {players.map((player) => (
                      <div key={player.id} className="player-item">
                        <div className="player-badge" style={{ background: player.accent }}>{player.name.slice(0, 1)}</div>
                        <div className="player-info">
                          <strong>{player.name}</strong>
                          <span>{player.level} · {player.style}</span>
                        </div>
                        <small>{player.availability}</small>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
            ) : null}

          </>
        );
    }
  };

  const renderPlayerContent = () => {
    if (activeTab === 'Inicio') {
      return (
        <>
          {renderPlayerTabContent('Inicio')}
          {renderPlayerTabContent('Buscar')}
        </>
      );
    }

    return renderPlayerTabContent();
  };

  const renderTrainerContent = () => {
    const trainerClubOptions = trainerAvailableClubs.length ? trainerAvailableClubs : clubs;
    const activeTrainerCourt = trainerClubCourts.find((court) => court.id === selectedCourt.id) || trainerClubCourts[0];

    const trainerClubSwitcher = (
      <div className="club-selector-row">
        {trainerClubOptions.map((club) => {
          const active = trainerActiveClubId === club.id;
          return (
            <button
              key={club.id}
              type="button"
              className={active ? 'club-tag active' : 'club-tag'}
              onClick={() => setSelectedClubId(club.id)}
            >
              {active ? '✓ ' : ''}{club.name}
            </button>
          );
        })}
      </div>
    );

    switch (activeTab) {
      case 'Clases':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Clases programadas · {trainerActiveClub.name}</h3>
                <button type="button" className="link-btn">Ver calendario</button>
              </div>

              {trainerClubSwitcher}

              <div className="booking-list">
                {trainerClubClasses.map((session) => (
                  <div key={session.id} className="booking-row">
                    <div>
                      <strong>{session.title}</strong>
                      <p>{session.court} · {session.students} alumnos</p>
                    </div>
                    <span>{session.time}</span>
                    <span className="booking-status confirmada">{session.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'Reservas':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Mis reservas · {trainerActiveClub.name}</h3>
                <button type="button" className="link-btn">Exportar</button>
              </div>

              {trainerClubSwitcher}

              <div className="booking-list">
                {trainerClubBookings.map((booking) => (
                  <div key={booking.id} className="booking-row">
                    <div>
                      <strong>{booking.note}</strong>
                      <p>{booking.court}</p>
                    </div>
                    <span>{booking.time}</span>
                    <span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'Canchas':
      case 'Calendario':
      default:
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Reservar cancha desde tus clubes</h3>
                <button type="button" className="link-btn">Disponibilidad</button>
              </div>

              {trainerClubSwitcher}

              <div className="court-list">
                {trainerClubCourts.map((court) => (
                  <button
                    key={court.id}
                    type="button"
                    className={activeTrainerCourt.id === court.id ? 'court-card active' : 'court-card'}
                    onClick={() => setSelectedCourt(court)}
                  >
                    <div className="court-top">
                      <div>
                        <strong>{court.name}</strong>
                        <small>{trainerActiveClub.name}</small>
                      </div>
                      <span>{court.price}</span>
                    </div>
                    <div className="slot-row">
                      {court.slots.map((slot) => (
                        <span key={slot}>{slot}</span>
                      ))}
                    </div>
                    <span className={`status-pill ${court.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {court.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Confirmar reserva</h3>
              </div>

              <div className="club-profile">
                <div className="club-logo">ZP</div>
                <div>
                  <strong>{trainerActiveClub.name}</strong>
                  <p>{activeTrainerCourt.name}</p>
                  <small>{activeTrainerCourt.price} · 18:00 / 19:00</small>
                </div>
              </div>

              <div className="club-actions" style={{ marginTop: '14px' }}>
                <button type="button" className="primary-btn" onClick={() => handleRoleCourtBooking('entrenador', '18:00')}>
                  Reservar cancha
                </button>
                <button type="button" className="status-btn">Ver mapa</button>
              </div>
            </section>
          </div>
        );
    }
  };

  const renderTournamentContent = () => {
    switch (activeTab) {
      case 'Torneos':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Eventos del torneo</h3>
                <button type="button" className="link-btn" onClick={() => setShowTournamentForm((current) => !current)}>
                  {showTournamentForm ? 'Cerrar' : 'Crear'}
                </button>
              </div>

              {showTournamentForm ? (
                <div className="tournament-form">
                  <label>Nombre del torneo
                    <input value={tournamentDraft.name} onChange={(event) => setTournamentDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Ej.: Copa Primavera" />
                  </label>
                  <label>Club
                    <select value={tournamentDraft.clubId} onChange={(event) => setTournamentDraft((current) => ({ ...current, clubId: event.target.value }))}>
                      {clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
                    </select>
                  </label>
                  <label>Cancha
                    <select value={tournamentDraft.courtId} onChange={(event) => setTournamentDraft((current) => ({ ...current, courtId: event.target.value }))}>
                      {courts.filter((court) => court.clubId === tournamentDraft.clubId).map((court) => <option key={court.id} value={court.id}>{court.name}</option>)}
                    </select>
                  </label>
                  <label>Día
                    <input type="date" value={tournamentDraft.date} onChange={(event) => setTournamentDraft((current) => ({ ...current, date: event.target.value }))} />
                  </label>
                  <label>Desde
                    <input type="time" value={tournamentDraft.from} onChange={(event) => setTournamentDraft((current) => ({ ...current, from: event.target.value }))} />
                  </label>
                  <label>Hasta
                    <input type="time" value={tournamentDraft.to} onChange={(event) => setTournamentDraft((current) => ({ ...current, to: event.target.value }))} />
                  </label>
                  <button type="button" className="primary-btn small-btn" onClick={createTournament}>Verificar y crear</button>
                </div>
              ) : null}

              {tournamentNotice ? <p className="training-notice" role="status">{tournamentNotice}</p> : null}

              <div className="booking-list">
                {tournamentEventsList.map((event) => (
                  <div key={event.id} className="booking-row">
                    <div>
                      <strong>{event.name}</strong>
                      <p>{event.displayDate || event.date} · {event.court}</p>
                      {event.from ? <small>{event.from} - {event.to} · {event.clubName}</small> : null}
                    </div>
                    <span>{event.teams} equipos</span>
                    <span className="booking-status pendiente">{event.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'Canchas':
      case 'Inscripciones':
      default:
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Reservar cancha para torneo</h3>
                <button type="button" className="link-btn">Ver fechas</button>
              </div>

              <div className="court-list">
                {rankedCourtStates.map((court) => (
                  <button
                    key={court.id}
                    type="button"
                    className={selectedCourt.id === court.id ? 'court-card active' : 'court-card'}
                    onClick={() => setSelectedCourt(court)}
                  >
                    <div className="court-top">
                      <div>
                        <strong>{court.name}</strong>
                        <small>{court.distance}</small>
                      </div>
                      <span>{court.price}</span>
                    </div>
                    <div className="slot-row">
                      {court.slots.map((slot) => (
                        <span key={slot}>{slot}</span>
                      ))}
                    </div>
                    <span className={`status-pill ${court.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {court.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Confirmar bloque del torneo</h3>
              </div>

              <div className="club-profile">
                <div className="club-logo">ZP</div>
                <div>
                  <strong>{selectedCourt.name}</strong>
                  <p>Bloque de competencia</p>
                  <small>{selectedCourt.price} · 20:00 / 21:30</small>
                </div>
              </div>

              <div className="club-actions" style={{ marginTop: '14px' }}>
                <button type="button" className="primary-btn" onClick={() => handleRoleCourtBooking('torneos', '20:00')}>
                  Reservar para evento
                </button>
                <button type="button" className="status-btn">Asignar grupos</button>
              </div>
            </section>
          </div>
        );
    }
  };

  const renderClubContent = () => {
    switch (activeTab) {
      case 'Canchas':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Configurador de canchas</h3>
                <button type="button" className="link-btn">Guardar</button>
              </div>

              <div className="club-court-list">
                {rankedCourtStates.map((court) => (
                  <div key={court.id} className="club-court-card">
                    <div className="club-court-head">
                      <div>
                        <strong>{court.name}</strong>
                      </div>
                      <span className={`status-pill ${court.status.toLowerCase().replace(/\s+/g, '-')}`}>{court.status}</span>
                    </div>

                    <label className="opening-hours-field">
                      <span>Horario de apertura</span>
                      <input
                        value={court.openingHours || '08:00 - 22:00'}
                        onChange={(event) => updateCourtHours(court.id, event.target.value)}
                      />
                    </label>

                    <label className="opening-hours-field" htmlFor={`court-price-${court.id}`}>
                      <span>Costo por hora</span>
                      <input
                        id={`court-price-${court.id}`}
                        value={court.price || ''}
                        onChange={(event) => updateCourtPrice(court.id, event.target.value)}
                        inputMode="decimal"
                      />
                    </label>

                    <div className="court-rate-grid">
                      {[
                        ['precio_partido', 'Costo partido'],
                        ['precio_clase', 'Costo clase'],
                        ['precio_torneo', 'Costo torneo'],
                      ].map(([field, label]) => (
                        <label key={field} className="opening-hours-field" htmlFor={`${field}-${court.id}`}>
                          <span>{label}</span>
                          <input
                            id={`${field}-${court.id}`}
                            value={court[field] || court.price || ''}
                            onChange={(event) => updateCourtRate(court.id, field, event.target.value)}
                            inputMode="decimal"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="club-actions">
                      {['Abierta', 'Semicerrada', 'Cerrada'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={court.status === status ? 'status-btn active' : 'status-btn'}
                          onClick={() => updateCourtStatus(court.id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="maintenance-form">
                <div className="section-header">
                  <h3>Programar mantenimiento</h3>
                </div>
                <div className="maintenance-fields">
                  <label>Cancha
                    <select value={maintenanceDraft.courtId} onChange={(event) => setMaintenanceDraft((current) => ({ ...current, courtId: event.target.value }))}>
                      {rankedCourtStates.map((court) => <option key={court.id} value={court.id}>{court.name}</option>)}
                    </select>
                  </label>
                  <label>Fecha
                    <input type="date" value={maintenanceDraft.date} onChange={(event) => setMaintenanceDraft((current) => ({ ...current, date: event.target.value }))} />
                  </label>
                  <label>Desde
                    <input type="time" value={maintenanceDraft.from} onChange={(event) => setMaintenanceDraft((current) => ({ ...current, from: event.target.value }))} />
                  </label>
                  <label>Hasta
                    <input type="time" value={maintenanceDraft.to} onChange={(event) => setMaintenanceDraft((current) => ({ ...current, to: event.target.value }))} />
                  </label>
                </div>
                <button type="button" className="primary-btn small-btn" onClick={addMaintenanceBlock}>Agregar mantenimiento</button>
              </div>
            </section>
          </div>
        );
      case 'Reservas':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Reservas por cancha · {selectedClub.name}</h3>
                <button type="button" className="link-btn">Exportar</button>
              </div>

              <div className="booking-list">
                {(selectedRole === 'club' ? apiReservations.map((reservation) => ({
                  id: reservation.id,
                  player: reservation.jugador_nombre || 'Jugador registrado',
                  court: reservation.cancha_nombre,
                  time: reservation.hora,
                  status: reservation.estado,
                  amount: reservation.monto || '-',
                })) : selectedClubBookings).map((booking) => (
                  <div key={booking.id} className="booking-row">
                    <div>
                      <strong>{booking.player}</strong>
                      <p>{booking.court} · {booking.time}</p>
                    </div>
                    <span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                    <strong className="booking-price">{booking.amount}</strong>
                  </div>
                ))}
                {selectedRole === 'club' && (!authenticatedUser || apiReservationsLoaded) && apiReservations.length === 0 ? (
                  <p className="empty-state">No hay reservas registradas en MySQL para este club.</p>
                ) : null}
              </div>
            </section>
          </div>
        );
      case 'Entrenamiento':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Entrenamiento</h3>
                <button type="button" className="link-btn">Ver todos</button>
              </div>

              <div className="coach-list">
                {coaches.map((coach) => (
                  <div key={coach.id} className="coach-card">
                    <div className="coach-avatar">{coach.name.slice(0, 1)}</div>
                    <div className="coach-info">
                      <strong>{coach.name}</strong>
                      <span>{coach.specialty}</span>
                      <small>{coach.availability}</small>
                    </div>
                    <div className="coach-meta">
                      <strong>{coach.rating}</strong>
                      <span>{coach.price}</span>
                    </div>
                    <button
                      type="button"
                      className="primary-btn small-btn"
                      onClick={() => requestCoachBooking(coach.id)}
                      disabled={false}
                    >
                      {requestedCoachIds.includes(coach.id) ? 'Cancelar solicitud' : 'Reservar'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'Perfil':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Club</h3>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setClubProfileDraft({
                      name: selectedClub.name,
                      city: selectedClub.city,
                      address: selectedClub.address,
                      phone: selectedClub.phone || '',
                    });
                    setIsClubEditing((current) => !current);
                  }}
                >
                  {isClubEditing ? 'Cerrar edición' : 'Editar'}
                </button>
              </div>

              <div className="club-profile">
                <div className="club-logo">ZP</div>
                <div>
                  <strong>{selectedClub.name}</strong>
                  <p>Plan mensual activo</p>
                  <small>{selectedClub.city} · Vence: 30/09/2026</small>
                </div>
              </div>
              {isClubEditing ? (
                <div className="club-profile-form">
                  <label>Nombre<input value={clubProfileDraft.name} onChange={(event) => setClubProfileDraft((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label>Ciudad<input value={clubProfileDraft.city} onChange={(event) => setClubProfileDraft((current) => ({ ...current, city: event.target.value }))} /></label>
                  <label>Dirección<input value={clubProfileDraft.address} onChange={(event) => setClubProfileDraft((current) => ({ ...current, address: event.target.value }))} /></label>
                  <label>Teléfono<input value={clubProfileDraft.phone} onChange={(event) => setClubProfileDraft((current) => ({ ...current, phone: event.target.value }))} /></label>
                  <button type="button" className="primary-btn small-btn" onClick={() => setIsClubEditing(false)}>Guardar datos</button>
                </div>
              ) : null}
            </section>
          </div>
        );
      case 'Inicio':
      default:
        return (
          <div className="tab-content">
            <section className="hero-banner club-banner">
              <div>
                <p className="eyebrow light">Club manager</p>
                <h2>Resumen de la jornada</h2>
                <p>Vigila turnos, confirmaciones y estado de las canchas desde tu móvil.</p>
              </div>
              <button type="button" className="primary-btn">Cobrar</button>
            </section>

            <div className="summary-grid">
              <div className="summary-card">
                <span>Turnos hoy</span>
                <strong>18</strong>
              </div>
              <div className="summary-card">
                <span>Confirmadas</span>
                <strong>12</strong>
              </div>
              <div className="summary-card">
                <span>Disponibles</span>
                <strong>3</strong>
              </div>
              <div className="summary-card">
                <span>Plan</span>
                <strong>Mensual</strong>
              </div>
            </div>

            <section className="panel">
              <div className="section-header">
                <h3>Calendario por cancha · {selectedClub.name}</h3>
                <label className="calendar-status-filter">
                  <span>Vista</span>
                  <select value={calendarView} onChange={(event) => setCalendarView(event.target.value)} aria-label="Vista del calendario">
                    <option value="Día">Día</option>
                    <option value="Semana">Semana</option>
                  </select>
                </label>
                {calendarView === 'Día' ? (
                  <label className="calendar-status-filter">
                    <span>Fecha</span>
                    <input type="date" value={calendarDate} onChange={(event) => setCalendarDate(event.target.value)} aria-label="Fecha del calendario" />
                  </label>
                ) : null}
                <label className="calendar-status-filter">
                  <span>Ver</span>
                  <select value={calendarStatusFilter} onChange={(event) => setCalendarStatusFilter(event.target.value)} aria-label="Estado del calendario">
                    <option value="Todos">Todos los estados</option>
                    <option value="Disponible">Disponibles</option>
                    <option value="Reservada">Reservadas</option>
                    <option value="Cumplida">Cumplidas</option>
                    <option value="Cancelada">Canceladas</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Torneo">Torneos</option>
                    <option value="Clase">Clases</option>
                  </select>
                </label>
              </div>

              <div className="court-calendar-grid">
                {calendarCourtsByBlockStatus.map((court) => (
                  <div key={court.id} className="court-calendar-card">
                    <div className="court-calendar-header">
                      <strong>{court.name}</strong>
                      <span className={`status-pill ${court.status.toLowerCase().replace(/\s+/g, '-')}`}>{court.status}</span>
                    </div>
                    <div className="calendar-days">
                      {Object.entries(court.week)
                        .filter(([day]) => calendarView === 'Semana' || day === selectedCalendarDay)
                        .map(([day, slots]) => (
                          <div key={`${court.id}-${day}`} className="calendar-day-column">
                            <span className="calendar-day-label">{day}</span>
                            {slots.map((slot) => (
                              <div
                                key={`${court.id}-${day}-${slot.time}`}
                                className={`day-pill ${slot.status.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                <small>{slot.time}</small>
                                <span>{slot.status}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              {useRealCalendarData && (!authenticatedUser || apiReservationsLoaded) && calendarCourtsByBlockStatus.length === 0 ? (
                <p className="empty-state">No hay reservas de MySQL para esta fecha y estado.</p>
              ) : null}
            </section>
          </div>
        );
    }
  };

  if (!selectedRole || (selectedRole === 'club' && !selectedClubId) || (selectedRole === 'entrenador' && trainerServiceClubs.length === 0)) {
    const isClubSelector = selectedRole === 'club' && !selectedClubId;
    const isTrainerClubSelector = selectedRole === 'entrenador' && trainerServiceClubs.length === 0;

    return (
      <div className={`auth-screen theme-${selectedTheme} ${isClubSelector || isTrainerClubSelector ? 'role-green' : ''}`}>
        <div className="auth-card">
          <div className="brand-wrap">
            <span className="brand-badge">ZP</span>
            <div>
              <p className="eyebrow">ZonaPadel</p>
              <h1>Tu red de pádel</h1>
            </div>
          </div>

          {!selectedRole && !isClubSelector && !isTrainerClubSelector ? (
            <form className="login-form" onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
              {authMode === 'register' ? (
                <label>Nombre
                  <input value={authName} onChange={(event) => setAuthName(event.target.value)} required />
                </label>
              ) : null}
              <label>Email
                <input type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} required />
              </label>
              <label>Contraseña
                <input type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} required />
              </label>
              {authMode === 'register' ? (
                <label>Ingresar como
                  <select value={authRole} onChange={(event) => setAuthRole(event.target.value)}>
                    <option value="jugador">Jugador</option>
                    <option value="club">Club</option>
                    <option value="entrenador">Entrenador</option>
                    <option value="torneos">Organizador de torneos</option>
                  </select>
                </label>
              ) : null}
              <button type="submit" className="primary-btn">{authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
              {authError ? <p className="auth-error" role="alert">{authError}</p> : null}
              <button type="button" className="link-btn auth-switch" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}>
                {authMode === 'login' ? 'Crear una cuenta' : 'Ya tengo una cuenta'}
              </button>
            </form>
          ) : null}

          <h2>{isClubSelector ? 'Elegí tu club' : isTrainerClubSelector ? 'Elegí los clubes donde trabajás' : '¿Cómo quieres entrar?'}</h2>
          <p className="subtitle">
            {isClubSelector
              ? 'Seleccioná la entidad del club para entrar directo a sus reservas y calendario por cancha.'
              : isTrainerClubSelector
                ? 'Elige los clubes con los que prestás servicios para poder reservar canchas desde allí.'
                : 'Elige tu perfil para descubrir jugadores, canchas y torneos según tu estilo de juego.'}
          </p>

          {isClubSelector || isTrainerClubSelector ? (
            <div className="club-selector-grid">
              {clubs.map((club) => {
                const selected = isTrainerClubSelector
                  ? trainerServiceClubs.includes(club.id)
                  : selectedClubId === club.id;

                return (
                  <button
                    key={club.id}
                    type="button"
                    className={selected ? 'club-select-card selected' : 'club-select-card'}
                    onClick={() => {
                      if (isTrainerClubSelector) {
                        toggleTrainerClub(club.id);
                        return;
                      }

                      setSelectedClubId(club.id);
                      setActiveTab('Inicio');
                    }}
                  >
                    <img src={club.image} alt={club.name} />
                    <div>
                      <strong>{club.name}</strong>
                      <span>{club.city}</span>
                      <small>{club.address}</small>
                    </div>
                    {isTrainerClubSelector ? (
                      <span className={selected ? 'club-select-check checked' : 'club-select-check'} aria-hidden="true">
                        {selected ? '✓' : ''}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              {isTrainerClubSelector ? (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (trainerServiceClubs.length > 0) {
                      setSelectedClubId(trainerServiceClubs[0]);
                      setActiveTab('Inicio');
                    }
                  }}
                >
                  Continuar
                </button>
              ) : null}
            </div>
          ) : (
            <div className="auth-options">
              <button type="button" className="role-card primary" onClick={() => setSelectedRole('jugador')}>
                <span className="role-title">Soy jugador</span>
                <span className="role-copy">Perfil deportivo, reserva y partidos de pádel.</span>
              </button>

              <button type="button" className="role-card green" onClick={() => setSelectedRole('club')}>
                <span className="role-title">Soy club</span>
                <span className="role-copy">Gestiona canchas, reservas y horarios.</span>
              </button>

              <button type="button" className="role-card green" onClick={() => setSelectedRole('entrenador')}>
                <span className="role-title">Soy entrenador</span>
                <span className="role-copy">Programá clases y reservá canchas desde el móvil.</span>
              </button>

              <button type="button" className="role-card green" onClick={() => setSelectedRole('torneos')}>
                <span className="role-title">Torneos</span>
                <span className="role-copy">Organizá competiciones y bloqueá canchas.</span>
              </button>
            </div>
          )}

          <div className="theme-picker">
            {userThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={selectedTheme === theme.id ? 'theme-pill active' : 'theme-pill'}
                onClick={() => setSelectedTheme(theme.id)}
                style={{ background: selectedTheme === theme.id ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})` : 'transparent' }}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderRoleContent = () => {
    if (selectedRole === 'club') return renderClubContent();
    if (selectedRole === 'entrenador') return renderTrainerContent();
    if (selectedRole === 'torneos') return renderTournamentContent();
    return renderPlayerContent();
  };

  return (
    <div className={`dashboard-shell theme-${selectedTheme} ${selectedRole && ['club', 'entrenador', 'torneos'].includes(selectedRole) ? 'role-green' : ''}`}>
      <aside className="sidebar desktop-only">
        <div className="brand">
          <span className="brand-badge">ZP</span>
          <div>
            <p className="eyebrow">ZonaPadel</p>
            <strong>{
              selectedRole === 'club' ? selectedClub.name :
              selectedRole === 'entrenador' ? trainerActiveClub.name :
              selectedRole === 'torneos' ? 'Torneos' :
              'Dashboard'
            }</strong>
          </div>
        </div>

        <nav className="nav-menu">
          {navItemsToRender.map((item) => (
            <button
              key={item}
              type="button"
              className={activeTab === item ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                setActiveTab(item);
                setShowAdvancedFilters(item === 'Buscar');
                if (item === 'Inicio') setAdvancedFilterType('Pool de partidos');
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p>Plan mensual</p>
          <strong>{selectedRole === 'club' ? 'Club premium activo' : 'Ver nivel real de jugadores'}</strong>
          <button type="button" className="primary-btn small-btn">Gestionar</button>
        </div>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Bienvenido</p>
            <h1>{selectedRole === 'jugador' ? 'Busca tu próximo partido' : selectedRole === 'club' ? `Panel · ${selectedClub.name}` : selectedRole === 'entrenador' ? `Panel · ${trainerActiveClub.name}` : 'Panel del club'}</h1>
          </div>

          <div className="topbar-tools">
            <button type="button" className="link-btn" onClick={handleLogout}>
              Volver al logueo
            </button>
          </div>
        </header>

        {renderRoleContent()}
      </main>

      <nav className="bottom-nav mobile-only" aria-label="Navegación principal">
        {navItemsToRender.map((item) => (
          <button
            key={item}
            type="button"
            className={activeTab === item ? 'nav-mobile active' : 'nav-mobile'}
            onClick={() => {
              setActiveTab(item);
              setShowAdvancedFilters(item === 'Buscar');
              if (item === 'Inicio') setAdvancedFilterType('Pool de partidos');
            }}
            aria-label={item}
            title={item}
          >
            <span className="nav-label">{item}</span>
            <span className="nav-icon"><NavIcon name={navIcons[item]} active={activeTab === item} /></span>
          </button>
        ))}
      </nav>

      {isCourtPhotoOpen ? (
        <div className="court-photo-backdrop" role="presentation" onClick={() => setIsCourtPhotoOpen(false)}>
          <section
            className="court-photo-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="court-photo-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="dialog-close" onClick={() => setIsCourtPhotoOpen(false)} aria-label="Cerrar foto">
              ×
            </button>
            <img src={selectedCourtClub.image} alt={`Referencia visual de ${selectedCourt.name}`} />
            <div className="court-photo-copy">
              <p className="eyebrow">{selectedCourtClub.name}</p>
              <h2 id="court-photo-title">{selectedCourt.name}</h2>
              <strong>Apertura: {selectedCourt.status}</strong>
              <p>Imagen de referencia del club. La apertura se informa y actualiza según la disponibilidad.</p>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default App;
