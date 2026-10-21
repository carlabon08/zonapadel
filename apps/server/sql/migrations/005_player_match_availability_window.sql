ALTER TABLE preferencias_partidos
  ADD COLUMN dia_semana ENUM('dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab') NULL AFTER ciudad,
  ADD COLUMN hora_desde TIME NULL AFTER dia_semana,
  ADD COLUMN hora_hasta TIME NULL AFTER hora_desde;