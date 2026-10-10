CREATE TABLE IF NOT EXISTS preferencias_partidos (
  jugador_id INT PRIMARY KEY,
  categoria ENUM('5ta', '6ta', '7ma') NOT NULL,
  genero ENUM('femenino', 'masculino', 'mixto') NOT NULL,
  ciudad VARCHAR(120) NOT NULL,
  disponible BOOLEAN NOT NULL DEFAULT FALSE,
  telefono_whatsapp VARCHAR(24),
  whatsapp_consentimiento BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (jugador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notificaciones_partidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jugador_id INT NOT NULL,
  partido_id INT NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY notificacion_partido_por_jugador (jugador_id, partido_id),
  FOREIGN KEY (jugador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE CASCADE
);