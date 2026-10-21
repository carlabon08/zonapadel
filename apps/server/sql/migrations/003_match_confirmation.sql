ALTER TABLE partidos
  MODIFY estado ENUM('Buscando rival', 'Publicada', 'Confirmada', 'Cancelado', 'Cancelada') NOT NULL DEFAULT 'Publicada',
  ADD COLUMN jugadores_faltantes TINYINT UNSIGNED NULL DEFAULT NULL AFTER hora;

UPDATE partidos SET estado = 'Publicada' WHERE estado = 'Buscando rival';
UPDATE partidos SET estado = 'Cancelada' WHERE estado = 'Cancelado';

ALTER TABLE partidos
  MODIFY estado ENUM('Publicada', 'Confirmada', 'Cancelada') NOT NULL DEFAULT 'Publicada';

CREATE TABLE IF NOT EXISTS club_usuarios (
  usuario_id INT NOT NULL,
  club_id VARCHAR(60) NOT NULL,
  PRIMARY KEY (usuario_id, club_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubes(id) ON DELETE CASCADE
);