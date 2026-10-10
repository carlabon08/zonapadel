CREATE TABLE IF NOT EXISTS partidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jugador_id INT NOT NULL,
  cancha_id INT NOT NULL,
  categoria VARCHAR(20) NOT NULL,
  genero ENUM('femenino', 'masculino', 'mixto') NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('Buscando rival', 'Cancelado') NOT NULL DEFAULT 'Buscando rival',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX partidos_disponibles (estado, fecha, hora),
  INDEX partidos_cancha_horario (cancha_id, fecha, hora, estado),
  FOREIGN KEY (jugador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE CASCADE
);