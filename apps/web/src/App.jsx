import { useEffect, useMemo, useState } from 'react';

const navItems = ['Inicio', 'Buscar', 'Canchas', 'Entrenamiento', 'Torneos', 'Perfil'];
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
  { id: 1, name: 'Cancha 1', distance: '0.8 km', price: '$18.000/h', surface: 'Pista rápida', slots: ['18:00', '19:00', '20:00'], status: 'Abierta', address: 'Club del Padel Norte', mapPosition: { left: '25%', top: '35%' }, openingHours: '08:00 - 23:00' },
  { id: 2, name: 'Cancha 2', distance: '1.3 km', price: '$22.000/h', surface: 'Pista de vidrio', slots: ['17:30', '18:30', '21:00'], status: 'Semicerrada', address: 'Club del Padel Norte', mapPosition: { left: '58%', top: '48%' }, openingHours: '12:00 - 22:00' },
  { id: 3, name: 'Cancha 3', distance: '2.4 km', price: '$25.000/h', surface: 'Interior climatizada', slots: ['16:00', '18:00', '19:30'], status: 'Cerrada', address: 'Club del Padel Norte', mapPosition: { left: '70%', top: '60%' }, openingHours: 'Sin horario activo' },
];

const players = [
  { id: 1, name: 'Agustín Tapia', level: '4.9', style: 'Ataque / velocidad', availability: 'Hoy 18:00-21:00', city: 'Buenos Aires', accent: '#7dd3fc', phoneVisible: false, phone: '+5491123456789' },
  { id: 2, name: 'Arturo Coelho', level: '4.8', style: 'Volea / control', availability: 'Mañana 19:00', city: 'Madrid', accent: '#dfeef9', phoneVisible: true, phone: '+34612345678' },
  { id: 3, name: 'Delfi Brea', level: '4.7', style: 'Defensa / precisión', availability: 'Viernes 20:00', city: 'Barcelona', accent: '#f9a8d4', phoneVisible: true, phone: '+34698765432' },
  { id: 4, name: 'Gema Triay', level: '4.6', style: 'All court / potencia', availability: 'Sábado 17:30', city: 'Valencia', accent: '#f4d7d7', phoneVisible: true, phone: '+34654321876' },
];

const tournaments = [
  { name: 'Rome Major', city: 'Roma', date: '12 Sep', category: 'Premier Padel', seats: '8 plazas', image: 'https://www.padelfip.com/wp-content/uploads/2026/06/Roma-Champions-1024x682.jpeg' },
  { name: 'London P1', city: 'Londres', date: '15 Sep', category: 'Premier Padel', seats: '12 plazas', image: 'https://cdn.premierpadel.com/uploads/hero/original/31969ff297d31a1918217f1ce0b94d546d4f8c33b4d4000052dc81c22895c2c3.jpg' },
  { name: 'Premier Tour', city: 'Valencia', date: '20 Sep', category: 'FIP Tour', seats: '10 plazas', image: 'https://damcdn.premierpadel.com/pendularupload/abstracts/12495/thumbnail.jpg' },
];

