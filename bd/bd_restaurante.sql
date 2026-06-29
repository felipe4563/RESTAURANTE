-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-06-2026 a las 15:35:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_restaurante`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id`, `nombre`, `creado_en`, `actualizado_en`) VALUES
(1, 'A', '2026-06-25 11:38:31', '2026-06-25 11:38:31'),
(2, 'B', '2026-06-25 11:38:35', '2026-06-25 11:38:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `imagen`, `activo`, `creado_en`, `actualizado_en`) VALUES
(1, 'Platos', NULL, 1, '2026-06-25 11:47:22', '2026-06-25 11:47:22'),
(2, 'bebidas', NULL, 1, '2026-06-25 11:47:31', '2026-06-25 11:47:31'),
(3, 'Postres', NULL, 1, '2026-06-25 11:47:45', '2026-06-25 11:47:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo_documento` varchar(50) NOT NULL DEFAULT 'CI',
  `numero_documento` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id` int(10) UNSIGNED NOT NULL,
  `proveedor_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `estado` enum('pendiente','recibido') NOT NULL DEFAULT 'pendiente',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuraciones`
--

CREATE TABLE `configuraciones` (
  `id` int(10) UNSIGNED NOT NULL,
  `clave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuraciones`
--

INSERT INTO `configuraciones` (`id`, `clave`, `valor`, `creado_en`, `actualizado_en`) VALUES
(1, 'nombre_negocio', 'La cliceñita', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(2, 'direccion', 'Villa tunari', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(3, 'telefono', '74819122', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(4, 'moneda', 'Bs', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(5, 'simbolo_moneda', 'Bs.', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(6, 'zona_horaria', 'America/La_Paz', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(7, 'pie_ticket', '¡Gracias por su preferencia!', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(8, 'logo', '/uploads/1782616386033-216627.png', '2026-06-22 07:23:40', '2026-06-28 03:25:55'),
(17, 'flujo_cocina', 'fisico', '2026-06-28 02:33:36', '2026-06-28 02:38:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_arqueo`
--

CREATE TABLE `detalle_arqueo` (
  `id` int(10) UNSIGNED NOT NULL,
  `sesion_caja_id` int(10) UNSIGNED NOT NULL,
  `denominacion` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_arqueo`
--

INSERT INTO `detalle_arqueo` (`id`, `sesion_caja_id`, `denominacion`, `cantidad`, `subtotal`) VALUES
(1, 1, 20.00, 2, 40.00),
(2, 1, 10.00, 1, 10.00),
(3, 2, 50.00, 2, 100.00),
(4, 2, 2.00, 1, 2.00),
(5, 2, 1.00, 1, 1.00),
(6, 3, 10.00, 1, 10.00),
(7, 4, 200.00, 1, 200.00),
(8, 4, 100.00, 1, 100.00),
(9, 4, 50.00, 1, 50.00),
(10, 4, 2.00, 1, 2.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compras`
--

CREATE TABLE `detalle_compras` (
  `id` int(10) UNSIGNED NOT NULL,
  `compra_id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `costo_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `id` int(10) UNSIGNED NOT NULL,
  `pedido_id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio` decimal(10,2) NOT NULL,
  `nota` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','preparando','servido') NOT NULL DEFAULT 'pendiente',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_pedidos`
--

INSERT INTO `detalle_pedidos` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio`, `nota`, `estado`, `creado_en`, `actualizado_en`) VALUES
(2, 1, 4, 1, 3.00, NULL, 'pendiente', '2026-06-25 11:54:25', '2026-06-25 11:54:25'),
(3, 1, 1, 1, 17.00, NULL, 'pendiente', '2026-06-25 11:54:26', '2026-06-25 11:54:26'),
(4, 2, 1, 1, 17.00, NULL, 'pendiente', '2026-06-25 11:57:09', '2026-06-25 11:57:09'),
(5, 2, 4, 1, 3.00, NULL, 'pendiente', '2026-06-25 11:57:12', '2026-06-25 11:57:12'),
(6, 3, 4, 1, 3.00, NULL, 'pendiente', '2026-06-25 11:57:17', '2026-06-25 11:57:17'),
(7, 3, 3, 1, 70.00, NULL, 'pendiente', '2026-06-25 11:57:18', '2026-06-25 11:57:18'),
(8, 4, 1, 1, 17.00, NULL, 'pendiente', '2026-06-25 12:28:06', '2026-06-25 12:28:06'),
(9, 4, 3, 1, 70.00, NULL, 'pendiente', '2026-06-25 12:28:06', '2026-06-25 12:28:06'),
(10, 5, 1, 1, 17.00, NULL, 'pendiente', '2026-06-25 12:28:45', '2026-06-25 12:28:45'),
(11, 5, 3, 1, 70.00, NULL, 'pendiente', '2026-06-25 12:28:45', '2026-06-25 12:28:45'),
(12, 6, 5, 1, 15.00, NULL, 'pendiente', '2026-06-25 14:07:46', '2026-06-25 14:07:46'),
(13, 6, 4, 2, 3.00, NULL, 'pendiente', '2026-06-25 14:07:50', '2026-06-28 01:20:16'),
(14, 7, 1, 1, 17.00, NULL, 'pendiente', '2026-06-28 00:46:31', '2026-06-28 00:46:31'),
(15, 7, 4, 1, 3.00, NULL, 'pendiente', '2026-06-28 00:46:31', '2026-06-28 00:46:31'),
(16, 6, 1, 1, 17.00, NULL, 'pendiente', '2026-06-28 01:20:15', '2026-06-28 01:20:15'),
(17, 8, 1, 1, 17.00, NULL, 'pendiente', '2026-06-28 01:20:57', '2026-06-28 01:20:57'),
(19, 9, 3, 1, 70.00, NULL, 'pendiente', '2026-06-28 01:22:25', '2026-06-28 01:22:25'),
(20, 9, 1, 1, 17.00, NULL, 'pendiente', '2026-06-28 01:22:25', '2026-06-28 01:22:25'),
(21, 10, 6, 1, 12.00, NULL, 'pendiente', '2026-06-28 01:26:56', '2026-06-28 01:26:56'),
(22, 11, 6, 1, 12.00, NULL, 'pendiente', '2026-06-28 01:31:58', '2026-06-28 01:31:58'),
(23, 12, 5, 1, 15.00, NULL, 'pendiente', '2026-06-28 01:32:16', '2026-06-28 01:32:16'),
(24, 13, 5, 5, 15.00, NULL, 'pendiente', '2026-06-28 01:33:32', '2026-06-28 01:33:35'),
(25, 14, 6, 2, 12.00, NULL, 'pendiente', '2026-06-28 01:34:02', '2026-06-28 01:34:14'),
(26, 15, 4, 1, 3.00, NULL, 'pendiente', '2026-06-28 01:35:20', '2026-06-28 01:35:20'),
(27, 16, 2, 2, 50.00, NULL, 'pendiente', '2026-06-28 01:36:06', '2026-06-28 02:14:46'),
(28, 16, 5, 1, 15.00, NULL, 'pendiente', '2026-06-28 01:36:07', '2026-06-28 01:36:07'),
(29, 17, 4, 2, 3.00, NULL, 'pendiente', '2026-06-28 02:37:25', '2026-06-28 02:37:54'),
(30, 17, 3, 2, 70.00, NULL, 'pendiente', '2026-06-28 02:37:26', '2026-06-28 02:37:54'),
(31, 18, 4, 1, 3.00, NULL, 'pendiente', '2026-06-28 03:53:01', '2026-06-28 03:53:01'),
(32, 19, 3, 1, 70.00, NULL, 'pendiente', '2026-06-28 03:53:25', '2026-06-28 03:53:25'),
(33, 19, 1, 1, 17.00, NULL, 'pendiente', '2026-06-28 03:53:25', '2026-06-28 03:53:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

CREATE TABLE `gastos` (
  `id` int(10) UNSIGNED NOT NULL,
  `sesion_caja_id` int(10) UNSIGNED DEFAULT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `gastos`
--

INSERT INTO `gastos` (`id`, `sesion_caja_id`, `usuario_id`, `descripcion`, `monto`, `creado_en`, `actualizado_en`) VALUES
(1, 4, 1, 'Gas', 25.00, '2026-06-25 12:29:14', '2026-06-25 12:29:14'),
(2, 4, 1, 'insumos', 20.00, '2026-06-28 01:20:51', '2026-06-28 01:20:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes_producto`
--

CREATE TABLE `ingredientes_producto` (
  `id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `ingrediente_id` int(10) UNSIGNED NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_caja`
--

CREATE TABLE `libro_caja` (
  `id` int(10) UNSIGNED NOT NULL,
  `sesion_caja_id` int(10) UNSIGNED DEFAULT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `tipo` enum('ingreso','egreso') NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('efectivo','qr') NOT NULL DEFAULT 'efectivo',
  `referencia_id` int(10) UNSIGNED DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `libro_caja`
--

INSERT INTO `libro_caja` (`id`, `sesion_caja_id`, `usuario_id`, `tipo`, `concepto`, `monto`, `metodo_pago`, `referencia_id`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 1, 'ingreso', 'Venta #1', 20.00, 'efectivo', 1, '2026-06-25 11:54:33', '2026-06-25 11:54:33'),
(2, 2, 1, 'ingreso', 'Venta #3', 73.00, 'efectivo', 3, '2026-06-25 11:57:26', '2026-06-25 11:57:26'),
(3, 2, 1, 'ingreso', 'Venta #2', 20.00, 'efectivo', 2, '2026-06-25 11:57:37', '2026-06-25 11:57:37'),
(4, 3, 1, 'ingreso', 'Venta #4', 87.00, 'efectivo', 4, '2026-06-25 12:28:11', '2026-06-25 12:28:11'),
(5, 4, 1, 'ingreso', 'Venta #5', 87.00, 'efectivo', 5, '2026-06-25 12:28:50', '2026-06-25 12:28:50'),
(6, 4, 1, 'egreso', 'Gas', 25.00, 'efectivo', 1, '2026-06-25 12:29:14', '2026-06-25 12:29:14'),
(7, 4, 1, 'ingreso', 'Venta #7', 20.00, 'efectivo', 7, '2026-06-28 01:20:09', '2026-06-28 01:20:09'),
(8, 4, 1, 'ingreso', 'Venta #6', 38.00, 'efectivo', 6, '2026-06-28 01:20:20', '2026-06-28 01:20:20'),
(9, 4, 1, 'egreso', 'insumos', 20.00, 'efectivo', 2, '2026-06-28 01:20:51', '2026-06-28 01:20:51'),
(10, 4, 1, 'ingreso', 'Venta #8', 17.00, 'efectivo', 8, '2026-06-28 01:21:01', '2026-06-28 01:21:01'),
(11, 4, 1, 'ingreso', 'Venta #9', 87.00, 'efectivo', 9, '2026-06-28 01:22:30', '2026-06-28 01:22:30'),
(12, 4, 1, 'ingreso', 'Venta #10', 12.00, 'efectivo', 10, '2026-06-28 01:27:00', '2026-06-28 01:27:00'),
(13, 4, 1, 'ingreso', 'Venta #11', 12.00, 'efectivo', 11, '2026-06-28 01:32:01', '2026-06-28 01:32:01'),
(14, 4, 1, 'ingreso', 'Venta #12', 15.00, 'efectivo', 12, '2026-06-28 01:32:21', '2026-06-28 01:32:21'),
(15, 4, 1, 'ingreso', 'Venta #13', 75.00, 'efectivo', 13, '2026-06-28 01:33:42', '2026-06-28 01:33:42'),
(16, 4, 1, 'ingreso', 'Venta #14', 24.00, 'efectivo', 14, '2026-06-28 01:34:20', '2026-06-28 01:34:20'),
(17, 6, 1, 'ingreso', 'Venta #18', 3.00, 'efectivo', 18, '2026-06-28 03:53:12', '2026-06-28 03:53:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesas`
--

CREATE TABLE `mesas` (
  `id` int(10) UNSIGNED NOT NULL,
  `area_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `asientos` int(11) NOT NULL DEFAULT 4,
  `estado` enum('disponible','ocupada','reservada') NOT NULL DEFAULT 'disponible',
  `pos_x` int(11) NOT NULL DEFAULT 0,
  `pos_y` int(11) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mesas`
--

INSERT INTO `mesas` (`id`, `area_id`, `nombre`, `asientos`, `estado`, `pos_x`, `pos_y`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'Mesa 1', 4, 'ocupada', 0, 0, '2026-06-25 11:38:44', '2026-06-28 01:36:03'),
(2, 1, 'Mesa 2', 4, 'ocupada', 0, 0, '2026-06-25 11:38:50', '2026-06-28 01:35:19'),
(3, 2, 'Mesa 3', 4, 'disponible', 0, 0, '2026-06-25 11:39:13', '2026-06-28 02:38:06'),
(4, 2, 'Mesa 4', 4, 'ocupada', 0, 0, '2026-06-25 11:39:21', '2026-06-28 03:53:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(10) UNSIGNED NOT NULL,
  `mesa_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED DEFAULT NULL,
  `sesion_caja_id` int(10) UNSIGNED DEFAULT NULL,
  `estado` enum('pendiente','listo','completado','cancelado') NOT NULL DEFAULT 'pendiente',
  `tipo_documento` varchar(50) NOT NULL DEFAULT 'Ticket',
  `nombre_cliente` varchar(255) NOT NULL DEFAULT 'Público General',
  `documento_cliente` varchar(50) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `descuento` decimal(10,2) NOT NULL DEFAULT 0.00,
  `propina` decimal(10,2) NOT NULL DEFAULT 0.00,
  `metodo_pago` enum('efectivo','qr') NOT NULL DEFAULT 'efectivo',
  `monto_recibido` decimal(10,2) DEFAULT NULL,
  `cambio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `mesa_id`, `usuario_id`, `cliente_id`, `sesion_caja_id`, `estado`, `tipo_documento`, `nombre_cliente`, `documento_cliente`, `total`, `descuento`, `propina`, `metodo_pago`, `monto_recibido`, `cambio`, `notas`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 1, NULL, 1, 'completado', 'Ticket', 'Público General', NULL, 20.00, 0.00, 0.00, 'efectivo', 20.00, 0.00, NULL, '2026-06-25 11:47:05', '2026-06-25 11:54:33'),
(2, 1, 1, NULL, 2, 'completado', 'Ticket', 'Público General', NULL, 20.00, 0.00, 0.00, 'efectivo', 30.00, 10.00, NULL, '2026-06-25 11:57:08', '2026-06-25 11:57:37'),
(3, 2, 1, NULL, 2, 'completado', 'Ticket', 'Público General', NULL, 73.00, 0.00, 0.00, 'efectivo', 80.00, 7.00, NULL, '2026-06-25 11:57:15', '2026-06-25 11:57:26'),
(4, 2, 1, NULL, 3, 'completado', 'Ticket', 'Público General', NULL, 87.00, 0.00, 0.00, 'efectivo', 90.00, 3.00, NULL, '2026-06-25 12:28:05', '2026-06-25 12:28:11'),
(5, 1, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 87.00, 0.00, 0.00, 'efectivo', 90.00, 3.00, NULL, '2026-06-25 12:28:44', '2026-06-25 12:28:50'),
(6, 1, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 38.00, 0.00, 0.00, 'efectivo', 40.00, 2.00, NULL, '2026-06-25 14:07:20', '2026-06-28 01:20:20'),
(7, 2, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 20.00, 0.00, 0.00, 'efectivo', 20.00, 0.00, NULL, '2026-06-28 00:46:30', '2026-06-28 01:20:09'),
(8, 4, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 17.00, 0.00, 0.00, 'efectivo', 20.00, 3.00, NULL, '2026-06-28 01:20:56', '2026-06-28 01:21:01'),
(9, 2, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 87.00, 0.00, 0.00, 'efectivo', 100.00, 13.00, NULL, '2026-06-28 01:21:18', '2026-06-28 01:22:30'),
(10, 1, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 12.00, 0.00, 0.00, 'efectivo', 20.00, 8.00, NULL, '2026-06-28 01:26:55', '2026-06-28 01:27:00'),
(11, 1, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 12.00, 0.00, 0.00, 'efectivo', 20.00, 8.00, NULL, '2026-06-28 01:31:56', '2026-06-28 01:32:01'),
(12, 1, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 15.00, 0.00, 0.00, 'efectivo', 20.00, 5.00, NULL, '2026-06-28 01:32:15', '2026-06-28 01:32:21'),
(13, 1, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 75.00, 0.00, 0.00, 'efectivo', 80.00, 5.00, NULL, '2026-06-28 01:33:31', '2026-06-28 01:33:42'),
(14, 2, 1, NULL, 4, 'completado', 'Ticket', 'Público General', NULL, 24.00, 0.00, 0.00, 'efectivo', 30.00, 6.00, NULL, '2026-06-28 01:33:53', '2026-06-28 01:34:20'),
(15, 2, 1, NULL, NULL, 'listo', 'Ticket', 'Público General', NULL, 3.00, 0.00, 0.00, 'efectivo', NULL, 0.00, NULL, '2026-06-28 01:35:19', '2026-06-28 02:35:13'),
(16, 1, 1, NULL, NULL, 'listo', 'Ticket', 'Público General', NULL, 115.00, 0.00, 0.00, 'efectivo', NULL, 0.00, NULL, '2026-06-28 01:36:03', '2026-06-28 02:35:10'),
(17, 3, 1, NULL, 5, 'cancelado', 'Ticket', 'Público General', NULL, 146.00, 0.00, 0.00, 'efectivo', NULL, 0.00, NULL, '2026-06-28 02:37:24', '2026-06-28 02:38:06'),
(18, 4, 1, NULL, 6, 'completado', 'Ticket', 'Público General', NULL, 3.00, 0.00, 0.00, 'efectivo', 23.00, 20.00, NULL, '2026-06-28 03:52:59', '2026-06-28 03:53:12'),
(19, 4, 1, NULL, 6, 'pendiente', 'Ticket', 'Público General', NULL, 87.00, 0.00, 0.00, 'efectivo', NULL, 0.00, NULL, '2026-06-28 03:53:22', '2026-06-28 03:53:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id` int(10) UNSIGNED NOT NULL,
  `modulo` varchar(50) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `modulo`, `accion`, `descripcion`) VALUES
(1, 'ventas', 'ver', 'Ver pedidos'),
(2, 'ventas', 'crear', 'Crear pedidos'),
(3, 'ventas', 'cancelar', 'Cancelar pedidos'),
(4, 'ventas', 'cobrar', 'Cobrar pedidos'),
(5, 'usuarios', 'ver', 'Ver usuarios'),
(6, 'usuarios', 'crear', 'Crear usuarios'),
(7, 'usuarios', 'editar', 'Editar usuarios'),
(8, 'inventario', 'ver', 'Ver inventario'),
(9, 'usuarios', 'eliminar', 'Eliminar usuarios'),
(10, 'inventario', 'ajustar', 'Ajustar stock'),
(11, 'inventario', 'entrada', 'Registrar entrada'),
(12, 'inventario', 'salida', 'Registrar salida'),
(13, 'caja', 'abrir', 'Abrir caja'),
(14, 'caja', 'cerrar', 'Cerrar caja'),
(15, 'caja', 'ver', 'Ver sesiones de caja'),
(16, 'libro_caja', 'ver', 'Ver libro caja'),
(17, 'libro_caja', 'crear', 'Registrar en libro caja'),
(18, 'compras', 'ver', 'Ver compras'),
(19, 'compras', 'crear', 'Crear compras'),
(20, 'compras', 'recibir', 'Marcar compra como recibida'),
(21, 'compras', 'editar', 'Editar compras'),
(22, 'proveedores', 'ver', 'Ver proveedores'),
(23, 'proveedores', 'crear', 'Crear proveedores'),
(24, 'proveedores', 'editar', 'Editar proveedores'),
(25, 'productos', 'ver', 'Ver productos'),
(26, 'productos', 'crear', 'Crear productos'),
(27, 'productos', 'editar', 'Editar productos'),
(28, 'productos', 'eliminar', 'Eliminar productos'),
(29, 'clientes', 'ver', 'Ver clientes'),
(30, 'clientes', 'crear', 'Crear clientes'),
(31, 'clientes', 'editar', 'Editar clientes'),
(32, 'configuracion', 'ver', 'Ver configuración'),
(33, 'configuracion', 'editar', 'Editar configuración'),
(34, 'roles', 'ver', 'Ver roles'),
(35, 'roles', 'crear', 'Crear roles'),
(36, 'roles', 'editar', 'Editar roles'),
(37, 'roles', 'eliminar', 'Eliminar roles'),
(38, 'reportes', 'ver', 'Ver reportes'),
(39, 'cocina', 'ver', 'Ver pantalla de cocina');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(10) UNSIGNED NOT NULL,
  `categoria_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `codigo_barras` varchar(255) DEFAULT NULL,
  `codigo` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `es_vendible` tinyint(1) NOT NULL DEFAULT 1,
  `imagen` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `categoria_id`, `nombre`, `codigo_barras`, `codigo`, `precio`, `costo`, `stock`, `es_vendible`, `imagen`, `activo`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'Pollo Spiedo', NULL, NULL, 17.00, NULL, NULL, 1, '/uploads/1782388331202-335161.jpg', 1, '2026-06-25 11:48:08', '2026-06-28 01:22:30'),
(2, 1, 'Charque', NULL, NULL, 50.00, NULL, NULL, 1, '/uploads/1782388343363-722097.jpg', 1, '2026-06-25 11:52:30', '2026-06-25 11:52:30'),
(3, 1, 'Pique Macho', NULL, NULL, 70.00, NULL, NULL, 1, '/uploads/1782388357359-601046.jpg', 1, '2026-06-25 11:52:51', '2026-06-28 01:22:30'),
(4, 2, 'Moconchinchi', NULL, NULL, 3.00, NULL, -1, 1, '/uploads/1782388387501-132113.jpg', 1, '2026-06-25 11:53:09', '2026-06-28 03:53:12'),
(5, 2, 'Coca Cola', NULL, NULL, 15.00, NULL, 51, 1, '/uploads/1782388394793-994458.png', 1, '2026-06-25 11:53:30', '2026-06-28 01:33:42'),
(6, 2, 'Simba', NULL, NULL, 12.00, NULL, 16, 1, '/uploads/1782388419586-907315.jpg', 1, '2026-06-25 11:53:52', '2026-06-28 01:34:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contacto` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_inventario`
--

CREATE TABLE `registros_inventario` (
  `id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `tipo` enum('entrada','salida','venta','compra','ajuste') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `stock_anterior` int(11) DEFAULT NULL,
  `stock_nuevo` int(11) DEFAULT NULL,
  `nota` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `registros_inventario`
--

INSERT INTO `registros_inventario` (`id`, `producto_id`, `usuario_id`, `tipo`, `cantidad`, `stock_anterior`, `stock_nuevo`, `nota`, `creado_en`, `actualizado_en`) VALUES
(1, 4, 1, 'venta', 1, NULL, -1, 'Venta #1', '2026-06-25 11:54:33', '2026-06-25 11:54:33'),
(2, 1, 1, 'venta', 1, NULL, -1, 'Venta #1', '2026-06-25 11:54:33', '2026-06-25 11:54:33'),
(3, 4, 1, 'venta', 1, NULL, -1, 'Venta #3', '2026-06-25 11:57:26', '2026-06-25 11:57:26'),
(4, 3, 1, 'venta', 1, NULL, -1, 'Venta #3', '2026-06-25 11:57:26', '2026-06-25 11:57:26'),
(5, 1, 1, 'venta', 1, NULL, -1, 'Venta #2', '2026-06-25 11:57:37', '2026-06-25 11:57:37'),
(6, 4, 1, 'venta', 1, NULL, -1, 'Venta #2', '2026-06-25 11:57:37', '2026-06-25 11:57:37'),
(7, 1, 1, 'venta', 1, NULL, -1, 'Venta #4', '2026-06-25 12:28:11', '2026-06-25 12:28:11'),
(8, 3, 1, 'venta', 1, NULL, -1, 'Venta #4', '2026-06-25 12:28:11', '2026-06-25 12:28:11'),
(9, 1, 1, 'venta', 1, NULL, -1, 'Venta #5', '2026-06-25 12:28:50', '2026-06-25 12:28:50'),
(10, 3, 1, 'venta', 1, NULL, -1, 'Venta #5', '2026-06-25 12:28:50', '2026-06-25 12:28:50'),
(11, 1, 1, 'venta', 1, NULL, -1, 'Venta #7', '2026-06-28 01:20:09', '2026-06-28 01:20:09'),
(12, 4, 1, 'venta', 1, NULL, -1, 'Venta #7', '2026-06-28 01:20:09', '2026-06-28 01:20:09'),
(13, 5, 1, 'venta', 1, 30, 29, 'Venta #6', '2026-06-28 01:20:20', '2026-06-28 01:20:20'),
(14, 4, 1, 'venta', 2, NULL, -2, 'Venta #6', '2026-06-28 01:20:20', '2026-06-28 01:20:20'),
(15, 1, 1, 'venta', 1, NULL, -1, 'Venta #6', '2026-06-28 01:20:20', '2026-06-28 01:20:20'),
(16, 1, 1, 'venta', 1, NULL, -1, 'Venta #8', '2026-06-28 01:21:01', '2026-06-28 01:21:01'),
(17, 3, 1, 'venta', 1, NULL, -1, 'Venta #9', '2026-06-28 01:22:30', '2026-06-28 01:22:30'),
(18, 1, 1, 'venta', 1, NULL, -1, 'Venta #9', '2026-06-28 01:22:30', '2026-06-28 01:22:30'),
(19, 6, 1, 'venta', 1, 20, 19, 'Venta #10', '2026-06-28 01:27:00', '2026-06-28 01:27:00'),
(20, 6, 1, 'venta', 1, 19, 18, 'Venta #11', '2026-06-28 01:32:01', '2026-06-28 01:32:01'),
(21, 5, 1, 'venta', 1, 29, 28, 'Venta #12', '2026-06-28 01:32:21', '2026-06-28 01:32:21'),
(22, 5, 1, 'entrada', 28, 28, 56, 'ingreso', '2026-06-28 01:32:47', '2026-06-28 01:32:47'),
(23, 5, 1, 'venta', 5, 56, 51, 'Venta #13', '2026-06-28 01:33:42', '2026-06-28 01:33:42'),
(24, 6, 1, 'venta', 2, 18, 16, 'Venta #14', '2026-06-28 01:34:20', '2026-06-28 01:34:20'),
(25, 4, 1, 'venta', 1, 0, -1, 'Venta #18', '2026-06-28 03:53:12', '2026-06-28 03:53:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservaciones`
--

CREATE TABLE `reservaciones` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre_cliente` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `hora_reserva` datetime NOT NULL,
  `personas` int(11) NOT NULL,
  `mesa_id` int(10) UNSIGNED DEFAULT NULL,
  `nota` text DEFAULT NULL,
  `estado` enum('pendiente','confirmada','cancelada') NOT NULL DEFAULT 'pendiente',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `creado_en`, `actualizado_en`) VALUES
(1, 'Administrador', 'Acceso total', '2026-06-22 07:21:43', '2026-06-22 07:21:43'),
(2, 'Cajero', 'Ventas, caja y clientes', '2026-06-22 07:23:40', '2026-06-22 07:23:40'),
(3, 'Mozo', 'Toma de pedidos', '2026-06-22 07:23:40', '2026-06-22 07:23:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles_permisos`
--

CREATE TABLE `roles_permisos` (
  `rol_id` int(10) UNSIGNED NOT NULL,
  `permiso_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles_permisos`
--

INSERT INTO `roles_permisos` (`rol_id`, `permiso_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 29),
(2, 30),
(2, 31),
(2, 39),
(3, 1),
(3, 2),
(3, 39);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones_caja`
--

CREATE TABLE `sesiones_caja` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `monto_apertura` decimal(10,2) NOT NULL DEFAULT 0.00,
  `monto_cierre` decimal(10,2) DEFAULT NULL,
  `total_ventas` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_gastos` decimal(10,2) NOT NULL DEFAULT 0.00,
  `diferencia` decimal(10,2) DEFAULT NULL,
  `abierto_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `cerrado_en` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `estado` enum('abierta','cerrada') NOT NULL DEFAULT 'abierta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sesiones_caja`
--

INSERT INTO `sesiones_caja` (`id`, `usuario_id`, `monto_apertura`, `monto_cierre`, `total_ventas`, `total_gastos`, `diferencia`, `abierto_en`, `cerrado_en`, `estado`) VALUES
(1, 1, 10.00, 50.00, 20.00, 0.00, 20.00, '2026-06-25 11:46:58', '2026-06-25 11:55:10', 'cerrada'),
(2, 1, 10.00, 103.00, 93.00, 0.00, 0.00, '2026-06-25 11:57:04', '2026-06-25 11:58:30', 'cerrada'),
(3, 1, 10.00, 10.00, 87.00, 0.00, -87.00, '2026-06-25 11:58:44', '2026-06-25 12:28:29', 'cerrada'),
(4, 1, 10.00, 352.00, 387.00, 45.00, 0.00, '2026-06-25 12:28:42', '2026-06-28 01:35:04', 'cerrada'),
(5, 1, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-06-28 02:36:14', '2026-06-28 03:26:24', 'cerrada'),
(6, 1, 200.00, NULL, 3.00, 0.00, NULL, '2026-06-28 03:52:55', '0000-00-00 00:00:00', 'abierta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `rol_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `token_recordar` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `rol_id`, `nombre`, `email`, `contrasena`, `activo`, `token_recordar`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'Administrador', 'admin@restaurante.com', '$2b$12$spw0UQ5SEJHbG1RePnlfLuMEOGxqL9TRvKwg1Hi7D2E5JQUCYplPS', 1, NULL, '2026-06-22 07:23:40', '2026-06-22 07:23:40'),
(2, 2, 'Juan Perx', 'juan@restaurante.com', '$2b$10$9RnqIXlSTJL0JcfXorQzluDZnbInIzSbApFUch1vBxU8lWlK/GH0i', 1, NULL, '2026-06-28 03:26:56', '2026-06-28 03:26:56');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clientes_doc_unique` (`numero_documento`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedor_id` (`proveedor_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `configuraciones_clave_unique` (`clave`);

--
-- Indices de la tabla `detalle_arqueo`
--
ALTER TABLE `detalle_arqueo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sesion_caja_id` (`sesion_caja_id`);

--
-- Indices de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compra_id` (`compra_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sesion_caja_id` (`sesion_caja_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `ingredientes_producto`
--
ALTER TABLE `ingredientes_producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `ingrediente_id` (`ingrediente_id`);

--
-- Indices de la tabla `libro_caja`
--
ALTER TABLE `libro_caja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sesion_caja_id` (`sesion_caja_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `mesas`
--
ALTER TABLE `mesas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `area_id` (`area_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mesa_id` (`mesa_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `sesion_caja_id` (`sesion_caja_id`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permiso_unico` (`modulo`,`accion`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productos_barcode_unique` (`codigo_barras`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `registros_inventario`
--
ALTER TABLE `registros_inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mesa_id` (`mesa_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles_permisos`
--
ALTER TABLE `roles_permisos`
  ADD PRIMARY KEY (`rol_id`,`permiso_id`),
  ADD KEY `permiso_id` (`permiso_id`);

--
-- Indices de la tabla `sesiones_caja`
--
ALTER TABLE `sesiones_caja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuarios_email_unique` (`email`),
  ADD KEY `rol_id` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de la tabla `detalle_arqueo`
--
ALTER TABLE `detalle_arqueo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ingredientes_producto`
--
ALTER TABLE `ingredientes_producto`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `libro_caja`
--
ALTER TABLE `libro_caja`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `mesas`
--
ALTER TABLE `mesas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registros_inventario`
--
ALTER TABLE `registros_inventario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sesiones_caja`
--
ALTER TABLE `sesiones_caja`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `detalle_arqueo`
--
ALTER TABLE `detalle_arqueo`
  ADD CONSTRAINT `detalle_arqueo_ibfk_1` FOREIGN KEY (`sesion_caja_id`) REFERENCES `sesiones_caja` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`compra_id`) REFERENCES `compras` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedidos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD CONSTRAINT `gastos_ibfk_1` FOREIGN KEY (`sesion_caja_id`) REFERENCES `sesiones_caja` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `gastos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `ingredientes_producto`
--
ALTER TABLE `ingredientes_producto`
  ADD CONSTRAINT `ingredientes_producto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ingredientes_producto_ibfk_2` FOREIGN KEY (`ingrediente_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libro_caja`
--
ALTER TABLE `libro_caja`
  ADD CONSTRAINT `libro_caja_ibfk_1` FOREIGN KEY (`sesion_caja_id`) REFERENCES `sesiones_caja` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `libro_caja_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `mesas`
--
ALTER TABLE `mesas`
  ADD CONSTRAINT `mesas_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pedidos_ibfk_4` FOREIGN KEY (`sesion_caja_id`) REFERENCES `sesiones_caja` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `registros_inventario`
--
ALTER TABLE `registros_inventario`
  ADD CONSTRAINT `registros_inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `registros_inventario_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD CONSTRAINT `reservaciones_ibfk_1` FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `roles_permisos`
--
ALTER TABLE `roles_permisos`
  ADD CONSTRAINT `roles_permisos_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `roles_permisos_ibfk_2` FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sesiones_caja`
--
ALTER TABLE `sesiones_caja`
  ADD CONSTRAINT `sesiones_caja_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
