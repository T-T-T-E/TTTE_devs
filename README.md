# TTTE_devs
repositorio para equipo back end 
# Node + Express Service Starter

This is a simple API sample in Node.js with express.js based on [Google Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service).

## Getting Started

Server should run automatically when starting a workspace. To run manually, run:
```sh
npm run dev
```
Database Script (MySQL)

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ttte_db;

-- Usar la base de datos
USE ttte_db;

-- -----------------------------------------------------
-- Estructura de la Tabla de Roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar los roles predefinidos
-- Esto asegura que los roles estén disponibles para ser asignados.
INSERT INTO roles (nombre_rol) VALUES
('cliente'),
('barbero'),
('admin');

-- -----------------------------------------------------
-- Estructura de la Tabla de Usuarios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol_id INT,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Estructura de la Tabla de Servicios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_servicio VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  foto_servicio VARCHAR(255)
);

-- -----------------------------------------------------
-- Estructura de la Tabla de Citas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(255) NOT NULL,
  id_servicio INT,
  id_barbero INT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  FOREIGN KEY (id_servicio) REFERENCES servicios(id),
  FOREIGN KEY (id_barbero) REFERENCES usuarios(id) ON DELETE CASCADE
);

--Contraseña 123456a como admin

INSERT INTO usuarios (nombre_completo, telefono, email, password, rol_id)
VALUES ('Chato', '77777777', 'admin@gmail.com', '$2a$10$w00TfTyf.VanuijxTW.sfuOIkKE4X22NRj9IU2UZu7ndDjR.lDod.', 3);


