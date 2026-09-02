import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import clubesRoutes from './src/routes/clubes.routes.js';
import canchasRoutes from './src/routes/canchas.routes.js';
import reservasRoutes from './src/routes/reservas.routes.js';
import clasesRoutes from './src/routes/clases.routes.js';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'ZonaPadel API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clubes', clubesRoutes);
app.use('/api/canchas', canchasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/clases', clasesRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  app.listen(port, () => {
    console.log(`Servidor ZonaPadel escuchando en http://localhost:${port}`);
  });
}

