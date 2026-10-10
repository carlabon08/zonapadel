-- ZonaPadel · esquema MySQL
-- Ejecutar con: mysql -u root -p < sql/schema.sql

CREATE DATABASE IF NOT EXISTS zonapadel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zonapadel;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('jugador', 'club', 'entrenador', 'torneos') NOT NULL,
  club_id INT NULL, -- solo aplica a rol 'club'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clubes (
  id VARCHAR(60) PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  ciudad VARCHAR(120) NOT NULL,
  direccion VARCHAR(200),
  imagen VARCHAR(400),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS canchas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  club_id VARCHAR(60) NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  superficie VARCHAR(120),
  precio VARCHAR(40),
  precio_partido VARCHAR(40),
  precio_clase VARCHAR(40),
  precio_torneo VARCHAR(40),
  estado ENUM('Abierta', 'Semicerrada', 'Cerrada') DEFAULT 'Abierta',
  horario_apertura VARCHAR(60) DEFAULT '08:00 - 22:00',
  FOREIGN KEY (club_id) REFERENCES clubes(id) ON DELETE CASCADE
);

-- Relación N:N entre entrenadores (usuarios con rol entrenador) y clubes donde prestan servicio
CREATE TABLE IF NOT EXISTS entrenador_clubes (
  usuario_id INT NOT NULL,
  club_id VARCHAR(60) NOT NULL,
  PRIMARY KEY (usuario_id, club_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cancha_id INT NOT NULL,
  usuario_id INT NULL,
  entrenador_id INT NULL,
  fecha DATE NOT NULL,
  hora VARCHAR(10) NOT NULL,
  jugador_nombre VARCHAR(120),
  estado ENUM('Pendiente', 'Confirmada', 'Cancelada') DEFAULT 'Pendiente',
  monto VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (entrenador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

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

CREATE TABLE IF NOT EXISTS clases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entrenador_id INT NOT NULL,
  club_id VARCHAR(60) NOT NULL,
  cancha_id INT NULL,
  titulo VARCHAR(160) NOT NULL,
  horario VARCHAR(80),
  fecha DATE NULL,
  hora_inicio TIME NULL,
  hora_fin TIME NULL,
  cupos INT DEFAULT 0,
  estado VARCHAR(60) DEFAULT 'Disponible',
  FOREIGN KEY (entrenador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubes(id) ON DELETE CASCADE,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inscripciones_clases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clase_id INT NOT NULL,
  jugador_id INT NOT NULL,
  estado ENUM('Activa', 'Cancelada') DEFAULT 'Activa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY una_inscripcion_por_clase (clase_id, jugador_id),
  FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE CASCADE,
  FOREIGN KEY (jugador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Seed: clubes
INSERT INTO clubes (id, nombre, ciudad, direccion, imagen) VALUES
  ('club-padel-norte', 'Club del Padel Norte', 'Funes', 'Ruta 20 y Av. Libertador', 'https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&w=800&q=80'),
  ('padel-arena', 'Padel Arena', 'Santa Fe', 'San Jerónimo 1900', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80'),
  ('sunset-club', 'Sunset Club', 'Rafaela', 'Calle del Sol 45', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Seed: canchas
INSERT INTO canchas (club_id, nombre, superficie, precio, estado, horario_apertura) VALUES
  ('club-padel-norte', 'Cancha 1', 'Pista rápida', '$18.000/h', 'Abierta', '08:00 - 23:00'),
  ('club-padel-norte', 'Cancha 2', 'Pista de vidrio', '$22.000/h', 'Semicerrada', '12:00 - 22:00'),
  ('club-padel-norte', 'Cancha 3', 'Interior climatizada', '$25.000/h', 'Cerrada', '00:00 - 00:00'),
  ('padel-arena', 'Cancha 1', 'Pista exterior', '$20.000/h', 'Abierta', '09:00 - 23:00'),
  ('padel-arena', 'Cancha 2', 'Pista de vidrio', '$24.000/h', 'Abierta', '10:00 - 22:30'),
  ('sunset-club', 'Cancha 1', 'Arena premium', '$19.000/h', 'Abierta', '08:00 - 22:00'),
  ('sunset-club', 'Cancha 3', 'Interior climatizada', '$26.000/h', 'Semicerrada', '11:00 - 21:00');
