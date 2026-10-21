ALTER TABLE partidos
  ADD COLUMN drive_faltantes TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER jugadores_faltantes,
  ADD COLUMN reves_faltantes TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER drive_faltantes;