// Carga reservas de ejemplo para la semana actual (lunes a domingo).
// Uso: npm run seed:reservas --workspace @zonapadel/server
// Es idempotente: reemplaza las reservas de ejemplo anteriores (usuario_id NULL y jugadores de demo).
import { pool, query } from '../src/db.js';

const jugadores = [
  'Lucas Fernández', 'Martina Pérez', 'Santiago Gómez', 'Valentina Ruiz', 'Mateo López',
  'Camila Torres', 'Nicolás Díaz', 'Sofía Acosta', 'Tomás Romero', 'Julieta Sosa',
  'Franco Medina', 'Agustina Ríos',
];
const horas = ['08:00', '09:30', '11:00', '16:00', '17:30', '19:00', '20:30', '22:00'];
const estados = ['Confirmada', 'Confirmada', 'Pendiente', 'Confirmada', 'Cancelada'];

const toIso = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const today = new Date();
const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
const fechas = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(monday);
  d.setDate(monday.getDate() + i);
  return toIso(d);
});

// Una cancha por (club, nombre) para no duplicar si la tabla tiene filas repetidas
const canchas = await query(
  `SELECT MIN(id) AS id, club_id, nombre, MIN(precio) AS precio
   FROM canchas WHERE estado != 'Cerrada' GROUP BY club_id, nombre ORDER BY club_id, nombre`
);

const placeholders = jugadores.map(() => '?').join(',');
await query(
  `DELETE FROM reservas WHERE usuario_id IS NULL AND entrenador_id IS NULL AND jugador_nombre IN (${placeholders})`,
  jugadores
);

let seed = 0;
const rows = [];
for (const cancha of canchas) {
  for (const fecha of fechas) {
    const cantidad = 3 + (seed % 3);
    for (let i = 0; i < cantidad; i += 1) {
      const hora = horas[(seed * 3 + i * 2) % horas.length];
      if (rows.some((r) => r[0] === cancha.id && r[1] === fecha && r[2] === hora)) continue;
      rows.push([
        cancha.id,
        fecha,
        hora,
        jugadores[(seed + i) % jugadores.length],
        estados[(seed + i) % estados.length],
        cancha.precio || '$18.000',
      ]);
    }
    seed += 1;
  }
}

if (rows.length) {
  await query(
    'INSERT INTO reservas (cancha_id, fecha, hora, jugador_nombre, estado, monto) VALUES ?',
    [rows]
  );
}

console.log(`Reservas de ejemplo creadas: ${rows.length} (${fechas[0]} a ${fechas[6]})`);
await pool.end();