const coaches = [
  { id: 1, name: 'Martín Ruiz', specialty: 'Mejora de drive', rating: '4.9', price: '$12.000', availability: 'Hoy 18:00' },
  { id: 2, name: 'Sofía Costa', specialty: 'Volea y red', rating: '4.8', price: '$10.000', availability: 'Mañana 17:30' },
  { id: 3, name: 'Diego Vera', specialty: 'Táctica defensiva', rating: '4.7', price: '$11.500', availability: 'Viernes 19:00' },
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
  { id: 1, name: 'Copa Funes', date: '12 Sep', court: 'Cancha 1', teams: 8, status: 'Abierta', budget: '$180.000' },
  { id: 2, name: 'Liga local', date: '18 Sep', court: 'Cancha 2', teams: 10, status: 'Confirmada', budget: '$220.000' },
  { id: 3, name: 'Mini torneos', date: '22 Sep', court: 'Cancha 3', teams: 6, status: 'Pendiente', budget: '$120.000' },
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
    surface: 'Pista rápida',
    status: 'Disponible',
    week: { Lun: '18:00', Mar: '17:30', Mié: '19:00', Jue: '20:30', Vie: '18:30', Sáb: '09:30', Dom: '10:00' },
  },
  {
    id: 2,
    name: 'Cancha 2',
    surface: 'Pista de vidrio',
    status: 'Reservada',
    week: { Lun: '20:00', Mar: '18:30', Mié: '19:30', Jue: '21:00', Vie: '20:00', Sáb: '11:00', Dom: '12:00' },
  },
  {
    id: 3,
    name: 'Cancha 3',
    surface: 'Interior climatizada',
    status: 'Disponible',
    week: { Lun: '17:30', Mar: '19:00', Mié: '18:00', Jue: '19:30', Vie: '20:30', Sáb: '08:30', Dom: '09:00' },
  },
  {
    id: 4,
    name: 'Cancha 4',
    surface: 'Pista exterior',
    status: 'Mantenimiento',
    week: { Lun: 'libre', Mar: 'libre', Mié: '19:00', Jue: 'libre', Vie: '18:00', Sáb: 'libre', Dom: 'libre' },
  },
  {
    id: 5,
    name: 'Cancha 5',
    surface: 'Arena premium',
    status: 'Disponible',
    week: { Lun: '20:00', Mar: '21:00', Mié: '18:30', Jue: '20:00', Vie: '19:00', Sáb: '10:00', Dom: '11:00' },
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
    { id: 1, name: 'Cancha 1', price: '$18.000/h', surface: 'Pista rápida', slots: ['18:00', '19:00', '20:00'], status: 'Abierta', openingHours: '08:00 - 23:00' },
    { id: 2, name: 'Cancha 2', price: '$22.000/h', surface: 'Pista de vidrio', slots: ['17:30', '18:30', '21:00'], status: 'Semicerrada', openingHours: '12:00 - 22:00' },
    { id: 3, name: 'Cancha 3', price: '$25.000/h', surface: 'Interior climatizada', slots: ['16:00', '18:00', '19:30'], status: 'Cerrada', openingHours: 'Sin horario activo' },
  ],
  'padel-arena': [
    { id: 1, name: 'Cancha 1', price: '$20.000/h', surface: 'Pista exterior', slots: ['17:00', '19:00', '20:00'], status: 'Abierta', openingHours: '09:00 - 23:00' },
    { id: 2, name: 'Cancha 2', price: '$24.000/h', surface: 'Pista de vidrio', slots: ['18:00', '19:30', '21:00'], status: 'Abierta', openingHours: '10:00 - 22:30' },
  ],
  'sunset-club': [
    { id: 1, name: 'Cancha 1', price: '$19.000/h', surface: 'Arena premium', slots: ['16:30', '18:00', '19:00'], status: 'Abierta', openingHours: '08:00 - 22:00' },
    { id: 2, name: 'Cancha 3', price: '$26.000/h', surface: 'Interior climatizada', slots: ['17:00', '18:30', '20:00'], status: 'Semicerrada', openingHours: '11:00 - 21:00' },
  ],
};

const userThemes = [
  { id: 'rosa', label: 'Rosa', accent: '#f5d5df', accentAlt: '#f9d3df' },
  { id: 'celeste', label: 'Celeste', accent: '#dfeef9', accentAlt: '#cfe9ff' },
  { id: 'verde', label: 'Verde', accent: '#d7f0dd', accentAlt: '#bde3c7' },
];

