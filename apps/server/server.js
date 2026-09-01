import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const courts = [
  { id: 1, name: 'Cancha 1', surface: 'Césped artificial', price: 18 },
  { id: 2, name: 'Cancha 2', surface: 'Pista rápida', price: 20 },
  { id: 3, name: 'Cancha 3', surface: 'Interior climatizada', price: 24 },
];

const reservations = [
  { id: 1, courtId: 1, date: '2026-08-30', time: '19:00', playerName: 'Luis' },
  { id: 2, courtId: 2, date: '2026-08-30', time: '18:00', playerName: 'Ana' },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'ZonaPadel API' });
});

app.get('/api/canchas', (req, res) => {
  res.json(courts);
});

app.get('/api/reservas', (req, res) => {
  res.json(reservations);
});

app.post('/api/reservas', (req, res) => {
  const { courtId, date, time, playerName } = req.body;

  if (!courtId || !date || !time || !playerName) {
    return res.status(400).json({ message: 'Faltan datos para crear la reserva' });
  }

  const exists = reservations.some(
    (reservation) =>
      reservation.courtId === Number(courtId) &&
      reservation.date === date &&
      reservation.time === time
  );

  if (exists) {
    return res.status(409).json({ message: 'Ese horario ya está reservado' });
  }

  const reservation = {
    id: Date.now(),
    courtId: Number(courtId),
    date,
    time,
    playerName,
  };

  reservations.push(reservation);
  return res.status(201).json({ message: 'Reserva creada', reservation });
});

app.listen(port, () => {
  console.log(`Servidor ZonaPadel escuchando en http://localhost:${port}`);
});
