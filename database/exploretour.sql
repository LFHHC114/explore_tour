-- =========================================================
-- BASE DE DATOS EXPLORETOUR
-- =========================================================

CREATE DATABASE IF NOT EXISTS exploretour;

USE exploretour;


-- =========================================================
-- ELIMINAR TABLAS SI EXISTEN
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS guias;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;


-- =========================================================
-- TABLA USUARIOS
-- =========================================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('turista', 'guia', 'administrador')
        NOT NULL DEFAULT 'turista',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- TABLA CATEGORIAS
-- =========================================================

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);


-- =========================================================
-- TABLA GUIAS
-- =========================================================

CREATE TABLE guias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    descripcion TEXT,
    experiencia INT,
    idiomas VARCHAR(200),
    foto VARCHAR(255),

    CONSTRAINT guias_ibfk_1
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);


-- =========================================================
-- TABLA TOURS
-- =========================================================

CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    duracion VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    imagen VARCHAR(255),
    categoria_id INT NOT NULL,
    guia_id INT NOT NULL,
    cupos INT NOT NULL DEFAULT 10,
    estado ENUM('activo', 'inactivo')
        NOT NULL DEFAULT 'activo',

    CONSTRAINT tours_ibfk_1
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id),

    CONSTRAINT tours_ibfk_2
        FOREIGN KEY (guia_id)
        REFERENCES guias(id)
);


-- =========================================================
-- TABLA RESERVAS
-- =========================================================

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tour_id INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    cantidad_personas INT NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada')
        NOT NULL DEFAULT 'pendiente',

    CONSTRAINT reservas_ibfk_1
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT reservas_ibfk_2
        FOREIGN KEY (tour_id)
        REFERENCES tours(id)
);


-- =========================================================
-- TABLA PAGOS
-- =========================================================

CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('tarjeta', 'efectivo', 'transferencia')
        NOT NULL,
    estado ENUM('pendiente', 'pagado', 'rechazado')
        NOT NULL DEFAULT 'pendiente',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pagos_ibfk_1
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id)
);


-- =========================================================
-- CATEGORIAS INICIALES
-- =========================================================

INSERT INTO categorias (nombre, descripcion)
VALUES
(
    'Cultura',
    'Tours relacionados con la cultura y tradiciones de Medellín'
),
(
    'Historia',
    'Recorridos históricos y patrimoniales'
),
(
    'Naturaleza',
    'Tours ecológicos y paisajísticos'
),
(
    'Aventura',
    'Actividades de aventura y deportes'
),
(
    'Gastronomía',
    'Experiencias gastronómicas y culinarias'
),
(
    'Arte Urbano',
    'Recorridos por murales y arte urbano'
);


-- =========================================================
-- USUARIOS INICIALES
-- =========================================================

INSERT INTO usuarios
(nombre, apellido, correo, password, telefono, rol)
VALUES
(
    'Carlos',
    'Gomez',
    'carlos@exploretour.com',
    '123456',
    '3001234567',
    'guia'
),
(
    'Luisa',
    'Hurtado',
    'luisa@exploretour.com',
    '123456',
    '3009876543',
    'turista'
);


-- =========================================================
-- GUIA INICIAL
-- =========================================================

INSERT INTO guias
(usuario_id, descripcion, experiencia, idiomas, foto)
VALUES
(
    1,
    'Guía profesional certificado en Medellín',
    5,
    'Español, Inglés',
    'carlos.jpg'
);


-- =========================================================
-- TOUR INICIAL
-- =========================================================

INSERT INTO tours
(
    titulo,
    descripcion,
    precio,
    duracion,
    ubicacion,
    imagen,
    categoria_id,
    guia_id,
    cupos,
    estado
)
VALUES
(
    'Tour Comuna 13',
    'Recorrido por el arte urbano, historia y cultura de la Comuna 13.',
    120000.00,
    '4 horas',
    'Medellín',
    'comuna13.jpg',
    1,
    1,
    10,
    'activo'
);


-- =========================================================
-- RESERVA INICIAL
-- =========================================================

INSERT INTO reservas
(
    usuario_id,
    tour_id,
    fecha_reserva,
    cantidad_personas,
    estado
)
VALUES
(
    2,
    1,
    '2026-08-20',
    2,
    'confirmada'
);


-- =========================================================
-- PAGO INICIAL
-- =========================================================

INSERT INTO pagos
(
    reserva_id,
    monto,
    metodo_pago,
    estado
)
VALUES
(
    1,
    240000.00,
    'transferencia',
    'pagado'
);


-- =========================================================
-- CONSULTAS DE VERIFICACION
-- =========================================================

SELECT * FROM usuarios;

SELECT * FROM categorias;

SELECT * FROM guias;

SELECT * FROM tours;

SELECT * FROM reservas;

SELECT * FROM pagos;