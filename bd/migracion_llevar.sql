-- Migración: agregar soporte para pedidos "para llevar"
-- Ejecutar en el VPS: mysql -u feliperest -p bd_restaurante < bd/migracion_llevar.sql

ALTER TABLE pedidos
  MODIFY COLUMN mesa_id INT UNSIGNED NULL,
  ADD COLUMN tipo ENUM('mesa', 'llevar') NOT NULL DEFAULT 'mesa' AFTER sesion_caja_id,
  ADD COLUMN numero_llevar INT UNSIGNED NULL AFTER tipo;