function App() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [trainerServiceClubs, setTrainerServiceClubs] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('rosa');
  const [selectedAvatarId, setSelectedAvatarId] = useState('delfi-brea');
  const [selectedShot, setSelectedShot] = useState('drive');
  const [activeTab, setActiveTab] = useState('Inicio');
  const [selectedCourt, setSelectedCourt] = useState(courts[0]);
  const [courtStates, setCourtStates] = useState(courts.map((court) => ({ ...court })));
  const [userLocation, setUserLocation] = useState({
    lat: -31.8667,
    lng: -60.7933,
    label: 'Funes, Santa Fe, Argentina',
  });
  const [matchPool, setMatchPool] = useState([
    { id: 1, format: 'Pádel', city: 'Funes', level: '3.5+', time: '18:30', missingPlayers: 1, status: 'Buscando rival', notified: false },
    { id: 2, format: 'Pádel', city: 'Santa Fe', level: '4.0+', time: '20:00', missingPlayers: 1, status: 'Disponible', notified: true },
    { id: 3, format: 'Pádel', city: 'Rafaela', level: '4.5+', time: '21:00', missingPlayers: 1, status: 'Pendiente', notified: false },
  ]);
  const [trainingPool, setTrainingPool] = useState([
    { id: 1, coach: 'Martín Ruiz', specialty: 'Drive y precisión', time: 'Hoy · 18:00', duration: '60 min', available: 2, students: ['Lucía', 'Mateo', 'Sofía'], status: 'Plazas abiertas' },
    { id: 2, coach: 'Sofía Costa', specialty: 'Volea y red', time: 'Mañana · 17:30', duration: '45 min', available: 1, students: ['Diego', 'Carla'], status: 'Última plaza' },
    { id: 3, coach: 'Diego Vera', specialty: 'Táctica defensiva', time: 'Viernes · 19:00', duration: '60 min', available: 3, students: ['Tomás', 'Nina', 'Juli'], status: 'Disponible' },
  ]);
  const [selectedRecipients, setSelectedRecipients] = useState({});

  const avatarSet = avatarOptions[selectedTheme] || avatarOptions.rosa;
  const selectedAvatar = avatarSet.find((avatar) => avatar.id === selectedAvatarId) || avatarSet[0];
  const selectedClub = clubs.find((club) => club.id === selectedClubId) || clubs[0];
  const trainerAvailableClubs = clubs.filter((club) => trainerServiceClubs.includes(club.id));
  const trainerActiveClub = clubs.find((club) => club.id === selectedClubId) || trainerAvailableClubs[0] || clubs[0];
  const currentLocationLabel = userLocation.label || 'Funes, Santa Fe, Argentina';
  const selectedClubBookings = clubBookingsByClub[selectedClubId] || clubBookingsByClub['club-padel-norte'];
  const trainerActiveClubId = trainerActiveClub?.id;
  const trainerClubCourts = clubCourtsByClub[trainerActiveClubId] || clubCourtsByClub['club-padel-norte'];
  const trainerClubClasses = trainerClassesByClub[trainerActiveClubId] || trainerClassesByClub['club-padel-norte'];
  const trainerClubBookings = trainerBookingsByClub[trainerActiveClubId] || trainerBookingsByClub['club-padel-norte'];

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

  const handleReserveClick = () => {
    const newMatch = {
      id: Date.now(),
      format: 'Pádel',
      city: currentLocationLabel.includes('Funes') ? 'Funes' : 'Tu zona',
      level: '3.5+',
      time: '19:00',
      missingPlayers: 1,
      status: 'Buscando rival',
      notified: false,
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
    setSelectedRole(null);
    setSelectedClubId(null);
    setTrainerServiceClubs([]);
    setActiveTab('Inicio');
    setSelectedCourt(courts[0]);
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

  const handleJoinTraining = (trainingId) => {
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

  const openMaps = (court, provider = 'google') => {
    const query = encodeURIComponent(`${court.name} ${court.address}`);
    const url = provider === 'apple'
      ? `https://maps.apple.com/?q=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderPlayerContent = () => {
    switch (activeTab) {
      case 'Buscar':
        return (
          <div className="tab-content">
            <section className="panel">
              <div className="section-header">
                <h3>Buscar jugadores y canchas</h3>
                <button type="button" className="link-btn">Filtros</button>
              </div>

              <div className="search-grid">
                <div className="search-field">
                  <label>Ciudad</label>
                  <input value={currentLocationLabel} readOnly />
                </div>
                <div className="search-field">
                  <label>Horario</label>
                  <input defaultValue="18:00 - 22:00" />
                </div>
                <div className="search-field">
                  <label>Nivel</label>
                  <input defaultValue="4.0+" />
                </div>
                <div className="search-field">
                  <label>Tipo</label>
                  <input defaultValue="Club / cubierta" />
                </div>
              </div>
            </section>

            <section className="panel pool-panel">
              <div className="section-header">
                <h3>Pool de partidos</h3>
                <button type="button" className="link-btn" onClick={handleReserveClick}>Crear partido</button>
              </div>

              <div className="match-pool">
                {matchPool.map((match) => (
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
                        {players.map((player) => (
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

            <section className="panel">
              <div className="section-header">
                <h3>Resultados</h3>
                <button type="button" className="link-btn">Ver mapa</button>
              </div>

              <div className="result-list">
                {players.map((player) => (
                  <div key={player.id} className="result-item">
                    <div className="player-badge" style={{ background: player.accent }}>{player.name.slice(0, 1)}</div>
                    <div>
                      <strong>{player.name}</strong>
                      <p>{player.city} · {player.level}</p>
                    </div>
                    <span>{player.phoneVisible ? 'Contacto visible' : player.availability}</span>
                  </div>
                ))}
              </div>
            </section>
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
                {courtStates.map((court) => (
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
                    <p>{court.surface}</p>
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
                <h3>Mapa de canchas</h3>
                <button type="button" className="link-btn">Cerca de ti</button>
              </div>

              <div className="map-card">
                {courtStates.map((court) => (
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
                        onClick={() => handleJoinTraining(session.id)}
                        disabled={session.available === 0}
                      >
                        {session.available === 0 ? 'Completa' : 'Unirme'}
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
                    <button type="button" className="primary-btn small-btn">Reservar</button>
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
                {tournaments.map((tournament) => (
                  <div key={tournament.name} className="tournament-card">
                    <div className="tournament-image">
                      <img src={tournament.image} alt={tournament.name} />
                    </div>
                    <div>
                      <strong>{tournament.name}</strong>
                      <p>{tournament.city}</p>
                    </div>
                    <div>
                      <span>{tournament.date}</span>
                      <small>{tournament.category}</small>
                    </div>
                    <button type="button" className="primary-btn small-btn">{tournament.seats}</button>
                  </div>
                ))}
              </div>
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
                <h3>Actividad</h3>
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
              <button type="button" className="primary-btn">Ver mapa</button>
            </section>

            <div className="main-grid">
              <div className="main-column">
                <section className="panel">
                  <div className="section-header">
                    <h3>Canchas disponibles</h3>
                    <button type="button" className="link-btn">Ver todas</button>
                  </div>

                  <div className="court-list">
                    {courtStates.map((court) => (
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
                        <p>{court.surface}</p>
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
                    <h3>Mapa de canchas</h3>
                    <button type="button" className="link-btn">Cerca de ti</button>
                  </div>

                  <div className="map-card">
                    {courtStates.map((court) => (
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
                    <h3>Actividad</h3>
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

          </>
        );
    }
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
                    <p>{court.surface}</p>
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
                  <p>{activeTrainerCourt.name} · {activeTrainerCourt.surface}</p>
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
                <button type="button" className="link-btn">Crear</button>
              </div>

              <div className="booking-list">
                {tournamentEvents.map((event) => (
                  <div key={event.id} className="booking-row">
                    <div>
                      <strong>{event.name}</strong>
                      <p>{event.date} · {event.court}</p>
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
                {courtStates.map((court) => (
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
                    <p>{court.surface}</p>
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
                {courtStates.map((court) => (
                  <div key={court.id} className="club-court-card">
                    <div className="club-court-head">
                      <div>
                        <strong>{court.name}</strong>
                        <p>{court.surface}</p>
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
                {selectedClubBookings.map((booking) => (
                  <div key={booking.id} className="booking-row">
                    <div>
                      <strong>{booking.player}</strong>
                      <p>{booking.court} · {booking.time}</p>
                    </div>
                    <span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                    <strong className="booking-price">{booking.amount}</strong>
                  </div>
                ))}
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
                    <button type="button" className="primary-btn small-btn">Reservar</button>
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
                <button type="button" className="link-btn">Editar</button>
              </div>

              <div className="club-profile">
                <div className="club-logo">ZP</div>
                <div>
                  <strong>{selectedClub.name}</strong>
                  <p>Plan mensual activo</p>
                  <small>{selectedClub.city} · Vence: 30/09/2026</small>
                </div>
              </div>
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
                <button type="button" className="link-btn">Ver todas</button>
              </div>

              <div className="court-calendar-grid">
                {clubCourtSchedule.map((court) => (
                  <div key={court.id} className="court-calendar-card">
                    <div className="court-calendar-header">
                      <strong>{court.name}</strong>
                      <span className={`status-pill ${court.status.toLowerCase().replace(/\s+/g, '-')}`}>{court.status}</span>
                    </div>
                    <p>{court.surface}</p>
                    <div className="calendar-days">
                      {Object.entries(court.week).map(([day, slot]) => (
                        <div key={`${court.id}-${day}`} className={slot === 'libre' ? 'day-pill free' : 'day-pill busy'}>
                          <span>{day}</span>
                          <small>{slot === 'libre' ? 'Libre' : slot}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
              onClick={() => setActiveTab(item)}
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
            <div className="search-box">
              <span>🔎</span>
              <input type="text" placeholder={selectedRole === 'club' ? 'Buscar reserva o cancha' : 'Buscar pista, jugador o torneo'} />
            </div>
            <button type="button" className="primary-btn" onClick={handleReserveClick}>
              {selectedRole === 'club' ? 'Cobrar' : 'Reservar'}
            </button>
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
            onClick={() => setActiveTab(item)}
            aria-label={item}
            title={item}
          >
            <span className="nav-label">{item}</span>
            <span className="nav-icon"><NavIcon name={navIcons[item]} active={activeTab === item} /></span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
