-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql_db:3306
-- Generation Time: Nov 17, 2025 at 02:10 PM
-- Server version: 8.0.44
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `multi_site_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `app_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL COMMENT 'Store additional context as JSON',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `app_id`, `action`, `description`, `ip_address`, `user_agent`, `metadata`, `created_at`) VALUES
(1, 1, NULL, 'system.login', 'Master admin logged in', '192.168.1.100', NULL, NULL, '2025-10-31 13:21:45'),
(2, 2, 1, 'app.update', 'Updated corporate app settings', '192.168.1.101', NULL, NULL, '2025-10-31 13:21:45'),
(3, 4, 1, 'content.edit', 'Edited homepage content', '192.168.1.102', NULL, NULL, '2025-10-31 13:21:45'),
(6, 1, NULL, 'user.update', 'Updated user ID: 1', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:28:06'),
(7, 1, NULL, 'user.update', 'Updated user ID: 1', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:28:46'),
(8, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:34:26'),
(9, 1, NULL, 'user.update', 'Updated user ID: 1', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:34:46'),
(10, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:41:34'),
(11, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:42:24'),
(12, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:43:46'),
(13, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:45:15'),
(14, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:46:44'),
(15, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:47:46'),
(16, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-10-31 13:49:23'),
(17, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:50:51'),
(18, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:52:09'),
(19, 1, 1, 'permission.assign', 'Assigned user 2 to app 1', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:52:18'),
(20, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:53:47'),
(21, 1, 1, 'permission.assign', 'Assigned user 2 to app 1', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:53:58'),
(24, 1, 1, 'permission.assign', 'Assigned user 4 to app 1', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:59:40'),
(26, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:20:45'),
(27, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:23:25'),
(28, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:26:23'),
(29, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:29:15'),
(30, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:31:08'),
(31, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:34:35'),
(32, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:42:59'),
(33, 1, 4, 'permission.assign', 'Assigned user 3 to app 4', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:05:40'),
(35, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:07:14'),
(36, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:18:10'),
(37, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:18:19'),
(38, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:20:53'),
(39, 1, NULL, 'user.update', 'Updated user ID: 3', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:21:20'),
(40, 3, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:21:40'),
(41, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:28:12'),
(42, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:31:46'),
(43, 3, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:32:01'),
(44, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:32:07'),
(45, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:33:46'),
(46, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:34:13'),
(47, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:34:15'),
(48, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:34:16'),
(49, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:36:22'),
(50, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:36:34'),
(51, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:37:17'),
(52, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:38:27'),
(53, 3, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:40:41'),
(54, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:42:14'),
(55, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:44:17'),
(56, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:46:29'),
(57, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:48:04'),
(58, 2, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:49:46'),
(59, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:53:42'),
(60, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 15:01:16'),
(61, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 18:33:29'),
(62, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 18:37:47'),
(63, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 18:42:03'),
(64, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 19:38:06'),
(65, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 19:50:04'),
(66, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 19:53:57'),
(67, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 19:54:45'),
(68, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-03 20:00:12'),
(69, 1, 1, 'permission.update', 'Updated permissions for user 4', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 15:34:35'),
(70, 1, 1, 'permission.update', 'Updated permissions for user 4', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 15:34:43'),
(71, 1, 1, 'permission.update', 'Updated permissions for user 4', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 15:34:46'),
(72, 1, 1, 'permission.update', 'Updated permissions for user 4', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 15:34:52'),
(73, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 19:36:27'),
(74, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 19:39:49'),
(75, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 19:42:03'),
(76, 1, NULL, 'app.delete', 'Deleted app: DoorBash', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 19:43:31'),
(77, 1, NULL, 'app.delete', 'Deleted app: DoorBash', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 19:44:47'),
(78, 1, NULL, 'app.delete', 'Deleted app: DoorBash', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 19:53:57'),
(79, 1, NULL, 'app.delete', 'Deleted app: DoorBash', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 20:08:25'),
(80, 1, NULL, 'app.delete', 'Deleted app: Test', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 20:48:34'),
(81, 1, NULL, 'app.delete', 'Deleted app: ecom test', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 20:50:26'),
(82, 1, NULL, 'app.delete', 'Deleted app: Test app', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 21:23:38'),
(83, 1, NULL, 'app.delete', 'Deleted app: DoorBash', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 21:23:56'),
(84, 1, NULL, 'app.delete', 'Deleted app: another test', '::ffff:172.217.215.95', NULL, NULL, '2025-11-04 21:24:49'),
(85, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-05 22:23:26'),
(86, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-06 16:14:32'),
(87, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 18:48:46'),
(88, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 18:57:56'),
(90, 1, NULL, 'app.delete', 'Deleted app: Finance', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:07:12'),
(91, 1, NULL, 'app.delete', 'Deleted app: AirPnP', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:07:32'),
(93, 1, 4, 'permission.assign', 'Assigned user 6 to app 4', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:08:12'),
(95, 1, NULL, 'app.delete', 'Deleted app: AirPnP', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:12:00'),
(97, 1, 4, 'permission.remove', 'Removed user 3 from app 4', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:13:01'),
(100, 1, NULL, 'user.update', 'Updated user ID: 6', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:17:03'),
(102, 1, 4, 'permission.assign', 'Assigned user 6 to app 4', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:17:12'),
(104, 2, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:18:25'),
(105, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:20:23'),
(106, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:21:49'),
(107, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:22:13'),
(110, 1, NULL, 'app.delete', 'Deleted app: DoorMash', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:36:21'),
(111, 1, 19, 'app.update', 'Updated app ID: 19', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:43:01'),
(112, 1, NULL, 'app.delete', 'Deleted app: Finance', '::ffff:192.168.65.1', NULL, NULL, '2025-11-06 19:52:30'),
(113, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-07 19:23:07'),
(114, 1, NULL, 'app.delete', 'Deleted app: SnapTrap', '::ffff:192.168.65.1', NULL, NULL, '2025-11-07 19:24:34'),
(115, 1, 21, 'app.update', 'Updated app ID: 21', '::ffff:192.168.65.1', NULL, NULL, '2025-11-07 19:25:58'),
(116, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-07 19:51:49'),
(117, 1, 22, 'app.update', 'Updated app ID: 22', '::ffff:192.168.65.1', NULL, NULL, '2025-11-07 20:14:49'),
(118, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-10 15:00:53'),
(120, 1, NULL, 'app.delete', 'Deleted app: AirPnP (Copy)', '::ffff:192.168.65.1', NULL, NULL, '2025-11-10 15:21:19'),
(122, 1, NULL, 'app.delete', 'Deleted app: DoorBash (Copy)', '::ffff:192.168.65.1', NULL, NULL, '2025-11-10 15:22:26'),
(124, 1, NULL, 'app.delete', 'Deleted app: Ubler (Copy)', '::ffff:192.168.65.1', NULL, NULL, '2025-11-10 15:23:02'),
(126, 1, 1, 'permission.assign', 'Assigned user 2 to app 1', '::ffff:192.168.65.1', NULL, NULL, '2025-11-10 18:30:34'),
(128, 2, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-10 18:30:57'),
(129, 1, NULL, 'auth.login', 'User logged in', '::ffff:192.168.65.1', NULL, NULL, '2025-11-10 18:31:17'),
(130, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.18.0.1', NULL, NULL, '2025-11-12 18:35:01'),
(131, 1, NULL, 'app.delete', 'Deleted app: AirPnP', '::ffff:172.18.0.1', NULL, NULL, '2025-11-12 18:37:36'),
(134, 1, NULL, 'app.delete', 'Deleted app: AirPnP old', '::ffff:172.18.0.1', NULL, NULL, '2025-11-12 19:10:45'),
(136, 1, NULL, 'app.delete', 'Deleted app: AirPnP', '::ffff:172.18.0.1', NULL, NULL, '2025-11-12 19:45:30'),
(137, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.18.0.1', NULL, NULL, '2025-11-13 14:14:43'),
(138, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.18.0.1', NULL, NULL, '2025-11-13 14:17:05'),
(139, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.18.0.1', NULL, NULL, '2025-11-13 14:18:20'),
(140, 1, 4, 'permission.assign', 'Assigned user 6 to app 4', '::ffff:142.250.105.94', NULL, NULL, '2025-11-13 18:47:23'),
(141, 1, 28, 'permission.assign', 'Assigned user 6 to app 28', '::ffff:142.250.105.94', NULL, NULL, '2025-11-13 18:47:23'),
(142, 1, NULL, 'auth.login', 'User logged in', '::ffff:142.250.105.94', NULL, NULL, '2025-11-14 16:30:22'),
(143, 1, NULL, 'auth.login', 'User logged in', '::ffff:142.250.105.94', NULL, NULL, '2025-11-14 19:23:07'),
(144, 1, NULL, 'auth.login', 'User logged in', '::ffff:142.250.105.94', NULL, NULL, '2025-11-17 13:10:48');

-- --------------------------------------------------------

--
-- Table structure for table `apps`
--

CREATE TABLE `apps` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_id` int DEFAULT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `apps`
--

INSERT INTO `apps` (`id`, `name`, `template_id`, `domain`, `description`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Ubler', NULL, 'ubler.com', 'Ubler Ridesharing app', 1, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(4, 'YouNube', NULL, 'younube.com', 'Teach and entertain with your own video channel.', 1, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(19, 'DoorBash', NULL, 'doorbash.com', 'Complete ride-sharing solution with booking, tracking, and payment features', 1, 1, '2025-11-06 19:35:17', '2025-11-06 19:43:01'),
(21, 'SnapTrap', NULL, 'snaptrap.com', 'Share images, videos with friends and family.', 1, 1, '2025-11-07 19:25:16', '2025-11-07 19:25:58'),
(22, 'Finance app', NULL, 'finance-app.com', 'Complete banking and finance management app with account dashboard', 1, 1, '2025-11-07 19:29:37', '2025-11-07 20:14:49'),
(28, 'AirPnP', 9, 'airpnp-1762976743072.app', 'Complete property rental and booking platform, booking system, host profiles, and reviews', 1, 1, '2025-11-12 19:45:43', '2025-11-13 15:09:57');

-- --------------------------------------------------------

--
-- Table structure for table `app_custom_screen_elements`
--

CREATE TABLE `app_custom_screen_elements` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `element_id` int NOT NULL,
  `field_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placeholder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_value` text COLLATE utf8mb4_unicode_ci,
  `validation_rules` json DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT '0',
  `is_visible` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '999',
  `config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_custom_screen_elements`
--

INSERT INTO `app_custom_screen_elements` (`id`, `app_id`, `screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `validation_rules`, `is_required`, `is_visible`, `display_order`, `config`, `created_at`, `updated_at`) VALUES
(2, 28, 58, 107, 'headerbar', 'User Profile', NULL, NULL, NULL, 0, 1, 999, NULL, '2025-11-14 18:58:51', '2025-11-14 18:58:51');

-- --------------------------------------------------------

--
-- Table structure for table `app_menus`
--

CREATE TABLE `app_menus` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `menu_type` enum('tabbar','sidebar_left','sidebar_right') COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'menu',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_menus`
--

INSERT INTO `app_menus` (`id`, `app_id`, `name`, `menu_type`, `icon`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 28, 'Bottom Tab Navigation', 'tabbar', 'menu', 'Primary bottom tab bar navigation', 1, '2025-11-14 17:05:50', '2025-11-14 17:30:10'),
(2, 28, 'Menu', 'sidebar_left', 'menu', NULL, 1, '2025-11-14 17:11:18', '2025-11-14 17:11:18'),
(3, 28, 'Legal', 'sidebar_right', 'menu', NULL, 1, '2025-11-14 17:11:30', '2025-11-14 17:11:30');

-- --------------------------------------------------------

--
-- Table structure for table `app_modules`
--

CREATE TABLE `app_modules` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_type` enum('header_bar','footer_bar','floating_action_button') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `default_config` json DEFAULT NULL COMMENT 'Default configuration for this module type',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_modules`
--

INSERT INTO `app_modules` (`id`, `name`, `module_type`, `description`, `default_config`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Header Bar with Sidebar Icons', 'header_bar', 'Top navigation bar that displays menu icons for left and right sidebars', '{\"elevation\": 2, \"showTitle\": true, \"textColor\": \"#000000\", \"showLeftIcon\": true, \"showRightIcon\": false, \"backgroundColor\": \"#FFFFFF\"}', 1, '2025-11-14 19:24:55', '2025-11-14 19:24:55'),
(2, 'Simple Header Bar', 'header_bar', 'Basic header bar with title only', '{\"elevation\": 2, \"showTitle\": true, \"textColor\": \"#FFFFFF\", \"showLeftIcon\": false, \"showRightIcon\": false, \"backgroundColor\": \"#007AFF\"}', 1, '2025-11-14 19:24:55', '2025-11-14 19:24:55');

-- --------------------------------------------------------

--
-- Table structure for table `app_roles`
--

CREATE TABLE `app_roles` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_default` tinyint(1) DEFAULT '0' COMMENT 'If true, assigned to new users automatically',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_roles`
--

INSERT INTO `app_roles` (`id`, `app_id`, `name`, `display_name`, `description`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 'all_users', 'All Users', 'Default role with access to all published screens', 1, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(2, 4, 'all_users', 'All Users', 'Default role with access to all published screens', 1, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(3, 19, 'all_users', 'All Users', 'Default role with access to all published screens', 1, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(4, 21, 'all_users', 'All Users', 'Default role with access to all published screens', 1, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(5, 22, 'all_users', 'All Users', 'Default role with access to all published screens', 1, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(8, 1, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(9, 4, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(10, 19, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(11, 21, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(12, 22, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(15, 1, 'admin', 'Administrators', 'Users with administrative privileges', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(16, 4, 'admin', 'Administrators', 'Users with administrative privileges', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(17, 19, 'admin', 'Administrators', 'Users with administrative privileges', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(18, 21, 'admin', 'Administrators', 'Users with administrative privileges', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25'),
(19, 22, 'admin', 'Administrators', 'Users with administrative privileges', 0, '2025-11-12 19:02:25', '2025-11-12 19:02:25');

-- --------------------------------------------------------

--
-- Table structure for table `app_screens`
--

CREATE TABLE `app_screens` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `screen_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unique identifier for the screen template',
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_screens`
--

INSERT INTO `app_screens` (`id`, `name`, `screen_key`, `description`, `icon`, `category`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(17, 'test', 'test', 'Welcome tutorial slides introducing the app', 'book-open', 'Onboarding', 1, 1, '2025-11-03 18:46:04', '2025-11-03 18:46:04'),
(18, 'Login Screen', 'login', 'Standard login screen with email and password fields', 'log-in', 'Authentication', 1, 1, '2025-11-04 17:22:20', '2025-11-04 20:57:14'),
(46, 'Splash Screen', 'splash_10_1762287416751', 'App splash screen', 'Zap', 'Auth', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(48, 'Sign Up', 'signup_10_1762287416777', 'User registration', 'UserPlus', 'Auth', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(49, 'Email Verification', 'email_verification_10_1762287416794', 'Verify email address', 'Mail', 'Auth', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(50, 'Forgot Password', 'forgot_password_10_1762287416806', 'Password recovery', 'Key', 'Auth', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(51, 'Reset Password', 'reset_password_10_1762287416818', 'Reset user password', 'Lock', 'Auth', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(52, 'Home', 'home_10_1762287416828', 'Restaurant discovery', 'Home', 'Main', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(53, 'Restaurant Menu', 'restaurant_menu_10_1762287416830', 'Browse restaurant menu', 'UtensilsCrossed', 'Main', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(54, 'Cart', 'cart_10_1762287416834', 'Food cart', 'ShoppingCart', 'Main', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(55, 'Checkout', 'checkout_10_1762287416838', 'Order checkout', 'CreditCard', 'Main', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(56, 'Track Order', 'track_order_10_1762287416858', 'Live order tracking', 'MapPin', 'Main', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(57, 'Order History', 'order_history_10_1762287416861', 'Past orders', 'Clock', 'Account', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(58, 'User Profile', 'user_profile_10_1762287416864', 'View user profile', 'User', 'Account', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(59, 'Edit Profile', 'edit_profile_10_1762287416880', 'Edit user profile', 'Edit', 'Account', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(60, 'Notifications List', 'notifications_10_1762287416898', 'View notifications', 'Bell', 'Account', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(61, 'Settings', 'settings_10_1762287416912', 'App settings', 'Settings', 'Account', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(62, 'Privacy Policy', 'privacy_policy_10_1762287416933', 'Privacy policy', 'Shield', 'Legal', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(63, 'Terms and Conditions', 'terms_of_service_10_1762287416948', 'Terms and conditions', 'FileText', 'Legal', 1, 1, '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(64, 'Contact Form', 'contact_10_1762287416961', 'Contact support', 'MessageSquare', 'Support', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(65, 'About Us', 'about_10_1762287416974', 'About the app', 'Info', 'Support', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(66, 'Products', 'products_13_1762289506066', 'Browse all products', 'ShoppingCart', 'Main', 1, 1, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(67, 'Product Details', 'product_details_13_1762289506072', 'Detailed product information', 'Package', 'Main', 1, 1, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(68, 'Orders', 'orders_13_1762289506108', 'Order history', 'Package', 'Account', 1, 1, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(69, 'Account Dashboard', 'account_dashboard_16_1762455434260', 'Main dashboard showing account balance, recent transactions, and quick actions', 'LayoutDashboard', 'Finance', 1, 1, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(70, 'Transaction History', 'transaction_history_16_1762455434288', 'Complete list of all account transactions with search and filter options', 'Receipt', 'Finance', 1, 1, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(71, 'Transfer Money', 'transfer_money_16_1762455434308', 'Send money to another account or contact', 'Send', 'Finance', 1, 1, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(72, 'Bill Payment', 'bill_payment_16_1762455434327', 'Pay utility bills, credit cards, and other recurring payments', 'FileText', 'Finance', 1, 1, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(73, 'Cards Management', 'cards_management_16_1762455434346', 'Manage debit and credit cards, view limits, and control card settings', 'CreditCard', 'Finance', 1, 1, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(74, 'Account Statements', 'account_statements_16_1762455434363', 'View and download monthly account statements', 'FileBarChart', 'Finance', 1, 1, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(75, 'Property Listings', 'property_listings_17_1762456066301', 'Browse available properties with filters and search', 'Building', 'Property', 1, 1, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(76, 'Property Details', 'property_details_17_1762456066326', 'Detailed view of a specific property with photos, amenities, and booking options', 'HomeIcon', 'Property', 1, 1, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(77, 'Booking Form', 'booking_form_17_1762456066353', 'Complete booking form with dates, guests, and payment information', 'Calendar', 'Booking', 1, 1, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(78, 'Host Profile', 'host_profile_17_1762456066377', 'View host information, ratings, and other properties', 'User', 'Profile', 1, 1, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(79, 'Reviews & Ratings', 'reviews_ratings_17_1762456066400', 'View and submit property reviews and ratings', 'Star', 'Reviews', 1, 1, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(80, 'Advanced Search', 'advanced_search_17_1762456066420', 'Advanced search with detailed filters for finding the perfect property', 'Search', 'Search', 1, 1, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(81, 'Request Ride', 'request_ride_19_1762457717201', 'Main screen to request a ride with pickup and destination selection', 'MapPin', 'Booking', 1, 1, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(82, 'Ride Tracking', 'ride_tracking_19_1762457717230', 'Track your current ride in real-time with driver location and ETA', 'Navigation', 'Booking', 1, 1, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(83, 'Ride History', 'ride_history_19_1762457717259', 'View all past rides with details and receipts', 'History', 'Account', 1, 1, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(84, 'Payment Methods', 'payment_methods_19_1762457717279', 'Manage credit cards, debit cards, and digital wallets', 'CreditCard', 'Account', 1, 1, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(85, 'Driver Profile', 'driver_profile_19_1762457717305', 'View detailed driver information, ratings, and reviews', 'User', 'Booking', 1, 1, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(86, 'Feed', 'feed_21_1762543516173', 'Social media feed', 'Home', 'Main', 1, 1, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(87, 'Search', 'search_21_1762543516178', 'Search users and posts', 'Search', 'Main', 1, 1, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(88, 'Messages', 'messages_21_1762543516193', 'Direct messages', 'MessageSquare', 'Main', 1, 1, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(89, 'Terms of Service', 'terms_of_service_21_1762543516201', 'Terms and Service', 'FileText', 'Legal', 1, 1, '2025-11-07 19:25:16', '2025-11-07 20:06:44'),
(93, 'Login', 'login_27_1762974630339', 'Login screen', 'LogIn', 'Authentication', 1, 1, '2025-11-12 19:10:30', '2025-11-12 19:10:30'),
(94, 'Notifications', 'notifications_27_1762974630364', 'Notifications', 'Bell', 'Notifications', 1, 1, '2025-11-12 19:10:30', '2025-11-12 19:10:30'),
(95, 'Contact Us', 'contact_us_27_1762974630367', 'Contact form', 'Mail', 'Information', 1, 1, '2025-11-12 19:10:30', '2025-11-12 19:10:30');

-- --------------------------------------------------------

--
-- Table structure for table `app_screen_assignments`
--

CREATE TABLE `app_screen_assignments` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_published` tinyint(1) DEFAULT '0',
  `is_preview_mode` tinyint(1) DEFAULT '0',
  `current_version_id` int DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `publish_notes` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` int NOT NULL,
  `auto_sync_enabled` tinyint(1) DEFAULT '1' COMMENT 'If false, new master elements are automatically hidden for this app screen',
  `show_in_tabbar` tinyint(1) DEFAULT '0' COMMENT 'Show screen in mobile app bottom tabbar',
  `tabbar_order` int DEFAULT NULL COMMENT 'Order in tabbar (NULL = not in tabbar)',
  `tabbar_icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Icon name for tabbar',
  `tabbar_label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Label for tabbar',
  `show_in_sidebar` tinyint(1) DEFAULT '0' COMMENT 'Show screen in mobile app sidebar menu',
  `sidebar_order` int DEFAULT NULL COMMENT 'Order in sidebar menu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_screen_assignments`
--

INSERT INTO `app_screen_assignments` (`id`, `app_id`, `screen_id`, `is_active`, `is_published`, `is_preview_mode`, `current_version_id`, `published_at`, `publish_notes`, `display_order`, `assigned_at`, `assigned_by`, `auto_sync_enabled`, `show_in_tabbar`, `tabbar_order`, `tabbar_icon`, `tabbar_label`, `show_in_sidebar`, `sidebar_order`) VALUES
(2, 1, 65, 1, 0, 0, NULL, NULL, NULL, 0, '2025-10-31 21:13:34', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(6, 1, 17, 1, 0, 0, NULL, NULL, NULL, 1, '2025-11-03 18:46:54', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(135, 19, 81, 1, 0, 0, NULL, NULL, NULL, 1, '2025-11-06 19:35:17', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(136, 19, 82, 1, 0, 0, NULL, NULL, NULL, 2, '2025-11-06 19:35:17', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(137, 19, 83, 1, 0, 0, NULL, NULL, NULL, 3, '2025-11-06 19:35:17', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(138, 19, 84, 1, 0, 0, NULL, NULL, NULL, 4, '2025-11-06 19:35:17', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(139, 19, 85, 1, 0, 0, NULL, NULL, NULL, 5, '2025-11-06 19:35:17', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(140, 19, 58, 1, 0, 0, NULL, NULL, NULL, 6, '2025-11-06 19:35:17', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(148, 21, 46, 1, 0, 0, NULL, NULL, NULL, 0, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(149, 21, 18, 1, 0, 0, NULL, NULL, NULL, 2, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(150, 21, 49, 1, 0, 0, NULL, NULL, NULL, 4, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(151, 21, 48, 1, 0, 0, NULL, NULL, NULL, 4, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(152, 21, 50, 1, 0, 0, NULL, NULL, NULL, 5, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(153, 21, 51, 1, 0, 0, NULL, NULL, NULL, 6, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(154, 21, 86, 1, 0, 0, NULL, NULL, NULL, 7, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(155, 21, 87, 1, 0, 0, NULL, NULL, NULL, 8, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(156, 21, 88, 1, 0, 0, NULL, NULL, NULL, 9, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(157, 21, 58, 1, 0, 0, NULL, NULL, NULL, 10, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(158, 21, 59, 1, 0, 0, NULL, NULL, NULL, 11, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(159, 21, 60, 1, 0, 0, NULL, NULL, NULL, 12, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(160, 21, 61, 1, 0, 0, NULL, NULL, NULL, 13, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(161, 21, 62, 1, 0, 0, NULL, NULL, NULL, 14, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(162, 21, 89, 1, 0, 0, NULL, NULL, NULL, 15, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(164, 21, 65, 1, 0, 0, NULL, NULL, NULL, 101, '2025-11-07 19:25:16', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(165, 22, 46, 1, 0, 0, NULL, NULL, NULL, 0, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(166, 22, 69, 1, 0, 0, NULL, NULL, NULL, 1, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(168, 22, 70, 1, 0, 0, NULL, NULL, NULL, 2, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(169, 22, 48, 1, 0, 0, NULL, NULL, NULL, 2, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(170, 22, 50, 1, 0, 0, NULL, NULL, NULL, 3, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(171, 22, 71, 1, 0, 0, NULL, NULL, NULL, 3, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(172, 22, 72, 1, 0, 0, NULL, NULL, NULL, 4, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(173, 22, 49, 1, 0, 0, NULL, NULL, NULL, 4, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(174, 22, 73, 1, 0, 0, NULL, NULL, NULL, 5, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(175, 22, 74, 1, 0, 0, NULL, NULL, NULL, 6, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(176, 22, 58, 1, 0, 0, NULL, NULL, NULL, 50, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(177, 22, 59, 1, 0, 0, NULL, NULL, NULL, 51, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(180, 22, 65, 1, 0, 0, NULL, NULL, NULL, 101, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(181, 22, 62, 1, 0, 0, NULL, NULL, NULL, 102, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(182, 22, 89, 1, 0, 0, NULL, NULL, NULL, 103, '2025-11-07 19:29:37', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(227, 28, 46, 1, 0, 0, NULL, NULL, NULL, 0, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(228, 28, 75, 1, 1, 0, NULL, '2025-11-13 21:20:51', NULL, 1, '2025-11-12 19:45:43', 1, 1, 1, 1, 'home', 'Property Listings', 0, NULL),
(229, 28, 18, 1, 0, 0, NULL, NULL, NULL, 1, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(230, 28, 76, 1, 0, 0, NULL, NULL, NULL, 2, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(231, 28, 48, 1, 0, 0, NULL, NULL, NULL, 2, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(232, 28, 50, 1, 0, 0, NULL, NULL, NULL, 3, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(233, 28, 77, 1, 1, 0, NULL, '2025-11-14 17:31:11', NULL, 3, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(234, 28, 78, 1, 1, 0, NULL, '2025-11-14 17:30:49', NULL, 4, '2025-11-12 19:45:43', 1, 1, 0, NULL, 'home', 'Host Profile', 1, NULL),
(235, 28, 49, 1, 0, 0, NULL, NULL, NULL, 4, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(236, 28, 79, 1, 1, 0, NULL, '2025-11-14 17:30:55', NULL, 5, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(237, 28, 80, 1, 1, 0, NULL, '2025-11-13 21:29:54', NULL, 6, '2025-11-12 19:45:43', 1, 1, 1, 1, 'search', 'Advanced Search', 1, NULL),
(238, 28, 58, 1, 1, 0, NULL, '2025-11-14 16:30:56', NULL, 50, '2025-11-12 19:45:43', 1, 1, 1, 3, 'home', 'User Profile', 1, NULL),
(239, 28, 59, 1, 1, 0, NULL, '2025-11-14 17:30:57', NULL, 51, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL),
(240, 28, 94, 1, 1, 0, NULL, '2025-11-14 17:31:06', NULL, 60, '2025-11-12 19:45:43', 1, 1, 0, NULL, 'home', 'Notifications', 1, NULL),
(241, 28, 95, 1, 1, 0, NULL, '2025-11-14 17:30:59', NULL, 100, '2025-11-12 19:45:43', 1, 1, 0, NULL, 'home', 'Contact Us', 1, NULL),
(242, 28, 65, 1, 1, 0, NULL, '2025-11-14 17:31:01', NULL, 101, '2025-11-12 19:45:43', 1, 1, 0, NULL, 'home', 'About Us', 1, NULL),
(243, 28, 62, 1, 1, 0, NULL, '2025-11-14 17:31:02', NULL, 102, '2025-11-12 19:45:43', 1, 1, 0, NULL, 'home', 'Privacy Policy', 1, NULL),
(244, 28, 89, 1, 1, 0, NULL, '2025-11-14 17:31:04', NULL, 103, '2025-11-12 19:45:43', 1, 1, 0, NULL, 'home', 'Terms of Service', 1, NULL),
(245, 28, 88, 1, 1, 0, NULL, '2025-11-14 17:31:08', NULL, 104, '2025-11-12 19:45:43', 1, 1, 0, NULL, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `app_screen_content`
--

CREATE TABLE `app_screen_content` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `element_instance_id` int NOT NULL,
  `content_value` longtext COLLATE utf8mb4_unicode_ci COMMENT 'The actual content/value for this element',
  `options` json DEFAULT NULL COMMENT 'Options for dropdown, radio, checkbox, etc',
  `updated_by` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_screen_content`
--

INSERT INTO `app_screen_content` (`id`, `app_id`, `screen_id`, `element_instance_id`, `content_value`, `options`, `updated_by`, `updated_at`, `created_at`) VALUES
(24, 1, 17, 156, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(25, 1, 17, 157, 'http://localhost:3000/uploads/general/admin-1762439481211-177700095.png', NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(26, 1, 17, 158, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(27, 1, 17, 159, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(28, 1, 17, 160, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(29, 1, 17, 161, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(30, 1, 17, 162, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(31, 1, 17, 163, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(32, 1, 17, 164, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(33, 1, 17, 165, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(34, 1, 17, 166, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11'),
(35, 1, 17, 167, NULL, NULL, 1, '2025-11-06 14:33:11', '2025-11-06 14:33:11');

-- --------------------------------------------------------

--
-- Table structure for table `app_screen_element_overrides`
--

CREATE TABLE `app_screen_element_overrides` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `element_instance_id` int NOT NULL,
  `is_hidden` tinyint(1) DEFAULT '0',
  `is_required_override` tinyint(1) DEFAULT NULL,
  `custom_label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom_placeholder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom_default_value` text COLLATE utf8mb4_unicode_ci,
  `custom_validation_rules` json DEFAULT NULL,
  `custom_display_order` int DEFAULT NULL,
  `custom_config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_screen_element_overrides`
--

INSERT INTO `app_screen_element_overrides` (`id`, `app_id`, `screen_id`, `element_instance_id`, `is_hidden`, `is_required_override`, `custom_label`, `custom_placeholder`, `custom_default_value`, `custom_validation_rules`, `custom_display_order`, `custom_config`, `created_at`, `updated_at`) VALUES
(13, 28, 58, 222, 0, 0, 'Profile information', NULL, NULL, NULL, 1, NULL, '2025-11-13 19:18:50', '2025-11-13 19:18:50'),
(14, 28, 75, 363, 0, 0, 'Page Title', '', 'Find Your Perfect Stay', NULL, 1, NULL, '2025-11-13 21:42:04', '2025-11-13 21:47:27');

-- --------------------------------------------------------

--
-- Table structure for table `app_screen_version_assignments`
--

CREATE TABLE `app_screen_version_assignments` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `version_id` int DEFAULT NULL COMMENT 'NULL means using latest',
  `is_preview_mode` tinyint(1) DEFAULT '0' COMMENT 'If true, shows preview to admins only',
  `locked` tinyint(1) DEFAULT '0' COMMENT 'If true, prevents updates until unlocked',
  `locked_by` int DEFAULT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`id`, `app_id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
(1, 1, 'theme', 'corporate-blue', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(2, 1, 'maintenance_mode', 'false', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(3, 1, 'contact_email', 'info@corporate.example.com', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(11, 4, 'theme', 'portal-dashboard', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(12, 4, 'support_email', 'support@example.com', '2025-10-31 13:21:45', '2025-10-31 13:21:45');

-- --------------------------------------------------------

--
-- Table structure for table `app_templates`
--

CREATE TABLE `app_templates` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Layout',
  `preview_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_templates`
--

INSERT INTO `app_templates` (`id`, `name`, `description`, `category`, `icon`, `preview_image`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'E-Commerce App', 'Complete e-commerce solution with product catalog, cart, and checkout', 'E-Commerce', 'ShoppingCart', NULL, 1, 1, '2025-11-04 20:00:21', '2025-11-04 20:00:21'),
(2, 'Social Media App', 'Social networking app with profiles, posts, and messaging', 'Social', 'MessageSquare', NULL, 1, 1, '2025-11-04 20:00:21', '2025-11-04 20:00:21'),
(3, 'Food Delivery App', 'Restaurant discovery and food ordering platform', 'Food & Drink', 'UtensilsCrossed', NULL, 1, 1, '2025-11-04 20:00:21', '2025-11-04 20:00:21'),
(4, 'Fitness Tracker', 'Health and fitness tracking with workouts and nutrition', 'Health & Fitness', 'Activity', NULL, 1, 1, '2025-11-04 20:00:21', '2025-11-04 20:00:21'),
(5, 'Real Estate App', 'Property listings and real estate marketplace', 'Real Estate', 'Building', NULL, 1, 1, '2025-11-04 20:00:21', '2025-11-04 20:00:21'),
(8, 'Finance & Banking App', 'Complete banking and finance management app with account dashboard', 'Finance & Banking', 'DollarSign', NULL, 1, NULL, '2025-11-06 15:47:20', '2025-11-06 19:10:04'),
(9, 'Property Rental App', 'Complete property rental and booking platform, booking system, host profiles, and reviews', 'Real Estate & Rental', 'Home', NULL, 1, NULL, '2025-11-06 15:49:34', '2025-11-06 19:10:30'),
(10, 'Video Streaming Platform', 'Complete video streaming and content platform with video player, channels, comments, subscriptions', 'Media & Entertainment', 'Video', NULL, 1, NULL, '2025-11-06 15:54:53', '2025-11-06 19:11:31'),
(11, 'Ride Share', 'Complete ride-sharing solution with booking, tracking, and payment features', 'Transportation', 'Car', NULL, 1, NULL, '2025-11-06 19:32:16', '2025-11-06 19:32:16'),
(12, 'Service Matching Platform', 'Complete template for service matching platforms connecting customers with service providers. Includes dual user roles, booking, payments, reviews, and messaging.', 'Marketplace', 'Briefcase', NULL, 1, NULL, '2025-11-07 15:14:42', '2025-11-07 15:14:42'),
(13, 'Money Transfer App', 'Complete template for money transfer and remittance applications. Includes multi-currency support, recipient management, transaction tracking, and secure payments.', 'Finance & Banking', 'DollarSign', NULL, 1, NULL, '2025-11-07 15:21:03', '2025-11-07 15:21:03'),
(14, 'Healthcare & Telemedicine', 'Complete template for healthcare and telemedicine applications. Includes appointment booking, medical records, prescriptions, video consultations, and health tracking.', 'Health & Fitness', 'Heart', NULL, 1, NULL, '2025-11-07 18:21:45', '2025-11-07 18:21:45'),
(15, 'Education & Learning Platform', 'Complete template for online learning and education applications. Includes courses, lessons, quizzes, progress tracking, certificates, and live classes.', 'Education', 'BookOpen', NULL, 1, NULL, '2025-11-07 18:21:53', '2025-11-07 18:21:53'),
(16, 'Event Booking & Ticketing', 'Complete template for event discovery and ticket booking applications. Includes event browsing, ticket purchasing, QR codes, check-in, and event management.', 'Entertainment', 'Calendar', NULL, 1, NULL, '2025-11-07 18:22:02', '2025-11-07 18:22:02'),
(17, 'Job Search & Recruitment', 'Complete template for job search and recruitment applications. Includes job listings, applications, resume builder, company profiles, and interview scheduling.', 'Business & Productivity', 'Briefcase', NULL, 1, NULL, '2025-11-07 18:22:10', '2025-11-07 18:22:10'),
(18, 'Dating & Social Connection', 'Complete template for dating and social connection applications. Includes profile matching, swiping, messaging, video calls, and safety features.', 'Social', 'Heart', NULL, 1, NULL, '2025-11-07 18:22:17', '2025-11-07 18:22:17');

-- --------------------------------------------------------

--
-- Table structure for table `app_template_screens`
--

CREATE TABLE `app_template_screens` (
  `id` int NOT NULL,
  `template_id` int NOT NULL,
  `screen_id` int DEFAULT NULL,
  `screen_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `screen_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `screen_description` text COLLATE utf8mb4_unicode_ci,
  `screen_icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Monitor',
  `screen_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_home_screen` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_template_screens`
--

INSERT INTO `app_template_screens` (`id`, `template_id`, `screen_id`, `screen_name`, `screen_key`, `screen_description`, `screen_icon`, `screen_category`, `display_order`, `is_home_screen`, `created_at`) VALUES
(2, 1, NULL, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(4, 1, NULL, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(5, 1, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(6, 1, NULL, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(7, 1, NULL, 'Home', 'home', 'Main landing page with featured products', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(8, 1, NULL, 'Products', 'products', 'Browse all products', 'ShoppingCart', 'Main', 8, 0, '2025-11-04 20:00:21'),
(9, 1, NULL, 'Product Details', 'product_details', 'Detailed product information', 'Package', 'Main', 9, 0, '2025-11-04 20:00:21'),
(10, 1, NULL, 'Cart', 'cart', 'Shopping cart', 'ShoppingCart', 'Main', 10, 0, '2025-11-04 20:00:21'),
(11, 1, NULL, 'Checkout', 'checkout', 'Order checkout and payment', 'CreditCard', 'Main', 11, 0, '2025-11-04 20:00:21'),
(12, 1, NULL, 'Orders', 'orders', 'Order history', 'Package', 'Account', 12, 0, '2025-11-04 20:00:21'),
(13, 1, NULL, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 13, 0, '2025-11-04 20:00:21'),
(14, 1, NULL, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 14, 0, '2025-11-04 20:00:21'),
(15, 1, NULL, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 15, 0, '2025-11-04 20:00:21'),
(16, 1, NULL, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 16, 0, '2025-11-04 20:00:21'),
(17, 1, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 17, 0, '2025-11-04 20:00:21'),
(18, 1, NULL, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 18, 0, '2025-11-04 20:00:21'),
(22, 2, NULL, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(24, 2, NULL, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(25, 2, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(26, 2, NULL, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(27, 2, NULL, 'Feed', 'feed', 'Social media feed', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(28, 2, NULL, 'Search', 'search', 'Search users and posts', 'Search', 'Main', 8, 0, '2025-11-04 20:00:21'),
(29, 2, NULL, 'Messages', 'messages', 'Direct messages', 'MessageSquare', 'Main', 9, 0, '2025-11-04 20:00:21'),
(30, 2, NULL, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 10, 0, '2025-11-04 20:00:21'),
(31, 2, NULL, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 11, 0, '2025-11-04 20:00:21'),
(32, 2, NULL, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 12, 0, '2025-11-04 20:00:21'),
(33, 2, NULL, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 13, 0, '2025-11-04 20:00:21'),
(34, 2, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 14, 0, '2025-11-04 20:00:21'),
(35, 2, NULL, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 15, 0, '2025-11-04 20:00:21'),
(39, 3, NULL, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(41, 3, NULL, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(42, 3, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(43, 3, NULL, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(44, 3, NULL, 'Home', 'home', 'Restaurant discovery', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(45, 3, NULL, 'Restaurant Menu', 'restaurant_menu', 'Browse restaurant menu', 'UtensilsCrossed', 'Main', 8, 0, '2025-11-04 20:00:21'),
(46, 3, NULL, 'Cart', 'cart', 'Food cart', 'ShoppingCart', 'Main', 9, 0, '2025-11-04 20:00:21'),
(47, 3, NULL, 'Checkout', 'checkout', 'Order checkout', 'CreditCard', 'Main', 10, 0, '2025-11-04 20:00:21'),
(48, 3, NULL, 'Track Order', 'track_order', 'Live order tracking', 'MapPin', 'Main', 11, 0, '2025-11-04 20:00:21'),
(49, 3, NULL, 'Order History', 'order_history', 'Past orders', 'Clock', 'Account', 12, 0, '2025-11-04 20:00:21'),
(50, 3, NULL, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 13, 0, '2025-11-04 20:00:21'),
(51, 3, NULL, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 14, 0, '2025-11-04 20:00:21'),
(52, 3, NULL, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 15, 0, '2025-11-04 20:00:21'),
(53, 3, NULL, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 16, 0, '2025-11-04 20:00:21'),
(54, 3, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 17, 0, '2025-11-04 20:00:21'),
(55, 3, NULL, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 18, 0, '2025-11-04 20:00:21'),
(59, 4, NULL, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(61, 4, NULL, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(62, 4, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(63, 4, NULL, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(64, 4, NULL, 'Dashboard', 'dashboard', 'Fitness dashboard', 'LayoutDashboard', 'Main', 7, 1, '2025-11-04 20:00:21'),
(65, 4, NULL, 'Workouts', 'workouts', 'Workout library', 'Activity', 'Main', 8, 0, '2025-11-04 20:00:21'),
(66, 4, NULL, 'Nutrition', 'nutrition', 'Meal tracking', 'Apple', 'Main', 9, 0, '2025-11-04 20:00:21'),
(67, 4, NULL, 'Progress', 'progress', 'Track your progress', 'TrendingUp', 'Main', 10, 0, '2025-11-04 20:00:21'),
(68, 4, NULL, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 11, 0, '2025-11-04 20:00:21'),
(69, 4, NULL, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 12, 0, '2025-11-04 20:00:21'),
(70, 4, NULL, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 13, 0, '2025-11-04 20:00:21'),
(71, 4, NULL, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 14, 0, '2025-11-04 20:00:21'),
(72, 4, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 15, 0, '2025-11-04 20:00:21'),
(73, 4, NULL, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 16, 0, '2025-11-04 20:00:21'),
(77, 5, NULL, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(79, 5, NULL, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(80, 5, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(81, 5, NULL, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(82, 5, NULL, 'Home', 'home', 'Property search', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(83, 5, NULL, 'Property Listings', 'property_listings', 'Browse properties', 'Building', 'Main', 8, 0, '2025-11-04 20:00:21'),
(84, 5, NULL, 'Property Details', 'property_details', 'Property information', 'Building2', 'Main', 9, 0, '2025-11-04 20:00:21'),
(85, 5, NULL, 'Favorites', 'favorites', 'Saved properties', 'Heart', 'Main', 10, 0, '2025-11-04 20:00:21'),
(86, 5, NULL, 'Map View', 'map_view', 'Properties on map', 'MapPin', 'Main', 11, 0, '2025-11-04 20:00:21'),
(87, 5, NULL, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 12, 0, '2025-11-04 20:00:21'),
(88, 5, NULL, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 13, 0, '2025-11-04 20:00:21'),
(89, 5, NULL, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 14, 0, '2025-11-04 20:00:21'),
(90, 5, NULL, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 15, 0, '2025-11-04 20:00:21'),
(91, 5, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 16, 0, '2025-11-04 20:00:21'),
(92, 5, NULL, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 17, 0, '2025-11-04 20:00:21'),
(115, 8, NULL, 'Account Dashboard', 'account_dashboard', 'Main dashboard showing account balance, recent transactions, and quick actions', 'LayoutDashboard', 'Finance', 1, 1, '2025-11-06 15:47:20'),
(116, 8, NULL, 'Transaction History', 'transaction_history', 'Complete list of all account transactions with search and filter options', 'Receipt', 'Finance', 2, 0, '2025-11-06 15:47:20'),
(117, 8, NULL, 'Transfer Money', 'transfer_money', 'Send money to another account or contact', 'Send', 'Finance', 3, 0, '2025-11-06 15:47:20'),
(118, 8, NULL, 'Bill Payment', 'bill_payment', 'Pay utility bills, credit cards, and other recurring payments', 'FileText', 'Finance', 4, 0, '2025-11-06 15:47:20'),
(119, 8, NULL, 'Cards Management', 'cards_management', 'Manage debit and credit cards, view limits, and control card settings', 'CreditCard', 'Finance', 5, 0, '2025-11-06 15:47:20'),
(120, 8, NULL, 'Account Statements', 'account_statements', 'View and download monthly account statements', 'FileBarChart', 'Finance', 6, 0, '2025-11-06 15:47:20'),
(121, 9, NULL, 'Property Listings', 'property_listings', 'Browse available properties with filters and search', 'Building', 'Property', 8, 1, '2025-11-06 15:49:34'),
(122, 9, NULL, 'Property Details', 'property_details', 'Detailed view of a specific property with photos, amenities, and booking options', 'HomeIcon', 'Property', 9, 0, '2025-11-06 15:49:34'),
(123, 9, NULL, 'Booking Form', 'booking_form', 'Complete booking form with dates, guests, and payment information', 'Calendar', 'Booking', 10, 0, '2025-11-06 15:49:34'),
(124, 9, NULL, 'Host Profile', 'host_profile', 'View host information, ratings, and other properties', 'User', 'Profile', 11, 0, '2025-11-06 15:49:34'),
(125, 9, NULL, 'Reviews & Ratings', 'reviews_ratings', 'View and submit property reviews and ratings', 'Star', 'Reviews', 14, 0, '2025-11-06 15:49:34'),
(126, 9, NULL, 'Advanced Search', 'advanced_search', 'Advanced search with detailed filters for finding the perfect property', 'Search', 'Search', 15, 0, '2025-11-06 15:49:34'),
(127, 10, NULL, 'Video Feed', 'video_feed', 'Main feed showing recommended and trending videos', 'PlayCircle', 'Content', 1, 1, '2025-11-06 15:54:53'),
(128, 10, NULL, 'Video Player', 'video_player', 'Full video player with controls, description, and engagement options', 'Play', 'Content', 2, 0, '2025-11-06 15:54:53'),
(129, 10, NULL, 'Channel Page', 'channel_page', 'Channel profile with videos, playlists, and about information', 'Tv', 'Profile', 3, 0, '2025-11-06 15:54:53'),
(130, 10, NULL, 'Comments', 'comments', 'View and post comments on videos', 'MessageSquare', 'Engagement', 4, 0, '2025-11-06 15:54:53'),
(131, 10, NULL, 'Subscriptions', 'subscriptions', 'View videos from subscribed channels', 'Bell', 'Content', 5, 0, '2025-11-06 15:54:53'),
(132, 10, NULL, 'Upload Video', 'upload_video', 'Upload and publish new videos to your channel', 'Upload', 'Content', 6, 0, '2025-11-06 15:54:53'),
(133, 11, NULL, 'Request Ride', 'request_ride', 'Main screen to request a ride with pickup and destination selection', 'MapPin', 'Booking', 1, 1, '2025-11-06 19:32:16'),
(134, 11, NULL, 'Ride Tracking', 'ride_tracking', 'Track your current ride in real-time with driver location and ETA', 'Navigation', 'Booking', 2, 0, '2025-11-06 19:32:16'),
(135, 11, NULL, 'Ride History', 'ride_history', 'View all past rides with details and receipts', 'History', 'Account', 3, 0, '2025-11-06 19:32:16'),
(136, 11, NULL, 'Payment Methods', 'payment_methods', 'Manage credit cards, debit cards, and digital wallets', 'CreditCard', 'Account', 4, 0, '2025-11-06 19:32:16'),
(137, 11, NULL, 'Driver Profile', 'driver_profile', 'View detailed driver information, ratings, and reviews', 'User', 'Booking', 5, 0, '2025-11-06 19:32:16'),
(138, 11, NULL, 'User Profile', 'user_profile', 'Manage your account settings, preferences, and personal information', 'Settings', 'Account', 6, 0, '2025-11-06 19:32:16'),
(139, 12, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding while loading', 'Zap', 'Onboarding', 1, 0, '2025-11-07 15:14:42'),
(140, 12, NULL, 'Onboarding', 'onboarding', 'Tutorial slides introducing the app', 'BookOpen', 'Onboarding', 2, 0, '2025-11-07 15:14:42'),
(141, 12, NULL, 'Login Screen', 'login', 'Email/username and password login', 'LogIn', 'Authentication', 3, 0, '2025-11-07 15:14:42'),
(142, 12, NULL, 'Sign Up', 'sign_up', 'Create new account - choose role (Customer or Provider)', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 15:14:42'),
(143, 12, NULL, 'Email Verification', 'email_verification', 'Verify email with code', 'Mail', 'Authentication', 5, 0, '2025-11-07 15:14:42'),
(144, 12, NULL, 'Profile Setup', 'profile_setup', 'Complete profile after signup - choose role and add details', 'UserPlus', 'Onboarding', 6, 0, '2025-11-07 15:14:42'),
(145, 12, NULL, 'Service Dashboard', 'service_dashboard', 'Main dashboard showing services or requests based on user role', 'Home', 'Navigation', 7, 1, '2025-11-07 15:14:42'),
(146, 12, NULL, 'Search Services', 'search_services', 'Search and filter service providers', 'Search', 'Discovery', 8, 0, '2025-11-07 15:14:42'),
(147, 12, NULL, 'Service Categories', 'service_categories', 'Browse services by category', 'Grid', 'Discovery', 9, 0, '2025-11-07 15:14:42'),
(148, 12, NULL, 'Service Provider Profile', 'provider_profile', 'View service provider details, ratings, and portfolio', 'User', 'Profile', 10, 0, '2025-11-07 15:14:42'),
(149, 12, NULL, 'Service Details', 'service_details', 'Detailed view of a specific service offering', 'FileText', 'Content', 11, 0, '2025-11-07 15:14:42'),
(150, 12, NULL, 'Request Service', 'request_service', 'Form to request a service from providers', 'MessageSquare', 'Booking', 12, 0, '2025-11-07 15:14:42'),
(151, 12, NULL, 'Request Details', 'request_details', 'View service request with received quotes', 'Eye', 'Booking', 13, 0, '2025-11-07 15:14:42'),
(152, 12, NULL, 'Send Quote', 'send_quote', 'Provider sends quote/proposal to customer', 'DollarSign', 'Booking', 14, 0, '2025-11-07 15:14:42'),
(153, 12, NULL, 'Schedule Booking', 'schedule_booking', 'Pick date and time for service', 'Calendar', 'Booking', 15, 0, '2025-11-07 15:14:42'),
(154, 12, NULL, 'Booking Confirmation', 'booking_confirmation', 'Confirm service booking details', 'CheckCircle', 'Booking', 16, 0, '2025-11-07 15:14:42'),
(155, 12, NULL, 'Messages', 'messages', 'Direct messaging between customers and providers', 'MessageCircle', 'Communication', 17, 0, '2025-11-07 15:14:42'),
(156, 12, NULL, 'Notifications', 'notifications', 'Job alerts, messages, and updates', 'Bell', 'Communication', 18, 0, '2025-11-07 15:14:42'),
(157, 12, NULL, 'Active Jobs', 'active_jobs', 'View current ongoing services', 'Briefcase', 'Jobs', 19, 0, '2025-11-07 15:14:42'),
(158, 12, NULL, 'Job Details', 'job_details', 'Detailed view of a specific job', 'FileText', 'Jobs', 20, 0, '2025-11-07 15:14:42'),
(159, 12, NULL, 'Job History', 'job_history', 'View past completed jobs', 'Clock', 'Jobs', 21, 0, '2025-11-07 15:14:42'),
(160, 12, NULL, 'Job Tracking', 'job_tracking', 'Track job progress and status', 'MapPin', 'Jobs', 22, 0, '2025-11-07 15:14:42'),
(161, 12, NULL, 'Payment Methods', 'payment_methods', 'Manage saved payment methods', 'CreditCard', 'Payment', 23, 0, '2025-11-07 15:14:42'),
(162, 12, NULL, 'Make Payment', 'make_payment', 'Pay for service', 'CreditCard', 'Payment', 24, 0, '2025-11-07 15:14:42'),
(163, 12, NULL, 'Payment Confirmation', 'payment_confirmation', 'Payment receipt and confirmation', 'CheckCircle', 'Payment', 25, 0, '2025-11-07 15:14:42'),
(164, 12, NULL, 'Earnings', 'earnings', 'View earnings and payout history', 'DollarSign', 'Payment', 26, 0, '2025-11-07 15:14:42'),
(165, 12, NULL, 'Payout Settings', 'payout_settings', 'Configure bank account for payouts', 'Settings', 'Payment', 27, 0, '2025-11-07 15:14:42'),
(166, 12, NULL, 'Write Review', 'write_review', 'Rate and review service provider', 'Star', 'Reviews', 28, 0, '2025-11-07 15:14:42'),
(167, 12, NULL, 'Reviews', 'reviews_list', 'View all reviews for a provider', 'Star', 'Reviews', 29, 0, '2025-11-07 15:14:42'),
(168, 12, NULL, 'User Profile', 'user_profile', 'View own profile', 'User', 'Profile', 30, 0, '2025-11-07 15:14:42'),
(169, 12, NULL, 'Edit Profile', 'edit_profile', 'Update profile information', 'Edit', 'Profile', 31, 0, '2025-11-07 15:14:42'),
(170, 12, NULL, 'Settings', 'settings', 'App preferences and account settings', 'Settings', 'Profile', 32, 0, '2025-11-07 15:14:42'),
(171, 12, NULL, 'Become a Provider', 'become_provider', 'Switch from customer to service provider', 'UserPlus', 'Profile', 33, 0, '2025-11-07 15:14:42'),
(172, 12, NULL, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 34, 0, '2025-11-07 15:14:42'),
(173, 12, NULL, 'Contact Us', 'contact_us', 'Contact form for support', 'Mail', 'Information', 35, 0, '2025-11-07 15:14:42'),
(174, 12, NULL, 'Terms of Service', 'terms_of_service', 'Legal terms and conditions', 'FileText', 'Legal', 36, 0, '2025-11-07 15:14:42'),
(175, 12, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy and data usage', 'Shield', 'Legal', 37, 0, '2025-11-07 15:14:42'),
(176, 13, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 1, 0, '2025-11-07 15:21:03'),
(177, 13, NULL, 'Onboarding', 'onboarding', 'Tutorial slides about sending money', 'BookOpen', 'Onboarding', 2, 0, '2025-11-07 15:21:03'),
(178, 13, NULL, 'Login', 'login', 'Secure login with email/phone', 'LogIn', 'Authentication', 3, 0, '2025-11-07 15:21:03'),
(179, 13, NULL, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 15:21:03'),
(180, 13, NULL, 'Phone Verification', 'phone_verification', 'Verify phone with OTP', 'Smartphone', 'Authentication', 5, 0, '2025-11-07 15:21:03'),
(181, 13, NULL, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Authentication', 6, 0, '2025-11-07 15:21:03'),
(182, 13, NULL, 'Home Dashboard', 'home_dashboard', 'Main screen with balance and quick actions', 'Home', 'Navigation', 7, 1, '2025-11-07 15:21:03'),
(183, 13, NULL, 'Transaction History', 'transaction_history', 'List of all transactions', 'List', 'Transactions', 8, 0, '2025-11-07 15:21:03'),
(184, 13, NULL, 'Transaction Details', 'transaction_details', 'Detailed view of a transaction', 'FileText', 'Transactions', 9, 0, '2025-11-07 15:21:03'),
(185, 13, NULL, 'Send Money', 'send_money', 'Start money transfer - select recipient', 'Send', 'Transfer', 10, 0, '2025-11-07 15:21:03'),
(186, 13, NULL, 'Select Recipient', 'select_recipient', 'Choose from saved recipients or add new', 'Users', 'Transfer', 11, 0, '2025-11-07 15:21:03'),
(187, 13, NULL, 'Add Recipient', 'add_recipient', 'Add new recipient details', 'UserPlus', 'Transfer', 12, 0, '2025-11-07 15:21:03'),
(188, 13, NULL, 'Enter Amount', 'enter_amount', 'Enter transfer amount and select currency', 'DollarSign', 'Transfer', 13, 0, '2025-11-07 15:21:03'),
(189, 13, NULL, 'Select Currency', 'select_currency', 'Choose sending and receiving currency', 'Globe', 'Transfer', 14, 0, '2025-11-07 15:21:03'),
(190, 13, NULL, 'Review Transfer', 'review_transfer', 'Review transfer details and fees', 'Eye', 'Transfer', 15, 0, '2025-11-07 15:21:03'),
(191, 13, NULL, 'Payment Method', 'payment_method', 'Choose payment method', 'CreditCard', 'Transfer', 16, 0, '2025-11-07 15:21:03'),
(192, 13, NULL, 'Transfer Confirmation', 'transfer_confirmation', 'Transfer successful confirmation', 'CheckCircle', 'Transfer', 17, 0, '2025-11-07 15:21:03'),
(193, 13, NULL, 'Recipients List', 'recipients_list', 'Manage saved recipients', 'Users', 'Recipients', 18, 0, '2025-11-07 15:21:03'),
(194, 13, NULL, 'Recipient Details', 'recipient_details', 'View recipient information', 'User', 'Recipients', 19, 0, '2025-11-07 15:21:03'),
(195, 13, NULL, 'Edit Recipient', 'edit_recipient', 'Update recipient details', 'Edit', 'Recipients', 20, 0, '2025-11-07 15:21:03'),
(196, 13, NULL, 'Wallet', 'wallet', 'View balance and manage funds', 'Wallet', 'Wallet', 21, 0, '2025-11-07 15:21:03'),
(197, 13, NULL, 'Add Funds', 'add_funds', 'Top up wallet balance', 'Plus', 'Wallet', 22, 0, '2025-11-07 15:21:03'),
(198, 13, NULL, 'Withdraw Funds', 'withdraw_funds', 'Cash out to bank account', 'Minus', 'Wallet', 23, 0, '2025-11-07 15:21:03'),
(199, 13, NULL, 'Payment Methods', 'payment_methods', 'Manage cards and bank accounts', 'CreditCard', 'Payment', 24, 0, '2025-11-07 15:21:03'),
(200, 13, NULL, 'Add Payment Method', 'add_payment_method', 'Link new card or bank', 'Plus', 'Payment', 25, 0, '2025-11-07 15:21:03'),
(201, 13, NULL, 'Bank Accounts', 'bank_accounts', 'Linked bank accounts', 'Building', 'Payment', 26, 0, '2025-11-07 15:21:03'),
(202, 13, NULL, 'Add Bank Account', 'add_bank_account', 'Link bank account', 'Plus', 'Payment', 27, 0, '2025-11-07 15:21:03'),
(203, 13, NULL, 'Exchange Rates', 'exchange_rates', 'View current exchange rates', 'TrendingUp', 'Rates', 28, 0, '2025-11-07 15:21:03'),
(204, 13, NULL, 'Rate Alerts', 'rate_alerts', 'Set alerts for favorable rates', 'Bell', 'Rates', 29, 0, '2025-11-07 15:21:03'),
(205, 13, NULL, 'Fee Calculator', 'fee_calculator', 'Calculate transfer fees', 'Calculator', 'Rates', 30, 0, '2025-11-07 15:21:03'),
(206, 13, NULL, 'Identity Verification', 'identity_verification', 'Verify identity with documents', 'Shield', 'Security', 31, 0, '2025-11-07 15:21:03'),
(207, 13, NULL, 'Upload Documents', 'upload_documents', 'Upload ID and proof of address', 'Upload', 'Security', 32, 0, '2025-11-07 15:21:03'),
(208, 13, NULL, 'Two-Factor Authentication', 'two_factor_auth', 'Enable 2FA for security', 'Lock', 'Security', 33, 0, '2025-11-07 15:21:03'),
(209, 13, NULL, 'Security Settings', 'security_settings', 'Manage security preferences', 'Shield', 'Security', 34, 0, '2025-11-07 15:21:03'),
(210, 13, NULL, 'Transaction PIN', 'transaction_pin', 'Set PIN for transactions', 'Key', 'Security', 35, 0, '2025-11-07 15:21:03'),
(211, 13, NULL, 'Profile', 'profile', 'View user profile', 'User', 'Profile', 36, 0, '2025-11-07 15:21:03'),
(212, 13, NULL, 'Edit Profile', 'edit_profile', 'Update profile information', 'Edit', 'Profile', 37, 0, '2025-11-07 15:21:03'),
(213, 13, NULL, 'Settings', 'settings', 'App settings and preferences', 'Settings', 'Settings', 38, 0, '2025-11-07 15:21:03'),
(214, 13, NULL, 'Notifications Settings', 'notifications_settings', 'Manage notification preferences', 'Bell', 'Settings', 39, 0, '2025-11-07 15:21:03'),
(215, 13, NULL, 'Language & Currency', 'language_currency', 'Set preferred language and currency', 'Globe', 'Settings', 40, 0, '2025-11-07 15:21:03'),
(216, 13, NULL, 'Change Password', 'change_password', 'Update account password', 'Lock', 'Settings', 41, 0, '2025-11-07 15:21:03'),
(217, 13, NULL, 'Help Center', 'help_center', 'FAQ and support articles', 'HelpCircle', 'Support', 42, 0, '2025-11-07 15:21:03'),
(218, 13, NULL, 'Contact Support', 'contact_support', 'Get help from support team', 'MessageCircle', 'Support', 43, 0, '2025-11-07 15:21:03'),
(219, 13, NULL, 'Live Chat', 'live_chat', 'Chat with support agent', 'MessageSquare', 'Support', 44, 0, '2025-11-07 15:21:03'),
(220, 13, NULL, 'Report Issue', 'report_issue', 'Report a problem', 'AlertCircle', 'Support', 45, 0, '2025-11-07 15:21:03'),
(221, 13, NULL, 'Transaction Dispute', 'transaction_dispute', 'Dispute a transaction', 'AlertTriangle', 'Support', 46, 0, '2025-11-07 15:21:03'),
(222, 13, NULL, 'Notifications', 'notifications', 'All notifications and alerts', 'Bell', 'Notifications', 47, 0, '2025-11-07 15:21:03'),
(223, 13, NULL, 'Activity Log', 'activity_log', 'Account activity history', 'Activity', 'Notifications', 48, 0, '2025-11-07 15:21:03'),
(224, 13, NULL, 'Referral Program', 'referral_program', 'Invite friends and earn rewards', 'Gift', 'Rewards', 49, 0, '2025-11-07 15:21:03'),
(225, 13, NULL, 'Rewards', 'rewards', 'View earned rewards and bonuses', 'Award', 'Rewards', 50, 0, '2025-11-07 15:21:03'),
(226, 13, NULL, 'Promo Codes', 'promo_codes', 'Enter promotional codes', 'Tag', 'Rewards', 51, 0, '2025-11-07 15:21:03'),
(227, 13, NULL, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 52, 0, '2025-11-07 15:21:03'),
(228, 13, NULL, 'Terms of Service', 'terms_of_service', 'Legal terms and conditions', 'FileText', 'Legal', 53, 0, '2025-11-07 15:21:03'),
(229, 13, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy and data usage', 'Shield', 'Legal', 54, 0, '2025-11-07 15:21:03'),
(230, 13, NULL, 'Compliance', 'compliance', 'Regulatory compliance information', 'CheckSquare', 'Legal', 55, 0, '2025-11-07 15:21:03'),
(231, 1, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(232, 1, NULL, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(233, 1, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(234, 1, NULL, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(235, 2, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(236, 2, NULL, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(237, 2, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(238, 2, NULL, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(239, 3, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(240, 3, NULL, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(241, 3, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(242, 3, NULL, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(243, 4, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(244, 4, NULL, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(245, 4, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(246, 4, NULL, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(247, 5, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(248, 5, NULL, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(249, 5, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(250, 5, NULL, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(251, 8, NULL, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(252, 8, NULL, 'Login', 'login', 'Login screen', 'LogIn', 'Authentication', 1, 0, '2025-11-07 15:30:52'),
(253, 8, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 2, 0, '2025-11-07 15:30:52'),
(254, 8, NULL, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0, '2025-11-07 15:30:52'),
(255, 8, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(256, 8, NULL, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 50, 0, '2025-11-07 15:30:52'),
(257, 8, NULL, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 51, 0, '2025-11-07 15:30:52'),
(258, 8, NULL, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 60, 0, '2025-11-07 15:30:52'),
(259, 8, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(260, 8, NULL, 'About Us', 'about_us', 'About', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(261, 8, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 102, 0, '2025-11-07 15:30:52'),
(262, 8, NULL, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 103, 0, '2025-11-07 15:30:52'),
(263, 9, NULL, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 1, 0, '2025-11-07 15:30:52'),
(265, 9, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 3, 0, '2025-11-07 15:30:52'),
(266, 9, NULL, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(267, 9, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 5, 0, '2025-11-07 15:30:52'),
(268, 9, NULL, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 12, 0, '2025-11-07 15:30:52'),
(269, 9, NULL, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 13, 0, '2025-11-07 15:30:52'),
(270, 9, NULL, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 16, 0, '2025-11-07 15:30:52'),
(271, 9, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 17, 0, '2025-11-07 15:30:52'),
(272, 9, NULL, 'About Us', 'about_us', 'About', 'Info', 'Information', 18, 0, '2025-11-07 15:30:52'),
(273, 9, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 6, 0, '2025-11-07 15:30:52'),
(274, 9, NULL, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 7, 0, '2025-11-07 15:30:52'),
(275, 10, NULL, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(276, 10, NULL, 'Login', 'login', 'Login screen', 'LogIn', 'Authentication', 1, 0, '2025-11-07 15:30:52'),
(277, 10, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 2, 0, '2025-11-07 15:30:52'),
(278, 10, NULL, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0, '2025-11-07 15:30:52'),
(279, 10, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(280, 10, NULL, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 50, 0, '2025-11-07 15:30:52'),
(281, 10, NULL, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 51, 0, '2025-11-07 15:30:52'),
(282, 10, NULL, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 60, 0, '2025-11-07 15:30:52'),
(283, 10, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(284, 10, NULL, 'About Us', 'about_us', 'About', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(285, 10, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 102, 0, '2025-11-07 15:30:52'),
(286, 10, NULL, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 103, 0, '2025-11-07 15:30:52'),
(287, 11, NULL, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 0, 0, '2025-11-07 15:30:52'),
(288, 11, NULL, 'Login', 'login', 'Login screen', 'LogIn', 'Authentication', 1, 0, '2025-11-07 15:30:52'),
(289, 11, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 2, 0, '2025-11-07 15:30:52'),
(290, 11, NULL, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0, '2025-11-07 15:30:52'),
(291, 11, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 4, 0, '2025-11-07 15:30:52'),
(292, 11, NULL, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 51, 0, '2025-11-07 15:30:52'),
(293, 11, NULL, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 60, 0, '2025-11-07 15:30:52'),
(294, 11, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(295, 11, NULL, 'About Us', 'about_us', 'About', 'Info', 'Information', 101, 0, '2025-11-07 15:30:52'),
(296, 11, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 102, 0, '2025-11-07 15:30:52'),
(297, 11, NULL, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 103, 0, '2025-11-07 15:30:52'),
(298, 12, NULL, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0, '2025-11-07 15:30:52'),
(299, 13, NULL, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0, '2025-11-07 15:30:52'),
(300, 13, NULL, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0, '2025-11-07 15:30:52'),
(301, 14, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 1, 0, '2025-11-07 18:21:45'),
(302, 14, NULL, 'Onboarding', 'onboarding', 'Health app introduction', 'BookOpen', 'Onboarding', 2, 0, '2025-11-07 18:21:45'),
(303, 14, NULL, 'Login', 'login', 'Secure login', 'LogIn', 'Authentication', 3, 0, '2025-11-07 18:21:45'),
(304, 14, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 18:21:45'),
(305, 14, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, '2025-11-07 18:21:45'),
(306, 14, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, '2025-11-07 18:21:45'),
(307, 14, NULL, 'Health Dashboard', 'health_dashboard', 'Main health overview with vitals and appointments', 'Activity', 'Navigation', 7, 1, '2025-11-07 18:21:45'),
(308, 14, NULL, 'Find Doctor', 'find_doctor', 'Search for healthcare providers', 'Search', 'Appointments', 8, 0, '2025-11-07 18:21:45'),
(309, 14, NULL, 'Doctor Profile', 'doctor_profile', 'View doctor details and reviews', 'User', 'Appointments', 9, 0, '2025-11-07 18:21:45'),
(310, 14, NULL, 'Book Appointment', 'book_appointment', 'Schedule appointment with doctor', 'Calendar', 'Appointments', 10, 0, '2025-11-07 18:21:45'),
(311, 14, NULL, 'Appointment Confirmation', 'appointment_confirmation', 'Booking confirmation', 'CheckCircle', 'Appointments', 11, 0, '2025-11-07 18:21:45'),
(312, 14, NULL, 'My Appointments', 'my_appointments', 'List of upcoming and past appointments', 'List', 'Appointments', 12, 0, '2025-11-07 18:21:45'),
(313, 14, NULL, 'Appointment Details', 'appointment_details', 'Detailed appointment information', 'FileText', 'Appointments', 13, 0, '2025-11-07 18:21:45'),
(314, 14, NULL, 'Reschedule Appointment', 'reschedule_appointment', 'Change appointment time', 'Clock', 'Appointments', 14, 0, '2025-11-07 18:21:45'),
(315, 14, NULL, 'Video Consultation', 'video_consultation', 'Live video call with doctor', 'Video', 'Telemedicine', 15, 0, '2025-11-07 18:21:45'),
(316, 14, NULL, 'Waiting Room', 'waiting_room', 'Virtual waiting room', 'Clock', 'Telemedicine', 16, 0, '2025-11-07 18:21:45'),
(317, 14, NULL, 'Chat with Doctor', 'chat_with_doctor', 'Text messaging with provider', 'MessageCircle', 'Telemedicine', 17, 0, '2025-11-07 18:21:45'),
(318, 14, NULL, 'Consultation Summary', 'consultation_summary', 'Post-consultation notes', 'FileText', 'Telemedicine', 18, 0, '2025-11-07 18:21:45'),
(319, 14, NULL, 'Medical Records', 'medical_records', 'View health records', 'Folder', 'Records', 19, 0, '2025-11-07 18:21:45'),
(320, 14, NULL, 'Lab Results', 'lab_results', 'View test results', 'Activity', 'Records', 20, 0, '2025-11-07 18:21:45'),
(321, 14, NULL, 'Prescriptions', 'prescriptions', 'View and refill prescriptions', 'Pill', 'Records', 21, 0, '2025-11-07 18:21:45'),
(322, 14, NULL, 'Immunization Records', 'immunization_records', 'Vaccination history', 'Shield', 'Records', 22, 0, '2025-11-07 18:21:45'),
(323, 14, NULL, 'Allergies', 'allergies', 'Manage allergy information', 'AlertTriangle', 'Records', 23, 0, '2025-11-07 18:21:45'),
(324, 14, NULL, 'Medical History', 'medical_history', 'Past conditions and treatments', 'Clock', 'Records', 24, 0, '2025-11-07 18:21:45'),
(325, 14, NULL, 'Health Metrics', 'health_metrics', 'Track vital signs', 'TrendingUp', 'Tracking', 25, 0, '2025-11-07 18:21:45'),
(326, 14, NULL, 'Blood Pressure Log', 'blood_pressure_log', 'Record blood pressure', 'Activity', 'Tracking', 26, 0, '2025-11-07 18:21:45'),
(327, 14, NULL, 'Blood Glucose Log', 'blood_glucose_log', 'Track blood sugar', 'Droplet', 'Tracking', 27, 0, '2025-11-07 18:21:45'),
(328, 14, NULL, 'Weight Tracker', 'weight_tracker', 'Monitor weight changes', 'TrendingUp', 'Tracking', 28, 0, '2025-11-07 18:21:45'),
(329, 14, NULL, 'Medication Tracker', 'medication_tracker', 'Track medication intake', 'Pill', 'Tracking', 29, 0, '2025-11-07 18:21:45'),
(330, 14, NULL, 'Symptom Checker', 'symptom_checker', 'Check symptoms', 'Search', 'Tracking', 30, 0, '2025-11-07 18:21:45'),
(331, 14, NULL, 'Health Goals', 'health_goals', 'Set and track health goals', 'Target', 'Tracking', 31, 0, '2025-11-07 18:21:45'),
(332, 14, NULL, 'Activity Log', 'activity_log', 'Track physical activity', 'Activity', 'Tracking', 32, 0, '2025-11-07 18:21:45'),
(333, 14, NULL, 'Pharmacy Locator', 'pharmacy_locator', 'Find nearby pharmacies', 'MapPin', 'Pharmacy', 33, 0, '2025-11-07 18:21:45'),
(334, 14, NULL, 'Order Medication', 'order_medication', 'Order prescription refills', 'ShoppingCart', 'Pharmacy', 34, 0, '2025-11-07 18:21:45'),
(335, 14, NULL, 'Medication Reminders', 'medication_reminders', 'Set pill reminders', 'Bell', 'Pharmacy', 35, 0, '2025-11-07 18:21:45'),
(336, 14, NULL, 'Pharmacy Orders', 'pharmacy_orders', 'Track medication orders', 'Package', 'Pharmacy', 36, 0, '2025-11-07 18:21:45'),
(337, 14, NULL, 'Insurance Information', 'insurance_information', 'Manage insurance details', 'CreditCard', 'Insurance', 37, 0, '2025-11-07 18:21:45'),
(338, 14, NULL, 'Insurance Card', 'insurance_card', 'Digital insurance card', 'CreditCard', 'Insurance', 38, 0, '2025-11-07 18:21:45'),
(339, 14, NULL, 'Bills & Payments', 'bills_payments', 'View and pay medical bills', 'DollarSign', 'Insurance', 39, 0, '2025-11-07 18:21:45'),
(340, 14, NULL, 'Payment Methods', 'payment_methods', 'Manage payment options', 'CreditCard', 'Insurance', 40, 0, '2025-11-07 18:21:45'),
(341, 14, NULL, 'Claims History', 'claims_history', 'View insurance claims', 'FileText', 'Insurance', 41, 0, '2025-11-07 18:21:45'),
(342, 14, NULL, 'Family Members', 'family_members', 'Manage family profiles', 'Users', 'Family', 42, 0, '2025-11-07 18:21:45'),
(343, 14, NULL, 'Add Family Member', 'add_family_member', 'Add dependent', 'UserPlus', 'Family', 43, 0, '2025-11-07 18:21:45'),
(344, 14, NULL, 'Switch Profile', 'switch_profile', 'Switch between family members', 'RefreshCw', 'Family', 44, 0, '2025-11-07 18:21:45'),
(345, 14, NULL, 'Notifications', 'notifications', 'Health alerts and reminders', 'Bell', 'Notifications', 45, 0, '2025-11-07 18:21:45'),
(346, 14, NULL, 'Appointment Reminders', 'appointment_reminders', 'Upcoming appointment alerts', 'Clock', 'Notifications', 46, 0, '2025-11-07 18:21:45'),
(347, 14, NULL, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 47, 0, '2025-11-07 18:21:45'),
(348, 14, NULL, 'Edit Profile', 'edit_profile', 'Update personal information', 'Edit', 'Profile', 48, 0, '2025-11-07 18:21:45'),
(349, 14, NULL, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 49, 0, '2025-11-07 18:21:45'),
(350, 14, NULL, 'Privacy Settings', 'privacy_settings', 'Health data privacy', 'Lock', 'Settings', 50, 0, '2025-11-07 18:21:45'),
(351, 14, NULL, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 51, 0, '2025-11-07 18:21:45'),
(352, 14, NULL, 'Contact Support', 'contact_us', 'Contact customer support', 'Mail', 'Support', 52, 0, '2025-11-07 18:21:45'),
(353, 14, NULL, 'About Us', 'about_us', 'App information', 'Info', 'Information', 53, 0, '2025-11-07 18:21:45'),
(354, 14, NULL, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 54, 0, '2025-11-07 18:21:45'),
(355, 14, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 55, 0, '2025-11-07 18:21:45'),
(356, 15, NULL, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 1, 0, '2025-11-07 18:21:53'),
(357, 15, NULL, 'Onboarding', 'onboarding', 'Learning platform introduction', 'BookOpen', 'Onboarding', 2, 0, '2025-11-07 18:21:53'),
(358, 15, NULL, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, '2025-11-07 18:21:53'),
(359, 15, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 18:21:53'),
(360, 15, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, '2025-11-07 18:21:53'),
(361, 15, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, '2025-11-07 18:21:53'),
(362, 15, NULL, 'Home Dashboard', 'home_dashboard', 'Main learning dashboard', 'Home', 'Navigation', 7, 1, '2025-11-07 18:21:53'),
(363, 15, NULL, 'Search', 'search', 'Search courses and content', 'Search', 'Navigation', 8, 0, '2025-11-07 18:21:53'),
(364, 15, NULL, 'Browse Courses', 'browse_courses', 'Explore available courses', 'Grid', 'Discovery', 9, 0, '2025-11-07 18:21:53'),
(365, 15, NULL, 'Course Categories', 'course_categories', 'Browse by category', 'Folder', 'Discovery', 10, 0, '2025-11-07 18:21:53'),
(366, 15, NULL, 'Featured Courses', 'featured_courses', 'Highlighted courses', 'Star', 'Discovery', 11, 0, '2025-11-07 18:21:53'),
(367, 15, NULL, 'Trending Courses', 'trending_courses', 'Popular courses', 'TrendingUp', 'Discovery', 12, 0, '2025-11-07 18:21:53'),
(368, 15, NULL, 'Recommended', 'recommended', 'Personalized recommendations', 'ThumbsUp', 'Discovery', 13, 0, '2025-11-07 18:21:53'),
(369, 15, NULL, 'Course Details', 'course_details', 'Course information and curriculum', 'FileText', 'Courses', 14, 0, '2025-11-07 18:21:53'),
(370, 15, NULL, 'Course Preview', 'course_preview', 'Preview course content', 'Eye', 'Courses', 15, 0, '2025-11-07 18:21:53'),
(371, 15, NULL, 'Instructor Profile', 'instructor_profile', 'View instructor details', 'User', 'Courses', 16, 0, '2025-11-07 18:21:53'),
(372, 15, NULL, 'Course Reviews', 'course_reviews', 'Student reviews and ratings', 'Star', 'Courses', 17, 0, '2025-11-07 18:21:53'),
(373, 15, NULL, 'My Courses', 'my_courses', 'Enrolled courses', 'BookOpen', 'Learning', 18, 0, '2025-11-07 18:21:53'),
(374, 15, NULL, 'Course Player', 'course_player', 'Video lesson player', 'Play', 'Learning', 19, 0, '2025-11-07 18:21:53'),
(375, 15, NULL, 'Lesson Content', 'lesson_content', 'Text and media lesson', 'FileText', 'Learning', 20, 0, '2025-11-07 18:21:53'),
(376, 15, NULL, 'Course Notes', 'course_notes', 'Take and view notes', 'Edit', 'Learning', 21, 0, '2025-11-07 18:21:53'),
(377, 15, NULL, 'Bookmarks', 'bookmarks', 'Saved lessons', 'Bookmark', 'Learning', 22, 0, '2025-11-07 18:21:53'),
(378, 15, NULL, 'Downloads', 'downloads', 'Offline content', 'Download', 'Learning', 23, 0, '2025-11-07 18:21:53'),
(379, 15, NULL, 'Continue Learning', 'continue_learning', 'Resume where you left off', 'Play', 'Learning', 24, 0, '2025-11-07 18:21:53'),
(380, 15, NULL, 'Learning Path', 'learning_path', 'Structured learning journey', 'GitBranch', 'Learning', 25, 0, '2025-11-07 18:21:53'),
(381, 15, NULL, 'Quiz', 'quiz', 'Take quiz', 'HelpCircle', 'Assessments', 26, 0, '2025-11-07 18:21:53'),
(382, 15, NULL, 'Quiz Results', 'quiz_results', 'View quiz score', 'CheckCircle', 'Assessments', 27, 0, '2025-11-07 18:21:53'),
(383, 15, NULL, 'Assignments', 'assignments', 'Course assignments', 'FileText', 'Assessments', 28, 0, '2025-11-07 18:21:53'),
(384, 15, NULL, 'Submit Assignment', 'submit_assignment', 'Upload assignment', 'Upload', 'Assessments', 29, 0, '2025-11-07 18:21:53'),
(385, 15, NULL, 'Practice Tests', 'practice_tests', 'Practice exams', 'Edit', 'Assessments', 30, 0, '2025-11-07 18:21:53'),
(386, 15, NULL, 'Final Exam', 'final_exam', 'Course final exam', 'Award', 'Assessments', 31, 0, '2025-11-07 18:21:53'),
(387, 15, NULL, 'Progress Dashboard', 'progress_dashboard', 'Learning progress overview', 'TrendingUp', 'Progress', 32, 0, '2025-11-07 18:21:53'),
(388, 15, NULL, 'Course Progress', 'course_progress', 'Individual course progress', 'Activity', 'Progress', 33, 0, '2025-11-07 18:21:53'),
(389, 15, NULL, 'Certificates', 'certificates', 'Earned certificates', 'Award', 'Progress', 34, 0, '2025-11-07 18:21:53'),
(390, 15, NULL, 'Achievements', 'achievements', 'Badges and milestones', 'Trophy', 'Progress', 35, 0, '2025-11-07 18:21:53'),
(391, 15, NULL, 'Leaderboard', 'leaderboard', 'Student rankings', 'TrendingUp', 'Progress', 36, 0, '2025-11-07 18:21:53'),
(392, 15, NULL, 'Live Classes', 'live_classes', 'Scheduled live sessions', 'Video', 'Live', 37, 0, '2025-11-07 18:21:53'),
(393, 15, NULL, 'Join Live Class', 'join_live_class', 'Enter live session', 'Video', 'Live', 38, 0, '2025-11-07 18:21:53'),
(394, 15, NULL, 'Class Schedule', 'class_schedule', 'Upcoming live classes', 'Calendar', 'Live', 39, 0, '2025-11-07 18:21:53'),
(395, 15, NULL, 'Recorded Sessions', 'recorded_sessions', 'Past live class recordings', 'Video', 'Live', 40, 0, '2025-11-07 18:21:53'),
(396, 15, NULL, 'Discussion Forum', 'discussion_forum', 'Course discussions', 'MessageCircle', 'Community', 41, 0, '2025-11-07 18:21:53'),
(397, 15, NULL, 'Q&A', 'qa', 'Ask questions', 'HelpCircle', 'Community', 42, 0, '2025-11-07 18:21:53'),
(398, 15, NULL, 'Study Groups', 'study_groups', 'Join study groups', 'Users', 'Community', 43, 0, '2025-11-07 18:21:53'),
(399, 15, NULL, 'Messages', 'messages', 'Chat with students and instructors', 'Mail', 'Community', 44, 0, '2025-11-07 18:21:53'),
(400, 15, NULL, 'Announcements', 'announcements', 'Course updates', 'Bell', 'Community', 45, 0, '2025-11-07 18:21:53'),
(401, 15, NULL, 'Enroll Course', 'enroll_course', 'Course enrollment', 'ShoppingCart', 'Enrollment', 46, 0, '2025-11-07 18:21:53'),
(402, 15, NULL, 'Payment', 'payment', 'Course payment', 'CreditCard', 'Enrollment', 47, 0, '2025-11-07 18:21:53'),
(403, 15, NULL, 'Purchase History', 'purchase_history', 'Past purchases', 'Receipt', 'Enrollment', 48, 0, '2025-11-07 18:21:53'),
(404, 15, NULL, 'Wishlist', 'wishlist', 'Saved courses', 'Heart', 'Enrollment', 49, 0, '2025-11-07 18:21:53'),
(405, 15, NULL, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 50, 0, '2025-11-07 18:21:53'),
(406, 15, NULL, 'Edit Profile', 'edit_profile', 'Update profile', 'Edit', 'Profile', 51, 0, '2025-11-07 18:21:53'),
(407, 15, NULL, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 52, 0, '2025-11-07 18:21:53'),
(408, 15, NULL, 'Notifications Settings', 'notifications_settings', 'Notification preferences', 'Bell', 'Settings', 53, 0, '2025-11-07 18:21:53'),
(409, 15, NULL, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 54, 0, '2025-11-07 18:21:53'),
(410, 15, NULL, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 55, 0, '2025-11-07 18:21:53'),
(411, 15, NULL, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 56, 0, '2025-11-07 18:21:53'),
(412, 15, NULL, 'About Us', 'about_us', 'Platform information', 'Info', 'Information', 57, 0, '2025-11-07 18:21:53'),
(413, 15, NULL, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 58, 0, '2025-11-07 18:21:53'),
(414, 15, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 59, 0, '2025-11-07 18:21:53'),
(415, 16, NULL, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 1, 0, '2025-11-07 18:22:02'),
(416, 16, NULL, 'Onboarding', 'onboarding', 'Event app introduction', 'BookOpen', 'Onboarding', 2, 0, '2025-11-07 18:22:02'),
(417, 16, NULL, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, '2025-11-07 18:22:02'),
(418, 16, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 18:22:02'),
(419, 16, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, '2025-11-07 18:22:02'),
(420, 16, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, '2025-11-07 18:22:02'),
(421, 16, NULL, 'Home', 'home', 'Main event feed', 'Home', 'Navigation', 7, 1, '2025-11-07 18:22:02'),
(422, 16, NULL, 'Search Events', 'search_events', 'Search and filter events', 'Search', 'Navigation', 8, 0, '2025-11-07 18:22:02'),
(423, 16, NULL, 'Browse Events', 'browse_events', 'Explore all events', 'Grid', 'Discovery', 9, 0, '2025-11-07 18:22:02'),
(424, 16, NULL, 'Event Categories', 'event_categories', 'Browse by category', 'Folder', 'Discovery', 10, 0, '2025-11-07 18:22:02'),
(425, 16, NULL, 'Nearby Events', 'nearby_events', 'Events near you', 'MapPin', 'Discovery', 11, 0, '2025-11-07 18:22:02'),
(426, 16, NULL, 'Featured Events', 'featured_events', 'Highlighted events', 'Star', 'Discovery', 12, 0, '2025-11-07 18:22:02'),
(427, 16, NULL, 'Trending Events', 'trending_events', 'Popular events', 'TrendingUp', 'Discovery', 13, 0, '2025-11-07 18:22:02'),
(428, 16, NULL, 'For You', 'for_you', 'Personalized recommendations', 'Heart', 'Discovery', 14, 0, '2025-11-07 18:22:02'),
(429, 16, NULL, 'Event Details', 'event_details', 'Full event information', 'FileText', 'Events', 15, 0, '2025-11-07 18:22:02'),
(430, 16, NULL, 'Event Gallery', 'event_gallery', 'Event photos and videos', 'Image', 'Events', 16, 0, '2025-11-07 18:22:02'),
(431, 16, NULL, 'Venue Information', 'venue_information', 'Venue details and map', 'MapPin', 'Events', 17, 0, '2025-11-07 18:22:02'),
(432, 16, NULL, 'Organizer Profile', 'organizer_profile', 'Event organizer info', 'User', 'Events', 18, 0, '2025-11-07 18:22:02'),
(433, 16, NULL, 'Event Reviews', 'event_reviews', 'Attendee reviews', 'Star', 'Events', 19, 0, '2025-11-07 18:22:02');
INSERT INTO `app_template_screens` (`id`, `template_id`, `screen_id`, `screen_name`, `screen_key`, `screen_description`, `screen_icon`, `screen_category`, `display_order`, `is_home_screen`, `created_at`) VALUES
(434, 16, NULL, 'Select Tickets', 'select_tickets', 'Choose ticket types and quantity', 'Ticket', 'Booking', 20, 0, '2025-11-07 18:22:02'),
(435, 16, NULL, 'Seat Selection', 'seat_selection', 'Choose seats (for seated events)', 'Grid', 'Booking', 21, 0, '2025-11-07 18:22:02'),
(436, 16, NULL, 'Attendee Information', 'attendee_information', 'Enter attendee details', 'Users', 'Booking', 22, 0, '2025-11-07 18:22:02'),
(437, 16, NULL, 'Checkout', 'checkout', 'Review and pay', 'ShoppingCart', 'Booking', 23, 0, '2025-11-07 18:22:02'),
(438, 16, NULL, 'Payment', 'payment', 'Payment processing', 'CreditCard', 'Booking', 24, 0, '2025-11-07 18:22:02'),
(439, 16, NULL, 'Booking Confirmation', 'booking_confirmation', 'Purchase confirmation', 'CheckCircle', 'Booking', 25, 0, '2025-11-07 18:22:02'),
(440, 16, NULL, 'Add to Calendar', 'add_to_calendar', 'Save event to calendar', 'Calendar', 'Booking', 26, 0, '2025-11-07 18:22:02'),
(441, 16, NULL, 'My Tickets', 'my_tickets', 'All purchased tickets', 'Ticket', 'Tickets', 27, 0, '2025-11-07 18:22:02'),
(442, 16, NULL, 'Ticket Details', 'ticket_details', 'Individual ticket information', 'FileText', 'Tickets', 28, 0, '2025-11-07 18:22:02'),
(443, 16, NULL, 'QR Code Ticket', 'qr_code_ticket', 'Digital ticket with QR code', 'QrCode', 'Tickets', 29, 0, '2025-11-07 18:22:02'),
(444, 16, NULL, 'Transfer Ticket', 'transfer_ticket', 'Transfer ticket to someone', 'Send', 'Tickets', 30, 0, '2025-11-07 18:22:02'),
(445, 16, NULL, 'Refund Request', 'refund_request', 'Request ticket refund', 'RefreshCw', 'Tickets', 31, 0, '2025-11-07 18:22:02'),
(446, 16, NULL, 'Check-In', 'check_in', 'Event check-in screen', 'CheckCircle', 'CheckIn', 32, 0, '2025-11-07 18:22:02'),
(447, 16, NULL, 'Scan QR Code', 'scan_qr_code', 'Scan ticket QR code', 'Camera', 'CheckIn', 33, 0, '2025-11-07 18:22:02'),
(448, 16, NULL, 'Event Feed', 'event_feed', 'Social feed for event', 'MessageCircle', 'Social', 34, 0, '2025-11-07 18:22:02'),
(449, 16, NULL, 'Attendees', 'attendees', 'See who else is going', 'Users', 'Social', 35, 0, '2025-11-07 18:22:02'),
(450, 16, NULL, 'Share Event', 'share_event', 'Share with friends', 'Share', 'Social', 36, 0, '2025-11-07 18:22:02'),
(451, 16, NULL, 'Invite Friends', 'invite_friends', 'Invite contacts', 'UserPlus', 'Social', 37, 0, '2025-11-07 18:22:02'),
(452, 16, NULL, 'Favorites', 'favorites', 'Saved events', 'Heart', 'Favorites', 38, 0, '2025-11-07 18:22:02'),
(453, 16, NULL, 'Interests', 'interests', 'Select event interests', 'Tag', 'Favorites', 39, 0, '2025-11-07 18:22:02'),
(454, 16, NULL, 'Following', 'following', 'Followed organizers and venues', 'Bell', 'Favorites', 40, 0, '2025-11-07 18:22:02'),
(455, 16, NULL, 'Event Calendar', 'event_calendar', 'Calendar view of events', 'Calendar', 'Calendar', 41, 0, '2025-11-07 18:22:02'),
(456, 16, NULL, 'Reminders', 'reminders', 'Event reminders', 'Bell', 'Calendar', 42, 0, '2025-11-07 18:22:02'),
(457, 16, NULL, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 43, 0, '2025-11-07 18:22:02'),
(458, 16, NULL, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 44, 0, '2025-11-07 18:22:02'),
(459, 16, NULL, 'Edit Profile', 'edit_profile', 'Update profile', 'Edit', 'Profile', 45, 0, '2025-11-07 18:22:02'),
(460, 16, NULL, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 46, 0, '2025-11-07 18:22:02'),
(461, 16, NULL, 'Payment Methods', 'payment_methods', 'Manage payment options', 'CreditCard', 'Settings', 47, 0, '2025-11-07 18:22:02'),
(462, 16, NULL, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 48, 0, '2025-11-07 18:22:02'),
(463, 16, NULL, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 49, 0, '2025-11-07 18:22:02'),
(464, 16, NULL, 'About Us', 'about_us', 'App information', 'Info', 'Information', 50, 0, '2025-11-07 18:22:02'),
(465, 16, NULL, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 51, 0, '2025-11-07 18:22:02'),
(466, 16, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 52, 0, '2025-11-07 18:22:02'),
(467, 17, NULL, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 1, 0, '2025-11-07 18:22:10'),
(468, 17, NULL, 'Onboarding', 'onboarding', 'Job app introduction', 'BookOpen', 'Onboarding', 2, 0, '2025-11-07 18:22:10'),
(469, 17, NULL, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, '2025-11-07 18:22:10'),
(470, 17, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 18:22:10'),
(471, 17, NULL, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, '2025-11-07 18:22:10'),
(472, 17, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, '2025-11-07 18:22:10'),
(473, 17, NULL, 'Profile Setup', 'profile_setup', 'Complete profile after signup', 'User', 'Onboarding', 7, 0, '2025-11-07 18:22:10'),
(474, 17, NULL, 'Home Feed', 'home_feed', 'Job recommendations feed', 'Home', 'Navigation', 8, 1, '2025-11-07 18:22:10'),
(475, 17, NULL, 'Search Jobs', 'search_jobs', 'Search and filter jobs', 'Search', 'Navigation', 9, 0, '2025-11-07 18:22:10'),
(476, 17, NULL, 'Browse Jobs', 'browse_jobs', 'Explore all job listings', 'Grid', 'Discovery', 10, 0, '2025-11-07 18:22:10'),
(477, 17, NULL, 'Job Categories', 'job_categories', 'Browse by category', 'Folder', 'Discovery', 11, 0, '2025-11-07 18:22:10'),
(478, 17, NULL, 'Nearby Jobs', 'nearby_jobs', 'Jobs near you', 'MapPin', 'Discovery', 12, 0, '2025-11-07 18:22:10'),
(479, 17, NULL, 'Remote Jobs', 'remote_jobs', 'Work from home opportunities', 'Home', 'Discovery', 13, 0, '2025-11-07 18:22:10'),
(480, 17, NULL, 'Recommended Jobs', 'recommended_jobs', 'Personalized recommendations', 'ThumbsUp', 'Discovery', 14, 0, '2025-11-07 18:22:10'),
(481, 17, NULL, 'Job Details', 'job_details', 'Full job description', 'FileText', 'Jobs', 15, 0, '2025-11-07 18:22:10'),
(482, 17, NULL, 'Company Profile', 'company_profile', 'Company information', 'Building', 'Jobs', 16, 0, '2025-11-07 18:22:10'),
(483, 17, NULL, 'Company Reviews', 'company_reviews', 'Employee reviews', 'Star', 'Jobs', 17, 0, '2025-11-07 18:22:10'),
(484, 17, NULL, 'Similar Jobs', 'similar_jobs', 'Related job listings', 'List', 'Jobs', 18, 0, '2025-11-07 18:22:10'),
(485, 17, NULL, 'Apply for Job', 'apply_for_job', 'Job application form', 'Send', 'Applications', 19, 0, '2025-11-07 18:22:10'),
(486, 17, NULL, 'Quick Apply', 'quick_apply', 'One-click application', 'Zap', 'Applications', 20, 0, '2025-11-07 18:22:10'),
(487, 17, NULL, 'Application Questions', 'application_questions', 'Screening questions', 'HelpCircle', 'Applications', 21, 0, '2025-11-07 18:22:10'),
(488, 17, NULL, 'Upload Documents', 'upload_documents', 'Upload resume and cover letter', 'Upload', 'Applications', 22, 0, '2025-11-07 18:22:10'),
(489, 17, NULL, 'Application Confirmation', 'application_confirmation', 'Application submitted', 'CheckCircle', 'Applications', 23, 0, '2025-11-07 18:22:10'),
(490, 17, NULL, 'My Applications', 'my_applications', 'Track application status', 'List', 'Applications', 24, 0, '2025-11-07 18:22:10'),
(491, 17, NULL, 'My Resume', 'my_resume', 'View and edit resume', 'FileText', 'Profile', 25, 0, '2025-11-07 18:22:10'),
(492, 17, NULL, 'Resume Builder', 'resume_builder', 'Create resume', 'Edit', 'Profile', 26, 0, '2025-11-07 18:22:10'),
(493, 17, NULL, 'Work Experience', 'work_experience', 'Add work history', 'Briefcase', 'Profile', 27, 0, '2025-11-07 18:22:10'),
(494, 17, NULL, 'Education', 'education', 'Add education', 'BookOpen', 'Profile', 28, 0, '2025-11-07 18:22:10'),
(495, 17, NULL, 'Skills', 'skills', 'Add skills and certifications', 'Award', 'Profile', 29, 0, '2025-11-07 18:22:10'),
(496, 17, NULL, 'Saved Jobs', 'saved_jobs', 'Bookmarked jobs', 'Bookmark', 'Saved', 30, 0, '2025-11-07 18:22:10'),
(497, 17, NULL, 'Job Alerts', 'job_alerts', 'Set up job alerts', 'Bell', 'Saved', 31, 0, '2025-11-07 18:22:10'),
(498, 17, NULL, 'Followed Companies', 'followed_companies', 'Companies you follow', 'Heart', 'Saved', 32, 0, '2025-11-07 18:22:10'),
(499, 17, NULL, 'Interview Schedule', 'interview_schedule', 'Upcoming interviews', 'Calendar', 'Interviews', 33, 0, '2025-11-07 18:22:10'),
(500, 17, NULL, 'Interview Details', 'interview_details', 'Interview information', 'FileText', 'Interviews', 34, 0, '2025-11-07 18:22:10'),
(501, 17, NULL, 'Interview Preparation', 'interview_preparation', 'Tips and resources', 'BookOpen', 'Interviews', 35, 0, '2025-11-07 18:22:10'),
(502, 17, NULL, 'Video Interview', 'video_interview', 'Virtual interview', 'Video', 'Interviews', 36, 0, '2025-11-07 18:22:10'),
(503, 17, NULL, 'Salary Calculator', 'salary_calculator', 'Estimate salary range', 'DollarSign', 'Insights', 37, 0, '2025-11-07 18:22:10'),
(504, 17, NULL, 'Career Insights', 'career_insights', 'Industry trends', 'TrendingUp', 'Insights', 38, 0, '2025-11-07 18:22:10'),
(505, 17, NULL, 'Skill Assessment', 'skill_assessment', 'Test your skills', 'Award', 'Insights', 39, 0, '2025-11-07 18:22:10'),
(506, 17, NULL, 'Connections', 'connections', 'Professional network', 'Users', 'Networking', 40, 0, '2025-11-07 18:22:10'),
(507, 17, NULL, 'Messages', 'messages', 'Chat with recruiters', 'MessageCircle', 'Networking', 41, 0, '2025-11-07 18:22:10'),
(508, 17, NULL, 'Referrals', 'referrals', 'Employee referrals', 'UserPlus', 'Networking', 42, 0, '2025-11-07 18:22:10'),
(509, 17, NULL, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 43, 0, '2025-11-07 18:22:10'),
(510, 17, NULL, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 44, 0, '2025-11-07 18:22:10'),
(511, 17, NULL, 'Edit Profile', 'edit_profile', 'Update profile', 'Edit', 'Profile', 45, 0, '2025-11-07 18:22:10'),
(512, 17, NULL, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 46, 0, '2025-11-07 18:22:10'),
(513, 17, NULL, 'Privacy Settings', 'privacy_settings', 'Control visibility', 'Lock', 'Settings', 47, 0, '2025-11-07 18:22:10'),
(514, 17, NULL, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 48, 0, '2025-11-07 18:22:10'),
(515, 17, NULL, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 49, 0, '2025-11-07 18:22:10'),
(516, 17, NULL, 'About Us', 'about_us', 'App information', 'Info', 'Information', 50, 0, '2025-11-07 18:22:10'),
(517, 17, NULL, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 51, 0, '2025-11-07 18:22:10'),
(518, 17, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 52, 0, '2025-11-07 18:22:10'),
(519, 18, NULL, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 1, 0, '2025-11-07 18:22:17'),
(520, 18, NULL, 'Onboarding', 'onboarding', 'Dating app introduction', 'BookOpen', 'Onboarding', 2, 0, '2025-11-07 18:22:17'),
(521, 18, NULL, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, '2025-11-07 18:22:17'),
(522, 18, NULL, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, '2025-11-07 18:22:17'),
(523, 18, NULL, 'Phone Verification', 'phone_verification', 'Verify phone number', 'Smartphone', 'Authentication', 5, 0, '2025-11-07 18:22:17'),
(524, 18, NULL, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, '2025-11-07 18:22:17'),
(525, 18, NULL, 'Profile Creation', 'profile_creation', 'Build your profile', 'User', 'Onboarding', 7, 0, '2025-11-07 18:22:17'),
(526, 18, NULL, 'Photo Upload', 'photo_upload', 'Add profile photos', 'Image', 'Onboarding', 8, 0, '2025-11-07 18:22:17'),
(527, 18, NULL, 'Discover', 'discover', 'Swipe through profiles', 'Users', 'Discovery', 9, 1, '2025-11-07 18:22:17'),
(528, 18, NULL, 'Profile Card', 'profile_card', 'View profile details', 'User', 'Discovery', 10, 0, '2025-11-07 18:22:17'),
(529, 18, NULL, 'Filters', 'filters', 'Set discovery preferences', 'SlidersHorizontal', 'Discovery', 11, 0, '2025-11-07 18:22:17'),
(530, 18, NULL, 'Matches', 'matches', 'Your matches', 'Heart', 'Matches', 12, 0, '2025-11-07 18:22:17'),
(531, 18, NULL, 'New Match', 'new_match', 'Match notification', 'Sparkles', 'Matches', 13, 0, '2025-11-07 18:22:17'),
(532, 18, NULL, 'Match Profile', 'match_profile', 'View match details', 'User', 'Matches', 14, 0, '2025-11-07 18:22:17'),
(533, 18, NULL, 'Icebreakers', 'icebreakers', 'Conversation starters', 'MessageCircle', 'Matches', 15, 0, '2025-11-07 18:22:17'),
(534, 18, NULL, 'Messages', 'messages', 'All conversations', 'MessageCircle', 'Messaging', 16, 0, '2025-11-07 18:22:17'),
(535, 18, NULL, 'Chat', 'chat', 'One-on-one chat', 'MessageSquare', 'Messaging', 17, 0, '2025-11-07 18:22:17'),
(536, 18, NULL, 'Voice Call', 'voice_call', 'Audio call', 'Phone', 'Messaging', 18, 0, '2025-11-07 18:22:17'),
(537, 18, NULL, 'Video Call', 'video_call', 'Video call', 'Video', 'Messaging', 19, 0, '2025-11-07 18:22:17'),
(538, 18, NULL, 'Send Gift', 'send_gift', 'Send virtual gift', 'Gift', 'Messaging', 20, 0, '2025-11-07 18:22:17'),
(539, 18, NULL, 'Likes You', 'likes_you', 'See who liked you', 'Heart', 'Activity', 21, 0, '2025-11-07 18:22:17'),
(540, 18, NULL, 'Your Likes', 'your_likes', 'People you liked', 'ThumbsUp', 'Activity', 22, 0, '2025-11-07 18:22:17'),
(541, 18, NULL, 'Activity Feed', 'activity_feed', 'Recent activity', 'Activity', 'Activity', 23, 0, '2025-11-07 18:22:17'),
(542, 18, NULL, 'My Profile', 'my_profile', 'View your profile', 'User', 'Profile', 24, 0, '2025-11-07 18:22:17'),
(543, 18, NULL, 'Edit Profile', 'edit_profile', 'Update profile information', 'Edit', 'Profile', 25, 0, '2025-11-07 18:22:17'),
(544, 18, NULL, 'Edit Photos', 'edit_photos', 'Manage profile photos', 'Image', 'Profile', 26, 0, '2025-11-07 18:22:17'),
(545, 18, NULL, 'Profile Preview', 'profile_preview', 'See how others see you', 'Eye', 'Profile', 27, 0, '2025-11-07 18:22:17'),
(546, 18, NULL, 'Profile Verification', 'profile_verification', 'Verify your profile', 'CheckCircle', 'Profile', 28, 0, '2025-11-07 18:22:17'),
(547, 18, NULL, 'Profile Prompts', 'profile_prompts', 'Answer profile questions', 'MessageSquare', 'Profile', 29, 0, '2025-11-07 18:22:17'),
(548, 18, NULL, 'Dating Preferences', 'dating_preferences', 'Set match criteria', 'Heart', 'Preferences', 30, 0, '2025-11-07 18:22:17'),
(549, 18, NULL, 'Location Settings', 'location_settings', 'Set search radius', 'MapPin', 'Preferences', 31, 0, '2025-11-07 18:22:17'),
(550, 18, NULL, 'Deal Breakers', 'deal_breakers', 'Set must-haves and deal breakers', 'X', 'Preferences', 32, 0, '2025-11-07 18:22:17'),
(551, 18, NULL, 'Premium Plans', 'premium_plans', 'Subscription options', 'Star', 'Premium', 33, 0, '2025-11-07 18:22:17'),
(552, 18, NULL, 'Boost Profile', 'boost_profile', 'Increase visibility', 'TrendingUp', 'Premium', 34, 0, '2025-11-07 18:22:17'),
(553, 18, NULL, 'Super Likes', 'super_likes', 'Stand out with super likes', 'Sparkles', 'Premium', 35, 0, '2025-11-07 18:22:17'),
(554, 18, NULL, 'Rewind', 'rewind', 'Undo last swipe', 'RotateCcw', 'Premium', 36, 0, '2025-11-07 18:22:17'),
(555, 18, NULL, 'Safety Center', 'safety_center', 'Safety tips and resources', 'Shield', 'Safety', 37, 0, '2025-11-07 18:22:17'),
(556, 18, NULL, 'Report User', 'report_user', 'Report inappropriate behavior', 'AlertTriangle', 'Safety', 38, 0, '2025-11-07 18:22:17'),
(557, 18, NULL, 'Block User', 'block_user', 'Block and unmatch', 'Ban', 'Safety', 39, 0, '2025-11-07 18:22:17'),
(558, 18, NULL, 'Safety Tips', 'safety_tips', 'Dating safety guidelines', 'Info', 'Safety', 40, 0, '2025-11-07 18:22:17'),
(559, 18, NULL, 'Events', 'events', 'Local dating events', 'Calendar', 'Social', 41, 0, '2025-11-07 18:22:17'),
(560, 18, NULL, 'Group Activities', 'group_activities', 'Group meetups', 'Users', 'Social', 42, 0, '2025-11-07 18:22:17'),
(561, 18, NULL, 'Date Ideas', 'date_ideas', 'Suggested date activities', 'Lightbulb', 'Social', 43, 0, '2025-11-07 18:22:17'),
(562, 18, NULL, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 44, 0, '2025-11-07 18:22:17'),
(563, 18, NULL, 'Settings', 'settings', 'App settings', 'Settings', 'Settings', 45, 0, '2025-11-07 18:22:17'),
(564, 18, NULL, 'Notification Settings', 'notification_settings', 'Manage notifications', 'Bell', 'Settings', 46, 0, '2025-11-07 18:22:17'),
(565, 18, NULL, 'Privacy Settings', 'privacy_settings', 'Control privacy', 'Lock', 'Settings', 47, 0, '2025-11-07 18:22:17'),
(566, 18, NULL, 'Account Settings', 'account_settings', 'Manage account', 'User', 'Settings', 48, 0, '2025-11-07 18:22:17'),
(567, 18, NULL, 'Subscription Management', 'subscription_management', 'Manage subscription', 'CreditCard', 'Settings', 49, 0, '2025-11-07 18:22:17'),
(568, 18, NULL, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 50, 0, '2025-11-07 18:22:17'),
(569, 18, NULL, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 51, 0, '2025-11-07 18:22:17'),
(570, 18, NULL, 'About Us', 'about_us', 'App information', 'Info', 'Information', 52, 0, '2025-11-07 18:22:17'),
(571, 18, NULL, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 53, 0, '2025-11-07 18:22:17'),
(572, 18, NULL, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 54, 0, '2025-11-07 18:22:17'),
(573, 9, 88, 'Messages', 'messages', 'Direct messages', 'MessageSquare', 'Main', 19, 0, '2025-11-12 19:44:57'),
(574, 9, 18, 'Login Screen', 'login_screen', 'Standard login screen with email and password fields', 'log-in', 'Authentication', 2, 0, '2025-11-13 18:53:26');

-- --------------------------------------------------------

--
-- Table structure for table `app_template_screen_elements`
--

CREATE TABLE `app_template_screen_elements` (
  `id` int NOT NULL,
  `template_screen_id` int NOT NULL,
  `element_id` int NOT NULL,
  `field_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placeholder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_value` text COLLATE utf8mb4_unicode_ci,
  `is_required` tinyint(1) DEFAULT '0',
  `is_readonly` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `config` json DEFAULT NULL,
  `validation_rules` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_template_screen_elements`
--

INSERT INTO `app_template_screen_elements` (`id`, `template_screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`) VALUES
(5, 2, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(6, 2, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(7, 2, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(8, 2, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(9, 2, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(10, 2, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(21, 4, 27, 'verify_heading', 'Verify Your Email', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(22, 4, 28, 'verify_description', 'We sent a verification code to your email address. Please enter it below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(23, 4, 1, 'verification_code', 'Verification Code', 'Enter 6-digit code', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(24, 4, 33, 'verify_button', 'Verify Email', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(25, 4, 28, 'resend_link', 'Did not receive code? Resend', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(26, 5, 27, 'forgot_heading', 'Forgot Password?', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(27, 5, 28, 'forgot_description', 'Enter your email address and we will send you a link to reset your password.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(28, 5, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(29, 5, 33, 'send_button', 'Send Reset Link', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(30, 5, 28, 'login_link', 'Remember your password? Login', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(31, 6, 27, 'reset_heading', 'Reset Password', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(32, 6, 28, 'reset_description', 'Please enter your new password below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(33, 6, 1, 'new_password', 'New Password', 'Enter new password', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(34, 6, 1, 'confirm_password', 'Confirm Password', 'Re-enter new password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(35, 6, 33, 'reset_button', 'Reset Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(36, 9, 27, 'product_name', 'Product Name', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(37, 9, 28, 'product_subtitle', 'Premium Quality Product', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(38, 9, 27, 'price_label', 'Price', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(39, 9, 28, 'product_price', '$99.99', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(40, 9, 27, 'description_label', 'Description', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(41, 9, 28, 'product_description', 'This is a high-quality product designed to meet your needs. Made with premium materials and built to last.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(42, 9, 27, 'features_label', 'Features', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(43, 9, 28, 'product_features', 'â€¢ Premium quality materials\nâ€¢ Durable construction\nâ€¢ Easy to use\nâ€¢ 1-year warranty', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(44, 9, 27, 'quantity_label', 'Quantity', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(45, 9, 11, 'quantity', 'Quantity', '1', NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(46, 9, 33, 'add_to_cart_button', 'Add to Cart', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(47, 9, 33, 'buy_now_button', 'Buy Now', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(48, 11, 27, 'checkout_heading', 'Checkout', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(49, 11, 27, 'shipping_heading', 'Shipping Address', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(50, 11, 1, 'shipping_name', 'Full Name', 'Enter full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(51, 11, 1, 'address_line1', 'Address Line 1', 'Street address', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(52, 11, 1, 'address_line2', 'Address Line 2', 'Apt, suite, etc. (optional)', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(53, 11, 1, 'city', 'City', 'City', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(54, 11, 1, 'state', 'State/Province', 'State', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(55, 11, 1, 'zip', 'ZIP/Postal Code', 'ZIP code', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(56, 11, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 1, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(57, 11, 27, 'payment_heading', 'Payment Method', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(58, 11, 28, 'payment_method', 'Credit/Debit Card', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(59, 11, 33, 'place_order_button', 'Place Order', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(60, 13, 27, 'profile_heading', 'My Profile', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(61, 13, 28, 'profile_description', 'Update your personal information below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(62, 13, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(63, 13, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(64, 13, 4, 'email', 'Email', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(65, 13, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(66, 13, 2, 'bio', 'Bio', 'Tell us about yourself...', NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(67, 13, 33, 'save_button', 'Save Changes', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(68, 14, 47, 'profile_photo', 'Profile Photo', 'Upload profile photo', '', 0, 0, 1, '{\"width\": \"150px\", \"height\": \"150px\", \"altText\": \"Profile Photo\", \"imageUrl\": \"https://placehold.co/150x150?text=Photo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(69, 14, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(70, 14, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(71, 14, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(72, 14, 5, 'phone', 'Phone Number', '+1 (555) 123-4567', '', 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(73, 14, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(74, 14, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(75, 14, 10, 'gender', 'Gender', 'Select your gender', '', 0, 0, 8, '{\"options\": [{\"label\": \"Male\", \"value\": \"male\"}, {\"label\": \"Female\", \"value\": \"female\"}, {\"label\": \"Non-binary\", \"value\": \"non_binary\"}, {\"label\": \"Prefer not to say\", \"value\": \"prefer_not_to_say\"}]}', NULL, '2025-11-04 20:15:18'),
(76, 14, 33, 'save_button', 'Save Changes', '', '', 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(77, 14, 34, 'change_password_link', 'Change Password', '', '', 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(78, 15, 27, 'notifications_heading', 'Notifications', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(79, 15, 28, 'notifications_description', 'Stay updated with your latest activities', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(80, 15, 28, 'notification_1', 'You have a new message', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(81, 15, 28, 'notification_2', 'Your order has been shipped', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(82, 15, 28, 'notification_3', 'New friend request', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(83, 15, 33, 'mark_read_button', 'Mark All as Read', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(84, 16, 27, 'settings_heading', 'Settings', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(85, 16, 28, 'settings_description', 'Manage your app preferences', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(86, 16, 27, 'account_section', 'Account', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(87, 16, 28, 'edit_profile_link', 'Edit Profile', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(88, 16, 28, 'change_password_link', 'Change Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(89, 16, 27, 'notifications_section', 'Notifications', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(90, 16, 28, 'push_notifications_toggle', 'Push Notifications', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(91, 16, 28, 'email_notifications_toggle', 'Email Notifications', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(92, 16, 27, 'privacy_section', 'Privacy', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(93, 16, 28, 'privacy_policy_link', 'Privacy Policy', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(94, 16, 28, 'terms_link', 'Terms of Service', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(95, 16, 33, 'logout_button', 'Logout', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(96, 17, 27, 'privacy_heading', 'Privacy Policy', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(97, 17, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(98, 17, 27, 'section1_heading', 'Information We Collect', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(99, 17, 28, 'section1_text', 'We collect information you provide directly to us, including name, email, and usage data.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(100, 17, 27, 'section2_heading', 'How We Use Your Information', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(101, 17, 28, 'section2_text', 'We use your information to provide, maintain, and improve our services.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(102, 17, 27, 'section3_heading', 'Data Security', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(103, 17, 28, 'section3_text', 'We implement appropriate security measures to protect your personal information.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(104, 18, 27, 'terms_heading', 'Terms of Service', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(105, 18, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(106, 18, 27, 'section1_heading', 'Acceptance of Terms', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(107, 18, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(108, 18, 27, 'section2_heading', 'User Responsibilities', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(109, 18, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(110, 18, 27, 'section3_heading', 'Termination', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(111, 18, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(133, 22, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(134, 22, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(135, 22, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(136, 22, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(137, 22, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(138, 22, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(149, 24, 27, 'verify_heading', 'Verify Your Email', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(150, 24, 28, 'verify_description', 'We sent a verification code to your email address. Please enter it below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(151, 24, 1, 'verification_code', 'Verification Code', 'Enter 6-digit code', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(152, 24, 33, 'verify_button', 'Verify Email', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(153, 24, 28, 'resend_link', 'Did not receive code? Resend', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(154, 25, 27, 'forgot_heading', 'Forgot Password?', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(155, 25, 28, 'forgot_description', 'Enter your email address and we will send you a link to reset your password.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(156, 25, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(157, 25, 33, 'send_button', 'Send Reset Link', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(158, 25, 28, 'login_link', 'Remember your password? Login', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(159, 26, 27, 'reset_heading', 'Reset Password', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(160, 26, 28, 'reset_description', 'Please enter your new password below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(161, 26, 1, 'new_password', 'New Password', 'Enter new password', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(162, 26, 1, 'confirm_password', 'Confirm Password', 'Re-enter new password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(163, 26, 33, 'reset_button', 'Reset Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(164, 28, 27, 'search_heading', 'Search', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(165, 28, 1, 'search_input', 'Search', 'What are you looking for?', NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(166, 28, 28, 'popular_section', 'Popular Searches', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(167, 28, 28, 'popular_1', 'Products', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(168, 28, 28, 'popular_2', 'Services', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(169, 28, 28, 'popular_3', 'Articles', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(170, 28, 33, 'search_button', 'Search', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(171, 30, 27, 'profile_heading', 'My Profile', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(172, 30, 28, 'profile_description', 'Update your personal information below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(173, 30, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(174, 30, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(175, 30, 4, 'email', 'Email', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(176, 30, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(177, 30, 2, 'bio', 'Bio', 'Tell us about yourself...', NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(178, 30, 33, 'save_button', 'Save Changes', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(179, 31, 47, 'profile_photo', 'Profile Photo', 'Upload profile photo', '', 0, 0, 1, '{\"width\": \"150px\", \"height\": \"150px\", \"altText\": \"Profile Photo\", \"imageUrl\": \"https://placehold.co/150x150?text=Photo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(180, 31, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(181, 31, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(182, 31, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(183, 31, 5, 'phone', 'Phone Number', '+1 (555) 123-4567', '', 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(184, 31, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(185, 31, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(186, 31, 10, 'gender', 'Gender', 'Select your gender', '', 0, 0, 8, '{\"options\": [{\"label\": \"Male\", \"value\": \"male\"}, {\"label\": \"Female\", \"value\": \"female\"}, {\"label\": \"Non-binary\", \"value\": \"non_binary\"}, {\"label\": \"Prefer not to say\", \"value\": \"prefer_not_to_say\"}]}', NULL, '2025-11-04 20:15:18'),
(187, 31, 33, 'save_button', 'Save Changes', '', '', 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(188, 31, 34, 'change_password_link', 'Change Password', '', '', 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(189, 32, 27, 'notifications_heading', 'Notifications', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(190, 32, 28, 'notifications_description', 'Stay updated with your latest activities', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(191, 32, 28, 'notification_1', 'You have a new message', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(192, 32, 28, 'notification_2', 'Your order has been shipped', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(193, 32, 28, 'notification_3', 'New friend request', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(194, 32, 33, 'mark_read_button', 'Mark All as Read', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(195, 33, 27, 'settings_heading', 'Settings', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(196, 33, 28, 'settings_description', 'Manage your app preferences', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(197, 33, 27, 'account_section', 'Account', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(198, 33, 28, 'edit_profile_link', 'Edit Profile', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(199, 33, 28, 'change_password_link', 'Change Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(200, 33, 27, 'notifications_section', 'Notifications', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(201, 33, 28, 'push_notifications_toggle', 'Push Notifications', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(202, 33, 28, 'email_notifications_toggle', 'Email Notifications', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(203, 33, 27, 'privacy_section', 'Privacy', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(204, 33, 28, 'privacy_policy_link', 'Privacy Policy', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(205, 33, 28, 'terms_link', 'Terms of Service', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(206, 33, 33, 'logout_button', 'Logout', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(207, 34, 27, 'privacy_heading', 'Privacy Policy', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(208, 34, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(209, 34, 27, 'section1_heading', 'Information We Collect', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(210, 34, 28, 'section1_text', 'We collect information you provide directly to us, including name, email, and usage data.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(211, 34, 27, 'section2_heading', 'How We Use Your Information', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(212, 34, 28, 'section2_text', 'We use your information to provide, maintain, and improve our services.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(213, 34, 27, 'section3_heading', 'Data Security', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(214, 34, 28, 'section3_text', 'We implement appropriate security measures to protect your personal information.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(215, 35, 27, 'terms_heading', 'Terms of Service', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(216, 35, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(217, 35, 27, 'section1_heading', 'Acceptance of Terms', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(218, 35, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(219, 35, 27, 'section2_heading', 'User Responsibilities', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(220, 35, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(221, 35, 27, 'section3_heading', 'Termination', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(222, 35, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(244, 39, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(245, 39, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(246, 39, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(247, 39, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(248, 39, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(249, 39, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(260, 41, 27, 'verify_heading', 'Verify Your Email', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(261, 41, 28, 'verify_description', 'We sent a verification code to your email address. Please enter it below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(262, 41, 1, 'verification_code', 'Verification Code', 'Enter 6-digit code', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(263, 41, 33, 'verify_button', 'Verify Email', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(264, 41, 28, 'resend_link', 'Did not receive code? Resend', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(265, 42, 27, 'forgot_heading', 'Forgot Password?', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(266, 42, 28, 'forgot_description', 'Enter your email address and we will send you a link to reset your password.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(267, 42, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(268, 42, 33, 'send_button', 'Send Reset Link', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(269, 42, 28, 'login_link', 'Remember your password? Login', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(270, 43, 27, 'reset_heading', 'Reset Password', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(271, 43, 28, 'reset_description', 'Please enter your new password below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(272, 43, 1, 'new_password', 'New Password', 'Enter new password', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(273, 43, 1, 'confirm_password', 'Confirm Password', 'Re-enter new password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(274, 43, 33, 'reset_button', 'Reset Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(275, 47, 27, 'checkout_heading', 'Checkout', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(276, 47, 27, 'shipping_heading', 'Shipping Address', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(277, 47, 1, 'shipping_name', 'Full Name', 'Enter full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(278, 47, 1, 'address_line1', 'Address Line 1', 'Street address', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(279, 47, 1, 'address_line2', 'Address Line 2', 'Apt, suite, etc. (optional)', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(280, 47, 1, 'city', 'City', 'City', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(281, 47, 1, 'state', 'State/Province', 'State', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(282, 47, 1, 'zip', 'ZIP/Postal Code', 'ZIP code', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(283, 47, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 1, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(284, 47, 27, 'payment_heading', 'Payment Method', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(285, 47, 28, 'payment_method', 'Credit/Debit Card', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(286, 47, 33, 'place_order_button', 'Place Order', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(287, 50, 27, 'profile_heading', 'My Profile', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(288, 50, 28, 'profile_description', 'Update your personal information below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(289, 50, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(290, 50, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(291, 50, 4, 'email', 'Email', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(292, 50, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(293, 50, 2, 'bio', 'Bio', 'Tell us about yourself...', NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(294, 50, 33, 'save_button', 'Save Changes', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(295, 51, 47, 'profile_photo', 'Profile Photo', 'Upload profile photo', '', 0, 0, 1, '{\"width\": \"150px\", \"height\": \"150px\", \"altText\": \"Profile Photo\", \"imageUrl\": \"https://placehold.co/150x150?text=Photo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(296, 51, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(297, 51, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(298, 51, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(299, 51, 5, 'phone', 'Phone Number', '+1 (555) 123-4567', '', 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(300, 51, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(301, 51, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(302, 51, 10, 'gender', 'Gender', 'Select your gender', '', 0, 0, 8, '{\"options\": [{\"label\": \"Male\", \"value\": \"male\"}, {\"label\": \"Female\", \"value\": \"female\"}, {\"label\": \"Non-binary\", \"value\": \"non_binary\"}, {\"label\": \"Prefer not to say\", \"value\": \"prefer_not_to_say\"}]}', NULL, '2025-11-04 20:15:18'),
(303, 51, 33, 'save_button', 'Save Changes', '', '', 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(304, 51, 34, 'change_password_link', 'Change Password', '', '', 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(305, 52, 27, 'notifications_heading', 'Notifications', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(306, 52, 28, 'notifications_description', 'Stay updated with your latest activities', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(307, 52, 28, 'notification_1', 'You have a new message', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(308, 52, 28, 'notification_2', 'Your order has been shipped', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(309, 52, 28, 'notification_3', 'New friend request', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(310, 52, 33, 'mark_read_button', 'Mark All as Read', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(311, 53, 27, 'settings_heading', 'Settings', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(312, 53, 28, 'settings_description', 'Manage your app preferences', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(313, 53, 27, 'account_section', 'Account', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(314, 53, 28, 'edit_profile_link', 'Edit Profile', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(315, 53, 28, 'change_password_link', 'Change Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(316, 53, 27, 'notifications_section', 'Notifications', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(317, 53, 28, 'push_notifications_toggle', 'Push Notifications', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(318, 53, 28, 'email_notifications_toggle', 'Email Notifications', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(319, 53, 27, 'privacy_section', 'Privacy', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(320, 53, 28, 'privacy_policy_link', 'Privacy Policy', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(321, 53, 28, 'terms_link', 'Terms of Service', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(322, 53, 33, 'logout_button', 'Logout', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(323, 54, 27, 'privacy_heading', 'Privacy Policy', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(324, 54, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(325, 54, 27, 'section1_heading', 'Information We Collect', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(326, 54, 28, 'section1_text', 'We collect information you provide directly to us, including name, email, and usage data.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(327, 54, 27, 'section2_heading', 'How We Use Your Information', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(328, 54, 28, 'section2_text', 'We use your information to provide, maintain, and improve our services.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(329, 54, 27, 'section3_heading', 'Data Security', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(330, 54, 28, 'section3_text', 'We implement appropriate security measures to protect your personal information.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(331, 55, 27, 'terms_heading', 'Terms of Service', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(332, 55, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(333, 55, 27, 'section1_heading', 'Acceptance of Terms', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(334, 55, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(335, 55, 27, 'section2_heading', 'User Responsibilities', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(336, 55, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(337, 55, 27, 'section3_heading', 'Termination', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(338, 55, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(360, 59, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(361, 59, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(362, 59, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(363, 59, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(364, 59, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(365, 59, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(376, 61, 27, 'verify_heading', 'Verify Your Email', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(377, 61, 28, 'verify_description', 'We sent a verification code to your email address. Please enter it below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(378, 61, 1, 'verification_code', 'Verification Code', 'Enter 6-digit code', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(379, 61, 33, 'verify_button', 'Verify Email', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(380, 61, 28, 'resend_link', 'Did not receive code? Resend', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(381, 62, 27, 'forgot_heading', 'Forgot Password?', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(382, 62, 28, 'forgot_description', 'Enter your email address and we will send you a link to reset your password.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(383, 62, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(384, 62, 33, 'send_button', 'Send Reset Link', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(385, 62, 28, 'login_link', 'Remember your password? Login', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(386, 63, 27, 'reset_heading', 'Reset Password', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(387, 63, 28, 'reset_description', 'Please enter your new password below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(388, 63, 1, 'new_password', 'New Password', 'Enter new password', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(389, 63, 1, 'confirm_password', 'Confirm Password', 'Re-enter new password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(390, 63, 33, 'reset_button', 'Reset Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(391, 64, 27, 'dashboard_heading', 'Dashboard', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(392, 64, 28, 'dashboard_subtitle', 'Welcome back! Here is your overview', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(393, 64, 27, 'stats_heading', 'Quick Stats', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(394, 64, 28, 'stat_orders', 'Total Orders: 24', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(395, 64, 28, 'stat_projects', 'Active Projects: 5', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(396, 64, 28, 'stat_messages', 'Messages: 12', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(397, 64, 27, 'activity_heading', 'Recent Activity', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(398, 64, 28, 'activity_1', 'New order received', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(399, 64, 28, 'activity_2', 'Profile updated', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(400, 64, 28, 'activity_3', 'Payment processed', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(401, 68, 27, 'profile_heading', 'My Profile', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(402, 68, 28, 'profile_description', 'Update your personal information below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(403, 68, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(404, 68, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(405, 68, 4, 'email', 'Email', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(406, 68, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(407, 68, 2, 'bio', 'Bio', 'Tell us about yourself...', NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(408, 68, 33, 'save_button', 'Save Changes', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(409, 69, 47, 'profile_photo', 'Profile Photo', 'Upload profile photo', '', 0, 0, 1, '{\"width\": \"150px\", \"height\": \"150px\", \"altText\": \"Profile Photo\", \"imageUrl\": \"https://placehold.co/150x150?text=Photo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(410, 69, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(411, 69, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(412, 69, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(413, 69, 5, 'phone', 'Phone Number', '+1 (555) 123-4567', '', 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(414, 69, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(415, 69, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(416, 69, 10, 'gender', 'Gender', 'Select your gender', '', 0, 0, 8, '{\"options\": [{\"label\": \"Male\", \"value\": \"male\"}, {\"label\": \"Female\", \"value\": \"female\"}, {\"label\": \"Non-binary\", \"value\": \"non_binary\"}, {\"label\": \"Prefer not to say\", \"value\": \"prefer_not_to_say\"}]}', NULL, '2025-11-04 20:15:18'),
(417, 69, 33, 'save_button', 'Save Changes', '', '', 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(418, 69, 34, 'change_password_link', 'Change Password', '', '', 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(419, 70, 27, 'notifications_heading', 'Notifications', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(420, 70, 28, 'notifications_description', 'Stay updated with your latest activities', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(421, 70, 28, 'notification_1', 'You have a new message', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(422, 70, 28, 'notification_2', 'Your order has been shipped', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(423, 70, 28, 'notification_3', 'New friend request', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(424, 70, 33, 'mark_read_button', 'Mark All as Read', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(425, 71, 27, 'settings_heading', 'Settings', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(426, 71, 28, 'settings_description', 'Manage your app preferences', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(427, 71, 27, 'account_section', 'Account', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(428, 71, 28, 'edit_profile_link', 'Edit Profile', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(429, 71, 28, 'change_password_link', 'Change Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(430, 71, 27, 'notifications_section', 'Notifications', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(431, 71, 28, 'push_notifications_toggle', 'Push Notifications', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(432, 71, 28, 'email_notifications_toggle', 'Email Notifications', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(433, 71, 27, 'privacy_section', 'Privacy', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(434, 71, 28, 'privacy_policy_link', 'Privacy Policy', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(435, 71, 28, 'terms_link', 'Terms of Service', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(436, 71, 33, 'logout_button', 'Logout', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(437, 72, 27, 'privacy_heading', 'Privacy Policy', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(438, 72, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(439, 72, 27, 'section1_heading', 'Information We Collect', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(440, 72, 28, 'section1_text', 'We collect information you provide directly to us, including name, email, and usage data.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(441, 72, 27, 'section2_heading', 'How We Use Your Information', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(442, 72, 28, 'section2_text', 'We use your information to provide, maintain, and improve our services.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(443, 72, 27, 'section3_heading', 'Data Security', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(444, 72, 28, 'section3_text', 'We implement appropriate security measures to protect your personal information.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(445, 73, 27, 'terms_heading', 'Terms of Service', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(446, 73, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(447, 73, 27, 'section1_heading', 'Acceptance of Terms', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(448, 73, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(449, 73, 27, 'section2_heading', 'User Responsibilities', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(450, 73, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(451, 73, 27, 'section3_heading', 'Termination', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(452, 73, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(474, 77, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(475, 77, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(476, 77, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(477, 77, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(478, 77, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(479, 77, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(490, 79, 27, 'verify_heading', 'Verify Your Email', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(491, 79, 28, 'verify_description', 'We sent a verification code to your email address. Please enter it below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(492, 79, 1, 'verification_code', 'Verification Code', 'Enter 6-digit code', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(493, 79, 33, 'verify_button', 'Verify Email', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(494, 79, 28, 'resend_link', 'Did not receive code? Resend', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(495, 80, 27, 'forgot_heading', 'Forgot Password?', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(496, 80, 28, 'forgot_description', 'Enter your email address and we will send you a link to reset your password.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(497, 80, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(498, 80, 33, 'send_button', 'Send Reset Link', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(499, 80, 28, 'login_link', 'Remember your password? Login', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(500, 81, 27, 'reset_heading', 'Reset Password', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(501, 81, 28, 'reset_description', 'Please enter your new password below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(502, 81, 1, 'new_password', 'New Password', 'Enter new password', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(503, 81, 1, 'confirm_password', 'Confirm Password', 'Re-enter new password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(504, 81, 33, 'reset_button', 'Reset Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(505, 87, 27, 'profile_heading', 'My Profile', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(506, 87, 28, 'profile_description', 'Update your personal information below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(507, 87, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(508, 87, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(509, 87, 4, 'email', 'Email', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(510, 87, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(511, 87, 2, 'bio', 'Bio', 'Tell us about yourself...', NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(512, 87, 33, 'save_button', 'Save Changes', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(513, 88, 47, 'profile_photo', 'Profile Photo', 'Upload profile photo', '', 0, 0, 1, '{\"width\": \"150px\", \"height\": \"150px\", \"altText\": \"Profile Photo\", \"imageUrl\": \"https://placehold.co/150x150?text=Photo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(514, 88, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(515, 88, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(516, 88, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(517, 88, 5, 'phone', 'Phone Number', '+1 (555) 123-4567', '', 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(518, 88, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(519, 88, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(520, 88, 10, 'gender', 'Gender', 'Select your gender', '', 0, 0, 8, '{\"options\": [{\"label\": \"Male\", \"value\": \"male\"}, {\"label\": \"Female\", \"value\": \"female\"}, {\"label\": \"Non-binary\", \"value\": \"non_binary\"}, {\"label\": \"Prefer not to say\", \"value\": \"prefer_not_to_say\"}]}', NULL, '2025-11-04 20:15:18'),
(521, 88, 33, 'save_button', 'Save Changes', '', '', 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(522, 88, 34, 'change_password_link', 'Change Password', '', '', 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(523, 89, 27, 'notifications_heading', 'Notifications', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(524, 89, 28, 'notifications_description', 'Stay updated with your latest activities', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(525, 89, 28, 'notification_1', 'You have a new message', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(526, 89, 28, 'notification_2', 'Your order has been shipped', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(527, 89, 28, 'notification_3', 'New friend request', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(528, 89, 33, 'mark_read_button', 'Mark All as Read', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(529, 90, 27, 'settings_heading', 'Settings', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(530, 90, 28, 'settings_description', 'Manage your app preferences', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(531, 90, 27, 'account_section', 'Account', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(532, 90, 28, 'edit_profile_link', 'Edit Profile', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(533, 90, 28, 'change_password_link', 'Change Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(534, 90, 27, 'notifications_section', 'Notifications', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(535, 90, 28, 'push_notifications_toggle', 'Push Notifications', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(536, 90, 28, 'email_notifications_toggle', 'Email Notifications', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(537, 90, 27, 'privacy_section', 'Privacy', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(538, 90, 28, 'privacy_policy_link', 'Privacy Policy', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(539, 90, 28, 'terms_link', 'Terms of Service', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:15:18'),
(540, 90, 33, 'logout_button', 'Logout', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:15:18'),
(541, 91, 27, 'privacy_heading', 'Privacy Policy', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(542, 91, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(543, 91, 27, 'section1_heading', 'Information We Collect', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(544, 91, 28, 'section1_text', 'We collect information you provide directly to us, including name, email, and usage data.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(545, 91, 27, 'section2_heading', 'How We Use Your Information', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(546, 91, 28, 'section2_text', 'We use your information to provide, maintain, and improve our services.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(547, 91, 27, 'section3_heading', 'Data Security', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(548, 91, 28, 'section3_text', 'We implement appropriate security measures to protect your personal information.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(549, 92, 27, 'terms_heading', 'Terms of Service', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(550, 92, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(551, 92, 27, 'section1_heading', 'Acceptance of Terms', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18');
INSERT INTO `app_template_screen_elements` (`id`, `template_screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`) VALUES
(552, 92, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(553, 92, 27, 'section2_heading', 'User Responsibilities', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(554, 92, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(555, 92, 27, 'section3_heading', 'Termination', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(556, 92, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(1152, 115, 27, 'dashboard_title', 'Dashboard', '', 'My Account', 0, 1, 1, '{}', NULL, '2025-11-06 15:47:20'),
(1153, 115, 28, 'welcome_message', 'Welcome Message', '', 'Welcome back! Here\'s your account overview.', 0, 1, 2, '{}', NULL, '2025-11-06 15:47:20'),
(1154, 115, 27, 'balance_heading', 'Balance Section', '', 'Account Balance', 0, 1, 3, '{\"level\": \"h2\"}', NULL, '2025-11-06 15:47:20'),
(1155, 115, 8, 'current_balance', 'Current Balance', '', '0.00', 0, 1, 4, '{\"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 15:47:20'),
(1156, 115, 8, 'available_balance', 'Available Balance', '', '0.00', 0, 1, 5, '{\"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 15:47:20'),
(1157, 115, 27, 'quick_actions_heading', 'Quick Actions', '', 'Quick Actions', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:47:20'),
(1158, 115, 33, 'transfer_button', 'Transfer Money', '', 'Transfer', 0, 0, 7, '{\"action\": \"navigate\", \"target\": \"/transfer\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:47:20'),
(1159, 115, 33, 'pay_bills_button', 'Pay Bills', '', 'Pay Bills', 0, 0, 8, '{\"action\": \"navigate\", \"target\": \"/bills\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:47:20'),
(1160, 115, 27, 'recent_transactions_heading', 'Recent Activity', '', 'Recent Transactions', 0, 1, 9, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:47:20'),
(1161, 115, 28, 'transactions_list', 'Transactions', '', 'Your recent transactions will appear here.', 0, 1, 10, '{\"type\": \"list\"}', NULL, '2025-11-06 15:47:20'),
(1162, 116, 27, 'transactions_title', 'Page Title', '', 'Transaction History', 0, 1, 1, '{}', NULL, '2025-11-06 15:47:20'),
(1163, 116, 28, 'transactions_description', 'Description', '', 'View all your account transactions', 0, 1, 2, '{}', NULL, '2025-11-06 15:47:20'),
(1164, 116, 17, 'start_date', 'Start Date', 'Select start date', '', 0, 0, 3, '{}', NULL, '2025-11-06 15:47:20'),
(1165, 116, 17, 'end_date', 'End Date', 'Select end date', '', 0, 0, 4, '{}', NULL, '2025-11-06 15:47:20'),
(1166, 116, 10, 'transaction_type', 'Transaction Type', 'All Types', '', 0, 0, 5, '{\"options\": [{\"label\": \"All\", \"value\": \"all\"}, {\"label\": \"Debit\", \"value\": \"debit\"}, {\"label\": \"Credit\", \"value\": \"credit\"}, {\"label\": \"Transfer\", \"value\": \"transfer\"}]}', NULL, '2025-11-06 15:47:20'),
(1167, 116, 33, 'apply_filters', 'Apply Filters', '', 'Apply', 0, 0, 6, '{\"variant\": \"primary\"}', NULL, '2025-11-06 15:47:20'),
(1168, 116, 27, 'transactions_list_heading', 'Transactions', '', 'All Transactions', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:47:20'),
(1169, 116, 28, 'transactions_data', 'Transaction List', '', 'Your transactions will appear here.', 0, 1, 8, '{\"type\": \"list\"}', NULL, '2025-11-06 15:47:20'),
(1170, 117, 27, 'transfer_title', 'Page Title', '', 'Transfer Money', 0, 1, 1, '{}', NULL, '2025-11-06 15:47:20'),
(1171, 117, 28, 'transfer_description', 'Description', '', 'Send money to another account', 0, 1, 2, '{}', NULL, '2025-11-06 15:47:20'),
(1172, 117, 10, 'from_account', 'From Account', 'Select account', '', 1, 0, 3, '{\"options\": [{\"label\": \"Checking Account\", \"value\": \"checking\"}, {\"label\": \"Savings Account\", \"value\": \"savings\"}]}', NULL, '2025-11-06 15:47:20'),
(1173, 117, 1, 'recipient_account', 'Recipient Account Number', 'Enter account number', '', 1, 0, 4, '{}', NULL, '2025-11-06 15:47:20'),
(1174, 117, 1, 'recipient_name', 'Recipient Name', 'Enter recipient name', '', 1, 0, 5, '{}', NULL, '2025-11-06 15:47:20'),
(1175, 117, 8, 'transfer_amount', 'Amount', 'Enter amount', '', 1, 0, 6, '{\"min\": 0.01, \"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 15:47:20'),
(1176, 117, 1, 'transfer_note', 'Note (Optional)', 'Add a note', '', 0, 0, 7, '{}', NULL, '2025-11-06 15:47:20'),
(1177, 117, 27, 'summary_heading', 'Transfer Summary', '', 'Summary', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:47:20'),
(1178, 117, 28, 'transfer_fee', 'Transfer Fee', '', 'Fee: $0.00', 0, 1, 9, '{}', NULL, '2025-11-06 15:47:20'),
(1179, 117, 28, 'total_amount', 'Total Amount', '', 'Total: $0.00', 0, 1, 10, '{}', NULL, '2025-11-06 15:47:20'),
(1180, 117, 33, 'transfer_submit', 'Transfer Button', '', 'Transfer Now', 0, 0, 11, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:47:20'),
(1181, 117, 33, 'transfer_cancel', 'Cancel Button', '', 'Cancel', 0, 0, 12, '{\"action\": \"cancel\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:47:20'),
(1182, 118, 27, 'bills_title', 'Page Title', '', 'Pay Bills', 0, 1, 1, '{}', NULL, '2025-11-06 15:47:20'),
(1183, 118, 28, 'bills_description', 'Description', '', 'Pay your bills quickly and securely', 0, 1, 2, '{}', NULL, '2025-11-06 15:47:20'),
(1184, 118, 10, 'bill_category', 'Bill Category', 'Select category', '', 1, 0, 3, '{\"options\": [{\"label\": \"Utilities\", \"value\": \"utilities\"}, {\"label\": \"Credit Card\", \"value\": \"credit_card\"}, {\"label\": \"Insurance\", \"value\": \"insurance\"}, {\"label\": \"Phone/Internet\", \"value\": \"telecom\"}, {\"label\": \"Other\", \"value\": \"other\"}]}', NULL, '2025-11-06 15:47:20'),
(1185, 118, 1, 'biller_name', 'Biller Name', 'Enter biller name', '', 1, 0, 4, '{}', NULL, '2025-11-06 15:47:20'),
(1186, 118, 1, 'account_number', 'Account/Reference Number', 'Enter account number', '', 1, 0, 5, '{}', NULL, '2025-11-06 15:47:20'),
(1187, 118, 8, 'bill_amount', 'Amount', 'Enter amount', '', 1, 0, 6, '{\"min\": 0.01, \"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 15:47:20'),
(1188, 118, 17, 'payment_date', 'Payment Date', 'Select date', '', 0, 0, 7, '{}', NULL, '2025-11-06 15:47:20'),
(1189, 118, 10, 'payment_account', 'Pay From', 'Select account', '', 1, 0, 8, '{\"options\": [{\"label\": \"Checking Account\", \"value\": \"checking\"}, {\"label\": \"Savings Account\", \"value\": \"savings\"}]}', NULL, '2025-11-06 15:47:20'),
(1190, 118, 33, 'pay_bill_button', 'Pay Bill', '', 'Pay Now', 0, 0, 9, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:47:20'),
(1191, 118, 33, 'save_biller_button', 'Save Biller', '', 'Save for Later', 0, 0, 10, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:47:20'),
(1192, 119, 27, 'cards_title', 'Page Title', '', 'My Cards', 0, 1, 1, '{}', NULL, '2025-11-06 15:47:20'),
(1193, 119, 28, 'cards_description', 'Description', '', 'Manage your debit and credit cards', 0, 1, 2, '{}', NULL, '2025-11-06 15:47:20'),
(1194, 119, 27, 'active_cards_heading', 'Active Cards', '', 'Your Cards', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:47:20'),
(1195, 119, 28, 'cards_list', 'Cards List', '', 'Your cards will appear here.', 0, 1, 4, '{\"type\": \"list\"}', NULL, '2025-11-06 15:47:20'),
(1196, 119, 33, 'add_card_button', 'Add Card', '', 'Add New Card', 0, 0, 5, '{\"action\": \"navigate\", \"target\": \"/add-card\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:47:20'),
(1197, 119, 33, 'request_card_button', 'Request Card', '', 'Request Physical Card', 0, 0, 6, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:47:20'),
(1198, 119, 27, 'card_settings_heading', 'Card Settings', '', 'Settings', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:47:20'),
(1199, 119, 28, 'daily_limit', 'Daily Limit', '', 'Daily spending limit: $1,000', 0, 1, 8, '{}', NULL, '2025-11-06 15:47:20'),
(1200, 119, 28, 'international_usage', 'International Transactions', '', 'Enabled', 0, 1, 9, '{}', NULL, '2025-11-06 15:47:20'),
(1201, 119, 33, 'manage_limits_button', 'Manage Limits', '', 'Manage Limits', 0, 0, 10, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:47:20'),
(1202, 120, 27, 'statements_title', 'Page Title', '', 'Account Statements', 0, 1, 1, '{}', NULL, '2025-11-06 15:47:20'),
(1203, 120, 28, 'statements_description', 'Description', '', 'View and download your account statements', 0, 1, 2, '{}', NULL, '2025-11-06 15:47:20'),
(1204, 120, 10, 'statement_account', 'Account', 'Select account', '', 0, 0, 3, '{\"options\": [{\"label\": \"All Accounts\", \"value\": \"all\"}, {\"label\": \"Checking Account\", \"value\": \"checking\"}, {\"label\": \"Savings Account\", \"value\": \"savings\"}]}', NULL, '2025-11-06 15:47:20'),
(1205, 120, 10, 'statement_year', 'Year', 'Select year', '', 0, 0, 4, '{\"options\": [{\"label\": \"2025\", \"value\": \"2025\"}, {\"label\": \"2024\", \"value\": \"2024\"}, {\"label\": \"2023\", \"value\": \"2023\"}]}', NULL, '2025-11-06 15:47:20'),
(1206, 120, 27, 'statements_list_heading', 'Available Statements', '', 'Statements', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:47:20'),
(1207, 120, 28, 'statements_data', 'Statements List', '', 'Your statements will appear here.', 0, 1, 6, '{\"type\": \"list\"}', NULL, '2025-11-06 15:47:20'),
(1208, 120, 33, 'download_all_button', 'Download All', '', 'Download All', 0, 0, 7, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:47:20'),
(1209, 120, 33, 'email_statement_button', 'Email Statement', '', 'Email Statement', 0, 0, 8, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:47:20'),
(1210, 121, 27, 'listings_title', 'Page Title', '', 'Find Your Perfect Stay', 0, 1, 1, '{}', NULL, '2025-11-06 15:49:34'),
(1211, 121, 28, 'listings_subtitle', 'Subtitle', '', 'Discover unique places to stay around the world', 0, 1, 2, '{}', NULL, '2025-11-06 15:49:34'),
(1212, 121, 1, 'search_location', 'Location', 'Where are you going?', '', 0, 0, 3, '{}', NULL, '2025-11-06 15:49:34'),
(1213, 121, 17, 'check_in_date', 'Check-in Date', 'Select date', '', 0, 0, 4, '{}', NULL, '2025-11-06 15:49:34'),
(1214, 121, 17, 'check_out_date', 'Check-out Date', 'Select date', '', 0, 0, 5, '{}', NULL, '2025-11-06 15:49:34'),
(1215, 121, 8, 'guests_count', 'Number of Guests', 'How many guests?', '1', 0, 0, 6, '{\"max\": 20, \"min\": 1}', NULL, '2025-11-06 15:49:34'),
(1216, 121, 10, 'property_type', 'Property Type', 'Any type', '', 0, 0, 7, '{\"options\": [{\"label\": \"Any\", \"value\": \"any\"}, {\"label\": \"Entire Place\", \"value\": \"entire\"}, {\"label\": \"Private Room\", \"value\": \"private\"}, {\"label\": \"Shared Room\", \"value\": \"shared\"}]}', NULL, '2025-11-06 15:49:34'),
(1217, 121, 8, 'min_price', 'Min Price', 'Min $', '', 0, 0, 8, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 15:49:34'),
(1218, 121, 8, 'max_price', 'Max Price', 'Max $', '', 0, 0, 9, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 15:49:34'),
(1219, 121, 33, 'search_button', 'Search', '', 'Search Properties', 0, 0, 10, '{\"action\": \"search\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:49:34'),
(1220, 121, 27, 'results_heading', 'Search Results', '', 'Available Properties', 0, 1, 11, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1221, 121, 28, 'properties_list', 'Properties', '', 'Properties will appear here based on your search.', 0, 1, 12, '{\"type\": \"list\"}', NULL, '2025-11-06 15:49:34'),
(1222, 122, 27, 'property_name', 'Property Name', '', 'Luxury Beachfront Villa', 0, 1, 1, '{}', NULL, '2025-11-06 15:49:34'),
(1223, 122, 28, 'property_location', 'Location', '', 'Malibu, California', 0, 1, 2, '{}', NULL, '2025-11-06 15:49:34'),
(1224, 122, 28, 'property_rating', 'Rating', '', '4.9 â˜… (127 reviews)', 0, 1, 3, '{}', NULL, '2025-11-06 15:49:34'),
(1225, 122, 27, 'photos_heading', 'Photos', '', 'Property Photos', 0, 1, 4, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1226, 122, 28, 'photo_gallery', 'Photo Gallery', '', 'Property images will be displayed here.', 0, 1, 5, '{\"type\": \"gallery\"}', NULL, '2025-11-06 15:49:34'),
(1227, 122, 27, 'description_heading', 'About', '', 'About This Property', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1228, 122, 28, 'property_description', 'Description', '', 'Beautiful beachfront villa with stunning ocean views, private pool, and modern amenities. Perfect for families or groups looking for a luxurious getaway.', 0, 1, 7, '{}', NULL, '2025-11-06 15:49:34'),
(1229, 122, 27, 'details_heading', 'Property Details', '', 'Details', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1230, 122, 28, 'bedrooms', 'Bedrooms', '', '4 Bedrooms', 0, 1, 9, '{}', NULL, '2025-11-06 15:49:34'),
(1231, 122, 28, 'bathrooms', 'Bathrooms', '', '3 Bathrooms', 0, 1, 10, '{}', NULL, '2025-11-06 15:49:34'),
(1232, 122, 28, 'max_guests', 'Max Guests', '', 'Up to 8 guests', 0, 1, 11, '{}', NULL, '2025-11-06 15:49:34'),
(1233, 122, 27, 'amenities_heading', 'Amenities', '', 'What This Place Offers', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1234, 122, 28, 'amenities_list', 'Amenities', '', 'WiFi, Pool, Kitchen, Parking, Air Conditioning, Beach Access', 0, 1, 13, '{\"type\": \"list\"}', NULL, '2025-11-06 15:49:34'),
(1235, 122, 27, 'pricing_heading', 'Pricing', '', 'Price', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1236, 122, 8, 'price_per_night', 'Price Per Night', '', '450', 0, 1, 15, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 15:49:34'),
(1237, 122, 28, 'cleaning_fee', 'Cleaning Fee', '', 'Cleaning fee: $75', 0, 1, 16, '{}', NULL, '2025-11-06 15:49:34'),
(1238, 122, 33, 'book_button', 'Book Now', '', 'Reserve This Property', 0, 0, 17, '{\"action\": \"navigate\", \"target\": \"/booking\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:49:34'),
(1239, 122, 33, 'contact_host_button', 'Contact Host', '', 'Message Host', 0, 0, 18, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:49:34'),
(1240, 123, 27, 'booking_title', 'Page Title', '', 'Complete Your Booking', 0, 1, 1, '{}', NULL, '2025-11-06 15:49:34'),
(1241, 123, 28, 'booking_subtitle', 'Subtitle', '', 'You\'re just a few steps away from your perfect stay', 0, 1, 2, '{}', NULL, '2025-11-06 15:49:34'),
(1242, 123, 27, 'trip_details_heading', 'Trip Details', '', 'Your Trip', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1243, 123, 17, 'booking_check_in', 'Check-in', 'Select date', '', 1, 0, 4, '{}', NULL, '2025-11-06 15:49:34'),
(1244, 123, 17, 'booking_check_out', 'Check-out', 'Select date', '', 1, 0, 5, '{}', NULL, '2025-11-06 15:49:34'),
(1245, 123, 8, 'booking_guests', 'Number of Guests', 'How many guests?', '1', 1, 0, 6, '{\"max\": 20, \"min\": 1}', NULL, '2025-11-06 15:49:34'),
(1246, 123, 27, 'guest_info_heading', 'Guest Information', '', 'Your Information', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1247, 123, 1, 'guest_first_name', 'First Name', 'Enter first name', '', 1, 0, 8, '{}', NULL, '2025-11-06 15:49:34'),
(1248, 123, 1, 'guest_last_name', 'Last Name', 'Enter last name', '', 1, 0, 9, '{}', NULL, '2025-11-06 15:49:34'),
(1249, 123, 5, 'guest_email', 'Email', 'Enter email', '', 1, 0, 10, '{}', NULL, '2025-11-06 15:49:34'),
(1250, 123, 6, 'guest_phone', 'Phone Number', 'Enter phone', '', 1, 0, 11, '{}', NULL, '2025-11-06 15:49:34'),
(1251, 123, 27, 'requests_heading', 'Special Requests', '', 'Special Requests (Optional)', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1252, 123, 2, 'special_requests', 'Requests', 'Any special requests?', '', 0, 0, 13, '{}', NULL, '2025-11-06 15:49:34'),
(1253, 123, 27, 'price_summary_heading', 'Price Summary', '', 'Price Breakdown', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1254, 123, 28, 'nights_total', 'Nights Total', '', '$450 x 3 nights = $1,350', 0, 1, 15, '{}', NULL, '2025-11-06 15:49:34'),
(1255, 123, 28, 'service_fee', 'Service Fee', '', 'Service fee: $135', 0, 1, 16, '{}', NULL, '2025-11-06 15:49:34'),
(1256, 123, 28, 'total_price', 'Total Price', '', 'Total: $1,560', 0, 1, 17, '{}', NULL, '2025-11-06 15:49:34'),
(1257, 123, 33, 'confirm_booking_button', 'Confirm Booking', '', 'Confirm and Pay', 0, 0, 18, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:49:34'),
(1258, 123, 33, 'cancel_booking_button', 'Cancel', '', 'Cancel', 0, 0, 19, '{\"action\": \"cancel\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:49:34'),
(1259, 124, 27, 'host_name', 'Host Name', '', 'Sarah Johnson', 0, 1, 1, '{}', NULL, '2025-11-06 15:49:34'),
(1260, 124, 28, 'host_title', 'Title', '', 'Superhost', 0, 1, 2, '{}', NULL, '2025-11-06 15:49:34'),
(1261, 124, 28, 'host_location', 'Location', '', 'Los Angeles, CA', 0, 1, 3, '{}', NULL, '2025-11-06 15:49:34'),
(1262, 124, 28, 'member_since', 'Member Since', '', 'Member since 2018', 0, 1, 4, '{}', NULL, '2025-11-06 15:49:34'),
(1263, 124, 27, 'stats_heading', 'Host Stats', '', 'About This Host', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1264, 124, 28, 'total_reviews', 'Reviews', '', '247 Reviews', 0, 1, 6, '{}', NULL, '2025-11-06 15:49:34'),
(1265, 124, 28, 'rating_score', 'Rating', '', '4.9 â˜… Rating', 0, 1, 7, '{}', NULL, '2025-11-06 15:49:34'),
(1266, 124, 28, 'response_rate', 'Response Rate', '', '100% Response rate', 0, 1, 8, '{}', NULL, '2025-11-06 15:49:34'),
(1267, 124, 28, 'response_time', 'Response Time', '', 'Responds within an hour', 0, 1, 9, '{}', NULL, '2025-11-06 15:49:34'),
(1268, 124, 27, 'about_heading', 'About', '', 'About Sarah', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1269, 124, 28, 'host_bio', 'Bio', '', 'I love hosting guests and sharing the beauty of California\'s coastline. I\'m passionate about providing exceptional experiences and ensuring every stay is memorable.', 0, 1, 11, '{}', NULL, '2025-11-06 15:49:34'),
(1270, 124, 27, 'properties_heading', 'Other Properties', '', 'Sarah\'s Other Listings', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1271, 124, 28, 'other_properties', 'Properties', '', 'Other properties by this host will appear here.', 0, 1, 13, '{\"type\": \"list\"}', NULL, '2025-11-06 15:49:34'),
(1272, 124, 33, 'contact_button', 'Contact Host', '', 'Send Message', 0, 0, 14, '{\"variant\": \"primary\"}', NULL, '2025-11-06 15:49:34'),
(1273, 124, 33, 'report_button', 'Report', '', 'Report Host', 0, 0, 15, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:49:34'),
(1274, 125, 27, 'reviews_title', 'Page Title', '', 'Guest Reviews', 0, 1, 1, '{}', NULL, '2025-11-06 15:49:34'),
(1275, 125, 28, 'overall_rating', 'Overall Rating', '', '4.9 â˜… (127 reviews)', 0, 1, 2, '{}', NULL, '2025-11-06 15:49:34'),
(1276, 125, 27, 'breakdown_heading', 'Rating Breakdown', '', 'Rating Categories', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1277, 125, 28, 'cleanliness_rating', 'Cleanliness', '', 'Cleanliness: 4.9 â˜…', 0, 1, 4, '{}', NULL, '2025-11-06 15:49:34'),
(1278, 125, 28, 'accuracy_rating', 'Accuracy', '', 'Accuracy: 4.8 â˜…', 0, 1, 5, '{}', NULL, '2025-11-06 15:49:34'),
(1279, 125, 28, 'communication_rating', 'Communication', '', 'Communication: 5.0 â˜…', 0, 1, 6, '{}', NULL, '2025-11-06 15:49:34'),
(1280, 125, 28, 'location_rating', 'Location', '', 'Location: 4.9 â˜…', 0, 1, 7, '{}', NULL, '2025-11-06 15:49:34'),
(1281, 125, 28, 'checkin_rating', 'Check-in', '', 'Check-in: 5.0 â˜…', 0, 1, 8, '{}', NULL, '2025-11-06 15:49:34'),
(1282, 125, 28, 'value_rating', 'Value', '', 'Value: 4.7 â˜…', 0, 1, 9, '{}', NULL, '2025-11-06 15:49:34'),
(1283, 125, 27, 'reviews_list_heading', 'Guest Reviews', '', 'What Guests Are Saying', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1284, 125, 28, 'reviews_list', 'Reviews', '', 'Guest reviews will appear here.', 0, 1, 11, '{\"type\": \"list\"}', NULL, '2025-11-06 15:49:34'),
(1285, 125, 27, 'write_review_heading', 'Write a Review', '', 'Share Your Experience', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1286, 125, 8, 'review_rating', 'Your Rating', 'Rate 1-5 stars', '', 0, 0, 13, '{\"max\": 5, \"min\": 1}', NULL, '2025-11-06 15:49:34'),
(1287, 125, 2, 'review_comment', 'Your Review', 'Share your experience...', '', 0, 0, 14, '{}', NULL, '2025-11-06 15:49:34'),
(1288, 125, 33, 'submit_review_button', 'Submit Review', '', 'Submit Review', 0, 0, 15, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:49:34'),
(1289, 126, 27, 'search_title', 'Page Title', '', 'Find Your Perfect Stay', 0, 1, 1, '{}', NULL, '2025-11-06 15:49:34'),
(1290, 126, 28, 'search_subtitle', 'Subtitle', '', 'Use filters to narrow down your search', 0, 1, 2, '{}', NULL, '2025-11-06 15:49:34'),
(1291, 126, 27, 'location_heading', 'Location', '', 'Where', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1292, 126, 1, 'destination', 'Destination', 'City, region, or country', '', 0, 0, 4, '{}', NULL, '2025-11-06 15:49:34'),
(1293, 126, 27, 'dates_heading', 'Dates', '', 'When', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1294, 126, 17, 'filter_check_in', 'Check-in', 'Select date', '', 0, 0, 6, '{}', NULL, '2025-11-06 15:49:34'),
(1295, 126, 17, 'filter_check_out', 'Check-out', 'Select date', '', 0, 0, 7, '{}', NULL, '2025-11-06 15:49:34'),
(1296, 126, 27, 'guests_heading', 'Guests', '', 'Who', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1297, 126, 8, 'adults_count', 'Adults', 'Number of adults', '1', 0, 0, 9, '{\"max\": 16, \"min\": 1}', NULL, '2025-11-06 15:49:34'),
(1298, 126, 8, 'children_count', 'Children', 'Number of children', '0', 0, 0, 10, '{\"max\": 10, \"min\": 0}', NULL, '2025-11-06 15:49:34'),
(1299, 126, 8, 'infants_count', 'Infants', 'Number of infants', '0', 0, 0, 11, '{\"max\": 5, \"min\": 0}', NULL, '2025-11-06 15:49:34'),
(1300, 126, 27, 'type_heading', 'Property Type', '', 'Type of Place', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1301, 126, 10, 'place_type', 'Type', 'Select type', '', 0, 0, 13, '{\"options\": [{\"label\": \"Entire Place\", \"value\": \"entire\"}, {\"label\": \"Private Room\", \"value\": \"private\"}, {\"label\": \"Shared Room\", \"value\": \"shared\"}, {\"label\": \"Hotel\", \"value\": \"hotel\"}]}', NULL, '2025-11-06 15:49:34'),
(1302, 126, 27, 'price_heading', 'Price Range', '', 'Price Per Night', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1303, 126, 8, 'filter_min_price', 'Minimum', 'Min $', '0', 0, 0, 15, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 15:49:34'),
(1304, 126, 8, 'filter_max_price', 'Maximum', 'Max $', '1000', 0, 0, 16, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 15:49:34'),
(1305, 126, 27, 'rooms_heading', 'Rooms & Beds', '', 'Rooms', 0, 1, 17, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1306, 126, 8, 'bedrooms_count', 'Bedrooms', 'Any', '0', 0, 0, 18, '{\"max\": 10, \"min\": 0}', NULL, '2025-11-06 15:49:34'),
(1307, 126, 8, 'beds_count', 'Beds', 'Any', '0', 0, 0, 19, '{\"max\": 20, \"min\": 0}', NULL, '2025-11-06 15:49:34'),
(1308, 126, 8, 'bathrooms_count', 'Bathrooms', 'Any', '0', 0, 0, 20, '{\"max\": 10, \"min\": 0}', NULL, '2025-11-06 15:49:34'),
(1309, 126, 27, 'amenities_filter_heading', 'Amenities', '', 'Popular Amenities', 0, 1, 21, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:49:34'),
(1310, 126, 11, 'wifi_filter', 'WiFi', '', '0', 0, 0, 22, '{}', NULL, '2025-11-06 15:49:34'),
(1311, 126, 11, 'kitchen_filter', 'Kitchen', '', '0', 0, 0, 23, '{}', NULL, '2025-11-06 15:49:34'),
(1312, 126, 11, 'parking_filter', 'Free Parking', '', '0', 0, 0, 24, '{}', NULL, '2025-11-06 15:49:34'),
(1313, 126, 11, 'pool_filter', 'Pool', '', '0', 0, 0, 25, '{}', NULL, '2025-11-06 15:49:34'),
(1314, 126, 11, 'ac_filter', 'Air Conditioning', '', '0', 0, 0, 26, '{}', NULL, '2025-11-06 15:49:34'),
(1315, 126, 33, 'apply_filters_button', 'Apply Filters', '', 'Show Results', 0, 0, 27, '{\"action\": \"search\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:49:34'),
(1316, 126, 33, 'clear_filters_button', 'Clear All', '', 'Clear Filters', 0, 0, 28, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:49:34'),
(1317, 127, 27, 'feed_title', 'Page Title', '', 'Home', 0, 1, 1, '{}', NULL, '2025-11-06 15:54:53'),
(1318, 127, 1, 'search_videos', 'Search', 'Search videos...', '', 0, 0, 2, '{}', NULL, '2025-11-06 15:54:53'),
(1319, 127, 27, 'filters_heading', 'Filters', '', 'Browse', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1320, 127, 10, 'video_category', 'Category', 'All', '', 0, 0, 4, '{\"options\": [{\"label\": \"All\", \"value\": \"all\"}, {\"label\": \"Trending\", \"value\": \"trending\"}, {\"label\": \"Music\", \"value\": \"music\"}, {\"label\": \"Gaming\", \"value\": \"gaming\"}, {\"label\": \"News\", \"value\": \"news\"}, {\"label\": \"Sports\", \"value\": \"sports\"}, {\"label\": \"Education\", \"value\": \"education\"}, {\"label\": \"Entertainment\", \"value\": \"entertainment\"}]}', NULL, '2025-11-06 15:54:53'),
(1321, 127, 27, 'videos_heading', 'Videos', '', 'Recommended Videos', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1322, 127, 28, 'videos_grid', 'Video Grid', '', 'Videos will appear here in a grid layout.', 0, 1, 6, '{\"type\": \"grid\"}', NULL, '2025-11-06 15:54:53'),
(1323, 127, 33, 'upload_video_button', 'Upload Video', '', 'Upload', 0, 0, 7, '{\"action\": \"navigate\", \"target\": \"/upload\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:54:53'),
(1324, 127, 33, 'subscriptions_button', 'Subscriptions', '', 'Subscriptions', 0, 0, 8, '{\"action\": \"navigate\", \"target\": \"/subscriptions\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1325, 128, 27, 'video_title', 'Video Title', '', 'Amazing Video Title Here', 0, 1, 1, '{}', NULL, '2025-11-06 15:54:53'),
(1326, 128, 28, 'video_player_area', 'Video Player', '', 'Video player will be embedded here.', 0, 1, 2, '{\"type\": \"video\"}', NULL, '2025-11-06 15:54:53'),
(1327, 128, 28, 'video_views', 'Views', '', '1.2M views', 0, 1, 3, '{}', NULL, '2025-11-06 15:54:53'),
(1328, 128, 28, 'video_date', 'Upload Date', '', 'Published 2 days ago', 0, 1, 4, '{}', NULL, '2025-11-06 15:54:53'),
(1329, 128, 27, 'engagement_heading', 'Engagement', '', 'Actions', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1330, 128, 33, 'like_button', 'Like', '', 'ðŸ‘ 125K', 0, 0, 6, '{\"action\": \"like\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1331, 128, 33, 'dislike_button', 'Dislike', '', 'ðŸ‘Ž Dislike', 0, 0, 7, '{\"action\": \"dislike\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1332, 128, 33, 'share_button', 'Share', '', 'ðŸ”— Share', 0, 0, 8, '{\"action\": \"share\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1333, 128, 33, 'save_button', 'Save', '', 'ðŸ’¾ Save', 0, 0, 9, '{\"action\": \"save\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1334, 128, 27, 'channel_heading', 'Channel', '', 'Channel Info', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1335, 128, 28, 'channel_name', 'Channel Name', '', 'Tech Reviews Channel', 0, 1, 11, '{}', NULL, '2025-11-06 15:54:53'),
(1336, 128, 28, 'channel_subscribers', 'Subscribers', '', '2.5M subscribers', 0, 1, 12, '{}', NULL, '2025-11-06 15:54:53'),
(1337, 128, 33, 'subscribe_button', 'Subscribe', '', 'Subscribe', 0, 0, 13, '{\"action\": \"subscribe\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:54:53'),
(1338, 128, 27, 'description_heading', 'Description', '', 'About', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1339, 128, 28, 'video_description', 'Description', '', 'This is the video description with details about the content, links, and timestamps.', 0, 1, 15, '{}', NULL, '2025-11-06 15:54:53'),
(1340, 128, 27, 'comments_heading', 'Comments', '', 'Comments', 0, 1, 16, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1341, 128, 28, 'comments_count', 'Comment Count', '', '1,234 Comments', 0, 1, 17, '{}', NULL, '2025-11-06 15:54:53'),
(1342, 128, 33, 'view_comments_button', 'View Comments', '', 'View All Comments', 0, 0, 18, '{\"action\": \"navigate\", \"target\": \"/comments\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1343, 128, 27, 'related_heading', 'Related Videos', '', 'Up Next', 0, 1, 19, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1344, 128, 28, 'related_videos', 'Related Videos', '', 'Related videos will appear here.', 0, 1, 20, '{\"type\": \"list\"}', NULL, '2025-11-06 15:54:53'),
(1345, 129, 27, 'channel_title', 'Channel Name', '', 'Tech Reviews Channel', 0, 1, 1, '{}', NULL, '2025-11-06 15:54:53'),
(1346, 129, 28, 'channel_handle', 'Channel Handle', '', '@techreviews', 0, 1, 2, '{}', NULL, '2025-11-06 15:54:53'),
(1347, 129, 28, 'subscriber_count', 'Subscribers', '', '2.5M subscribers', 0, 1, 3, '{}', NULL, '2025-11-06 15:54:53'),
(1348, 129, 28, 'video_count', 'Videos', '', '456 videos', 0, 1, 4, '{}', NULL, '2025-11-06 15:54:53'),
(1349, 129, 33, 'channel_subscribe_button', 'Subscribe', '', 'Subscribe', 0, 0, 5, '{\"action\": \"subscribe\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:54:53'),
(1350, 129, 27, 'tabs_heading', 'Navigation', '', 'Channel Sections', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1351, 129, 10, 'channel_tab', 'Tab', 'Select tab', 'videos', 0, 0, 7, '{\"options\": [{\"label\": \"Videos\", \"value\": \"videos\"}, {\"label\": \"Playlists\", \"value\": \"playlists\"}, {\"label\": \"Community\", \"value\": \"community\"}, {\"label\": \"About\", \"value\": \"about\"}]}', NULL, '2025-11-06 15:54:53'),
(1352, 129, 27, 'channel_videos_heading', 'Videos', '', 'Channel Videos', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1353, 129, 10, 'videos_sort', 'Sort By', 'Sort', 'latest', 0, 0, 9, '{\"options\": [{\"label\": \"Latest\", \"value\": \"latest\"}, {\"label\": \"Popular\", \"value\": \"popular\"}, {\"label\": \"Oldest\", \"value\": \"oldest\"}]}', NULL, '2025-11-06 15:54:53'),
(1354, 129, 28, 'channel_videos_grid', 'Videos', '', 'Channel videos will appear here.', 0, 1, 10, '{\"type\": \"grid\"}', NULL, '2025-11-06 15:54:53'),
(1355, 129, 27, 'about_heading', 'About', '', 'About This Channel', 0, 1, 11, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1356, 129, 28, 'channel_description', 'Description', '', 'Welcome to our channel! We create amazing tech reviews and tutorials.', 0, 1, 12, '{}', NULL, '2025-11-06 15:54:53'),
(1357, 129, 28, 'channel_stats', 'Stats', '', 'Joined: Jan 2020 â€¢ Total views: 150M', 0, 1, 13, '{}', NULL, '2025-11-06 15:54:53'),
(1358, 129, 28, 'channel_links', 'Links', '', 'Website, Social Media Links', 0, 1, 14, '{}', NULL, '2025-11-06 15:54:53'),
(1359, 130, 27, 'comments_title', 'Page Title', '', 'Comments', 0, 1, 1, '{}', NULL, '2025-11-06 15:54:53'),
(1360, 130, 28, 'total_comments', 'Comment Count', '', '1,234 Comments', 0, 1, 2, '{}', NULL, '2025-11-06 15:54:53'),
(1361, 130, 10, 'comments_sort', 'Sort By', 'Sort comments', 'top', 0, 0, 3, '{\"options\": [{\"label\": \"Top Comments\", \"value\": \"top\"}, {\"label\": \"Newest First\", \"value\": \"newest\"}, {\"label\": \"Oldest First\", \"value\": \"oldest\"}]}', NULL, '2025-11-06 15:54:53'),
(1362, 130, 27, 'add_comment_heading', 'Add Comment', '', 'Add a Comment', 0, 1, 4, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1363, 130, 2, 'new_comment', 'Your Comment', 'Add a public comment...', '', 0, 0, 5, '{}', NULL, '2025-11-06 15:54:53'),
(1364, 130, 33, 'post_comment_button', 'Post Comment', '', 'Comment', 0, 0, 6, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:54:53'),
(1365, 130, 33, 'cancel_comment_button', 'Cancel', '', 'Cancel', 0, 0, 7, '{\"action\": \"cancel\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1366, 130, 27, 'comments_list_heading', 'All Comments', '', 'Comments', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1367, 130, 28, 'comments_list', 'Comments', '', 'Comments will appear here with user info, timestamp, likes, and replies.', 0, 1, 9, '{\"type\": \"list\"}', NULL, '2025-11-06 15:54:53'),
(1368, 130, 27, 'comment_actions_heading', 'Actions', '', 'Comment Actions', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1369, 130, 33, 'like_comment_button', 'Like Comment', '', 'ðŸ‘ Like', 0, 0, 11, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1370, 130, 33, 'reply_button', 'Reply', '', 'ðŸ’¬ Reply', 0, 0, 12, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1371, 130, 33, 'report_comment_button', 'Report', '', 'âš ï¸ Report', 0, 0, 13, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1372, 131, 27, 'subscriptions_title', 'Page Title', '', 'Subscriptions', 0, 1, 1, '{}', NULL, '2025-11-06 15:54:53'),
(1373, 131, 28, 'subscriptions_subtitle', 'Subtitle', '', 'Latest from your subscriptions', 0, 1, 2, '{}', NULL, '2025-11-06 15:54:53'),
(1374, 131, 10, 'subscription_filter', 'Filter', 'All channels', 'all', 0, 0, 3, '{\"options\": [{\"label\": \"All\", \"value\": \"all\"}, {\"label\": \"Today\", \"value\": \"today\"}, {\"label\": \"This Week\", \"value\": \"week\"}, {\"label\": \"This Month\", \"value\": \"month\"}]}', NULL, '2025-11-06 15:54:53'),
(1375, 131, 27, 'channels_heading', 'Channels', '', 'Your Channels', 0, 1, 4, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1376, 131, 28, 'subscribed_channels', 'Channels List', '', 'Your subscribed channels will appear here.', 0, 1, 5, '{\"type\": \"horizontal-list\"}', NULL, '2025-11-06 15:54:53'),
(1377, 131, 27, 'latest_videos_heading', 'Latest Videos', '', 'New Videos', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1378, 131, 28, 'subscription_videos', 'Videos', '', 'Latest videos from your subscriptions will appear here.', 0, 1, 7, '{\"type\": \"list\"}', NULL, '2025-11-06 15:54:53'),
(1379, 131, 27, 'manage_heading', 'Manage', '', 'Manage Subscriptions', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1380, 131, 33, 'manage_subscriptions_button', 'Manage', '', 'Manage All Subscriptions', 0, 0, 9, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1381, 131, 33, 'notification_settings_button', 'Notifications', '', 'Notification Settings', 0, 0, 10, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1382, 132, 27, 'upload_title', 'Page Title', '', 'Upload Video', 0, 1, 1, '{}', NULL, '2025-11-06 15:54:53'),
(1383, 132, 28, 'upload_subtitle', 'Subtitle', '', 'Share your content with the world', 0, 1, 2, '{}', NULL, '2025-11-06 15:54:53'),
(1384, 132, 27, 'video_file_heading', 'Video File', '', 'Select Video', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1385, 132, 28, 'video_upload_area', 'Upload Area', '', 'Drag and drop video file or click to browse', 0, 1, 4, '{\"type\": \"file-upload\"}', NULL, '2025-11-06 15:54:53'),
(1386, 132, 28, 'upload_progress', 'Upload Progress', '', 'Upload progress: 0%', 0, 1, 5, '{}', NULL, '2025-11-06 15:54:53'),
(1387, 132, 27, 'details_heading', 'Video Details', '', 'Details', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1388, 132, 1, 'upload_video_title', 'Title', 'Enter video title', '', 1, 0, 7, '{}', NULL, '2025-11-06 15:54:53'),
(1389, 132, 2, 'upload_description', 'Description', 'Tell viewers about your video', '', 1, 0, 8, '{}', NULL, '2025-11-06 15:54:53'),
(1390, 132, 27, 'thumbnail_heading', 'Thumbnail', '', 'Video Thumbnail', 0, 1, 9, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1391, 132, 28, 'thumbnail_upload', 'Thumbnail', '', 'Upload custom thumbnail or select from auto-generated options', 0, 1, 10, '{\"type\": \"image-upload\"}', NULL, '2025-11-06 15:54:53'),
(1392, 132, 27, 'category_heading', 'Category & Tags', '', 'Categorization', 0, 1, 11, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1393, 132, 10, 'upload_category', 'Category', 'Select category', '', 1, 0, 12, '{\"options\": [{\"label\": \"Music\", \"value\": \"music\"}, {\"label\": \"Gaming\", \"value\": \"gaming\"}, {\"label\": \"Education\", \"value\": \"education\"}, {\"label\": \"Entertainment\", \"value\": \"entertainment\"}, {\"label\": \"News\", \"value\": \"news\"}, {\"label\": \"Sports\", \"value\": \"sports\"}, {\"label\": \"Technology\", \"value\": \"technology\"}, {\"label\": \"Vlog\", \"value\": \"vlog\"}]}', NULL, '2025-11-06 15:54:53'),
(1394, 132, 1, 'video_tags', 'Tags', 'Add tags (comma separated)', '', 0, 0, 13, '{}', NULL, '2025-11-06 15:54:53'),
(1395, 132, 27, 'visibility_heading', 'Visibility', '', 'Who Can Watch', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1396, 132, 12, 'visibility_options', 'Visibility', '', 'public', 1, 0, 15, '{\"options\": [{\"label\": \"Public\", \"value\": \"public\"}, {\"label\": \"Unlisted\", \"value\": \"unlisted\"}, {\"label\": \"Private\", \"value\": \"private\"}]}', NULL, '2025-11-06 15:54:53'),
(1397, 132, 27, 'advanced_heading', 'Advanced Settings', '', 'Additional Options', 0, 1, 16, '{\"level\": \"h3\"}', NULL, '2025-11-06 15:54:53'),
(1398, 132, 11, 'allow_comments', 'Allow Comments', '', '1', 0, 0, 17, '{}', NULL, '2025-11-06 15:54:53'),
(1399, 132, 11, 'age_restriction', 'Age Restriction (18+)', '', '0', 0, 0, 18, '{}', NULL, '2025-11-06 15:54:53'),
(1400, 132, 11, 'monetization', 'Enable Monetization', '', '0', 0, 0, 19, '{}', NULL, '2025-11-06 15:54:53'),
(1401, 132, 33, 'publish_button', 'Publish', '', 'Publish Video', 0, 0, 20, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 15:54:53'),
(1402, 132, 33, 'save_draft_button', 'Save Draft', '', 'Save as Draft', 0, 0, 21, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1403, 132, 33, 'cancel_upload_button', 'Cancel', '', 'Cancel', 0, 0, 22, '{\"action\": \"cancel\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53'),
(1404, 133, 27, 'request_title', 'Page Title', '', 'Where to?', 0, 1, 1, '{\"level\": \"h1\"}', NULL, '2025-11-06 19:32:16'),
(1405, 133, 28, 'request_subtitle', 'Subtitle', '', 'Enter your destination to get started', 0, 1, 2, '{}', NULL, '2025-11-06 19:32:16'),
(1406, 133, 1, 'pickup_location', 'Pickup Location', 'Enter pickup address', '', 1, 0, 3, '{\"icon\": \"MapPin\"}', NULL, '2025-11-06 19:32:16'),
(1407, 133, 1, 'destination', 'Destination', 'Where are you going?', '', 1, 0, 4, '{\"icon\": \"Navigation\"}', NULL, '2025-11-06 19:32:16'),
(1408, 133, 27, 'ride_type_heading', 'Ride Type', '', 'Choose Your Ride', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1409, 133, 10, 'ride_type', 'Ride Type', 'Select ride type', 'standard', 1, 0, 6, '{\"options\": [{\"label\": \"Standard\", \"value\": \"standard\", \"description\": \"Affordable rides\"}, {\"label\": \"Premium\", \"value\": \"premium\", \"description\": \"Comfortable sedans\"}, {\"label\": \"XL\", \"value\": \"xl\", \"description\": \"6 seats\"}, {\"label\": \"Luxury\", \"value\": \"luxury\", \"description\": \"High-end vehicles\"}]}', NULL, '2025-11-06 19:32:16'),
(1410, 133, 27, 'ride_details_heading', 'Trip Details', '', 'Trip Details', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1411, 133, 8, 'estimated_fare', 'Estimated Fare', '', '0.00', 0, 1, 8, '{\"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 19:32:16'),
(1412, 133, 28, 'estimated_time', 'Estimated Time', '', 'Calculating...', 0, 1, 9, '{}', NULL, '2025-11-06 19:32:16'),
(1413, 133, 28, 'distance', 'Distance', '', 'Calculating...', 0, 1, 10, '{}', NULL, '2025-11-06 19:32:16'),
(1414, 133, 1, 'promo_code', 'Promo Code', 'Enter promo code', '', 0, 0, 11, '{}', NULL, '2025-11-06 19:32:16'),
(1415, 133, 1, 'ride_notes', 'Special Instructions', 'Add notes for driver', '', 0, 0, 12, '{}', NULL, '2025-11-06 19:32:16'),
(1416, 133, 33, 'request_ride_button', 'Request Ride', '', 'Request Ride', 0, 0, 13, '{\"size\": \"large\", \"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 19:32:16'),
(1417, 134, 27, 'tracking_title', 'Page Title', '', 'Your Ride', 0, 1, 1, '{}', NULL, '2025-11-06 19:32:16'),
(1418, 134, 28, 'ride_status', 'Ride Status', '', 'Driver is on the way', 0, 1, 2, '{\"type\": \"status\"}', NULL, '2025-11-06 19:32:16'),
(1419, 134, 27, 'driver_info_heading', 'Driver Information', '', 'Your Driver', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1420, 134, 28, 'driver_name', 'Driver Name', '', 'John Doe', 0, 1, 4, '{}', NULL, '2025-11-06 19:32:16'),
(1421, 134, 28, 'driver_rating', 'Driver Rating', '', '4.8 â­', 0, 1, 5, '{}', NULL, '2025-11-06 19:32:16'),
(1422, 134, 28, 'vehicle_info', 'Vehicle Info', '', 'Toyota Camry - ABC 123', 0, 1, 6, '{}', NULL, '2025-11-06 19:32:16'),
(1423, 134, 27, 'trip_progress_heading', 'Trip Progress', '', 'Trip Details', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1424, 134, 28, 'eta', 'Estimated Arrival', '', '5 minutes', 0, 1, 8, '{\"icon\": \"Clock\"}', NULL, '2025-11-06 19:32:16'),
(1425, 134, 28, 'current_location', 'Current Location', '', 'Updating...', 0, 1, 9, '{\"icon\": \"MapPin\"}', NULL, '2025-11-06 19:32:16'),
(1426, 134, 28, 'destination_display', 'Destination', '', '', 0, 1, 10, '{\"icon\": \"Navigation\"}', NULL, '2025-11-06 19:32:16'),
(1427, 134, 33, 'call_driver_button', 'Call Driver', '', 'Call Driver', 0, 0, 11, '{\"icon\": \"Phone\", \"variant\": \"secondary\"}', NULL, '2025-11-06 19:32:16'),
(1428, 134, 33, 'message_driver_button', 'Message Driver', '', 'Message', 0, 0, 12, '{\"icon\": \"MessageCircle\", \"variant\": \"secondary\"}', NULL, '2025-11-06 19:32:16'),
(1429, 134, 33, 'cancel_ride_button', 'Cancel Ride', '', 'Cancel Ride', 0, 0, 13, '{\"variant\": \"danger\"}', NULL, '2025-11-06 19:32:16'),
(1430, 134, 27, 'safety_heading', 'Safety', '', 'Safety Features', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1431, 134, 33, 'share_trip_button', 'Share Trip', '', 'Share Trip Status', 0, 0, 15, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:32:16'),
(1432, 134, 33, 'emergency_button', 'Emergency', '', 'Emergency', 0, 0, 16, '{\"variant\": \"danger\"}', NULL, '2025-11-06 19:32:16'),
(1433, 135, 27, 'history_title', 'Page Title', '', 'Ride History', 0, 1, 1, '{}', NULL, '2025-11-06 19:32:16'),
(1434, 135, 28, 'history_description', 'Description', '', 'View all your past rides', 0, 1, 2, '{}', NULL, '2025-11-06 19:32:16'),
(1435, 135, 17, 'start_date', 'Start Date', 'From date', '', 0, 0, 3, '{}', NULL, '2025-11-06 19:32:16'),
(1436, 135, 17, 'end_date', 'End Date', 'To date', '', 0, 0, 4, '{}', NULL, '2025-11-06 19:32:16'),
(1437, 135, 10, 'ride_status_filter', 'Status', 'All Rides', '', 0, 0, 5, '{\"options\": [{\"label\": \"All Rides\", \"value\": \"all\"}, {\"label\": \"Completed\", \"value\": \"completed\"}, {\"label\": \"Cancelled\", \"value\": \"cancelled\"}]}', NULL, '2025-11-06 19:32:16'),
(1438, 135, 33, 'apply_filters_button', 'Apply Filters', '', 'Apply', 0, 0, 6, '{\"variant\": \"primary\"}', NULL, '2025-11-06 19:32:16'),
(1439, 135, 27, 'rides_list_heading', 'Your Rides', '', 'Past Rides', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1440, 135, 28, 'rides_list', 'Rides List', '', 'Your ride history will appear here.', 0, 1, 8, '{\"type\": \"list\"}', NULL, '2025-11-06 19:32:16'),
(1441, 135, 27, 'stats_heading', 'Statistics', '', 'Your Stats', 0, 1, 9, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1442, 135, 28, 'total_rides', 'Total Rides', '', '0 rides', 0, 1, 10, '{}', NULL, '2025-11-06 19:32:16'),
(1443, 135, 28, 'total_spent', 'Total Spent', '', '$0.00', 0, 1, 11, '{}', NULL, '2025-11-06 19:32:16'),
(1444, 136, 27, 'payment_title', 'Page Title', '', 'Payment Methods', 0, 1, 1, '{}', NULL, '2025-11-06 19:32:16'),
(1445, 136, 28, 'payment_description', 'Description', '', 'Manage your payment options', 0, 1, 2, '{}', NULL, '2025-11-06 19:32:16'),
(1446, 136, 27, 'saved_methods_heading', 'Saved Methods', '', 'Your Payment Methods', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1447, 136, 28, 'payment_methods_list', 'Payment Methods', '', 'Your saved payment methods will appear here.', 0, 1, 4, '{\"type\": \"list\"}', NULL, '2025-11-06 19:32:16'),
(1448, 136, 27, 'add_payment_heading', 'Add New Payment', '', 'Add Payment Method', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1449, 136, 10, 'payment_type', 'Payment Type', 'Select type', '', 0, 0, 6, '{\"options\": [{\"label\": \"Credit Card\", \"value\": \"credit\"}, {\"label\": \"Debit Card\", \"value\": \"debit\"}, {\"label\": \"PayPal\", \"value\": \"paypal\"}, {\"label\": \"Apple Pay\", \"value\": \"apple_pay\"}, {\"label\": \"Google Pay\", \"value\": \"google_pay\"}]}', NULL, '2025-11-06 19:32:16'),
(1450, 136, 1, 'card_number', 'Card Number', 'Enter card number', '', 0, 0, 7, '{\"type\": \"number\"}', NULL, '2025-11-06 19:32:16'),
(1451, 136, 1, 'card_name', 'Cardholder Name', 'Name on card', '', 0, 0, 8, '{}', NULL, '2025-11-06 19:32:16'),
(1452, 136, 17, 'expiry_date', 'Expiry Date', 'MM/YY', '', 0, 0, 9, '{}', NULL, '2025-11-06 19:32:16'),
(1453, 136, 1, 'cvv', 'CVV', 'CVV', '', 0, 0, 10, '{\"type\": \"password\", \"maxLength\": 4}', NULL, '2025-11-06 19:32:16'),
(1454, 136, 33, 'add_payment_button', 'Add Payment', '', 'Add Payment Method', 0, 0, 11, '{\"variant\": \"primary\"}', NULL, '2025-11-06 19:32:16'),
(1455, 136, 27, 'default_payment_heading', 'Default Payment', '', 'Default Payment Method', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1456, 136, 28, 'default_payment_info', 'Default Payment', '', 'Set your preferred payment method for rides', 0, 1, 13, '{}', NULL, '2025-11-06 19:32:16'),
(1457, 137, 27, 'driver_profile_title', 'Page Title', '', 'Driver Profile', 0, 1, 1, '{}', NULL, '2025-11-06 19:32:16'),
(1458, 137, 28, 'driver_photo', 'Driver Photo', '', 'Driver photo placeholder', 0, 1, 2, '{\"type\": \"image\"}', NULL, '2025-11-06 19:32:16'),
(1459, 137, 27, 'driver_name_display', 'Driver Name', '', 'John Doe', 0, 1, 3, '{\"level\": \"h2\"}', NULL, '2025-11-06 19:32:16'),
(1460, 137, 28, 'driver_rating_display', 'Rating', '', '4.8 â­ (1,234 rides)', 0, 1, 4, '{}', NULL, '2025-11-06 19:32:16'),
(1461, 137, 28, 'member_since', 'Member Since', '', 'Member since: Jan 2023', 0, 1, 5, '{}', NULL, '2025-11-06 19:32:16'),
(1462, 137, 27, 'vehicle_heading', 'Vehicle', '', 'Vehicle Information', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1463, 137, 28, 'vehicle_make_model', 'Vehicle', '', 'Toyota Camry 2023', 0, 1, 7, '{}', NULL, '2025-11-06 19:32:16'),
(1464, 137, 28, 'vehicle_color', 'Color', '', 'Silver', 0, 1, 8, '{}', NULL, '2025-11-06 19:32:16'),
(1465, 137, 28, 'license_plate', 'License Plate', '', 'ABC 123', 0, 1, 9, '{}', NULL, '2025-11-06 19:32:16'),
(1466, 137, 27, 'stats_heading', 'Statistics', '', 'Driver Stats', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1467, 137, 28, 'total_trips', 'Total Trips', '', '1,234 trips', 0, 1, 11, '{}', NULL, '2025-11-06 19:32:16'),
(1468, 137, 28, 'acceptance_rate', 'Acceptance Rate', '', '98%', 0, 1, 12, '{}', NULL, '2025-11-06 19:32:16'),
(1469, 137, 28, 'cancellation_rate', 'Cancellation Rate', '', '2%', 0, 1, 13, '{}', NULL, '2025-11-06 19:32:16'),
(1470, 137, 27, 'reviews_heading', 'Reviews', '', 'Recent Reviews', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1471, 137, 28, 'reviews_list', 'Reviews', '', 'Driver reviews will appear here.', 0, 1, 15, '{\"type\": \"list\"}', NULL, '2025-11-06 19:32:16'),
(1472, 137, 33, 'contact_driver_button', 'Contact Driver', '', 'Contact Driver', 0, 0, 16, '{\"variant\": \"primary\"}', NULL, '2025-11-06 19:32:16'),
(1473, 137, 33, 'report_driver_button', 'Report Issue', '', 'Report Issue', 0, 0, 17, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:32:16'),
(1474, 138, 27, 'profile_title', 'Page Title', '', 'My Profile', 0, 1, 1, '{}', NULL, '2025-11-06 19:32:16'),
(1475, 138, 28, 'profile_description', 'Description', '', 'Manage your account settings', 0, 1, 2, '{}', NULL, '2025-11-06 19:32:16'),
(1476, 138, 27, 'personal_info_heading', 'Personal Info', '', 'Personal Information', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1477, 138, 1, 'first_name', 'First Name', 'Enter first name', '', 1, 0, 4, '{}', NULL, '2025-11-06 19:32:16'),
(1478, 138, 1, 'last_name', 'Last Name', 'Enter last name', '', 1, 0, 5, '{}', NULL, '2025-11-06 19:32:16'),
(1479, 138, 1, 'email', 'Email', 'Enter email', '', 1, 0, 6, '{\"type\": \"email\"}', NULL, '2025-11-06 19:32:16'),
(1480, 138, 1, 'phone', 'Phone Number', 'Enter phone number', '', 1, 0, 7, '{\"type\": \"tel\"}', NULL, '2025-11-06 19:32:16'),
(1481, 138, 27, 'home_address_heading', 'Home Address', '', 'Saved Addresses', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1482, 138, 1, 'home_address', 'Home Address', 'Enter home address', '', 0, 0, 9, '{}', NULL, '2025-11-06 19:32:16'),
(1483, 138, 1, 'work_address', 'Work Address', 'Enter work address', '', 0, 0, 10, '{}', NULL, '2025-11-06 19:32:16'),
(1484, 138, 27, 'preferences_heading', 'Preferences', '', 'Ride Preferences', 0, 1, 11, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1485, 138, 10, 'preferred_ride_type', 'Preferred Ride Type', 'Select default', '', 0, 0, 12, '{\"options\": [{\"label\": \"Standard\", \"value\": \"standard\"}, {\"label\": \"Premium\", \"value\": \"premium\"}, {\"label\": \"XL\", \"value\": \"xl\"}, {\"label\": \"Luxury\", \"value\": \"luxury\"}]}', NULL, '2025-11-06 19:32:16'),
(1486, 138, 10, 'language', 'Language', 'Select language', 'en', 0, 0, 13, '{\"options\": [{\"label\": \"English\", \"value\": \"en\"}, {\"label\": \"Spanish\", \"value\": \"es\"}, {\"label\": \"French\", \"value\": \"fr\"}]}', NULL, '2025-11-06 19:32:16'),
(1487, 138, 27, 'notifications_heading', 'Notifications', '', 'Notification Settings', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:32:16'),
(1488, 138, 28, 'push_notifications', 'Push Notifications', '', 'Enabled', 0, 1, 15, '{}', NULL, '2025-11-06 19:32:16'),
(1489, 138, 28, 'email_notifications', 'Email Notifications', '', 'Enabled', 0, 1, 16, '{}', NULL, '2025-11-06 19:32:16');
INSERT INTO `app_template_screen_elements` (`id`, `template_screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`) VALUES
(1490, 138, 28, 'sms_notifications', 'SMS Notifications', '', 'Enabled', 0, 1, 17, '{}', NULL, '2025-11-06 19:32:16'),
(1491, 138, 33, 'save_profile_button', 'Save Changes', '', 'Save Changes', 0, 0, 18, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 19:32:16'),
(1492, 138, 33, 'logout_button', 'Logout', '', 'Logout', 0, 0, 19, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:32:16'),
(1493, 138, 33, 'delete_account_button', 'Delete Account', '', 'Delete Account', 0, 0, 20, '{\"variant\": \"danger\"}', NULL, '2025-11-06 19:32:16'),
(1494, 139, 27, 'heading_139_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1495, 140, 27, 'heading_140_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1496, 141, 27, 'heading_141_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1497, 142, 27, 'heading_142_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1498, 143, 27, 'heading_143_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1499, 144, 27, 'heading_144_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1500, 145, 27, 'heading_145_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1501, 146, 27, 'heading_146_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1502, 147, 27, 'heading_147_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1503, 148, 27, 'heading_148_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1504, 149, 27, 'heading_149_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1505, 150, 27, 'heading_150_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1506, 151, 27, 'heading_151_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1507, 152, 27, 'heading_152_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1508, 153, 27, 'heading_153_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1509, 154, 27, 'heading_154_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1510, 155, 27, 'heading_155_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1511, 156, 27, 'heading_156_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1512, 157, 27, 'heading_157_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1513, 158, 27, 'heading_158_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1514, 159, 27, 'heading_159_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1515, 160, 27, 'heading_160_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1516, 161, 27, 'heading_161_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1517, 162, 27, 'heading_162_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1518, 163, 27, 'heading_163_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1519, 164, 27, 'heading_164_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1520, 165, 27, 'heading_165_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1521, 166, 27, 'heading_166_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1522, 167, 27, 'heading_167_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1523, 168, 27, 'heading_168_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1524, 169, 27, 'heading_169_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1525, 170, 27, 'heading_170_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1526, 171, 27, 'heading_171_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1527, 172, 27, 'heading_172_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1528, 173, 27, 'heading_173_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1529, 174, 27, 'heading_174_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1530, 175, 27, 'heading_175_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1531, 298, 27, 'heading_298_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1532, 139, 28, 'paragraph_139_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1533, 140, 28, 'paragraph_140_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1534, 141, 28, 'paragraph_141_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1535, 142, 28, 'paragraph_142_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1536, 143, 28, 'paragraph_143_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1537, 144, 28, 'paragraph_144_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1538, 145, 28, 'paragraph_145_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1539, 146, 28, 'paragraph_146_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1540, 147, 28, 'paragraph_147_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1541, 148, 28, 'paragraph_148_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1542, 149, 28, 'paragraph_149_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1543, 150, 28, 'paragraph_150_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1544, 151, 28, 'paragraph_151_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1545, 152, 28, 'paragraph_152_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1546, 153, 28, 'paragraph_153_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1547, 154, 28, 'paragraph_154_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1548, 155, 28, 'paragraph_155_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1549, 156, 28, 'paragraph_156_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1550, 157, 28, 'paragraph_157_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1551, 158, 28, 'paragraph_158_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1552, 159, 28, 'paragraph_159_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1553, 160, 28, 'paragraph_160_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1554, 161, 28, 'paragraph_161_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1555, 162, 28, 'paragraph_162_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1556, 163, 28, 'paragraph_163_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1557, 164, 28, 'paragraph_164_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1558, 165, 28, 'paragraph_165_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1559, 166, 28, 'paragraph_166_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1560, 167, 28, 'paragraph_167_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1561, 168, 28, 'paragraph_168_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1562, 169, 28, 'paragraph_169_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1563, 170, 28, 'paragraph_170_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1564, 171, 28, 'paragraph_171_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1565, 172, 28, 'paragraph_172_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1566, 173, 28, 'paragraph_173_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1567, 174, 28, 'paragraph_174_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1568, 175, 28, 'paragraph_175_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1569, 298, 28, 'paragraph_298_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1570, 139, 33, 'button_139_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1571, 140, 33, 'button_140_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1572, 141, 33, 'button_141_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1573, 142, 33, 'button_142_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1574, 143, 33, 'button_143_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1575, 144, 33, 'button_144_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1576, 145, 33, 'button_145_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1577, 146, 33, 'button_146_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1578, 147, 33, 'button_147_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1579, 148, 33, 'button_148_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1580, 149, 33, 'button_149_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1581, 150, 33, 'button_150_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1582, 151, 33, 'button_151_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1583, 152, 33, 'button_152_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1584, 153, 33, 'button_153_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1585, 154, 33, 'button_154_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1586, 155, 33, 'button_155_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1587, 156, 33, 'button_156_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1588, 157, 33, 'button_157_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1589, 158, 33, 'button_158_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1590, 159, 33, 'button_159_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1591, 160, 33, 'button_160_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1592, 161, 33, 'button_161_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1593, 162, 33, 'button_162_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1594, 163, 33, 'button_163_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1595, 164, 33, 'button_164_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1596, 165, 33, 'button_165_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1597, 166, 33, 'button_166_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1598, 167, 33, 'button_167_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1599, 168, 33, 'button_168_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1600, 169, 33, 'button_169_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1601, 170, 33, 'button_170_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1602, 171, 33, 'button_171_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1603, 172, 33, 'button_172_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1604, 173, 33, 'button_173_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1605, 174, 33, 'button_174_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1606, 175, 33, 'button_175_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1607, 298, 33, 'button_298_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1608, 139, 1, 'text_field_139_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1609, 140, 1, 'text_field_140_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1610, 141, 1, 'text_field_141_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1611, 142, 1, 'text_field_142_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1612, 143, 1, 'text_field_143_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1613, 144, 1, 'text_field_144_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1614, 145, 1, 'text_field_145_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1615, 146, 1, 'text_field_146_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1616, 147, 1, 'text_field_147_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1617, 148, 1, 'text_field_148_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1618, 149, 1, 'text_field_149_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1619, 150, 1, 'text_field_150_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1620, 151, 1, 'text_field_151_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1621, 152, 1, 'text_field_152_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1622, 153, 1, 'text_field_153_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1623, 154, 1, 'text_field_154_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1624, 155, 1, 'text_field_155_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1625, 156, 1, 'text_field_156_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1626, 157, 1, 'text_field_157_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1627, 158, 1, 'text_field_158_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1628, 159, 1, 'text_field_159_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1629, 160, 1, 'text_field_160_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1630, 161, 1, 'text_field_161_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1631, 162, 1, 'text_field_162_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1632, 163, 1, 'text_field_163_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1633, 164, 1, 'text_field_164_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1634, 165, 1, 'text_field_165_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1635, 166, 1, 'text_field_166_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1636, 167, 1, 'text_field_167_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1637, 168, 1, 'text_field_168_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1638, 169, 1, 'text_field_169_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1639, 170, 1, 'text_field_170_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1640, 171, 1, 'text_field_171_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1641, 172, 1, 'text_field_172_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1642, 173, 1, 'text_field_173_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1643, 174, 1, 'text_field_174_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1644, 175, 1, 'text_field_175_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1645, 298, 1, 'text_field_298_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1749, 176, 27, 'heading_176_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1750, 177, 27, 'heading_177_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1751, 178, 27, 'heading_178_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1752, 179, 27, 'heading_179_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1753, 180, 27, 'heading_180_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1754, 181, 27, 'heading_181_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1755, 182, 27, 'heading_182_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1756, 183, 27, 'heading_183_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1757, 184, 27, 'heading_184_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1758, 185, 27, 'heading_185_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1759, 186, 27, 'heading_186_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1760, 187, 27, 'heading_187_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1761, 188, 27, 'heading_188_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1762, 189, 27, 'heading_189_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1763, 190, 27, 'heading_190_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1764, 191, 27, 'heading_191_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1765, 192, 27, 'heading_192_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1766, 193, 27, 'heading_193_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1767, 194, 27, 'heading_194_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1768, 195, 27, 'heading_195_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1769, 196, 27, 'heading_196_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1770, 197, 27, 'heading_197_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1771, 198, 27, 'heading_198_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1772, 199, 27, 'heading_199_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1773, 200, 27, 'heading_200_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1774, 201, 27, 'heading_201_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1775, 202, 27, 'heading_202_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1776, 203, 27, 'heading_203_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1777, 204, 27, 'heading_204_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1778, 205, 27, 'heading_205_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1779, 206, 27, 'heading_206_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1780, 207, 27, 'heading_207_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1781, 208, 27, 'heading_208_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1782, 209, 27, 'heading_209_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1783, 210, 27, 'heading_210_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1784, 211, 27, 'heading_211_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1785, 212, 27, 'heading_212_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1786, 213, 27, 'heading_213_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1787, 214, 27, 'heading_214_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1788, 215, 27, 'heading_215_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1789, 216, 27, 'heading_216_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1790, 217, 27, 'heading_217_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1791, 218, 27, 'heading_218_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1792, 219, 27, 'heading_219_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1793, 220, 27, 'heading_220_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1794, 221, 27, 'heading_221_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1795, 222, 27, 'heading_222_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1796, 223, 27, 'heading_223_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1797, 224, 27, 'heading_224_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1798, 225, 27, 'heading_225_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1799, 226, 27, 'heading_226_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1800, 227, 27, 'heading_227_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1801, 228, 27, 'heading_228_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1802, 229, 27, 'heading_229_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1803, 230, 27, 'heading_230_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1804, 299, 27, 'heading_299_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1805, 300, 27, 'heading_300_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 16:03:26'),
(1806, 176, 28, 'paragraph_176_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1807, 177, 28, 'paragraph_177_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1808, 178, 28, 'paragraph_178_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1809, 179, 28, 'paragraph_179_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1810, 180, 28, 'paragraph_180_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1811, 181, 28, 'paragraph_181_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1812, 182, 28, 'paragraph_182_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1813, 183, 28, 'paragraph_183_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1814, 184, 28, 'paragraph_184_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1815, 185, 28, 'paragraph_185_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1816, 186, 28, 'paragraph_186_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1817, 187, 28, 'paragraph_187_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1818, 188, 28, 'paragraph_188_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1819, 189, 28, 'paragraph_189_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1820, 190, 28, 'paragraph_190_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1821, 191, 28, 'paragraph_191_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1822, 192, 28, 'paragraph_192_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1823, 193, 28, 'paragraph_193_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1824, 194, 28, 'paragraph_194_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1825, 195, 28, 'paragraph_195_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1826, 196, 28, 'paragraph_196_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1827, 197, 28, 'paragraph_197_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1828, 198, 28, 'paragraph_198_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1829, 199, 28, 'paragraph_199_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1830, 200, 28, 'paragraph_200_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1831, 201, 28, 'paragraph_201_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1832, 202, 28, 'paragraph_202_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1833, 203, 28, 'paragraph_203_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1834, 204, 28, 'paragraph_204_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1835, 205, 28, 'paragraph_205_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1836, 206, 28, 'paragraph_206_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1837, 207, 28, 'paragraph_207_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1838, 208, 28, 'paragraph_208_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1839, 209, 28, 'paragraph_209_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1840, 210, 28, 'paragraph_210_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1841, 211, 28, 'paragraph_211_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1842, 212, 28, 'paragraph_212_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1843, 213, 28, 'paragraph_213_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1844, 214, 28, 'paragraph_214_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1845, 215, 28, 'paragraph_215_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1846, 216, 28, 'paragraph_216_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1847, 217, 28, 'paragraph_217_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1848, 218, 28, 'paragraph_218_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1849, 219, 28, 'paragraph_219_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1850, 220, 28, 'paragraph_220_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1851, 221, 28, 'paragraph_221_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1852, 222, 28, 'paragraph_222_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1853, 223, 28, 'paragraph_223_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1854, 224, 28, 'paragraph_224_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1855, 225, 28, 'paragraph_225_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1856, 226, 28, 'paragraph_226_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1857, 227, 28, 'paragraph_227_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1858, 228, 28, 'paragraph_228_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1859, 229, 28, 'paragraph_229_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1860, 230, 28, 'paragraph_230_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1861, 299, 28, 'paragraph_299_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1862, 300, 28, 'paragraph_300_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 16:03:26'),
(1863, 176, 33, 'button_176_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1864, 177, 33, 'button_177_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1865, 178, 33, 'button_178_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1866, 179, 33, 'button_179_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1867, 180, 33, 'button_180_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1868, 181, 33, 'button_181_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1869, 182, 33, 'button_182_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1870, 183, 33, 'button_183_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1871, 184, 33, 'button_184_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1872, 185, 33, 'button_185_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1873, 186, 33, 'button_186_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1874, 187, 33, 'button_187_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1875, 188, 33, 'button_188_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1876, 189, 33, 'button_189_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1877, 190, 33, 'button_190_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1878, 191, 33, 'button_191_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1879, 192, 33, 'button_192_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1880, 193, 33, 'button_193_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1881, 194, 33, 'button_194_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1882, 195, 33, 'button_195_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1883, 196, 33, 'button_196_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1884, 197, 33, 'button_197_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1885, 198, 33, 'button_198_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1886, 199, 33, 'button_199_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1887, 200, 33, 'button_200_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1888, 201, 33, 'button_201_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1889, 202, 33, 'button_202_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1890, 203, 33, 'button_203_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1891, 204, 33, 'button_204_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1892, 205, 33, 'button_205_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1893, 206, 33, 'button_206_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1894, 207, 33, 'button_207_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1895, 208, 33, 'button_208_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1896, 209, 33, 'button_209_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1897, 210, 33, 'button_210_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1898, 211, 33, 'button_211_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1899, 212, 33, 'button_212_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1900, 213, 33, 'button_213_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1901, 214, 33, 'button_214_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1902, 215, 33, 'button_215_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1903, 216, 33, 'button_216_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1904, 217, 33, 'button_217_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1905, 218, 33, 'button_218_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1906, 219, 33, 'button_219_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1907, 220, 33, 'button_220_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1908, 221, 33, 'button_221_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1909, 222, 33, 'button_222_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1910, 223, 33, 'button_223_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1911, 224, 33, 'button_224_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1912, 225, 33, 'button_225_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1913, 226, 33, 'button_226_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1914, 227, 33, 'button_227_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1915, 228, 33, 'button_228_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1916, 229, 33, 'button_229_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1917, 230, 33, 'button_230_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1918, 299, 33, 'button_299_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1919, 300, 33, 'button_300_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 16:03:26'),
(1920, 176, 1, 'text_field_176_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1921, 177, 1, 'text_field_177_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1922, 178, 1, 'text_field_178_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1923, 179, 1, 'text_field_179_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1924, 180, 1, 'text_field_180_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1925, 181, 1, 'text_field_181_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1926, 182, 1, 'text_field_182_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1927, 183, 1, 'text_field_183_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1928, 184, 1, 'text_field_184_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1929, 185, 1, 'text_field_185_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1930, 186, 1, 'text_field_186_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1931, 187, 1, 'text_field_187_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1932, 188, 1, 'text_field_188_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1933, 189, 1, 'text_field_189_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1934, 190, 1, 'text_field_190_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1935, 191, 1, 'text_field_191_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1936, 192, 1, 'text_field_192_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1937, 193, 1, 'text_field_193_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1938, 194, 1, 'text_field_194_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1939, 195, 1, 'text_field_195_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1940, 196, 1, 'text_field_196_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1941, 197, 1, 'text_field_197_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1942, 198, 1, 'text_field_198_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1943, 199, 1, 'text_field_199_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1944, 200, 1, 'text_field_200_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1945, 201, 1, 'text_field_201_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1946, 202, 1, 'text_field_202_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1947, 203, 1, 'text_field_203_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1948, 204, 1, 'text_field_204_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1949, 205, 1, 'text_field_205_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1950, 206, 1, 'text_field_206_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1951, 207, 1, 'text_field_207_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1952, 208, 1, 'text_field_208_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1953, 209, 1, 'text_field_209_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1954, 210, 1, 'text_field_210_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1955, 211, 1, 'text_field_211_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1956, 212, 1, 'text_field_212_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1957, 213, 1, 'text_field_213_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1958, 214, 1, 'text_field_214_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1959, 215, 1, 'text_field_215_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1960, 216, 1, 'text_field_216_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1961, 217, 1, 'text_field_217_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1962, 218, 1, 'text_field_218_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1963, 219, 1, 'text_field_219_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1964, 220, 1, 'text_field_220_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1965, 221, 1, 'text_field_221_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1966, 222, 1, 'text_field_222_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1967, 223, 1, 'text_field_223_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1968, 224, 1, 'text_field_224_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1969, 225, 1, 'text_field_225_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1970, 226, 1, 'text_field_226_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1971, 227, 1, 'text_field_227_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1972, 228, 1, 'text_field_228_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1973, 229, 1, 'text_field_229_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1974, 230, 1, 'text_field_230_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1975, 299, 1, 'text_field_299_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(1976, 300, 1, 'text_field_300_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 16:03:26'),
(2004, 301, 27, 'heading_301_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2005, 302, 27, 'heading_302_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2006, 303, 27, 'heading_303_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2007, 304, 27, 'heading_304_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2008, 305, 27, 'heading_305_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2009, 306, 27, 'heading_306_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2010, 307, 27, 'heading_307_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2011, 308, 27, 'heading_308_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2012, 309, 27, 'heading_309_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2013, 310, 27, 'heading_310_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2014, 311, 27, 'heading_311_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2015, 312, 27, 'heading_312_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2016, 313, 27, 'heading_313_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2017, 314, 27, 'heading_314_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2018, 315, 27, 'heading_315_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2019, 316, 27, 'heading_316_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2020, 317, 27, 'heading_317_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2021, 318, 27, 'heading_318_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2022, 319, 27, 'heading_319_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2023, 320, 27, 'heading_320_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2024, 321, 27, 'heading_321_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2025, 322, 27, 'heading_322_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2026, 323, 27, 'heading_323_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2027, 324, 27, 'heading_324_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2028, 325, 27, 'heading_325_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2029, 326, 27, 'heading_326_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2030, 327, 27, 'heading_327_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2031, 328, 27, 'heading_328_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2032, 329, 27, 'heading_329_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2033, 330, 27, 'heading_330_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2034, 331, 27, 'heading_331_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2035, 332, 27, 'heading_332_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2036, 333, 27, 'heading_333_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2037, 334, 27, 'heading_334_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2038, 335, 27, 'heading_335_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2039, 336, 27, 'heading_336_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2040, 337, 27, 'heading_337_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2041, 338, 27, 'heading_338_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2042, 339, 27, 'heading_339_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2043, 340, 27, 'heading_340_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2044, 341, 27, 'heading_341_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2045, 342, 27, 'heading_342_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2046, 343, 27, 'heading_343_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2047, 344, 27, 'heading_344_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2048, 345, 27, 'heading_345_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2049, 346, 27, 'heading_346_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2050, 347, 27, 'heading_347_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2051, 348, 27, 'heading_348_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2052, 349, 27, 'heading_349_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2053, 350, 27, 'heading_350_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2054, 351, 27, 'heading_351_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2055, 352, 27, 'heading_352_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2056, 353, 27, 'heading_353_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2057, 354, 27, 'heading_354_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2058, 355, 27, 'heading_355_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2059, 356, 27, 'heading_356_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2060, 357, 27, 'heading_357_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2061, 358, 27, 'heading_358_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2062, 359, 27, 'heading_359_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2063, 360, 27, 'heading_360_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2064, 361, 27, 'heading_361_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2065, 362, 27, 'heading_362_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2066, 363, 27, 'heading_363_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2067, 364, 27, 'heading_364_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2068, 365, 27, 'heading_365_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2069, 366, 27, 'heading_366_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2070, 367, 27, 'heading_367_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2071, 368, 27, 'heading_368_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2072, 369, 27, 'heading_369_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2073, 370, 27, 'heading_370_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2074, 371, 27, 'heading_371_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2075, 372, 27, 'heading_372_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2076, 373, 27, 'heading_373_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2077, 374, 27, 'heading_374_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2078, 375, 27, 'heading_375_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2079, 376, 27, 'heading_376_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2080, 377, 27, 'heading_377_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2081, 378, 27, 'heading_378_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2082, 379, 27, 'heading_379_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2083, 380, 27, 'heading_380_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2084, 381, 27, 'heading_381_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2085, 382, 27, 'heading_382_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2086, 383, 27, 'heading_383_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2087, 384, 27, 'heading_384_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2088, 385, 27, 'heading_385_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2089, 386, 27, 'heading_386_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2090, 387, 27, 'heading_387_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2091, 388, 27, 'heading_388_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2092, 389, 27, 'heading_389_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2093, 390, 27, 'heading_390_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2094, 391, 27, 'heading_391_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2095, 392, 27, 'heading_392_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2096, 393, 27, 'heading_393_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2097, 394, 27, 'heading_394_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2098, 395, 27, 'heading_395_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2099, 396, 27, 'heading_396_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2100, 397, 27, 'heading_397_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2101, 398, 27, 'heading_398_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2102, 399, 27, 'heading_399_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2103, 400, 27, 'heading_400_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2104, 401, 27, 'heading_401_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2105, 402, 27, 'heading_402_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2106, 403, 27, 'heading_403_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2107, 404, 27, 'heading_404_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2108, 405, 27, 'heading_405_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2109, 406, 27, 'heading_406_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2110, 407, 27, 'heading_407_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2111, 408, 27, 'heading_408_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2112, 409, 27, 'heading_409_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2113, 410, 27, 'heading_410_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2114, 411, 27, 'heading_411_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2115, 412, 27, 'heading_412_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2116, 413, 27, 'heading_413_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2117, 414, 27, 'heading_414_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2118, 415, 27, 'heading_415_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2119, 416, 27, 'heading_416_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2120, 417, 27, 'heading_417_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2121, 418, 27, 'heading_418_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2122, 419, 27, 'heading_419_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2123, 420, 27, 'heading_420_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2124, 421, 27, 'heading_421_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2125, 422, 27, 'heading_422_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2126, 423, 27, 'heading_423_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2127, 424, 27, 'heading_424_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2128, 425, 27, 'heading_425_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2129, 426, 27, 'heading_426_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2130, 427, 27, 'heading_427_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2131, 428, 27, 'heading_428_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2132, 429, 27, 'heading_429_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2133, 430, 27, 'heading_430_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2134, 431, 27, 'heading_431_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2135, 432, 27, 'heading_432_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2136, 433, 27, 'heading_433_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2137, 434, 27, 'heading_434_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2138, 435, 27, 'heading_435_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2139, 436, 27, 'heading_436_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2140, 437, 27, 'heading_437_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2141, 438, 27, 'heading_438_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2142, 439, 27, 'heading_439_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2143, 440, 27, 'heading_440_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40');
INSERT INTO `app_template_screen_elements` (`id`, `template_screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`) VALUES
(2144, 441, 27, 'heading_441_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2145, 442, 27, 'heading_442_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2146, 443, 27, 'heading_443_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2147, 444, 27, 'heading_444_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2148, 445, 27, 'heading_445_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2149, 446, 27, 'heading_446_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2150, 447, 27, 'heading_447_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2151, 448, 27, 'heading_448_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2152, 449, 27, 'heading_449_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2153, 450, 27, 'heading_450_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2154, 451, 27, 'heading_451_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2155, 452, 27, 'heading_452_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2156, 453, 27, 'heading_453_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2157, 454, 27, 'heading_454_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2158, 455, 27, 'heading_455_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2159, 456, 27, 'heading_456_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2160, 457, 27, 'heading_457_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2161, 458, 27, 'heading_458_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2162, 459, 27, 'heading_459_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2163, 460, 27, 'heading_460_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2164, 461, 27, 'heading_461_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2165, 462, 27, 'heading_462_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2166, 463, 27, 'heading_463_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2167, 464, 27, 'heading_464_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2168, 465, 27, 'heading_465_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2169, 466, 27, 'heading_466_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2170, 467, 27, 'heading_467_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2171, 468, 27, 'heading_468_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2172, 469, 27, 'heading_469_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2173, 470, 27, 'heading_470_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2174, 471, 27, 'heading_471_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2175, 472, 27, 'heading_472_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2176, 473, 27, 'heading_473_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2177, 474, 27, 'heading_474_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2178, 475, 27, 'heading_475_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2179, 476, 27, 'heading_476_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2180, 477, 27, 'heading_477_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2181, 478, 27, 'heading_478_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2182, 479, 27, 'heading_479_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2183, 480, 27, 'heading_480_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2184, 481, 27, 'heading_481_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2185, 482, 27, 'heading_482_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2186, 483, 27, 'heading_483_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2187, 484, 27, 'heading_484_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2188, 485, 27, 'heading_485_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2189, 486, 27, 'heading_486_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2190, 487, 27, 'heading_487_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2191, 488, 27, 'heading_488_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2192, 489, 27, 'heading_489_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2193, 490, 27, 'heading_490_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2194, 491, 27, 'heading_491_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2195, 492, 27, 'heading_492_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2196, 493, 27, 'heading_493_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2197, 494, 27, 'heading_494_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2198, 495, 27, 'heading_495_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2199, 496, 27, 'heading_496_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2200, 497, 27, 'heading_497_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2201, 498, 27, 'heading_498_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2202, 499, 27, 'heading_499_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2203, 500, 27, 'heading_500_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2204, 501, 27, 'heading_501_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2205, 502, 27, 'heading_502_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2206, 503, 27, 'heading_503_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2207, 504, 27, 'heading_504_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2208, 505, 27, 'heading_505_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2209, 506, 27, 'heading_506_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2210, 507, 27, 'heading_507_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2211, 508, 27, 'heading_508_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2212, 509, 27, 'heading_509_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2213, 510, 27, 'heading_510_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2214, 511, 27, 'heading_511_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2215, 512, 27, 'heading_512_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2216, 513, 27, 'heading_513_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2217, 514, 27, 'heading_514_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2218, 515, 27, 'heading_515_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2219, 516, 27, 'heading_516_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2220, 517, 27, 'heading_517_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2221, 518, 27, 'heading_518_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2222, 519, 27, 'heading_519_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2223, 520, 27, 'heading_520_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2224, 521, 27, 'heading_521_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2225, 522, 27, 'heading_522_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2226, 523, 27, 'heading_523_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2227, 524, 27, 'heading_524_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2228, 525, 27, 'heading_525_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2229, 526, 27, 'heading_526_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2230, 527, 27, 'heading_527_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2231, 528, 27, 'heading_528_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2232, 529, 27, 'heading_529_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2233, 530, 27, 'heading_530_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2234, 531, 27, 'heading_531_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2235, 532, 27, 'heading_532_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2236, 533, 27, 'heading_533_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2237, 534, 27, 'heading_534_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2238, 535, 27, 'heading_535_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2239, 536, 27, 'heading_536_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2240, 537, 27, 'heading_537_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2241, 538, 27, 'heading_538_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2242, 539, 27, 'heading_539_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2243, 540, 27, 'heading_540_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2244, 541, 27, 'heading_541_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2245, 542, 27, 'heading_542_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2246, 543, 27, 'heading_543_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2247, 544, 27, 'heading_544_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2248, 545, 27, 'heading_545_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2249, 546, 27, 'heading_546_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2250, 547, 27, 'heading_547_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2251, 548, 27, 'heading_548_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2252, 549, 27, 'heading_549_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2253, 550, 27, 'heading_550_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2254, 551, 27, 'heading_551_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2255, 552, 27, 'heading_552_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2256, 553, 27, 'heading_553_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2257, 554, 27, 'heading_554_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2258, 555, 27, 'heading_555_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2259, 556, 27, 'heading_556_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2260, 557, 27, 'heading_557_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2261, 558, 27, 'heading_558_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2262, 559, 27, 'heading_559_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2263, 560, 27, 'heading_560_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2264, 561, 27, 'heading_561_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2265, 562, 27, 'heading_562_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2266, 563, 27, 'heading_563_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2267, 564, 27, 'heading_564_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2268, 565, 27, 'heading_565_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2269, 566, 27, 'heading_566_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2270, 567, 27, 'heading_567_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2271, 568, 27, 'heading_568_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2272, 569, 27, 'heading_569_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2273, 570, 27, 'heading_570_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2274, 571, 27, 'heading_571_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2275, 572, 27, 'heading_572_1', NULL, NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 18:22:40'),
(2276, 301, 28, 'paragraph_301_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2277, 302, 28, 'paragraph_302_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2278, 303, 28, 'paragraph_303_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2279, 304, 28, 'paragraph_304_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2280, 305, 28, 'paragraph_305_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2281, 306, 28, 'paragraph_306_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2282, 307, 28, 'paragraph_307_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2283, 308, 28, 'paragraph_308_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2284, 309, 28, 'paragraph_309_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2285, 310, 28, 'paragraph_310_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2286, 311, 28, 'paragraph_311_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2287, 312, 28, 'paragraph_312_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2288, 313, 28, 'paragraph_313_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2289, 314, 28, 'paragraph_314_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2290, 315, 28, 'paragraph_315_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2291, 316, 28, 'paragraph_316_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2292, 317, 28, 'paragraph_317_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2293, 318, 28, 'paragraph_318_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2294, 319, 28, 'paragraph_319_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2295, 320, 28, 'paragraph_320_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2296, 321, 28, 'paragraph_321_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2297, 322, 28, 'paragraph_322_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2298, 323, 28, 'paragraph_323_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2299, 324, 28, 'paragraph_324_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2300, 325, 28, 'paragraph_325_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2301, 326, 28, 'paragraph_326_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2302, 327, 28, 'paragraph_327_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2303, 328, 28, 'paragraph_328_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2304, 329, 28, 'paragraph_329_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2305, 330, 28, 'paragraph_330_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2306, 331, 28, 'paragraph_331_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2307, 332, 28, 'paragraph_332_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2308, 333, 28, 'paragraph_333_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2309, 334, 28, 'paragraph_334_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2310, 335, 28, 'paragraph_335_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2311, 336, 28, 'paragraph_336_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2312, 337, 28, 'paragraph_337_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2313, 338, 28, 'paragraph_338_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2314, 339, 28, 'paragraph_339_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2315, 340, 28, 'paragraph_340_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2316, 341, 28, 'paragraph_341_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2317, 342, 28, 'paragraph_342_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2318, 343, 28, 'paragraph_343_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2319, 344, 28, 'paragraph_344_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2320, 345, 28, 'paragraph_345_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2321, 346, 28, 'paragraph_346_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2322, 347, 28, 'paragraph_347_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2323, 348, 28, 'paragraph_348_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2324, 349, 28, 'paragraph_349_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2325, 350, 28, 'paragraph_350_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2326, 351, 28, 'paragraph_351_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2327, 352, 28, 'paragraph_352_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2328, 353, 28, 'paragraph_353_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2329, 354, 28, 'paragraph_354_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2330, 355, 28, 'paragraph_355_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2331, 356, 28, 'paragraph_356_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2332, 357, 28, 'paragraph_357_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2333, 358, 28, 'paragraph_358_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2334, 359, 28, 'paragraph_359_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2335, 360, 28, 'paragraph_360_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2336, 361, 28, 'paragraph_361_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2337, 362, 28, 'paragraph_362_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2338, 363, 28, 'paragraph_363_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2339, 364, 28, 'paragraph_364_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2340, 365, 28, 'paragraph_365_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2341, 366, 28, 'paragraph_366_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2342, 367, 28, 'paragraph_367_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2343, 368, 28, 'paragraph_368_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2344, 369, 28, 'paragraph_369_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2345, 370, 28, 'paragraph_370_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2346, 371, 28, 'paragraph_371_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2347, 372, 28, 'paragraph_372_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2348, 373, 28, 'paragraph_373_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2349, 374, 28, 'paragraph_374_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2350, 375, 28, 'paragraph_375_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2351, 376, 28, 'paragraph_376_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2352, 377, 28, 'paragraph_377_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2353, 378, 28, 'paragraph_378_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2354, 379, 28, 'paragraph_379_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2355, 380, 28, 'paragraph_380_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2356, 381, 28, 'paragraph_381_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2357, 382, 28, 'paragraph_382_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2358, 383, 28, 'paragraph_383_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2359, 384, 28, 'paragraph_384_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2360, 385, 28, 'paragraph_385_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2361, 386, 28, 'paragraph_386_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2362, 387, 28, 'paragraph_387_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2363, 388, 28, 'paragraph_388_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2364, 389, 28, 'paragraph_389_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2365, 390, 28, 'paragraph_390_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2366, 391, 28, 'paragraph_391_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2367, 392, 28, 'paragraph_392_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2368, 393, 28, 'paragraph_393_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2369, 394, 28, 'paragraph_394_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2370, 395, 28, 'paragraph_395_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2371, 396, 28, 'paragraph_396_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2372, 397, 28, 'paragraph_397_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2373, 398, 28, 'paragraph_398_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2374, 399, 28, 'paragraph_399_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2375, 400, 28, 'paragraph_400_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2376, 401, 28, 'paragraph_401_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2377, 402, 28, 'paragraph_402_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2378, 403, 28, 'paragraph_403_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2379, 404, 28, 'paragraph_404_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2380, 405, 28, 'paragraph_405_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2381, 406, 28, 'paragraph_406_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2382, 407, 28, 'paragraph_407_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2383, 408, 28, 'paragraph_408_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2384, 409, 28, 'paragraph_409_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2385, 410, 28, 'paragraph_410_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2386, 411, 28, 'paragraph_411_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2387, 412, 28, 'paragraph_412_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2388, 413, 28, 'paragraph_413_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2389, 414, 28, 'paragraph_414_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2390, 415, 28, 'paragraph_415_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2391, 416, 28, 'paragraph_416_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2392, 417, 28, 'paragraph_417_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2393, 418, 28, 'paragraph_418_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2394, 419, 28, 'paragraph_419_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2395, 420, 28, 'paragraph_420_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2396, 421, 28, 'paragraph_421_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2397, 422, 28, 'paragraph_422_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2398, 423, 28, 'paragraph_423_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2399, 424, 28, 'paragraph_424_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2400, 425, 28, 'paragraph_425_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2401, 426, 28, 'paragraph_426_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2402, 427, 28, 'paragraph_427_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2403, 428, 28, 'paragraph_428_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2404, 429, 28, 'paragraph_429_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2405, 430, 28, 'paragraph_430_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2406, 431, 28, 'paragraph_431_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2407, 432, 28, 'paragraph_432_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2408, 433, 28, 'paragraph_433_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2409, 434, 28, 'paragraph_434_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2410, 435, 28, 'paragraph_435_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2411, 436, 28, 'paragraph_436_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2412, 437, 28, 'paragraph_437_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2413, 438, 28, 'paragraph_438_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2414, 439, 28, 'paragraph_439_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2415, 440, 28, 'paragraph_440_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2416, 441, 28, 'paragraph_441_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2417, 442, 28, 'paragraph_442_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2418, 443, 28, 'paragraph_443_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2419, 444, 28, 'paragraph_444_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2420, 445, 28, 'paragraph_445_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2421, 446, 28, 'paragraph_446_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2422, 447, 28, 'paragraph_447_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2423, 448, 28, 'paragraph_448_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2424, 449, 28, 'paragraph_449_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2425, 450, 28, 'paragraph_450_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2426, 451, 28, 'paragraph_451_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2427, 452, 28, 'paragraph_452_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2428, 453, 28, 'paragraph_453_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2429, 454, 28, 'paragraph_454_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2430, 455, 28, 'paragraph_455_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2431, 456, 28, 'paragraph_456_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2432, 457, 28, 'paragraph_457_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2433, 458, 28, 'paragraph_458_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2434, 459, 28, 'paragraph_459_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2435, 460, 28, 'paragraph_460_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2436, 461, 28, 'paragraph_461_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2437, 462, 28, 'paragraph_462_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2438, 463, 28, 'paragraph_463_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2439, 464, 28, 'paragraph_464_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2440, 465, 28, 'paragraph_465_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2441, 466, 28, 'paragraph_466_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2442, 467, 28, 'paragraph_467_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2443, 468, 28, 'paragraph_468_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2444, 469, 28, 'paragraph_469_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2445, 470, 28, 'paragraph_470_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2446, 471, 28, 'paragraph_471_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2447, 472, 28, 'paragraph_472_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2448, 473, 28, 'paragraph_473_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2449, 474, 28, 'paragraph_474_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2450, 475, 28, 'paragraph_475_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2451, 476, 28, 'paragraph_476_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2452, 477, 28, 'paragraph_477_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2453, 478, 28, 'paragraph_478_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2454, 479, 28, 'paragraph_479_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2455, 480, 28, 'paragraph_480_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2456, 481, 28, 'paragraph_481_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2457, 482, 28, 'paragraph_482_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2458, 483, 28, 'paragraph_483_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2459, 484, 28, 'paragraph_484_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2460, 485, 28, 'paragraph_485_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2461, 486, 28, 'paragraph_486_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2462, 487, 28, 'paragraph_487_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2463, 488, 28, 'paragraph_488_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2464, 489, 28, 'paragraph_489_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2465, 490, 28, 'paragraph_490_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2466, 491, 28, 'paragraph_491_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2467, 492, 28, 'paragraph_492_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2468, 493, 28, 'paragraph_493_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2469, 494, 28, 'paragraph_494_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2470, 495, 28, 'paragraph_495_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2471, 496, 28, 'paragraph_496_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2472, 497, 28, 'paragraph_497_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2473, 498, 28, 'paragraph_498_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2474, 499, 28, 'paragraph_499_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2475, 500, 28, 'paragraph_500_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2476, 501, 28, 'paragraph_501_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2477, 502, 28, 'paragraph_502_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2478, 503, 28, 'paragraph_503_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2479, 504, 28, 'paragraph_504_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2480, 505, 28, 'paragraph_505_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2481, 506, 28, 'paragraph_506_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2482, 507, 28, 'paragraph_507_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2483, 508, 28, 'paragraph_508_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2484, 509, 28, 'paragraph_509_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2485, 510, 28, 'paragraph_510_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2486, 511, 28, 'paragraph_511_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2487, 512, 28, 'paragraph_512_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2488, 513, 28, 'paragraph_513_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2489, 514, 28, 'paragraph_514_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2490, 515, 28, 'paragraph_515_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2491, 516, 28, 'paragraph_516_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2492, 517, 28, 'paragraph_517_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2493, 518, 28, 'paragraph_518_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2494, 519, 28, 'paragraph_519_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2495, 520, 28, 'paragraph_520_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2496, 521, 28, 'paragraph_521_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2497, 522, 28, 'paragraph_522_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2498, 523, 28, 'paragraph_523_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2499, 524, 28, 'paragraph_524_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2500, 525, 28, 'paragraph_525_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2501, 526, 28, 'paragraph_526_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2502, 527, 28, 'paragraph_527_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2503, 528, 28, 'paragraph_528_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2504, 529, 28, 'paragraph_529_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2505, 530, 28, 'paragraph_530_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2506, 531, 28, 'paragraph_531_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2507, 532, 28, 'paragraph_532_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2508, 533, 28, 'paragraph_533_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2509, 534, 28, 'paragraph_534_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2510, 535, 28, 'paragraph_535_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2511, 536, 28, 'paragraph_536_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2512, 537, 28, 'paragraph_537_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2513, 538, 28, 'paragraph_538_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2514, 539, 28, 'paragraph_539_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2515, 540, 28, 'paragraph_540_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2516, 541, 28, 'paragraph_541_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2517, 542, 28, 'paragraph_542_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2518, 543, 28, 'paragraph_543_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2519, 544, 28, 'paragraph_544_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2520, 545, 28, 'paragraph_545_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2521, 546, 28, 'paragraph_546_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2522, 547, 28, 'paragraph_547_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2523, 548, 28, 'paragraph_548_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2524, 549, 28, 'paragraph_549_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2525, 550, 28, 'paragraph_550_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2526, 551, 28, 'paragraph_551_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2527, 552, 28, 'paragraph_552_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2528, 553, 28, 'paragraph_553_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2529, 554, 28, 'paragraph_554_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2530, 555, 28, 'paragraph_555_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2531, 556, 28, 'paragraph_556_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2532, 557, 28, 'paragraph_557_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2533, 558, 28, 'paragraph_558_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2534, 559, 28, 'paragraph_559_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2535, 560, 28, 'paragraph_560_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2536, 561, 28, 'paragraph_561_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2537, 562, 28, 'paragraph_562_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2538, 563, 28, 'paragraph_563_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2539, 564, 28, 'paragraph_564_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2540, 565, 28, 'paragraph_565_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2541, 566, 28, 'paragraph_566_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2542, 567, 28, 'paragraph_567_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2543, 568, 28, 'paragraph_568_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2544, 569, 28, 'paragraph_569_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2545, 570, 28, 'paragraph_570_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2546, 571, 28, 'paragraph_571_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2547, 572, 28, 'paragraph_572_2', NULL, NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 18:22:40'),
(2548, 301, 33, 'button_301_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2549, 302, 33, 'button_302_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2550, 303, 33, 'button_303_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2551, 304, 33, 'button_304_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2552, 305, 33, 'button_305_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2553, 306, 33, 'button_306_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2554, 307, 33, 'button_307_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2555, 308, 33, 'button_308_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2556, 309, 33, 'button_309_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2557, 310, 33, 'button_310_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2558, 311, 33, 'button_311_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2559, 312, 33, 'button_312_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2560, 313, 33, 'button_313_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2561, 314, 33, 'button_314_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2562, 315, 33, 'button_315_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2563, 316, 33, 'button_316_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2564, 317, 33, 'button_317_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2565, 318, 33, 'button_318_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2566, 319, 33, 'button_319_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2567, 320, 33, 'button_320_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2568, 321, 33, 'button_321_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2569, 322, 33, 'button_322_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2570, 323, 33, 'button_323_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2571, 324, 33, 'button_324_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2572, 325, 33, 'button_325_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2573, 326, 33, 'button_326_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2574, 327, 33, 'button_327_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2575, 328, 33, 'button_328_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2576, 329, 33, 'button_329_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2577, 330, 33, 'button_330_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2578, 331, 33, 'button_331_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2579, 332, 33, 'button_332_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2580, 333, 33, 'button_333_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2581, 334, 33, 'button_334_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2582, 335, 33, 'button_335_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2583, 336, 33, 'button_336_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2584, 337, 33, 'button_337_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2585, 338, 33, 'button_338_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2586, 339, 33, 'button_339_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2587, 340, 33, 'button_340_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2588, 341, 33, 'button_341_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2589, 342, 33, 'button_342_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2590, 343, 33, 'button_343_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2591, 344, 33, 'button_344_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2592, 345, 33, 'button_345_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2593, 346, 33, 'button_346_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2594, 347, 33, 'button_347_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2595, 348, 33, 'button_348_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2596, 349, 33, 'button_349_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2597, 350, 33, 'button_350_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2598, 351, 33, 'button_351_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2599, 352, 33, 'button_352_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2600, 353, 33, 'button_353_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2601, 354, 33, 'button_354_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2602, 355, 33, 'button_355_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2603, 356, 33, 'button_356_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2604, 357, 33, 'button_357_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2605, 358, 33, 'button_358_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2606, 359, 33, 'button_359_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2607, 360, 33, 'button_360_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2608, 361, 33, 'button_361_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2609, 362, 33, 'button_362_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2610, 363, 33, 'button_363_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2611, 364, 33, 'button_364_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2612, 365, 33, 'button_365_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2613, 366, 33, 'button_366_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2614, 367, 33, 'button_367_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2615, 368, 33, 'button_368_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2616, 369, 33, 'button_369_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2617, 370, 33, 'button_370_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2618, 371, 33, 'button_371_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2619, 372, 33, 'button_372_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2620, 373, 33, 'button_373_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2621, 374, 33, 'button_374_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2622, 375, 33, 'button_375_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2623, 376, 33, 'button_376_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2624, 377, 33, 'button_377_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2625, 378, 33, 'button_378_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2626, 379, 33, 'button_379_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2627, 380, 33, 'button_380_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2628, 381, 33, 'button_381_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2629, 382, 33, 'button_382_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2630, 383, 33, 'button_383_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2631, 384, 33, 'button_384_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2632, 385, 33, 'button_385_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2633, 386, 33, 'button_386_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2634, 387, 33, 'button_387_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2635, 388, 33, 'button_388_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2636, 389, 33, 'button_389_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2637, 390, 33, 'button_390_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2638, 391, 33, 'button_391_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2639, 392, 33, 'button_392_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2640, 393, 33, 'button_393_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2641, 394, 33, 'button_394_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2642, 395, 33, 'button_395_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2643, 396, 33, 'button_396_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2644, 397, 33, 'button_397_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2645, 398, 33, 'button_398_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2646, 399, 33, 'button_399_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2647, 400, 33, 'button_400_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2648, 401, 33, 'button_401_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2649, 402, 33, 'button_402_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2650, 403, 33, 'button_403_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2651, 404, 33, 'button_404_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2652, 405, 33, 'button_405_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2653, 406, 33, 'button_406_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2654, 407, 33, 'button_407_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2655, 408, 33, 'button_408_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2656, 409, 33, 'button_409_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2657, 410, 33, 'button_410_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2658, 411, 33, 'button_411_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2659, 412, 33, 'button_412_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2660, 413, 33, 'button_413_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2661, 414, 33, 'button_414_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2662, 415, 33, 'button_415_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2663, 416, 33, 'button_416_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2664, 417, 33, 'button_417_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2665, 418, 33, 'button_418_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2666, 419, 33, 'button_419_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2667, 420, 33, 'button_420_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40');
INSERT INTO `app_template_screen_elements` (`id`, `template_screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`) VALUES
(2668, 421, 33, 'button_421_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2669, 422, 33, 'button_422_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2670, 423, 33, 'button_423_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2671, 424, 33, 'button_424_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2672, 425, 33, 'button_425_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2673, 426, 33, 'button_426_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2674, 427, 33, 'button_427_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2675, 428, 33, 'button_428_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2676, 429, 33, 'button_429_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2677, 430, 33, 'button_430_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2678, 431, 33, 'button_431_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2679, 432, 33, 'button_432_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2680, 433, 33, 'button_433_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2681, 434, 33, 'button_434_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2682, 435, 33, 'button_435_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2683, 436, 33, 'button_436_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2684, 437, 33, 'button_437_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2685, 438, 33, 'button_438_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2686, 439, 33, 'button_439_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2687, 440, 33, 'button_440_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2688, 441, 33, 'button_441_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2689, 442, 33, 'button_442_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2690, 443, 33, 'button_443_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2691, 444, 33, 'button_444_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2692, 445, 33, 'button_445_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2693, 446, 33, 'button_446_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2694, 447, 33, 'button_447_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2695, 448, 33, 'button_448_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2696, 449, 33, 'button_449_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2697, 450, 33, 'button_450_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2698, 451, 33, 'button_451_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2699, 452, 33, 'button_452_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2700, 453, 33, 'button_453_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2701, 454, 33, 'button_454_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2702, 455, 33, 'button_455_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2703, 456, 33, 'button_456_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2704, 457, 33, 'button_457_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2705, 458, 33, 'button_458_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2706, 459, 33, 'button_459_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2707, 460, 33, 'button_460_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2708, 461, 33, 'button_461_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2709, 462, 33, 'button_462_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2710, 463, 33, 'button_463_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2711, 464, 33, 'button_464_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2712, 465, 33, 'button_465_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2713, 466, 33, 'button_466_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2714, 467, 33, 'button_467_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2715, 468, 33, 'button_468_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2716, 469, 33, 'button_469_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2717, 470, 33, 'button_470_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2718, 471, 33, 'button_471_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2719, 472, 33, 'button_472_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2720, 473, 33, 'button_473_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2721, 474, 33, 'button_474_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2722, 475, 33, 'button_475_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2723, 476, 33, 'button_476_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2724, 477, 33, 'button_477_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2725, 478, 33, 'button_478_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2726, 479, 33, 'button_479_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2727, 480, 33, 'button_480_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2728, 481, 33, 'button_481_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2729, 482, 33, 'button_482_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2730, 483, 33, 'button_483_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2731, 484, 33, 'button_484_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2732, 485, 33, 'button_485_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2733, 486, 33, 'button_486_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2734, 487, 33, 'button_487_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2735, 488, 33, 'button_488_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2736, 489, 33, 'button_489_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2737, 490, 33, 'button_490_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2738, 491, 33, 'button_491_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2739, 492, 33, 'button_492_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2740, 493, 33, 'button_493_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2741, 494, 33, 'button_494_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2742, 495, 33, 'button_495_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2743, 496, 33, 'button_496_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2744, 497, 33, 'button_497_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2745, 498, 33, 'button_498_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2746, 499, 33, 'button_499_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2747, 500, 33, 'button_500_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2748, 501, 33, 'button_501_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2749, 502, 33, 'button_502_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2750, 503, 33, 'button_503_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2751, 504, 33, 'button_504_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2752, 505, 33, 'button_505_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2753, 506, 33, 'button_506_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2754, 507, 33, 'button_507_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2755, 508, 33, 'button_508_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2756, 509, 33, 'button_509_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2757, 510, 33, 'button_510_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2758, 511, 33, 'button_511_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2759, 512, 33, 'button_512_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2760, 513, 33, 'button_513_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2761, 514, 33, 'button_514_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2762, 515, 33, 'button_515_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2763, 516, 33, 'button_516_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2764, 517, 33, 'button_517_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2765, 518, 33, 'button_518_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2766, 519, 33, 'button_519_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2767, 520, 33, 'button_520_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2768, 521, 33, 'button_521_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2769, 522, 33, 'button_522_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2770, 523, 33, 'button_523_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2771, 524, 33, 'button_524_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2772, 525, 33, 'button_525_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2773, 526, 33, 'button_526_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2774, 527, 33, 'button_527_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2775, 528, 33, 'button_528_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2776, 529, 33, 'button_529_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2777, 530, 33, 'button_530_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2778, 531, 33, 'button_531_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2779, 532, 33, 'button_532_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2780, 533, 33, 'button_533_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2781, 534, 33, 'button_534_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2782, 535, 33, 'button_535_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2783, 536, 33, 'button_536_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2784, 537, 33, 'button_537_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2785, 538, 33, 'button_538_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2786, 539, 33, 'button_539_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2787, 540, 33, 'button_540_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2788, 541, 33, 'button_541_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2789, 542, 33, 'button_542_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2790, 543, 33, 'button_543_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2791, 544, 33, 'button_544_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2792, 545, 33, 'button_545_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2793, 546, 33, 'button_546_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2794, 547, 33, 'button_547_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2795, 548, 33, 'button_548_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2796, 549, 33, 'button_549_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2797, 550, 33, 'button_550_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2798, 551, 33, 'button_551_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2799, 552, 33, 'button_552_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2800, 553, 33, 'button_553_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2801, 554, 33, 'button_554_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2802, 555, 33, 'button_555_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2803, 556, 33, 'button_556_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2804, 557, 33, 'button_557_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2805, 558, 33, 'button_558_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2806, 559, 33, 'button_559_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2807, 560, 33, 'button_560_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2808, 561, 33, 'button_561_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2809, 562, 33, 'button_562_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2810, 563, 33, 'button_563_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2811, 564, 33, 'button_564_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2812, 565, 33, 'button_565_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2813, 566, 33, 'button_566_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2814, 567, 33, 'button_567_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2815, 568, 33, 'button_568_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2816, 569, 33, 'button_569_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2817, 570, 33, 'button_570_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2818, 571, 33, 'button_571_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2819, 572, 33, 'button_572_3', NULL, NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 18:22:40'),
(2820, 301, 1, 'text_field_301_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2821, 302, 1, 'text_field_302_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2822, 303, 1, 'text_field_303_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2823, 304, 1, 'text_field_304_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2824, 305, 1, 'text_field_305_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2825, 306, 1, 'text_field_306_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2826, 307, 1, 'text_field_307_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2827, 308, 1, 'text_field_308_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2828, 309, 1, 'text_field_309_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2829, 310, 1, 'text_field_310_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2830, 311, 1, 'text_field_311_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2831, 312, 1, 'text_field_312_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2832, 313, 1, 'text_field_313_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2833, 314, 1, 'text_field_314_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2834, 315, 1, 'text_field_315_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2835, 316, 1, 'text_field_316_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2836, 317, 1, 'text_field_317_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2837, 318, 1, 'text_field_318_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2838, 319, 1, 'text_field_319_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2839, 320, 1, 'text_field_320_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2840, 321, 1, 'text_field_321_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2841, 322, 1, 'text_field_322_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2842, 323, 1, 'text_field_323_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2843, 324, 1, 'text_field_324_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2844, 325, 1, 'text_field_325_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2845, 326, 1, 'text_field_326_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2846, 327, 1, 'text_field_327_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2847, 328, 1, 'text_field_328_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2848, 329, 1, 'text_field_329_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2849, 330, 1, 'text_field_330_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2850, 331, 1, 'text_field_331_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2851, 332, 1, 'text_field_332_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2852, 333, 1, 'text_field_333_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2853, 334, 1, 'text_field_334_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2854, 335, 1, 'text_field_335_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2855, 336, 1, 'text_field_336_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2856, 337, 1, 'text_field_337_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2857, 338, 1, 'text_field_338_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2858, 339, 1, 'text_field_339_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2859, 340, 1, 'text_field_340_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2860, 341, 1, 'text_field_341_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2861, 342, 1, 'text_field_342_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2862, 343, 1, 'text_field_343_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2863, 344, 1, 'text_field_344_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2864, 345, 1, 'text_field_345_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2865, 346, 1, 'text_field_346_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2866, 347, 1, 'text_field_347_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2867, 348, 1, 'text_field_348_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2868, 349, 1, 'text_field_349_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2869, 350, 1, 'text_field_350_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2870, 351, 1, 'text_field_351_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2871, 352, 1, 'text_field_352_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2872, 353, 1, 'text_field_353_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2873, 354, 1, 'text_field_354_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2874, 355, 1, 'text_field_355_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2875, 356, 1, 'text_field_356_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2876, 357, 1, 'text_field_357_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2877, 358, 1, 'text_field_358_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2878, 359, 1, 'text_field_359_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2879, 360, 1, 'text_field_360_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2880, 361, 1, 'text_field_361_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2881, 362, 1, 'text_field_362_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2882, 363, 1, 'text_field_363_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2883, 364, 1, 'text_field_364_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2884, 365, 1, 'text_field_365_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2885, 366, 1, 'text_field_366_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2886, 367, 1, 'text_field_367_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2887, 368, 1, 'text_field_368_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2888, 369, 1, 'text_field_369_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2889, 370, 1, 'text_field_370_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2890, 371, 1, 'text_field_371_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2891, 372, 1, 'text_field_372_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2892, 373, 1, 'text_field_373_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2893, 374, 1, 'text_field_374_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2894, 375, 1, 'text_field_375_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2895, 376, 1, 'text_field_376_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2896, 377, 1, 'text_field_377_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2897, 378, 1, 'text_field_378_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2898, 379, 1, 'text_field_379_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2899, 380, 1, 'text_field_380_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2900, 381, 1, 'text_field_381_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2901, 382, 1, 'text_field_382_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2902, 383, 1, 'text_field_383_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2903, 384, 1, 'text_field_384_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2904, 385, 1, 'text_field_385_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2905, 386, 1, 'text_field_386_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2906, 387, 1, 'text_field_387_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2907, 388, 1, 'text_field_388_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2908, 389, 1, 'text_field_389_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2909, 390, 1, 'text_field_390_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2910, 391, 1, 'text_field_391_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2911, 392, 1, 'text_field_392_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2912, 393, 1, 'text_field_393_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2913, 394, 1, 'text_field_394_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2914, 395, 1, 'text_field_395_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2915, 396, 1, 'text_field_396_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2916, 397, 1, 'text_field_397_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2917, 398, 1, 'text_field_398_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2918, 399, 1, 'text_field_399_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2919, 400, 1, 'text_field_400_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2920, 401, 1, 'text_field_401_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2921, 402, 1, 'text_field_402_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2922, 403, 1, 'text_field_403_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2923, 404, 1, 'text_field_404_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2924, 405, 1, 'text_field_405_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2925, 406, 1, 'text_field_406_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2926, 407, 1, 'text_field_407_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2927, 408, 1, 'text_field_408_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2928, 409, 1, 'text_field_409_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2929, 410, 1, 'text_field_410_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2930, 411, 1, 'text_field_411_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2931, 412, 1, 'text_field_412_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2932, 413, 1, 'text_field_413_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2933, 414, 1, 'text_field_414_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2934, 415, 1, 'text_field_415_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2935, 416, 1, 'text_field_416_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2936, 417, 1, 'text_field_417_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2937, 418, 1, 'text_field_418_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2938, 419, 1, 'text_field_419_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2939, 420, 1, 'text_field_420_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2940, 421, 1, 'text_field_421_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2941, 422, 1, 'text_field_422_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2942, 423, 1, 'text_field_423_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2943, 424, 1, 'text_field_424_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2944, 425, 1, 'text_field_425_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2945, 426, 1, 'text_field_426_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2946, 427, 1, 'text_field_427_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2947, 428, 1, 'text_field_428_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2948, 429, 1, 'text_field_429_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2949, 430, 1, 'text_field_430_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2950, 431, 1, 'text_field_431_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2951, 432, 1, 'text_field_432_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2952, 433, 1, 'text_field_433_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2953, 434, 1, 'text_field_434_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2954, 435, 1, 'text_field_435_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2955, 436, 1, 'text_field_436_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2956, 437, 1, 'text_field_437_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2957, 438, 1, 'text_field_438_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2958, 439, 1, 'text_field_439_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2959, 440, 1, 'text_field_440_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2960, 441, 1, 'text_field_441_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2961, 442, 1, 'text_field_442_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2962, 443, 1, 'text_field_443_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2963, 444, 1, 'text_field_444_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2964, 445, 1, 'text_field_445_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2965, 446, 1, 'text_field_446_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2966, 447, 1, 'text_field_447_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2967, 448, 1, 'text_field_448_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2968, 449, 1, 'text_field_449_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2969, 450, 1, 'text_field_450_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2970, 451, 1, 'text_field_451_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2971, 452, 1, 'text_field_452_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2972, 453, 1, 'text_field_453_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2973, 454, 1, 'text_field_454_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2974, 455, 1, 'text_field_455_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2975, 456, 1, 'text_field_456_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2976, 457, 1, 'text_field_457_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2977, 458, 1, 'text_field_458_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2978, 459, 1, 'text_field_459_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2979, 460, 1, 'text_field_460_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2980, 461, 1, 'text_field_461_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2981, 462, 1, 'text_field_462_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2982, 463, 1, 'text_field_463_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2983, 464, 1, 'text_field_464_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2984, 465, 1, 'text_field_465_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2985, 466, 1, 'text_field_466_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2986, 467, 1, 'text_field_467_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2987, 468, 1, 'text_field_468_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2988, 469, 1, 'text_field_469_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2989, 470, 1, 'text_field_470_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2990, 471, 1, 'text_field_471_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2991, 472, 1, 'text_field_472_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2992, 473, 1, 'text_field_473_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2993, 474, 1, 'text_field_474_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2994, 475, 1, 'text_field_475_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2995, 476, 1, 'text_field_476_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2996, 477, 1, 'text_field_477_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2997, 478, 1, 'text_field_478_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2998, 479, 1, 'text_field_479_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(2999, 480, 1, 'text_field_480_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3000, 481, 1, 'text_field_481_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3001, 482, 1, 'text_field_482_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3002, 483, 1, 'text_field_483_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3003, 484, 1, 'text_field_484_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3004, 485, 1, 'text_field_485_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3005, 486, 1, 'text_field_486_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3006, 487, 1, 'text_field_487_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3007, 488, 1, 'text_field_488_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3008, 489, 1, 'text_field_489_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3009, 490, 1, 'text_field_490_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3010, 491, 1, 'text_field_491_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3011, 492, 1, 'text_field_492_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3012, 493, 1, 'text_field_493_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3013, 494, 1, 'text_field_494_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3014, 495, 1, 'text_field_495_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3015, 496, 1, 'text_field_496_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3016, 497, 1, 'text_field_497_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3017, 498, 1, 'text_field_498_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3018, 499, 1, 'text_field_499_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3019, 500, 1, 'text_field_500_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3020, 501, 1, 'text_field_501_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3021, 502, 1, 'text_field_502_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3022, 503, 1, 'text_field_503_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3023, 504, 1, 'text_field_504_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3024, 505, 1, 'text_field_505_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3025, 506, 1, 'text_field_506_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3026, 507, 1, 'text_field_507_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3027, 508, 1, 'text_field_508_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3028, 509, 1, 'text_field_509_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3029, 510, 1, 'text_field_510_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3030, 511, 1, 'text_field_511_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3031, 512, 1, 'text_field_512_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3032, 513, 1, 'text_field_513_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3033, 514, 1, 'text_field_514_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3034, 515, 1, 'text_field_515_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3035, 516, 1, 'text_field_516_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3036, 517, 1, 'text_field_517_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3037, 518, 1, 'text_field_518_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3038, 519, 1, 'text_field_519_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3039, 520, 1, 'text_field_520_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3040, 521, 1, 'text_field_521_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3041, 522, 1, 'text_field_522_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3042, 523, 1, 'text_field_523_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3043, 524, 1, 'text_field_524_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3044, 525, 1, 'text_field_525_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3045, 526, 1, 'text_field_526_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3046, 527, 1, 'text_field_527_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3047, 528, 1, 'text_field_528_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3048, 529, 1, 'text_field_529_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3049, 530, 1, 'text_field_530_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3050, 531, 1, 'text_field_531_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3051, 532, 1, 'text_field_532_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3052, 533, 1, 'text_field_533_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3053, 534, 1, 'text_field_534_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3054, 535, 1, 'text_field_535_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3055, 536, 1, 'text_field_536_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3056, 537, 1, 'text_field_537_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3057, 538, 1, 'text_field_538_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3058, 539, 1, 'text_field_539_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3059, 540, 1, 'text_field_540_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3060, 541, 1, 'text_field_541_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3061, 542, 1, 'text_field_542_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3062, 543, 1, 'text_field_543_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3063, 544, 1, 'text_field_544_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3064, 545, 1, 'text_field_545_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3065, 546, 1, 'text_field_546_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3066, 547, 1, 'text_field_547_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3067, 548, 1, 'text_field_548_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3068, 549, 1, 'text_field_549_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3069, 550, 1, 'text_field_550_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3070, 551, 1, 'text_field_551_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3071, 552, 1, 'text_field_552_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3072, 553, 1, 'text_field_553_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3073, 554, 1, 'text_field_554_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3074, 555, 1, 'text_field_555_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3075, 556, 1, 'text_field_556_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3076, 557, 1, 'text_field_557_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3077, 558, 1, 'text_field_558_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3078, 559, 1, 'text_field_559_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3079, 560, 1, 'text_field_560_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3080, 561, 1, 'text_field_561_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3081, 562, 1, 'text_field_562_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3082, 563, 1, 'text_field_563_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3083, 564, 1, 'text_field_564_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3084, 565, 1, 'text_field_565_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3085, 566, 1, 'text_field_566_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3086, 567, 1, 'text_field_567_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3087, 568, 1, 'text_field_568_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3088, 569, 1, 'text_field_569_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3089, 570, 1, 'text_field_570_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3090, 571, 1, 'text_field_571_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40'),
(3091, 572, 1, 'text_field_572_4', NULL, NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 18:22:40');

-- --------------------------------------------------------

--
-- Table structure for table `app_users`
--

CREATE TABLE `app_users` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','non_binary','prefer_not_to_say') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `email_verification_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verification_expires` datetime DEFAULT NULL,
  `password_reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `status` enum('active','inactive','suspended','deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_users`
--

INSERT INTO `app_users` (`id`, `app_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `bio`, `avatar_url`, `date_of_birth`, `gender`, `email_verified`, `email_verification_token`, `email_verification_expires`, `password_reset_token`, `password_reset_expires`, `status`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 19, 'larry@bluestoneapps.com', '$2a$10$V90eQv9T/Z0DQSm7jLf/n.vYBO3iTGiXTjX1pG73O4h3cbShTDE2y', 'Larry', 'Allen', '8655882465', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 'active', NULL, '2025-11-03 19:57:44', '2025-11-06 19:35:37'),
(8, 19, 'testuser@example.com', '$2a$10$yelEv1/vQKDYMXTdfxdFneBWmGbZxcdI3GM3tsRBQGyW40pP0LdGK', 'Test', 'User', NULL, NULL, NULL, NULL, NULL, 0, '701651111d415abc54da8651593838980905fe3c0fa762ef53af67db9aefad57', '2025-11-04 20:31:28', NULL, NULL, 'active', NULL, '2025-11-03 20:31:28', '2025-11-06 19:35:42'),
(9, 19, 'john.doe@example.com', '$2a$10$Yxr1X1VlvUzEx2jpxRP8d.0U12Tb0GE7wnQMetoD7d924Mnhp3vy2', 'John', 'Doe', NULL, NULL, NULL, NULL, NULL, 0, 'ae2ce72332a53f84bd43a14adf2f13be5dfe515529372230b782a849f2b07a90', '2025-11-04 20:34:08', NULL, NULL, 'active', '2025-11-03 20:34:49', '2025-11-03 20:34:07', '2025-11-06 19:35:46'),
(19, 1, 'settingstest@example.com', '$2a$10$aW9sS5jTsTjjXBl/.32rDe7Vwpge..6q.kMnXZenP2oGX9zsUN7Fe', 'Settings', 'Test', NULL, NULL, NULL, NULL, NULL, 0, 'c83e936edc3d6b178b537535afbd126e4b5ac8adc112fef04044dc976d5f583e', '2025-11-08 19:52:50', NULL, NULL, 'active', NULL, '2025-11-07 19:52:49', '2025-11-07 19:52:49'),
(20, 28, 'larry@bluestoneapps.com', '$2a$10$Y4D7WUEBpCWzw4ZklolQ2OIY6onHOaJ.BZuoLagolcfbUTeM.BCo.', 'Larry', 'Allen', '', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 'active', NULL, '2025-11-13 18:02:35', '2025-11-13 18:02:35'),
(21, 28, 'john@test.com', '$2a$10$6bLNQQmuSq9cSiXNR8xN4ulq55BGPPi.iyU7MdhVsTA0fcMbluknm', '', '', '', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 'active', '2025-11-17 14:02:24', '2025-11-13 18:11:29', '2025-11-17 14:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `app_user_role_assignments`
--

CREATE TABLE `app_user_role_assignments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `role_id` int DEFAULT NULL,
  `app_role_id` int DEFAULT NULL,
  `assigned_by` int DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_user_role_assignments`
--

INSERT INTO `app_user_role_assignments` (`id`, `user_id`, `role_id`, `app_role_id`, `assigned_by`, `assigned_at`) VALUES
(1, 9, 1, NULL, NULL, '2025-11-03 20:52:47'),
(2, 19, NULL, 1, NULL, '2025-11-12 19:02:48'),
(3, 1, NULL, 3, NULL, '2025-11-12 19:02:48'),
(4, 8, NULL, 3, NULL, '2025-11-12 19:02:48'),
(5, 9, NULL, 3, NULL, '2025-11-12 19:02:48');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int NOT NULL,
  `menu_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `display_order` int DEFAULT '0',
  `label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `menu_id`, `screen_id`, `display_order`, `label`, `icon`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 75, 1, 'Property Listings', 'home', 1, '2025-11-14 17:05:50', '2025-11-14 17:05:50'),
(4, 3, 62, 0, NULL, NULL, 1, '2025-11-14 17:31:34', '2025-11-14 17:31:34'),
(5, 3, 89, 1, NULL, NULL, 1, '2025-11-14 17:31:40', '2025-11-14 17:31:40'),
(6, 2, 75, 0, NULL, NULL, 1, '2025-11-14 17:32:34', '2025-11-14 17:32:34'),
(7, 2, 80, 1, NULL, NULL, 1, '2025-11-14 17:32:42', '2025-11-14 17:32:42'),
(8, 2, 58, 2, NULL, NULL, 1, '2025-11-14 17:32:50', '2025-11-14 17:32:50'),
(9, 2, 59, 3, NULL, NULL, 1, '2025-11-14 17:32:56', '2025-11-14 17:32:56'),
(10, 2, 94, 4, NULL, NULL, 1, '2025-11-14 17:43:11', '2025-11-14 17:43:11'),
(11, 2, 95, 5, NULL, NULL, 1, '2025-11-14 17:43:11', '2025-11-14 17:43:11'),
(12, 2, 65, 6, NULL, NULL, 1, '2025-11-14 17:43:11', '2025-11-14 17:43:11'),
(13, 2, 88, 7, NULL, NULL, 1, '2025-11-14 17:43:11', '2025-11-14 17:43:11'),
(14, 1, 58, 2, NULL, NULL, 1, '2025-11-14 17:58:22', '2025-11-14 17:58:22');

-- --------------------------------------------------------

--
-- Table structure for table `property_amenities`
--

CREATE TABLE `property_amenities` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('basic','features','safety','accessibility','outdoor','entertainment') COLLATE utf8mb4_unicode_ci DEFAULT 'basic',
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Icon name for UI',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_amenities`
--

INSERT INTO `property_amenities` (`id`, `name`, `category`, `icon`, `description`, `is_active`, `created_at`) VALUES
(1, 'WiFi', 'basic', 'Wifi', NULL, 1, '2025-11-12 20:09:13'),
(2, 'Kitchen', 'basic', 'ChefHat', NULL, 1, '2025-11-12 20:09:13'),
(3, 'Washer', 'basic', 'WashingMachine', NULL, 1, '2025-11-12 20:09:13'),
(4, 'Dryer', 'basic', 'Wind', NULL, 1, '2025-11-12 20:09:13'),
(5, 'Air Conditioning', 'basic', 'AirVent', NULL, 1, '2025-11-12 20:09:13'),
(6, 'Heating', 'basic', 'Flame', NULL, 1, '2025-11-12 20:09:13'),
(7, 'TV', 'basic', 'Tv', NULL, 1, '2025-11-12 20:09:13'),
(8, 'Hair Dryer', 'basic', 'Wind', NULL, 1, '2025-11-12 20:09:13'),
(9, 'Iron', 'basic', 'Shirt', NULL, 1, '2025-11-12 20:09:13'),
(10, 'Pool', 'features', 'Waves', NULL, 1, '2025-11-12 20:09:13'),
(11, 'Hot Tub', 'features', 'Bath', NULL, 1, '2025-11-12 20:09:13'),
(12, 'Gym', 'features', 'Dumbbell', NULL, 1, '2025-11-12 20:09:13'),
(13, 'EV Charger', 'features', 'BatteryCharging', NULL, 1, '2025-11-12 20:09:13'),
(14, 'BBQ Grill', 'features', 'Flame', NULL, 1, '2025-11-12 20:09:13'),
(15, 'Fireplace', 'features', 'Flame', NULL, 1, '2025-11-12 20:09:13'),
(16, 'Piano', 'features', 'Music', NULL, 1, '2025-11-12 20:09:13'),
(17, 'Workspace', 'features', 'Monitor', NULL, 1, '2025-11-12 20:09:13'),
(18, 'Smoke Alarm', 'safety', 'AlertTriangle', NULL, 1, '2025-11-12 20:09:13'),
(19, 'Carbon Monoxide Alarm', 'safety', 'AlertTriangle', NULL, 1, '2025-11-12 20:09:13'),
(20, 'Fire Extinguisher', 'safety', 'Shield', NULL, 1, '2025-11-12 20:09:13'),
(21, 'First Aid Kit', 'safety', 'Heart', NULL, 1, '2025-11-12 20:09:13'),
(22, 'Security Cameras', 'safety', 'Camera', NULL, 1, '2025-11-12 20:09:13'),
(23, 'Step-free Entry', 'accessibility', 'Home', NULL, 1, '2025-11-12 20:09:13'),
(24, 'Elevator', 'accessibility', 'ArrowUpDown', NULL, 1, '2025-11-12 20:09:13'),
(25, 'Wide Doorways', 'accessibility', 'DoorOpen', NULL, 1, '2025-11-12 20:09:13'),
(26, 'Accessible Parking', 'accessibility', 'ParkingCircle', NULL, 1, '2025-11-12 20:09:13'),
(27, 'Patio', 'outdoor', 'Trees', NULL, 1, '2025-11-12 20:09:13'),
(28, 'Balcony', 'outdoor', 'Home', NULL, 1, '2025-11-12 20:09:13'),
(29, 'Garden', 'outdoor', 'Flower', NULL, 1, '2025-11-12 20:09:13'),
(30, 'Beach Access', 'outdoor', 'Waves', NULL, 1, '2025-11-12 20:09:13'),
(31, 'Lake Access', 'outdoor', 'Waves', NULL, 1, '2025-11-12 20:09:13'),
(32, 'Netflix', 'entertainment', 'Tv', NULL, 1, '2025-11-12 20:09:13'),
(33, 'Board Games', 'entertainment', 'Gamepad2', NULL, 1, '2025-11-12 20:09:13'),
(34, 'Books', 'entertainment', 'Book', NULL, 1, '2025-11-12 20:09:13'),
(35, 'Sound System', 'entertainment', 'Music', NULL, 1, '2025-11-12 20:09:13');

-- --------------------------------------------------------

--
-- Table structure for table `property_availability`
--

CREATE TABLE `property_availability` (
  `id` int NOT NULL,
  `listing_id` int NOT NULL,
  `date` date NOT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `price_override` decimal(10,2) DEFAULT NULL COMMENT 'Special pricing for this date',
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int NOT NULL,
  `listing_id` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'S3 key or storage identifier',
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_primary` tinyint(1) DEFAULT '0' COMMENT 'Main listing photo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_listings`
--

CREATE TABLE `property_listings` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `user_id` int NOT NULL COMMENT 'Host/owner of the property',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `property_type` enum('house','apartment','condo','villa','cabin','cottage','townhouse','loft','other') COLLATE utf8mb4_unicode_ci DEFAULT 'apartment',
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL COMMENT 'For map display and proximity search',
  `longitude` decimal(11,8) DEFAULT NULL,
  `bedrooms` int DEFAULT '0',
  `bathrooms` decimal(3,1) DEFAULT '0.0' COMMENT 'Supports half baths (e.g., 2.5)',
  `beds` int DEFAULT '0',
  `guests_max` int DEFAULT '1',
  `square_feet` int DEFAULT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  `cleaning_fee` decimal(10,2) DEFAULT '0.00',
  `service_fee_percentage` decimal(5,2) DEFAULT '0.00' COMMENT 'Platform fee percentage',
  `min_nights` int DEFAULT '1',
  `max_nights` int DEFAULT '365',
  `check_in_time` time DEFAULT '15:00:00',
  `check_out_time` time DEFAULT '11:00:00',
  `cancellation_policy` enum('flexible','moderate','strict','super_strict') COLLATE utf8mb4_unicode_ci DEFAULT 'moderate',
  `status` enum('draft','pending_review','active','inactive','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `is_published` tinyint(1) DEFAULT '0',
  `is_instant_book` tinyint(1) DEFAULT '0' COMMENT 'Auto-approve bookings',
  `house_rules` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON or text of house rules',
  `additional_info` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_listing_amenities`
--

CREATE TABLE `property_listing_amenities` (
  `id` int NOT NULL,
  `listing_id` int NOT NULL,
  `amenity_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `publish_history`
--

CREATE TABLE `publish_history` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `version_id` int DEFAULT NULL,
  `action` enum('published','unpublished','reverted') COLLATE utf8mb4_unicode_ci NOT NULL,
  `published_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `level` int NOT NULL COMMENT '1=Master Admin, 2=Admin, 3=Editor',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `level`, `created_at`, `updated_at`) VALUES
(1, 'Master Admin', 'Full access to all sites and system settings', 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(2, 'Admin', 'Can manage assigned sites and their users', 2, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(3, 'Editor', 'Can edit content on assigned sites with limited permissions', 3, '2025-10-31 13:21:45', '2025-10-31 13:21:45');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `name`, `display_name`, `description`, `category`, `created_at`) VALUES
(1, 'content.create', 'Create Content', 'Can create posts, articles, or content', 'content', '2025-11-03 20:51:54'),
(2, 'content.edit', 'Edit Content', 'Can edit own content', 'content', '2025-11-03 20:51:54'),
(3, 'content.edit.all', 'Edit All Content', 'Can edit any user content', 'content', '2025-11-03 20:51:54'),
(4, 'content.delete', 'Delete Content', 'Can delete own content', 'content', '2025-11-03 20:51:54'),
(5, 'content.delete.all', 'Delete All Content', 'Can delete any user content', 'content', '2025-11-03 20:51:54'),
(6, 'content.publish', 'Publish Content', 'Can publish content', 'content', '2025-11-03 20:51:54'),
(7, 'comments.create', 'Create Comments', 'Can post comments', 'comments', '2025-11-03 20:51:54'),
(8, 'comments.edit', 'Edit Comments', 'Can edit own comments', 'comments', '2025-11-03 20:51:54'),
(9, 'comments.delete', 'Delete Comments', 'Can delete own comments', 'comments', '2025-11-03 20:51:54'),
(10, 'comments.moderate', 'Moderate Comments', 'Can moderate all comments', 'comments', '2025-11-03 20:51:54'),
(11, 'users.view', 'View Users', 'Can view user profiles', 'users', '2025-11-03 20:51:54'),
(12, 'users.follow', 'Follow Users', 'Can follow other users', 'users', '2025-11-03 20:51:54'),
(13, 'users.message', 'Message Users', 'Can send direct messages', 'users', '2025-11-03 20:51:54'),
(14, 'users.block', 'Block Users', 'Can block other users', 'users', '2025-11-03 20:51:54'),
(15, 'moderation.reports', 'Handle Reports', 'Can view and handle user reports', 'moderation', '2025-11-03 20:51:54'),
(16, 'moderation.ban', 'Ban Users', 'Can ban users from the app', 'moderation', '2025-11-03 20:51:54'),
(17, 'moderation.content', 'Moderate Content', 'Can moderate all content', 'moderation', '2025-11-03 20:51:54'),
(18, 'commerce.purchase', 'Make Purchases', 'Can purchase items', 'commerce', '2025-11-03 20:51:54'),
(19, 'commerce.sell', 'Sell Items', 'Can list items for sale', 'commerce', '2025-11-03 20:51:54'),
(20, 'commerce.refund', 'Process Refunds', 'Can process refunds', 'commerce', '2025-11-03 20:51:54'),
(21, 'analytics.view', 'View Analytics', 'Can view analytics and insights', 'analytics', '2025-11-03 20:51:54'),
(22, 'analytics.export', 'Export Data', 'Can export analytics data', 'analytics', '2025-11-03 20:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission_assignments`
--

CREATE TABLE `role_permission_assignments` (
  `id` int NOT NULL,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permission_assignments`
--

INSERT INTO `role_permission_assignments` (`id`, `role_id`, `permission_id`, `created_at`) VALUES
(1, 1, 7, '2025-11-03 20:52:36'),
(2, 1, 9, '2025-11-03 20:52:36'),
(3, 1, 8, '2025-11-03 20:52:36'),
(4, 1, 18, '2025-11-03 20:52:36'),
(5, 1, 1, '2025-11-03 20:52:36'),
(6, 1, 4, '2025-11-03 20:52:36'),
(7, 1, 2, '2025-11-03 20:52:36'),
(8, 1, 14, '2025-11-03 20:52:36'),
(9, 1, 12, '2025-11-03 20:52:36'),
(10, 1, 13, '2025-11-03 20:52:36'),
(11, 1, 11, '2025-11-03 20:52:36'),
(16, 2, 7, '2025-11-03 20:52:36'),
(17, 2, 9, '2025-11-03 20:52:36'),
(18, 2, 8, '2025-11-03 20:52:36'),
(19, 2, 10, '2025-11-03 20:52:36'),
(20, 2, 1, '2025-11-03 20:52:36'),
(21, 2, 4, '2025-11-03 20:52:36'),
(22, 2, 5, '2025-11-03 20:52:36'),
(23, 2, 2, '2025-11-03 20:52:36'),
(24, 2, 3, '2025-11-03 20:52:36'),
(25, 2, 17, '2025-11-03 20:52:36'),
(26, 2, 15, '2025-11-03 20:52:36'),
(27, 2, 14, '2025-11-03 20:52:36'),
(28, 2, 12, '2025-11-03 20:52:36'),
(29, 2, 13, '2025-11-03 20:52:36'),
(30, 2, 11, '2025-11-03 20:52:36'),
(31, 3, 21, '2025-11-03 20:52:36'),
(32, 3, 7, '2025-11-03 20:52:36'),
(33, 3, 9, '2025-11-03 20:52:36'),
(34, 3, 8, '2025-11-03 20:52:36'),
(35, 3, 18, '2025-11-03 20:52:36'),
(36, 3, 19, '2025-11-03 20:52:36'),
(37, 3, 1, '2025-11-03 20:52:36'),
(38, 3, 4, '2025-11-03 20:52:36'),
(39, 3, 2, '2025-11-03 20:52:36'),
(40, 3, 6, '2025-11-03 20:52:36'),
(41, 3, 14, '2025-11-03 20:52:36'),
(42, 3, 12, '2025-11-03 20:52:36'),
(43, 3, 13, '2025-11-03 20:52:36'),
(44, 3, 11, '2025-11-03 20:52:36'),
(46, 4, 22, '2025-11-03 20:52:36'),
(47, 4, 21, '2025-11-03 20:52:36'),
(48, 4, 7, '2025-11-03 20:52:36'),
(49, 4, 9, '2025-11-03 20:52:36'),
(50, 4, 8, '2025-11-03 20:52:36'),
(51, 4, 10, '2025-11-03 20:52:36'),
(52, 4, 18, '2025-11-03 20:52:36'),
(53, 4, 20, '2025-11-03 20:52:36'),
(54, 4, 19, '2025-11-03 20:52:36'),
(55, 4, 1, '2025-11-03 20:52:36'),
(56, 4, 4, '2025-11-03 20:52:36'),
(57, 4, 5, '2025-11-03 20:52:36'),
(58, 4, 2, '2025-11-03 20:52:36'),
(59, 4, 3, '2025-11-03 20:52:36'),
(60, 4, 6, '2025-11-03 20:52:36'),
(61, 4, 16, '2025-11-03 20:52:36'),
(62, 4, 17, '2025-11-03 20:52:36'),
(63, 4, 15, '2025-11-03 20:52:36'),
(64, 4, 14, '2025-11-03 20:52:36'),
(65, 4, 12, '2025-11-03 20:52:36'),
(66, 4, 13, '2025-11-03 20:52:36'),
(67, 4, 11, '2025-11-03 20:52:36');

-- --------------------------------------------------------

--
-- Table structure for table `screen_elements`
--

CREATE TABLE `screen_elements` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `element_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_editable_by_app_admin` tinyint(1) DEFAULT '1' COMMENT 'Can app admin edit this element content',
  `has_options` tinyint(1) DEFAULT '0' COMMENT 'Does this element have selectable options (dropdown, radio, etc)',
  `is_content_field` tinyint(1) DEFAULT '0' COMMENT 'Is this a content field (heading, paragraph, etc)',
  `is_input_field` tinyint(1) DEFAULT '1' COMMENT 'Is this an input field for mobile app users',
  `default_config` json DEFAULT NULL COMMENT 'Default configuration for this element type',
  `validation_rules` json DEFAULT NULL COMMENT 'Available validation rules',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `screen_elements`
--

INSERT INTO `screen_elements` (`id`, `name`, `element_type`, `category`, `icon`, `description`, `is_editable_by_app_admin`, `has_options`, `is_content_field`, `is_input_field`, `default_config`, `validation_rules`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Text Field', 'text_field', 'Input', 'Type', 'Single line text input', 1, 0, 0, 1, NULL, NULL, 1, 1, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(2, 'Text Area', 'text_area', 'Input', 'AlignLeft', 'Multi-line text input', 1, 0, 0, 1, NULL, NULL, 1, 2, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(3, 'Rich Text Editor', 'rich_text_editor', 'Content', 'FileText', 'Text area with formatting toolbar', 1, 0, 1, 0, NULL, NULL, 1, 3, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(4, 'Email Input', 'email_input', 'Input', 'Mail', 'Email address with validation', 1, 0, 0, 1, NULL, NULL, 1, 4, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(5, 'Phone Input', 'phone_input', 'Input', 'Phone', 'Phone number with formatting', 1, 0, 0, 1, NULL, NULL, 1, 5, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(6, 'URL Input', 'url_input', 'Input', 'Link', 'URL with validation', 1, 0, 0, 1, NULL, NULL, 1, 6, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(7, 'Password Input', 'password_input', 'Input', 'Lock', 'Masked password field', 0, 0, 0, 1, NULL, NULL, 1, 7, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(8, 'Number Input', 'number_input', 'Input', 'Hash', 'Numeric input with min/max', 1, 0, 0, 1, NULL, NULL, 1, 8, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(9, 'Currency Input', 'currency_input', 'Input', 'DollarSign', 'Money input with formatting', 1, 0, 0, 1, NULL, NULL, 1, 9, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(10, 'Dropdown', 'dropdown', 'Selection', 'ChevronDown', 'Single selection dropdown', 1, 1, 0, 1, NULL, NULL, 1, 10, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(11, 'Multi-Select', 'multi_select', 'Selection', 'ListChecks', 'Multiple selection dropdown', 1, 1, 0, 1, NULL, NULL, 1, 11, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(12, 'Radio Button', 'radio_button', 'Selection', 'Circle', 'Single choice from options', 1, 1, 0, 1, NULL, NULL, 1, 12, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(13, 'Checkbox', 'checkbox', 'Selection', 'CheckSquare', 'Multiple choice from options', 1, 1, 0, 1, NULL, NULL, 1, 13, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(14, 'Switch/Toggle', 'switch_toggle', 'Selection', 'ToggleLeft', 'On/off boolean toggle', 0, 0, 0, 1, NULL, NULL, 1, 14, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(15, 'Country Selector', 'country_selector', 'Selection', 'Globe', 'Country dropdown with flags', 0, 0, 0, 1, NULL, NULL, 1, 15, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(16, 'Language Selector', 'language_selector', 'Selection', 'Languages', 'Language picker', 0, 0, 0, 1, NULL, NULL, 1, 16, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(17, 'Date Picker', 'date_picker', 'DateTime', 'Calendar', 'Date selection', 0, 0, 0, 1, NULL, NULL, 1, 20, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(18, 'Time Picker', 'time_picker', 'DateTime', 'Clock', 'Time selection', 0, 0, 0, 1, NULL, NULL, 1, 21, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(19, 'DateTime Picker', 'datetime_picker', 'DateTime', 'CalendarClock', 'Combined date and time', 0, 0, 0, 1, NULL, NULL, 1, 22, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(20, 'Calendar', 'calendar', 'DateTime', 'CalendarDays', 'Full calendar view', 0, 0, 0, 1, NULL, NULL, 1, 23, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(21, 'File Upload', 'file_upload', 'Media', 'Upload', 'Single file upload', 0, 0, 0, 1, NULL, NULL, 1, 30, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(22, 'Image Upload', 'image_upload', 'Media', 'Image', 'Image with preview', 0, 0, 0, 1, NULL, NULL, 1, 31, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(23, 'Video Upload', 'video_upload', 'Media', 'Video', 'Video file upload', 0, 0, 0, 1, NULL, NULL, 1, 32, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(24, 'Audio Recorder', 'audio_recorder', 'Media', 'Mic', 'Record audio', 0, 0, 0, 1, NULL, NULL, 1, 33, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(25, 'Camera Capture', 'camera_capture', 'Media', 'Camera', 'Take photo directly', 0, 0, 0, 1, NULL, NULL, 1, 34, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(26, 'Signature Pad', 'signature_pad', 'Media', 'PenTool', 'Digital signature', 0, 0, 0, 1, NULL, NULL, 1, 35, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(27, 'Heading', 'heading', 'Content', 'Heading', 'Page heading text', 1, 0, 1, 0, NULL, NULL, 1, 40, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(28, 'Paragraph', 'paragraph', 'Content', 'AlignLeft', 'Paragraph text content', 1, 0, 1, 0, NULL, NULL, 1, 41, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(29, 'Rich Text Display', 'rich_text_display', 'Content', 'FileText', 'Formatted content display', 1, 0, 1, 0, NULL, NULL, 1, 42, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(30, 'Icon', 'icon', 'Content', 'Star', 'Display icon', 1, 0, 1, 0, NULL, NULL, 1, 43, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(31, 'Divider', 'divider', 'Content', 'Minus', 'Visual separation line', 0, 0, 1, 0, NULL, NULL, 1, 44, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(32, 'Spacer', 'spacer', 'Content', 'Space', 'Empty space', 0, 0, 1, 0, NULL, NULL, 1, 45, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(33, 'Button', 'button', 'Interactive', 'MousePointer', 'Action button', 1, 0, 1, 0, NULL, NULL, 1, 50, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(34, 'Link', 'link', 'Interactive', 'Link2', 'Hyperlink', 1, 0, 1, 0, NULL, NULL, 1, 51, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(35, 'Slider', 'slider', 'Interactive', 'SlidersHorizontal', 'Range selection', 1, 0, 0, 1, NULL, NULL, 1, 52, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(36, 'Stepper', 'stepper', 'Interactive', 'PlusCircle', 'Increment/decrement', 1, 0, 0, 1, NULL, NULL, 1, 53, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(37, 'Rating', 'rating', 'Interactive', 'Star', 'Star rating component', 0, 0, 0, 1, NULL, NULL, 1, 54, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(38, 'Color Picker', 'color_picker', 'Interactive', 'Palette', 'Color selection', 0, 0, 0, 1, NULL, NULL, 1, 55, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(39, 'Address Input', 'address_input', 'Advanced', 'MapPin', 'Structured address fields', 1, 0, 0, 1, NULL, NULL, 1, 60, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(40, 'Location Picker', 'location_picker', 'Advanced', 'Map', 'GPS/map location', 0, 0, 0, 1, NULL, NULL, 1, 61, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(41, 'Barcode Scanner', 'barcode_scanner', 'Advanced', 'ScanLine', 'QR/barcode scanning', 0, 0, 0, 1, NULL, NULL, 1, 62, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(42, 'OTP Input', 'otp_input', 'Advanced', 'ShieldCheck', 'One-time password', 0, 0, 0, 1, NULL, NULL, 1, 63, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(43, 'Tags Input', 'tags_input', 'Advanced', 'Tags', 'Multiple tag entries', 1, 0, 0, 1, NULL, NULL, 1, 64, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(44, 'Progress Bar', 'progress_bar', 'Advanced', 'TrendingUp', 'Show progress', 1, 0, 1, 0, NULL, NULL, 1, 65, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(45, 'Timer/Countdown', 'timer_countdown', 'Advanced', 'Timer', 'Countdown display', 1, 0, 1, 0, NULL, NULL, 1, 66, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(46, 'Chart/Graph', 'chart_graph', 'Advanced', 'BarChart', 'Data visualization', 1, 0, 1, 0, NULL, NULL, 1, 67, '2025-10-31 18:12:54', '2025-10-31 18:12:54'),
(47, 'Image Display', 'image_display', 'Media', 'image', 'Display a static image (logo, banner, photo)', 1, 0, 1, 0, '{\"width\": \"100%\", \"height\": \"auto\", \"altText\": \"Image\", \"imageUrl\": \"\", \"alignment\": \"center\"}', NULL, 1, 0, '2025-11-03 18:07:47', '2025-11-03 18:07:47'),
(48, 'Star Rating Display', 'star_rating_display', 'Display', 'Star', 'Display star rating (read-only)', 1, 0, 0, 0, '{\"size\": \"medium\", \"color\": \"#FFD700\", \"max_stars\": 5, \"show_count\": true, \"show_value\": true}', NULL, 1, 47, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(49, 'Service Card', 'service_card', 'Display', 'CreditCard', 'Display service offering card', 1, 0, 0, 0, '{\"card_style\": \"elevated\", \"show_image\": true, \"show_price\": true, \"show_rating\": true, \"show_distance\": true, \"show_provider\": true}', NULL, 1, 48, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(50, 'Job Status Badge', 'job_status_badge', 'Display', 'Tag', 'Display job status with color coding', 1, 0, 0, 0, '{\"size\": \"medium\", \"statuses\": [{\"color\": \"#FFA500\", \"label\": \"Pending\", \"value\": \"pending\"}, {\"color\": \"#4CAF50\", \"label\": \"Accepted\", \"value\": \"accepted\"}, {\"color\": \"#2196F3\", \"label\": \"In Progress\", \"value\": \"in_progress\"}, {\"color\": \"#4CAF50\", \"label\": \"Completed\", \"value\": \"completed\"}, {\"color\": \"#F44336\", \"label\": \"Cancelled\", \"value\": \"cancelled\"}], \"show_icon\": true}', NULL, 1, 49, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(51, 'Availability Grid', 'availability_grid', 'Input', 'Calendar', 'Select available time slots for the week', 1, 0, 0, 1, '{\"days\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\", \"Sunday\"], \"time_slots\": [\"Morning\", \"Afternoon\", \"Evening\"], \"time_format\": \"12h\", \"allow_custom_times\": true}', NULL, 1, 50, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(52, 'Quote Builder', 'quote_builder', 'Input', 'FileText', 'Build itemized quote with line items', 1, 0, 0, 1, '{\"currency\": \"USD\", \"show_tax\": true, \"tax_rate\": 0, \"show_total\": true, \"show_subtotal\": true, \"allow_add_items\": true, \"allow_remove_items\": true}', NULL, 1, 51, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(53, 'Payment Method Card', 'payment_method_card', 'Display', 'CreditCard', 'Display saved payment method', 1, 0, 0, 0, '{\"card_style\": \"outlined\", \"show_brand\": true, \"show_expiry\": true, \"allow_delete\": true, \"show_last_four\": true, \"show_default_badge\": true}', NULL, 1, 52, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(54, 'Badge Display', 'badge_display', 'Display', 'Award', 'Display verification and achievement badges', 1, 0, 0, 0, '{\"size\": \"small\", \"layout\": \"horizontal\", \"badge_types\": [{\"icon\": \"CheckCircle\", \"type\": \"verified\", \"color\": \"#4CAF50\", \"label\": \"Verified\"}, {\"icon\": \"Shield\", \"type\": \"background_check\", \"color\": \"#2196F3\", \"label\": \"Background Check\"}, {\"icon\": \"Star\", \"type\": \"top_rated\", \"color\": \"#FFD700\", \"label\": \"Top Rated\"}, {\"icon\": \"Award\", \"type\": \"pro\", \"color\": \"#9C27B0\", \"label\": \"Pro\"}], \"show_labels\": true}', NULL, 1, 53, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(55, 'Review Card', 'review_card', 'Display', 'MessageSquare', 'Display customer review with rating and comment', 1, 0, 0, 0, '{\"show_date\": true, \"show_name\": true, \"allow_reply\": false, \"date_format\": \"relative\", \"show_avatar\": true, \"show_rating\": true, \"show_helpful_count\": true}', NULL, 1, 54, '2025-11-07 15:12:39', '2025-11-07 15:12:39'),
(56, 'Account Balance Display', 'account_balance_display', 'Display', 'DollarSign', 'Display account balance with currency', 1, 0, 0, 0, '{\"font_size\": \"large\", \"decimal_places\": 2, \"show_eye_toggle\": true, \"show_currency_code\": true, \"show_currency_symbol\": true, \"show_pending_balance\": false, \"show_available_balance\": true}', NULL, 1, 55, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(57, 'Transaction List Item', 'transaction_list_item', 'Display', 'ArrowRightLeft', 'Display transaction with amount, date, and status', 1, 0, 0, 0, '{\"show_date\": true, \"date_format\": \"relative\", \"show_amount\": true, \"show_avatar\": true, \"show_currency\": true, \"show_status_badge\": true, \"highlight_incoming\": true, \"show_recipient_name\": true}', NULL, 1, 56, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(58, 'Currency Selector', 'currency_selector', 'Input', 'Globe', 'Select currency with flags and exchange rates', 1, 0, 0, 1, '{\"searchable\": true, \"show_flags\": true, \"popular_currencies\": [\"USD\", \"EUR\", \"GBP\", \"JPY\", \"CAD\", \"AUD\"], \"show_currency_code\": true, \"show_currency_name\": true, \"show_exchange_rate\": true}', NULL, 1, 57, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(59, 'Amount Input with Currency', 'amount_input_currency', 'Input', 'DollarSign', 'Large amount input with currency symbol', 1, 0, 0, 1, '{\"font_size\": \"xlarge\", \"max_amount\": 10000, \"min_amount\": 1, \"allow_decimal\": true, \"decimal_places\": 2, \"show_word_format\": true, \"show_currency_code\": true, \"show_currency_symbol\": true}', NULL, 1, 58, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(60, 'Recipient Card', 'recipient_card', 'Display', 'User', 'Display saved recipient with avatar and details', 1, 0, 0, 0, '{\"show_name\": true, \"card_style\": \"elevated\", \"show_avatar\": true, \"show_bank_name\": true, \"show_last_sent\": true, \"show_account_number\": true, \"show_favorite_badge\": true}', NULL, 1, 59, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(61, 'Transaction Status Timeline', 'transaction_status_timeline', 'Display', 'GitBranch', 'Show transaction progress steps', 1, 0, 0, 0, '{\"steps\": [{\"key\": \"initiated\", \"icon\": \"Circle\", \"label\": \"Initiated\"}, {\"key\": \"processing\", \"icon\": \"Clock\", \"label\": \"Processing\"}, {\"key\": \"completed\", \"icon\": \"CheckCircle\", \"label\": \"Completed\"}, {\"key\": \"failed\", \"icon\": \"XCircle\", \"label\": \"Failed\"}], \"orientation\": \"vertical\", \"show_timestamps\": true, \"show_descriptions\": true}', NULL, 1, 60, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(62, 'Exchange Rate Display', 'exchange_rate_display', 'Display', 'TrendingUp', 'Show current exchange rate with live updates', 1, 0, 0, 0, '{\"show_rate\": true, \"show_trend\": true, \"auto_refresh\": true, \"decimal_places\": 4, \"refresh_interval\": 30, \"show_to_currency\": true, \"show_last_updated\": true, \"show_from_currency\": true}', NULL, 1, 61, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(63, 'Fee Breakdown', 'fee_breakdown', 'Display', 'Receipt', 'Itemized fee display', 1, 0, 0, 0, '{\"show_total\": true, \"show_subtotal\": true, \"show_you_send\": true, \"highlight_total\": true, \"show_service_fee\": true, \"show_exchange_fee\": true, \"show_transfer_fee\": true, \"show_recipient_gets\": true}', NULL, 1, 62, '2025-11-07 15:20:52', '2025-11-07 15:20:52'),
(64, 'Tab Bar', 'tab_bar', 'Navigation', 'Menu', 'Bottom navigation tabs', 1, 0, 0, 0, '{\"tabs\": [{\"key\": \"home\", \"icon\": \"Home\", \"label\": \"Home\"}, {\"key\": \"search\", \"icon\": \"Search\", \"label\": \"Search\"}, {\"key\": \"profile\", \"icon\": \"User\", \"label\": \"Profile\"}], \"position\": \"bottom\", \"show_labels\": true, \"active_color\": \"#007AFF\", \"inactive_color\": \"#8E8E93\"}', NULL, 1, 64, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(65, 'Navigation Header', 'navigation_header', 'Navigation', 'Navigation', 'Top navigation bar with title and actions', 1, 0, 0, 0, '{\"show_menu\": false, \"show_title\": true, \"text_color\": \"#000000\", \"show_search\": false, \"background_color\": \"#FFFFFF\", \"show_back_button\": true}', NULL, 1, 65, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(66, 'Drawer Menu', 'drawer_menu', 'Navigation', 'Menu', 'Side drawer navigation menu', 1, 0, 0, 0, '{\"position\": \"left\", \"menu_items\": [{\"key\": \"home\", \"icon\": \"Home\", \"label\": \"Home\"}, {\"key\": \"settings\", \"icon\": \"Settings\", \"label\": \"Settings\"}], \"show_header\": true, \"show_user_info\": true}', NULL, 1, 66, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(67, 'Breadcrumb', 'breadcrumb', 'Navigation', 'ChevronRight', 'Breadcrumb navigation trail', 1, 0, 0, 0, '{\"max_items\": 5, \"separator\": \"/\", \"show_home\": true}', NULL, 1, 67, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(68, 'Pagination', 'pagination', 'Navigation', 'MoreHorizontal', 'Page navigation controls', 1, 0, 0, 0, '{\"items_per_page\": 10, \"show_prev_next\": true, \"show_first_last\": true, \"show_page_numbers\": true}', NULL, 1, 68, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(69, 'Stepper Navigation', 'stepper_navigation', 'Navigation', 'GitCommit', 'Multi-step process navigation', 1, 0, 0, 0, '{\"steps\": [{\"key\": \"step1\", \"label\": \"Step 1\"}, {\"key\": \"step2\", \"label\": \"Step 2\"}, {\"key\": \"step3\", \"label\": \"Step 3\"}], \"allow_skip\": false, \"orientation\": \"horizontal\", \"show_numbers\": true}', NULL, 1, 69, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(70, 'Avatar', 'avatar', 'Display', 'User', 'User avatar/profile picture', 1, 0, 0, 0, '{\"size\": \"medium\", \"shape\": \"circle\", \"show_badge\": false, \"show_border\": true, \"fallback_icon\": \"User\"}', NULL, 1, 70, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(71, 'Badge', 'badge', 'Display', 'Tag', 'Small status or count badge', 1, 0, 0, 0, '{\"color\": \"#FF3B30\", \"variant\": \"default\", \"position\": \"top-right\", \"max_count\": 99, \"show_count\": true}', NULL, 1, 71, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(72, 'Chip', 'chip', 'Display', 'Tag', 'Compact element for tags or filters', 1, 0, 0, 0, '{\"size\": \"medium\", \"color\": \"#007AFF\", \"variant\": \"filled\", \"show_icon\": false, \"show_close\": false}', NULL, 1, 72, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(73, 'Alert Banner', 'alert_banner', 'Display', 'AlertCircle', 'Alert or notification banner', 1, 0, 0, 0, '{\"type\": \"info\", \"duration\": 5000, \"position\": \"top\", \"show_icon\": true, \"dismissible\": true, \"auto_dismiss\": false}', NULL, 1, 73, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(74, 'Tooltip', 'tooltip', 'Display', 'Info', 'Hover tooltip with information', 1, 0, 0, 0, '{\"delay\": 200, \"trigger\": \"hover\", \"position\": \"top\", \"show_arrow\": true}', NULL, 1, 74, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(75, 'Skeleton Loader', 'skeleton_loader', 'Display', 'Loader', 'Loading placeholder skeleton', 1, 0, 0, 0, '{\"rows\": 3, \"variant\": \"text\", \"animation\": \"pulse\", \"show_avatar\": false}', NULL, 1, 75, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(76, 'Empty State', 'empty_state', 'Display', 'Inbox', 'Empty state placeholder', 1, 0, 0, 0, '{\"icon\": \"Inbox\", \"title\": \"No items found\", \"show_icon\": true, \"description\": \"Try adjusting your filters\", \"show_action\": true, \"action_label\": \"Add New\"}', NULL, 1, 76, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(77, 'Accordion', 'accordion', 'Display', 'ChevronDown', 'Expandable content sections', 1, 0, 0, 0, '{\"show_icon\": true, \"icon_position\": \"right\", \"allow_multiple\": false, \"default_expanded\": false}', NULL, 1, 77, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(78, 'Carousel', 'carousel', 'Display', 'Image', 'Image or content carousel', 1, 0, 0, 0, '{\"interval\": 3000, \"auto_play\": false, \"show_arrows\": true, \"infinite_loop\": true, \"show_indicators\": true}', NULL, 1, 78, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(79, 'Timeline', 'timeline', 'Display', 'Clock', 'Vertical timeline display', 1, 0, 0, 0, '{\"show_dates\": true, \"show_icons\": true, \"orientation\": \"vertical\", \"alternate_sides\": false}', NULL, 1, 79, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(80, 'Table', 'table', 'Display', 'Table', 'Data table display', 1, 0, 0, 0, '{\"striped\": true, \"sortable\": true, \"paginated\": true, \"filterable\": false, \"show_header\": true, \"rows_per_page\": 10}', NULL, 1, 80, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(81, 'Data Grid', 'data_grid', 'Display', 'Grid', 'Grid layout for items', 1, 0, 0, 0, '{\"gap\": 16, \"columns\": 2, \"responsive\": true, \"min_column_width\": 150}', NULL, 1, 81, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(82, 'Map View', 'map_view', 'Display', 'Map', 'Interactive map display', 1, 0, 0, 0, '{\"allow_pan\": true, \"allow_zoom\": true, \"default_zoom\": 12, \"show_markers\": true, \"show_controls\": true}', NULL, 1, 82, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(83, 'Video Player', 'video_player', 'Media', 'Video', 'Video player with controls', 1, 0, 0, 0, '{\"loop\": false, \"muted\": false, \"auto_play\": false, \"show_controls\": true, \"show_fullscreen\": true}', NULL, 1, 83, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(84, 'Audio Player', 'audio_player', 'Media', 'Music', 'Audio player with controls', 1, 0, 0, 0, '{\"show_volume\": true, \"show_controls\": true, \"show_playlist\": false, \"show_progress\": true}', NULL, 1, 84, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(85, 'QR Code Display', 'qr_code_display', 'Display', 'QrCode', 'Display QR code', 1, 0, 0, 0, '{\"size\": 200, \"background_color\": \"#FFFFFF\", \"error_correction\": \"M\", \"foreground_color\": \"#000000\"}', NULL, 1, 85, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(86, 'Search Bar', 'search_bar', 'Input', 'Search', 'Search input with icon', 1, 0, 0, 1, '{\"debounce\": 300, \"show_icon\": true, \"show_clear\": true, \"placeholder\": \"Search...\", \"min_characters\": 2}', NULL, 1, 86, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(87, 'Autocomplete', 'autocomplete', 'Input', 'Search', 'Input with suggestions', 1, 0, 0, 1, '{\"show_icon\": true, \"allow_custom\": false, \"min_characters\": 2, \"max_suggestions\": 5}', NULL, 1, 87, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(88, 'Range Slider', 'range_slider', 'Input', 'SlidersHorizontal', 'Range selection slider', 1, 0, 0, 1, '{\"max\": 100, \"min\": 0, \"step\": 1, \"show_value\": true, \"show_labels\": true, \"dual_handles\": false}', NULL, 1, 88, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(89, 'Star Rating Input', 'star_rating_input', 'Input', 'Star', 'Star rating input', 1, 0, 0, 1, '{\"size\": \"medium\", \"color\": \"#FFD700\", \"max_stars\": 5, \"allow_half\": false, \"show_value\": true}', NULL, 1, 89, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(90, 'Image Picker', 'image_picker', 'Input', 'Image', 'Multiple image selection', 1, 0, 0, 1, '{\"max_images\": 5, \"max_size_mb\": 10, \"allow_camera\": true, \"show_preview\": true, \"allow_gallery\": true}', NULL, 1, 90, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(91, 'Video Picker', 'video_picker', 'Input', 'Video', 'Video file selection', 1, 0, 0, 1, '{\"max_videos\": 1, \"max_size_mb\": 50, \"allow_camera\": true, \"allow_gallery\": true, \"max_duration_seconds\": 60}', NULL, 1, 90, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(92, 'Document Picker', 'document_picker', 'Input', 'FileText', 'Document file selection', 1, 0, 0, 1, '{\"max_files\": 3, \"max_size_mb\": 10, \"show_preview\": true, \"allowed_types\": [\"pdf\", \"doc\", \"docx\", \"txt\"]}', NULL, 1, 91, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(93, 'Rich Text Editor', 'rich_text_input', 'Input', 'Type', 'Rich text editing input', 1, 0, 0, 1, '{\"toolbar\": [\"bold\", \"italic\", \"underline\", \"link\", \"list\"], \"max_height\": 400, \"min_height\": 150, \"placeholder\": \"Enter text...\"}', NULL, 1, 92, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(94, 'Code Editor', 'code_editor', 'Input', 'Code', 'Code editing input', 1, 0, 0, 1, '{\"theme\": \"light\", \"language\": \"javascript\", \"line_numbers\": true, \"auto_complete\": true, \"syntax_highlighting\": true}', NULL, 1, 93, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(95, 'Mention Input', 'mention_input', 'Input', 'AtSign', 'Input with @mentions', 1, 0, 0, 1, '{\"trigger\": \"@\", \"max_suggestions\": 5, \"show_suggestions\": true, \"highlight_mentions\": true}', NULL, 1, 94, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(96, 'Hashtag Input', 'hashtag_input', 'Input', 'Hash', 'Input with #hashtags', 1, 0, 0, 1, '{\"trigger\": \"#\", \"max_suggestions\": 5, \"show_suggestions\": true, \"highlight_hashtags\": true}', NULL, 1, 95, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(97, 'Modal', 'modal', 'Interactive', 'Square', 'Modal dialog overlay', 1, 0, 0, 0, '{\"size\": \"medium\", \"centered\": true, \"closable\": true, \"show_close_button\": true, \"backdrop_dismissible\": true}', NULL, 1, 96, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(98, 'Bottom Sheet', 'bottom_sheet', 'Interactive', 'PanelBottom', 'Bottom sliding panel', 1, 0, 0, 0, '{\"height\": \"auto\", \"dismissible\": true, \"show_handle\": true, \"snap_points\": [0.5, 0.9]}', NULL, 1, 97, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(99, 'Action Sheet', 'action_sheet', 'Interactive', 'List', 'Action selection sheet', 1, 0, 0, 0, '{\"title\": \"Choose an action\", \"cancelable\": true, \"show_icons\": true, \"destructive_index\": -1}', NULL, 1, 98, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(100, 'Context Menu', 'context_menu', 'Interactive', 'MoreVertical', 'Right-click context menu', 1, 0, 0, 0, '{\"trigger\": \"right-click\", \"show_icons\": true, \"close_on_select\": true}', NULL, 1, 99, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(101, 'Popover', 'popover', 'Interactive', 'MessageSquare', 'Popover content overlay', 1, 0, 0, 0, '{\"trigger\": \"click\", \"position\": \"bottom\", \"show_arrow\": true, \"close_on_outside_click\": true}', NULL, 1, 100, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(102, 'Snackbar', 'snackbar', 'Interactive', 'MessageCircle', 'Temporary notification message', 1, 0, 0, 0, '{\"duration\": 3000, \"position\": \"bottom\", \"dismissible\": true, \"action_label\": \"\"}', NULL, 1, 101, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(103, 'Toast', 'toast', 'Interactive', 'Bell', 'Toast notification', 1, 0, 0, 0, '{\"type\": \"info\", \"duration\": 3000, \"position\": \"top-right\", \"show_icon\": true, \"dismissible\": true}', NULL, 1, 102, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(104, 'Pull to Refresh', 'pull_to_refresh', 'Interactive', 'RefreshCw', 'Pull down to refresh content', 1, 0, 0, 0, '{\"enabled\": true, \"threshold\": 80, \"show_spinner\": true}', NULL, 1, 103, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(105, 'Infinite Scroll', 'infinite_scroll', 'Interactive', 'ArrowDown', 'Load more on scroll', 1, 0, 0, 0, '{\"threshold\": 200, \"show_loader\": true, \"initial_load\": true}', NULL, 1, 104, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(106, 'Swipe Actions', 'swipe_actions', 'Interactive', 'Move', 'Swipeable list item actions', 1, 0, 0, 0, '{\"threshold\": 0.5, \"left_actions\": [], \"right_actions\": [{\"key\": \"delete\", \"icon\": \"Trash\", \"color\": \"#FF3B30\", \"label\": \"Delete\"}]}', NULL, 1, 105, '2025-11-07 16:25:08', '2025-11-07 16:25:08'),
(107, 'Header Bar', 'header_bar', 'Layout', 'LayoutDashboard', 'Top navigation bar with menu icons', 1, 0, 1, 0, NULL, NULL, 0, 56, '2025-11-14 18:42:19', '2025-11-17 14:08:39');

-- --------------------------------------------------------

--
-- Table structure for table `screen_element_instances`
--

CREATE TABLE `screen_element_instances` (
  `id` int NOT NULL,
  `screen_id` int NOT NULL,
  `element_id` int NOT NULL,
  `field_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unique key for this field instance',
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `placeholder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_value` text COLLATE utf8mb4_unicode_ci,
  `is_required` tinyint(1) DEFAULT '0',
  `is_readonly` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `config` json DEFAULT NULL COMMENT 'Element-specific configuration',
  `validation_rules` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `screen_element_instances`
--

INSERT INTO `screen_element_instances` (`id`, `screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`, `updated_at`) VALUES
(156, 17, 27, 'onboarding_heading', 'Welcome!', '', '', 0, 0, 0, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(157, 17, 47, 'feature_image_1', 'Feature Image 1', '', '', 0, 0, 1, '\"{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"auto\\\",\\\"altText\\\":\\\"Feature 1\\\",\\\"imageUrl\\\":\\\"https://placehold.co/300x200?text=Feature+1\\\",\\\"alignment\\\":\\\"center\\\"}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:51:43'),
(158, 17, 27, 'feature_1_title', 'Easy to Use', '', '', 0, 0, 2, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(159, 17, 28, 'feature_1_description', 'Our app is designed with simplicity in mind. Get started in seconds!', '', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(160, 17, 47, 'feature_image_2', 'Feature Image 2', '', '', 0, 0, 4, '\"{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"auto\\\",\\\"altText\\\":\\\"Feature 2\\\",\\\"imageUrl\\\":\\\"https://placehold.co/300x200?text=Feature+2\\\",\\\"alignment\\\":\\\"center\\\"}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:51:43'),
(161, 17, 27, 'feature_2_title', 'Powerful Features', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(162, 17, 28, 'feature_2_description', 'Access all the tools you need to be productive and efficient.', '', '', 0, 0, 6, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(163, 17, 47, 'feature_image_3', 'Feature Image 3', '', '', 0, 0, 7, '\"{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"auto\\\",\\\"altText\\\":\\\"Feature 3\\\",\\\"imageUrl\\\":\\\"https://placehold.co/300x200?text=Feature+3\\\",\\\"alignment\\\":\\\"center\\\"}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:51:43'),
(164, 17, 27, 'feature_3_title', 'Secure & Private', '', '', 0, 0, 8, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(165, 17, 28, 'feature_3_description', 'Your data is protected with industry-standard security measures.', '', '', 0, 0, 9, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(166, 17, 33, 'get_started_button', 'Get Started', '', '', 0, 0, 10, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(167, 17, 28, 'skip_link', 'Skip', '', '', 0, 0, 11, '\"{}\"', '\"{}\"', '2025-11-03 18:46:04', '2025-11-03 18:46:32'),
(168, 18, 27, 'login_heading', 'Welcome Back', '', '', 0, 0, 0, '\"{}\"', '\"{}\"', '2025-11-04 17:22:20', '2025-11-04 17:22:29'),
(169, 18, 28, 'login_description', 'Please sign in to continue.', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-04 17:22:20', '2025-11-04 17:22:29'),
(170, 18, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 2, '\"{}\"', '\"{}\"', '2025-11-04 17:22:20', '2025-11-04 17:22:29'),
(171, 18, 1, 'password', 'Password', 'Enter your password', '', 1, 0, 3, '\"{}\"', '\"{}\"', '2025-11-04 17:22:20', '2025-11-04 17:22:29'),
(172, 18, 33, 'login_button', 'Sign In', '', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-04 17:22:20', '2025-11-04 17:22:29'),
(173, 18, 28, 'forgot_password_link', 'Forgot your password?', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 17:22:21', '2025-11-04 17:22:29'),
(174, 46, 47, 'app_logo', 'App Logo', NULL, NULL, 0, 0, 0, '{\"width\": \"200px\", \"height\": \"200px\", \"altText\": \"App Logo\", \"imageUrl\": \"https://placehold.co/200x200?text=Logo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(175, 46, 27, 'app_name', 'App Name', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(176, 46, 28, 'app_version', 'Version 1.0', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(177, 46, 28, 'loading_text', 'Loading...', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(184, 48, 27, 'signup_heading', 'Create Account', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(185, 48, 28, 'signup_description', 'Join us today and get started!', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(186, 48, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(187, 48, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(188, 48, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(189, 48, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(190, 48, 1, 'password', 'Password', 'Create a strong password', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(191, 48, 1, 'confirm_password', 'Confirm Password', 'Re-enter your password', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(192, 48, 33, 'signup_button', 'Sign Up', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(193, 48, 28, 'login_link', 'Already have an account? Login', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(194, 49, 27, 'verify_heading', 'Verify Your Email', '', '', 0, 0, 0, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-04 21:33:34'),
(195, 49, 28, 'verify_description', 'We sent a verification code to your email address. Please enter it below.', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-04 21:33:34'),
(196, 49, 1, 'verification_code', 'Verification Code', 'Enter 6-digit code', '', 1, 0, 2, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-04 21:33:34'),
(197, 49, 33, 'verify_button', 'Verify Email', '', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-04 21:33:34'),
(198, 49, 28, 'resend_link', 'Did not receive code? Resend', '', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-04 21:33:34'),
(199, 50, 27, 'forgot_heading', 'Forgot Password?', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(200, 50, 28, 'forgot_description', 'Enter your email address and we will send you a link to reset your password.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(201, 50, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(202, 50, 33, 'send_button', 'Send Reset Link', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(203, 50, 28, 'login_link', 'Remember your password? Login', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(204, 51, 27, 'reset_heading', 'Reset Password', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(205, 51, 28, 'reset_description', 'Please enter your new password below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(206, 51, 1, 'new_password', 'New Password', 'Enter new password', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(207, 51, 1, 'confirm_password', 'Confirm Password', 'Re-enter new password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(208, 51, 33, 'reset_button', 'Reset Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(209, 55, 27, 'checkout_heading', 'Checkout', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(210, 55, 27, 'shipping_heading', 'Shipping Address', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(211, 55, 1, 'shipping_name', 'Full Name', 'Enter full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(212, 55, 1, 'address_line1', 'Address Line 1', 'Street address', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(213, 55, 1, 'address_line2', 'Address Line 2', 'Apt, suite, etc. (optional)', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(214, 55, 1, 'city', 'City', 'City', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(215, 55, 1, 'state', 'State/Province', 'State', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(216, 55, 1, 'zip', 'ZIP/Postal Code', 'ZIP code', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(217, 55, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 1, 0, 8, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(218, 55, 27, 'payment_heading', 'Payment Method', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(219, 55, 28, 'payment_method', 'Credit/Debit Card', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(220, 55, 33, 'place_order_button', 'Place Order', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(221, 58, 27, 'profile_heading', 'My Profile', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(222, 58, 28, 'profile_description', 'Update your personal information below.', '', '', 0, 0, 2, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(223, 58, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 3, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(224, 58, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 4, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(225, 58, 4, 'email', 'Email', 'your.email@example.com', '', 1, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(226, 58, 5, 'phone', 'Phone', '(555) 123-4567', '', 0, 0, 6, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(227, 58, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 7, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(228, 58, 33, 'save_button', 'Save Changes', '', '', 0, 0, 8, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:57'),
(229, 59, 47, 'profile_photo', 'Profile Photo', 'Upload profile photo', '', 0, 0, 1, '\"{\\\"width\\\":\\\"150px\\\",\\\"height\\\":\\\"150px\\\",\\\"altText\\\":\\\"Profile Photo\\\",\\\"imageUrl\\\":\\\"https://placehold.co/150x150?text=Photo\\\",\\\"alignment\\\":\\\"center\\\"}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(230, 59, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 2, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(231, 59, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 3, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(232, 59, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 4, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(233, 59, 5, 'phone', 'Phone Number', '+1 (555) 123-4567', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(234, 59, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 6, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(235, 59, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(236, 59, 10, 'gender', 'Gender', 'Select your gender', '', 0, 0, 8, '\"{\\\"options\\\":[{\\\"label\\\":\\\"Male\\\",\\\"value\\\":\\\"male\\\"},{\\\"label\\\":\\\"Female\\\",\\\"value\\\":\\\"female\\\"},{\\\"label\\\":\\\"Non-binary\\\",\\\"value\\\":\\\"non_binary\\\"},{\\\"label\\\":\\\"Prefer not to say\\\",\\\"value\\\":\\\"prefer_not_to_say\\\"}]}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(237, 59, 33, 'save_button', 'Save Changes', '', '', 0, 0, 9, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(238, 59, 34, 'change_password_link', 'Change Password', '', '', 0, 0, 10, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:48:17'),
(239, 60, 27, 'notifications_heading', 'Notifications', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(240, 60, 28, 'notifications_description', 'Stay updated with your latest activities', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(241, 60, 28, 'notification_1', 'You have a new message', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(242, 60, 28, 'notification_2', 'Your order has been shipped', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(243, 60, 28, 'notification_3', 'New friend request', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(244, 60, 33, 'mark_read_button', 'Mark All as Read', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(245, 61, 27, 'settings_heading', 'Settings', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(246, 61, 28, 'settings_description', 'Manage your app preferences', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(247, 61, 27, 'account_section', 'Account', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(248, 61, 28, 'edit_profile_link', 'Edit Profile', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(249, 61, 28, 'change_password_link', 'Change Password', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(250, 61, 27, 'notifications_section', 'Notifications', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(251, 61, 28, 'push_notifications_toggle', 'Push Notifications', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(252, 61, 28, 'email_notifications_toggle', 'Email Notifications', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(253, 61, 27, 'privacy_section', 'Privacy', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(254, 61, 28, 'privacy_policy_link', 'Privacy Policy', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(255, 61, 28, 'terms_link', 'Terms of Service', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(256, 61, 33, 'logout_button', 'Logout', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(257, 62, 27, 'privacy_heading', 'Privacy Policy', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(258, 62, 28, 'last_updated', 'Last updated: November 2025', '', '', 0, 0, 2, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(259, 62, 27, 'section1_heading', 'Information We Collect', '', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(260, 62, 28, 'section1_text', 'We collect information you provide directly to us, including name, email, and usage data.', '', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(261, 62, 27, 'section2_heading', 'How We Use Your Information', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(262, 62, 28, 'section2_text', 'We use your information to provide, maintain, and improve our services.', '', '', 0, 0, 6, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(263, 62, 27, 'section3_heading', 'Data Security', '', '', 0, 0, 7, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(264, 62, 28, 'section3_text', 'We implement appropriate security measures to protect your personal information.', '', '', 0, 0, 8, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:47:36'),
(265, 63, 27, 'terms_heading', 'Terms and Conditions', '', '', 0, 0, 0, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(266, 63, 28, 'last_updated', 'Last updated: November 2025', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(267, 63, 27, 'section1_heading', 'Acceptance of Terms', '', '', 0, 0, 2, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(268, 63, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', '', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(269, 63, 27, 'section2_heading', 'User Responsibilities', '', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(270, 63, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(271, 63, 27, 'section3_heading', 'Termination', '', '', 0, 0, 6, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(272, 63, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', '', '', 0, 0, 7, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-07 20:07:35'),
(273, 64, 27, 'contact_heading', 'Contact Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(274, 64, 28, 'contact_description', 'We would love to hear from you. Please fill out the form below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(275, 64, 1, 'full_name', 'Full Name', 'Enter your full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(276, 64, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(277, 64, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(278, 64, 2, 'message', 'Message', 'Type your message here...', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(279, 64, 33, 'submit_button', 'Send Message', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(280, 65, 27, 'about_heading', 'About Us', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(281, 65, 28, 'about_subtitle', 'Learn more about our company and mission', '', '', 0, 0, 2, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(282, 65, 27, 'story_heading', 'Our Story', '', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(283, 65, 28, 'story_text', 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', '', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(284, 65, 27, 'mission_heading', 'Our Mission', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(285, 65, 28, 'mission_text', 'To deliver innovative solutions that make a difference in people lives.', '', '', 0, 0, 6, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(286, 65, 27, 'contact_heading', 'Contact Information', '', '', 0, 0, 7, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(287, 65, 4, 'contact_email', 'Email', 'info@company.com', '', 0, 0, 8, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(288, 65, 5, 'contact_phone', 'Phone', '(555) 123-4567', '', 0, 0, 9, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(289, 65, 33, 'contact_button', 'Contact Us', '', '', 0, 0, 10, '\"{}\"', '\"{}\"', '2025-11-04 20:16:56', '2025-11-14 18:49:07'),
(292, 67, 27, 'product_name', 'Product Name', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(293, 67, 28, 'product_subtitle', 'Premium Quality Product', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(294, 67, 27, 'price_label', 'Price', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(295, 67, 28, 'product_price', '$99.99', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(296, 67, 27, 'description_label', 'Description', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(297, 67, 28, 'product_description', 'This is a high-quality product designed to meet your needs. Made with premium materials and built to last.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(298, 67, 27, 'features_label', 'Features', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(299, 67, 28, 'product_features', 'â€¢ Premium quality materials\nâ€¢ Durable construction\nâ€¢ Easy to use\nâ€¢ 1-year warranty', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(300, 67, 27, 'quantity_label', 'Quantity', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(301, 67, 11, 'quantity', 'Quantity', '1', NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(302, 67, 33, 'add_to_cart_button', 'Add to Cart', NULL, NULL, 0, 0, 10, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(303, 67, 33, 'buy_now_button', 'Buy Now', NULL, NULL, 0, 0, 11, NULL, NULL, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(304, 49, 43, 'tags_input', 'Tags Input', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 21:33:34', '2025-11-04 21:33:34'),
(305, 69, 27, 'dashboard_title', 'Dashboard', '', 'My Account', 0, 1, 1, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(306, 69, 28, 'welcome_message', 'Welcome Message', '', 'Welcome back! Here\'s your account overview.', 0, 1, 2, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(307, 69, 27, 'balance_heading', 'Balance Section', '', 'Account Balance', 0, 1, 3, '{\"level\": \"h2\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(308, 69, 8, 'current_balance', 'Current Balance', '', '0.00', 0, 1, 4, '{\"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(309, 69, 8, 'available_balance', 'Available Balance', '', '0.00', 0, 1, 5, '{\"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(310, 69, 27, 'quick_actions_heading', 'Quick Actions', '', 'Quick Actions', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(311, 69, 33, 'transfer_button', 'Transfer Money', '', 'Transfer', 0, 0, 7, '{\"action\": \"navigate\", \"target\": \"/transfer\", \"variant\": \"primary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(312, 69, 33, 'pay_bills_button', 'Pay Bills', '', 'Pay Bills', 0, 0, 8, '{\"action\": \"navigate\", \"target\": \"/bills\", \"variant\": \"secondary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(313, 69, 27, 'recent_transactions_heading', 'Recent Activity', '', 'Recent Transactions', 0, 1, 9, '{\"level\": \"h3\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(314, 69, 28, 'transactions_list', 'Transactions', '', 'Your recent transactions will appear here.', 0, 1, 10, '{\"type\": \"list\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(315, 70, 27, 'transactions_title', 'Page Title', '', 'Transaction History', 0, 1, 1, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(316, 70, 28, 'transactions_description', 'Description', '', 'View all your account transactions', 0, 1, 2, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(317, 70, 17, 'start_date', 'Start Date', 'Select start date', '', 0, 0, 3, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(318, 70, 17, 'end_date', 'End Date', 'Select end date', '', 0, 0, 4, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(319, 70, 10, 'transaction_type', 'Transaction Type', 'All Types', '', 0, 0, 5, '{\"options\": [{\"label\": \"All\", \"value\": \"all\"}, {\"label\": \"Debit\", \"value\": \"debit\"}, {\"label\": \"Credit\", \"value\": \"credit\"}, {\"label\": \"Transfer\", \"value\": \"transfer\"}]}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(320, 70, 33, 'apply_filters', 'Apply Filters', '', 'Apply', 0, 0, 6, '{\"variant\": \"primary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(321, 70, 27, 'transactions_list_heading', 'Transactions', '', 'All Transactions', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(322, 70, 28, 'transactions_data', 'Transaction List', '', 'Your transactions will appear here.', 0, 1, 8, '{\"type\": \"list\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(323, 71, 27, 'transfer_title', 'Page Title', '', 'Transfer Money', 0, 1, 1, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(324, 71, 28, 'transfer_description', 'Description', '', 'Send money to another account', 0, 1, 2, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(325, 71, 10, 'from_account', 'From Account', 'Select account', '', 1, 0, 3, '{\"options\": [{\"label\": \"Checking Account\", \"value\": \"checking\"}, {\"label\": \"Savings Account\", \"value\": \"savings\"}]}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(326, 71, 1, 'recipient_account', 'Recipient Account Number', 'Enter account number', '', 1, 0, 4, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(327, 71, 1, 'recipient_name', 'Recipient Name', 'Enter recipient name', '', 1, 0, 5, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(328, 71, 8, 'transfer_amount', 'Amount', 'Enter amount', '', 1, 0, 6, '{\"min\": 0.01, \"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(329, 71, 1, 'transfer_note', 'Note (Optional)', 'Add a note', '', 0, 0, 7, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(330, 71, 27, 'summary_heading', 'Transfer Summary', '', 'Summary', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(331, 71, 28, 'transfer_fee', 'Transfer Fee', '', 'Fee: $0.00', 0, 1, 9, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(332, 71, 28, 'total_amount', 'Total Amount', '', 'Total: $0.00', 0, 1, 10, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(333, 71, 33, 'transfer_submit', 'Transfer Button', '', 'Transfer Now', 0, 0, 11, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(334, 71, 33, 'transfer_cancel', 'Cancel Button', '', 'Cancel', 0, 0, 12, '{\"action\": \"cancel\", \"variant\": \"secondary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(335, 72, 27, 'bills_title', 'Page Title', '', 'Pay Bills', 0, 1, 1, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(336, 72, 28, 'bills_description', 'Description', '', 'Pay your bills quickly and securely', 0, 1, 2, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(337, 72, 10, 'bill_category', 'Bill Category', 'Select category', '', 1, 0, 3, '{\"options\": [{\"label\": \"Utilities\", \"value\": \"utilities\"}, {\"label\": \"Credit Card\", \"value\": \"credit_card\"}, {\"label\": \"Insurance\", \"value\": \"insurance\"}, {\"label\": \"Phone/Internet\", \"value\": \"telecom\"}, {\"label\": \"Other\", \"value\": \"other\"}]}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(338, 72, 1, 'biller_name', 'Biller Name', 'Enter biller name', '', 1, 0, 4, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(339, 72, 1, 'account_number', 'Account/Reference Number', 'Enter account number', '', 1, 0, 5, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(340, 72, 8, 'bill_amount', 'Amount', 'Enter amount', '', 1, 0, 6, '{\"min\": 0.01, \"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(341, 72, 17, 'payment_date', 'Payment Date', 'Select date', '', 0, 0, 7, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(342, 72, 10, 'payment_account', 'Pay From', 'Select account', '', 1, 0, 8, '{\"options\": [{\"label\": \"Checking Account\", \"value\": \"checking\"}, {\"label\": \"Savings Account\", \"value\": \"savings\"}]}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(343, 72, 33, 'pay_bill_button', 'Pay Bill', '', 'Pay Now', 0, 0, 9, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(344, 72, 33, 'save_biller_button', 'Save Biller', '', 'Save for Later', 0, 0, 10, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(345, 73, 27, 'cards_title', 'Page Title', '', 'My Cards', 0, 1, 1, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(346, 73, 28, 'cards_description', 'Description', '', 'Manage your debit and credit cards', 0, 1, 2, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(347, 73, 27, 'active_cards_heading', 'Active Cards', '', 'Your Cards', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(348, 73, 28, 'cards_list', 'Cards List', '', 'Your cards will appear here.', 0, 1, 4, '{\"type\": \"list\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(349, 73, 33, 'add_card_button', 'Add Card', '', 'Add New Card', 0, 0, 5, '{\"action\": \"navigate\", \"target\": \"/add-card\", \"variant\": \"primary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(350, 73, 33, 'request_card_button', 'Request Card', '', 'Request Physical Card', 0, 0, 6, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(351, 73, 27, 'card_settings_heading', 'Card Settings', '', 'Settings', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(352, 73, 28, 'daily_limit', 'Daily Limit', '', 'Daily spending limit: $1,000', 0, 1, 8, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(353, 73, 28, 'international_usage', 'International Transactions', '', 'Enabled', 0, 1, 9, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(354, 73, 33, 'manage_limits_button', 'Manage Limits', '', 'Manage Limits', 0, 0, 10, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(355, 74, 27, 'statements_title', 'Page Title', '', 'Account Statements', 0, 1, 1, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(356, 74, 28, 'statements_description', 'Description', '', 'View and download your account statements', 0, 1, 2, '{}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(357, 74, 10, 'statement_account', 'Account', 'Select account', '', 0, 0, 3, '{\"options\": [{\"label\": \"All Accounts\", \"value\": \"all\"}, {\"label\": \"Checking Account\", \"value\": \"checking\"}, {\"label\": \"Savings Account\", \"value\": \"savings\"}]}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(358, 74, 10, 'statement_year', 'Year', 'Select year', '', 0, 0, 4, '{\"options\": [{\"label\": \"2025\", \"value\": \"2025\"}, {\"label\": \"2024\", \"value\": \"2024\"}, {\"label\": \"2023\", \"value\": \"2023\"}]}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(359, 74, 27, 'statements_list_heading', 'Available Statements', '', 'Statements', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(360, 74, 28, 'statements_data', 'Statements List', '', 'Your statements will appear here.', 0, 1, 6, '{\"type\": \"list\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(361, 74, 33, 'download_all_button', 'Download All', '', 'Download All', 0, 0, 7, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(362, 74, 33, 'email_statement_button', 'Email Statement', '', 'Email Statement', 0, 0, 8, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 18:57:14', '2025-11-06 18:57:14'),
(363, 75, 27, 'listings_title', 'Page Title', '', 'Find Your Perfect Stay', 0, 1, 1, '\"{}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(364, 75, 28, 'listings_subtitle', 'Subtitle', '', 'Discover unique places to stay around the world', 0, 1, 2, '\"{}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(365, 75, 1, 'search_location', 'Location', 'Where are you going?', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(366, 75, 17, 'check_in_date', 'Check-in Date', 'Select date', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(367, 75, 17, 'check_out_date', 'Check-out Date', 'Select date', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(368, 75, 8, 'guests_count', 'Number of Guests', 'How many guests?', '1', 0, 0, 6, '\"{\\\"max\\\":20,\\\"min\\\":1}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(369, 75, 10, 'property_type', 'Property Type', 'Any type', '', 0, 0, 7, '\"{\\\"options\\\":[{\\\"label\\\":\\\"Any\\\",\\\"value\\\":\\\"any\\\"},{\\\"label\\\":\\\"Entire Place\\\",\\\"value\\\":\\\"entire\\\"},{\\\"label\\\":\\\"Private Room\\\",\\\"value\\\":\\\"private\\\"},{\\\"label\\\":\\\"Shared Room\\\",\\\"value\\\":\\\"shared\\\"}]}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(370, 75, 8, 'min_price', 'Min Price', 'Min $', '', 0, 0, 8, '\"{\\\"prefix\\\":\\\"$\\\",\\\"decimals\\\":0}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(371, 75, 8, 'max_price', 'Max Price', 'Max $', '', 0, 0, 9, '\"{\\\"prefix\\\":\\\"$\\\",\\\"decimals\\\":0}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(372, 75, 33, 'search_button', 'Search', '', 'Search Properties', 0, 0, 10, '\"{\\\"action\\\":\\\"search\\\",\\\"variant\\\":\\\"primary\\\"}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(373, 75, 27, 'results_heading', 'Search Results', '', 'Available Properties', 0, 1, 11, '\"{\\\"level\\\":\\\"h3\\\"}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(374, 75, 28, 'properties_list', 'Properties', '', 'Properties will appear here based on your search.', 0, 1, 12, '\"{\\\"type\\\":\\\"list\\\"}\"', '\"{}\"', '2025-11-06 19:07:46', '2025-11-10 18:17:40'),
(375, 76, 27, 'property_name', 'Property Name', '', 'Luxury Beachfront Villa', 0, 1, 1, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(376, 76, 28, 'property_location', 'Location', '', 'Malibu, California', 0, 1, 2, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(377, 76, 28, 'property_rating', 'Rating', '', '4.9 â˜… (127 reviews)', 0, 1, 3, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(378, 76, 27, 'photos_heading', 'Photos', '', 'Property Photos', 0, 1, 4, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(379, 76, 28, 'photo_gallery', 'Photo Gallery', '', 'Property images will be displayed here.', 0, 1, 5, '{\"type\": \"gallery\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(380, 76, 27, 'description_heading', 'About', '', 'About This Property', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(381, 76, 28, 'property_description', 'Description', '', 'Beautiful beachfront villa with stunning ocean views, private pool, and modern amenities. Perfect for families or groups looking for a luxurious getaway.', 0, 1, 7, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(382, 76, 27, 'details_heading', 'Property Details', '', 'Details', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(383, 76, 28, 'bedrooms', 'Bedrooms', '', '4 Bedrooms', 0, 1, 9, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(384, 76, 28, 'bathrooms', 'Bathrooms', '', '3 Bathrooms', 0, 1, 10, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(385, 76, 28, 'max_guests', 'Max Guests', '', 'Up to 8 guests', 0, 1, 11, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(386, 76, 27, 'amenities_heading', 'Amenities', '', 'What This Place Offers', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(387, 76, 28, 'amenities_list', 'Amenities', '', 'WiFi, Pool, Kitchen, Parking, Air Conditioning, Beach Access', 0, 1, 13, '{\"type\": \"list\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(388, 76, 27, 'pricing_heading', 'Pricing', '', 'Price', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(389, 76, 8, 'price_per_night', 'Price Per Night', '', '450', 0, 1, 15, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(390, 76, 28, 'cleaning_fee', 'Cleaning Fee', '', 'Cleaning fee: $75', 0, 1, 16, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(391, 76, 33, 'book_button', 'Book Now', '', 'Reserve This Property', 0, 0, 17, '{\"action\": \"navigate\", \"target\": \"/booking\", \"variant\": \"primary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(392, 76, 33, 'contact_host_button', 'Contact Host', '', 'Message Host', 0, 0, 18, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(393, 77, 27, 'booking_title', 'Page Title', '', 'Complete Your Booking', 0, 1, 1, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(394, 77, 28, 'booking_subtitle', 'Subtitle', '', 'You\'re just a few steps away from your perfect stay', 0, 1, 2, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(395, 77, 27, 'trip_details_heading', 'Trip Details', '', 'Your Trip', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(396, 77, 17, 'booking_check_in', 'Check-in', 'Select date', '', 1, 0, 4, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(397, 77, 17, 'booking_check_out', 'Check-out', 'Select date', '', 1, 0, 5, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(398, 77, 8, 'booking_guests', 'Number of Guests', 'How many guests?', '1', 1, 0, 6, '{\"max\": 20, \"min\": 1}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(399, 77, 27, 'guest_info_heading', 'Guest Information', '', 'Your Information', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(400, 77, 1, 'guest_first_name', 'First Name', 'Enter first name', '', 1, 0, 8, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(401, 77, 1, 'guest_last_name', 'Last Name', 'Enter last name', '', 1, 0, 9, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(402, 77, 5, 'guest_email', 'Email', 'Enter email', '', 1, 0, 10, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(403, 77, 6, 'guest_phone', 'Phone Number', 'Enter phone', '', 1, 0, 11, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(404, 77, 27, 'requests_heading', 'Special Requests', '', 'Special Requests (Optional)', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(405, 77, 2, 'special_requests', 'Requests', 'Any special requests?', '', 0, 0, 13, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(406, 77, 27, 'price_summary_heading', 'Price Summary', '', 'Price Breakdown', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(407, 77, 28, 'nights_total', 'Nights Total', '', '$450 x 3 nights = $1,350', 0, 1, 15, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(408, 77, 28, 'service_fee', 'Service Fee', '', 'Service fee: $135', 0, 1, 16, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(409, 77, 28, 'total_price', 'Total Price', '', 'Total: $1,560', 0, 1, 17, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(410, 77, 33, 'confirm_booking_button', 'Confirm Booking', '', 'Confirm and Pay', 0, 0, 18, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(411, 77, 33, 'cancel_booking_button', 'Cancel', '', 'Cancel', 0, 0, 19, '{\"action\": \"cancel\", \"variant\": \"secondary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(412, 78, 27, 'host_name', 'Host Name', '', 'Sarah Johnson', 0, 1, 1, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(413, 78, 28, 'host_title', 'Title', '', 'Superhost', 0, 1, 2, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(414, 78, 28, 'host_location', 'Location', '', 'Los Angeles, CA', 0, 1, 3, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(415, 78, 28, 'member_since', 'Member Since', '', 'Member since 2018', 0, 1, 4, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(416, 78, 27, 'stats_heading', 'Host Stats', '', 'About This Host', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(417, 78, 28, 'total_reviews', 'Reviews', '', '247 Reviews', 0, 1, 6, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(418, 78, 28, 'rating_score', 'Rating', '', '4.9 â˜… Rating', 0, 1, 7, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(419, 78, 28, 'response_rate', 'Response Rate', '', '100% Response rate', 0, 1, 8, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(420, 78, 28, 'response_time', 'Response Time', '', 'Responds within an hour', 0, 1, 9, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(421, 78, 27, 'about_heading', 'About', '', 'About Sarah', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(422, 78, 28, 'host_bio', 'Bio', '', 'I love hosting guests and sharing the beauty of California\'s coastline. I\'m passionate about providing exceptional experiences and ensuring every stay is memorable.', 0, 1, 11, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(423, 78, 27, 'properties_heading', 'Other Properties', '', 'Sarah\'s Other Listings', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(424, 78, 28, 'other_properties', 'Properties', '', 'Other properties by this host will appear here.', 0, 1, 13, '{\"type\": \"list\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(425, 78, 33, 'contact_button', 'Contact Host', '', 'Send Message', 0, 0, 14, '{\"variant\": \"primary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(426, 78, 33, 'report_button', 'Report', '', 'Report Host', 0, 0, 15, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(427, 79, 27, 'reviews_title', 'Page Title', '', 'Guest Reviews', 0, 1, 1, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(428, 79, 28, 'overall_rating', 'Overall Rating', '', '4.9 â˜… (127 reviews)', 0, 1, 2, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(429, 79, 27, 'breakdown_heading', 'Rating Breakdown', '', 'Rating Categories', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(430, 79, 28, 'cleanliness_rating', 'Cleanliness', '', 'Cleanliness: 4.9 â˜…', 0, 1, 4, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(431, 79, 28, 'accuracy_rating', 'Accuracy', '', 'Accuracy: 4.8 â˜…', 0, 1, 5, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(432, 79, 28, 'communication_rating', 'Communication', '', 'Communication: 5.0 â˜…', 0, 1, 6, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(433, 79, 28, 'location_rating', 'Location', '', 'Location: 4.9 â˜…', 0, 1, 7, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(434, 79, 28, 'checkin_rating', 'Check-in', '', 'Check-in: 5.0 â˜…', 0, 1, 8, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(435, 79, 28, 'value_rating', 'Value', '', 'Value: 4.7 â˜…', 0, 1, 9, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(436, 79, 27, 'reviews_list_heading', 'Guest Reviews', '', 'What Guests Are Saying', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(437, 79, 28, 'reviews_list', 'Reviews', '', 'Guest reviews will appear here.', 0, 1, 11, '{\"type\": \"list\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(438, 79, 27, 'write_review_heading', 'Write a Review', '', 'Share Your Experience', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(439, 79, 8, 'review_rating', 'Your Rating', 'Rate 1-5 stars', '', 0, 0, 13, '{\"max\": 5, \"min\": 1}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(440, 79, 2, 'review_comment', 'Your Review', 'Share your experience...', '', 0, 0, 14, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(441, 79, 33, 'submit_review_button', 'Submit Review', '', 'Submit Review', 0, 0, 15, '{\"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(442, 80, 27, 'search_title', 'Page Title', '', 'Find Your Perfect Stay', 0, 1, 1, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(443, 80, 28, 'search_subtitle', 'Subtitle', '', 'Use filters to narrow down your search', 0, 1, 2, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(444, 80, 27, 'location_heading', 'Location', '', 'Where', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(445, 80, 1, 'destination', 'Destination', 'City, region, or country', '', 0, 0, 4, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(446, 80, 27, 'dates_heading', 'Dates', '', 'When', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(447, 80, 17, 'filter_check_in', 'Check-in', 'Select date', '', 0, 0, 6, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(448, 80, 17, 'filter_check_out', 'Check-out', 'Select date', '', 0, 0, 7, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(449, 80, 27, 'guests_heading', 'Guests', '', 'Who', 0, 1, 8, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(450, 80, 8, 'adults_count', 'Adults', 'Number of adults', '1', 0, 0, 9, '{\"max\": 16, \"min\": 1}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(451, 80, 8, 'children_count', 'Children', 'Number of children', '0', 0, 0, 10, '{\"max\": 10, \"min\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(452, 80, 8, 'infants_count', 'Infants', 'Number of infants', '0', 0, 0, 11, '{\"max\": 5, \"min\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(453, 80, 27, 'type_heading', 'Property Type', '', 'Type of Place', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(454, 80, 10, 'place_type', 'Type', 'Select type', '', 0, 0, 13, '{\"options\": [{\"label\": \"Entire Place\", \"value\": \"entire\"}, {\"label\": \"Private Room\", \"value\": \"private\"}, {\"label\": \"Shared Room\", \"value\": \"shared\"}, {\"label\": \"Hotel\", \"value\": \"hotel\"}]}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(455, 80, 27, 'price_heading', 'Price Range', '', 'Price Per Night', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(456, 80, 8, 'filter_min_price', 'Minimum', 'Min $', '0', 0, 0, 15, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(457, 80, 8, 'filter_max_price', 'Maximum', 'Max $', '1000', 0, 0, 16, '{\"prefix\": \"$\", \"decimals\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(458, 80, 27, 'rooms_heading', 'Rooms & Beds', '', 'Rooms', 0, 1, 17, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(459, 80, 8, 'bedrooms_count', 'Bedrooms', 'Any', '0', 0, 0, 18, '{\"max\": 10, \"min\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(460, 80, 8, 'beds_count', 'Beds', 'Any', '0', 0, 0, 19, '{\"max\": 20, \"min\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(461, 80, 8, 'bathrooms_count', 'Bathrooms', 'Any', '0', 0, 0, 20, '{\"max\": 10, \"min\": 0}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(462, 80, 27, 'amenities_filter_heading', 'Amenities', '', 'Popular Amenities', 0, 1, 21, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(463, 80, 11, 'wifi_filter', 'WiFi', '', '0', 0, 0, 22, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(464, 80, 11, 'kitchen_filter', 'Kitchen', '', '0', 0, 0, 23, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(465, 80, 11, 'parking_filter', 'Free Parking', '', '0', 0, 0, 24, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(466, 80, 11, 'pool_filter', 'Pool', '', '0', 0, 0, 25, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(467, 80, 11, 'ac_filter', 'Air Conditioning', '', '0', 0, 0, 26, '{}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(468, 80, 33, 'apply_filters_button', 'Apply Filters', '', 'Show Results', 0, 0, 27, '{\"action\": \"search\", \"variant\": \"primary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(469, 80, 33, 'clear_filters_button', 'Clear All', '', 'Clear Filters', 0, 0, 28, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:07:46', '2025-11-06 19:07:46'),
(470, 81, 27, 'request_title', 'Page Title', '', 'Where to?', 0, 1, 1, '{\"level\": \"h1\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(471, 81, 28, 'request_subtitle', 'Subtitle', '', 'Enter your destination to get started', 0, 1, 2, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(472, 81, 1, 'pickup_location', 'Pickup Location', 'Enter pickup address', '', 1, 0, 3, '{\"icon\": \"MapPin\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(473, 81, 1, 'destination', 'Destination', 'Where are you going?', '', 1, 0, 4, '{\"icon\": \"Navigation\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(474, 81, 27, 'ride_type_heading', 'Ride Type', '', 'Choose Your Ride', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(475, 81, 10, 'ride_type', 'Ride Type', 'Select ride type', 'standard', 1, 0, 6, '{\"options\": [{\"label\": \"Standard\", \"value\": \"standard\", \"description\": \"Affordable rides\"}, {\"label\": \"Premium\", \"value\": \"premium\", \"description\": \"Comfortable sedans\"}, {\"label\": \"XL\", \"value\": \"xl\", \"description\": \"6 seats\"}, {\"label\": \"Luxury\", \"value\": \"luxury\", \"description\": \"High-end vehicles\"}]}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(476, 81, 27, 'ride_details_heading', 'Trip Details', '', 'Trip Details', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(477, 81, 8, 'estimated_fare', 'Estimated Fare', '', '0.00', 0, 1, 8, '{\"prefix\": \"$\", \"decimals\": 2}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17');
INSERT INTO `screen_element_instances` (`id`, `screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`, `updated_at`) VALUES
(478, 81, 28, 'estimated_time', 'Estimated Time', '', 'Calculating...', 0, 1, 9, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(479, 81, 28, 'distance', 'Distance', '', 'Calculating...', 0, 1, 10, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(480, 81, 1, 'promo_code', 'Promo Code', 'Enter promo code', '', 0, 0, 11, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(481, 81, 1, 'ride_notes', 'Special Instructions', 'Add notes for driver', '', 0, 0, 12, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(482, 81, 33, 'request_ride_button', 'Request Ride', '', 'Request Ride', 0, 0, 13, '{\"size\": \"large\", \"action\": \"submit\", \"variant\": \"primary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(483, 82, 27, 'tracking_title', 'Page Title', '', 'Your Ride', 0, 1, 1, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(484, 82, 28, 'ride_status', 'Ride Status', '', 'Driver is on the way', 0, 1, 2, '{\"type\": \"status\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(485, 82, 27, 'driver_info_heading', 'Driver Information', '', 'Your Driver', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(486, 82, 28, 'driver_name', 'Driver Name', '', 'John Doe', 0, 1, 4, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(487, 82, 28, 'driver_rating', 'Driver Rating', '', '4.8 â­', 0, 1, 5, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(488, 82, 28, 'vehicle_info', 'Vehicle Info', '', 'Toyota Camry - ABC 123', 0, 1, 6, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(489, 82, 27, 'trip_progress_heading', 'Trip Progress', '', 'Trip Details', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(490, 82, 28, 'eta', 'Estimated Arrival', '', '5 minutes', 0, 1, 8, '{\"icon\": \"Clock\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(491, 82, 28, 'current_location', 'Current Location', '', 'Updating...', 0, 1, 9, '{\"icon\": \"MapPin\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(492, 82, 28, 'destination_display', 'Destination', '', '', 0, 1, 10, '{\"icon\": \"Navigation\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(493, 82, 33, 'call_driver_button', 'Call Driver', '', 'Call Driver', 0, 0, 11, '{\"icon\": \"Phone\", \"variant\": \"secondary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(494, 82, 33, 'message_driver_button', 'Message Driver', '', 'Message', 0, 0, 12, '{\"icon\": \"MessageCircle\", \"variant\": \"secondary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(495, 82, 33, 'cancel_ride_button', 'Cancel Ride', '', 'Cancel Ride', 0, 0, 13, '{\"variant\": \"danger\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(496, 82, 27, 'safety_heading', 'Safety', '', 'Safety Features', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(497, 82, 33, 'share_trip_button', 'Share Trip', '', 'Share Trip Status', 0, 0, 15, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(498, 82, 33, 'emergency_button', 'Emergency', '', 'Emergency', 0, 0, 16, '{\"variant\": \"danger\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(499, 83, 27, 'history_title', 'Page Title', '', 'Ride History', 0, 1, 1, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(500, 83, 28, 'history_description', 'Description', '', 'View all your past rides', 0, 1, 2, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(501, 83, 17, 'start_date', 'Start Date', 'From date', '', 0, 0, 3, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(502, 83, 17, 'end_date', 'End Date', 'To date', '', 0, 0, 4, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(503, 83, 10, 'ride_status_filter', 'Status', 'All Rides', '', 0, 0, 5, '{\"options\": [{\"label\": \"All Rides\", \"value\": \"all\"}, {\"label\": \"Completed\", \"value\": \"completed\"}, {\"label\": \"Cancelled\", \"value\": \"cancelled\"}]}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(504, 83, 33, 'apply_filters_button', 'Apply Filters', '', 'Apply', 0, 0, 6, '{\"variant\": \"primary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(505, 83, 27, 'rides_list_heading', 'Your Rides', '', 'Past Rides', 0, 1, 7, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(506, 83, 28, 'rides_list', 'Rides List', '', 'Your ride history will appear here.', 0, 1, 8, '{\"type\": \"list\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(507, 83, 27, 'stats_heading', 'Statistics', '', 'Your Stats', 0, 1, 9, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(508, 83, 28, 'total_rides', 'Total Rides', '', '0 rides', 0, 1, 10, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(509, 83, 28, 'total_spent', 'Total Spent', '', '$0.00', 0, 1, 11, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(510, 84, 27, 'payment_title', 'Page Title', '', 'Payment Methods', 0, 1, 1, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(511, 84, 28, 'payment_description', 'Description', '', 'Manage your payment options', 0, 1, 2, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(512, 84, 27, 'saved_methods_heading', 'Saved Methods', '', 'Your Payment Methods', 0, 1, 3, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(513, 84, 28, 'payment_methods_list', 'Payment Methods', '', 'Your saved payment methods will appear here.', 0, 1, 4, '{\"type\": \"list\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(514, 84, 27, 'add_payment_heading', 'Add New Payment', '', 'Add Payment Method', 0, 1, 5, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(515, 84, 10, 'payment_type', 'Payment Type', 'Select type', '', 0, 0, 6, '{\"options\": [{\"label\": \"Credit Card\", \"value\": \"credit\"}, {\"label\": \"Debit Card\", \"value\": \"debit\"}, {\"label\": \"PayPal\", \"value\": \"paypal\"}, {\"label\": \"Apple Pay\", \"value\": \"apple_pay\"}, {\"label\": \"Google Pay\", \"value\": \"google_pay\"}]}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(516, 84, 1, 'card_number', 'Card Number', 'Enter card number', '', 0, 0, 7, '{\"type\": \"number\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(517, 84, 1, 'card_name', 'Cardholder Name', 'Name on card', '', 0, 0, 8, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(518, 84, 17, 'expiry_date', 'Expiry Date', 'MM/YY', '', 0, 0, 9, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(519, 84, 1, 'cvv', 'CVV', 'CVV', '', 0, 0, 10, '{\"type\": \"password\", \"maxLength\": 4}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(520, 84, 33, 'add_payment_button', 'Add Payment', '', 'Add Payment Method', 0, 0, 11, '{\"variant\": \"primary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(521, 84, 27, 'default_payment_heading', 'Default Payment', '', 'Default Payment Method', 0, 1, 12, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(522, 84, 28, 'default_payment_info', 'Default Payment', '', 'Set your preferred payment method for rides', 0, 1, 13, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(523, 85, 27, 'driver_profile_title', 'Page Title', '', 'Driver Profile', 0, 1, 1, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(524, 85, 28, 'driver_photo', 'Driver Photo', '', 'Driver photo placeholder', 0, 1, 2, '{\"type\": \"image\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(525, 85, 27, 'driver_name_display', 'Driver Name', '', 'John Doe', 0, 1, 3, '{\"level\": \"h2\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(526, 85, 28, 'driver_rating_display', 'Rating', '', '4.8 â­ (1,234 rides)', 0, 1, 4, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(527, 85, 28, 'member_since', 'Member Since', '', 'Member since: Jan 2023', 0, 1, 5, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(528, 85, 27, 'vehicle_heading', 'Vehicle', '', 'Vehicle Information', 0, 1, 6, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(529, 85, 28, 'vehicle_make_model', 'Vehicle', '', 'Toyota Camry 2023', 0, 1, 7, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(530, 85, 28, 'vehicle_color', 'Color', '', 'Silver', 0, 1, 8, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(531, 85, 28, 'license_plate', 'License Plate', '', 'ABC 123', 0, 1, 9, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(532, 85, 27, 'stats_heading', 'Statistics', '', 'Driver Stats', 0, 1, 10, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(533, 85, 28, 'total_trips', 'Total Trips', '', '1,234 trips', 0, 1, 11, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(534, 85, 28, 'acceptance_rate', 'Acceptance Rate', '', '98%', 0, 1, 12, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(535, 85, 28, 'cancellation_rate', 'Cancellation Rate', '', '2%', 0, 1, 13, '{}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(536, 85, 27, 'reviews_heading', 'Reviews', '', 'Recent Reviews', 0, 1, 14, '{\"level\": \"h3\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(537, 85, 28, 'reviews_list', 'Reviews', '', 'Driver reviews will appear here.', 0, 1, 15, '{\"type\": \"list\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(538, 85, 33, 'contact_driver_button', 'Contact Driver', '', 'Contact Driver', 0, 0, 16, '{\"variant\": \"primary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(539, 85, 33, 'report_driver_button', 'Report Issue', '', 'Report Issue', 0, 0, 17, '{\"variant\": \"secondary\"}', NULL, '2025-11-06 19:35:17', '2025-11-06 19:35:17'),
(540, 87, 27, 'search_heading', 'Search', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(541, 87, 1, 'search_input', 'Search', 'What are you looking for?', NULL, 0, 0, 1, NULL, NULL, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(542, 87, 28, 'popular_section', 'Popular Searches', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(543, 87, 28, 'popular_1', 'Products', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(544, 87, 28, 'popular_2', 'Services', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(545, 87, 28, 'popular_3', 'Articles', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(546, 87, 33, 'search_button', 'Search', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-07 19:25:16', '2025-11-07 19:25:16'),
(547, 89, 27, 'terms_heading', 'Terms of Service', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(548, 89, 28, 'last_updated', 'Last updated: November 2025', '', '', 0, 0, 2, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(549, 89, 27, 'section1_heading', 'Acceptance of Terms', '', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(550, 89, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', '', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(551, 89, 27, 'section2_heading', 'User Responsibilities', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(552, 89, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', '', '', 0, 0, 6, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(553, 89, 27, 'section3_heading', 'Termination', '', '', 0, 0, 7, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(554, 89, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', '', '', 0, 0, 8, '\"{}\"', '\"{}\"', '2025-11-07 19:25:16', '2025-11-14 18:47:02'),
(555, 52, 27, 'heading_52_1', 'Home Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(556, 53, 27, 'heading_53_1', 'Restaurant Menu Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(557, 54, 27, 'heading_54_1', 'Cart Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(558, 56, 27, 'heading_56_1', 'Track Order Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(559, 57, 27, 'heading_57_1', 'Order History Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(560, 66, 27, 'heading_66_1', 'Products Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(561, 68, 27, 'heading_68_1', 'Orders Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(562, 86, 27, 'heading_86_1', 'Feed Title', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-07 20:04:27', '2025-11-07 20:04:27'),
(563, 88, 27, 'heading_88_1', 'Messages Title', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-11-07 20:04:27', '2025-11-14 18:46:37'),
(570, 52, 28, 'paragraph_52_2', 'Home Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(571, 53, 28, 'paragraph_53_2', 'Restaurant Menu Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(572, 54, 28, 'paragraph_54_2', 'Cart Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(573, 56, 28, 'paragraph_56_2', 'Track Order Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(574, 57, 28, 'paragraph_57_2', 'Order History Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(575, 66, 28, 'paragraph_66_2', 'Products Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(576, 68, 28, 'paragraph_68_2', 'Orders Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(577, 86, 28, 'paragraph_86_2', 'Feed Description', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(578, 88, 28, 'paragraph_88_2', 'Messages Description', '', '', 0, 0, 2, '\"{}\"', '\"{}\"', '2025-11-07 20:04:53', '2025-11-14 18:46:37'),
(585, 52, 33, 'button_52_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(586, 53, 33, 'button_53_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(587, 54, 33, 'button_54_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(588, 56, 33, 'button_56_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(589, 57, 33, 'button_57_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(590, 66, 33, 'button_66_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(591, 68, 33, 'button_68_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(592, 86, 33, 'button_86_3', 'Action Button', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(593, 88, 33, 'button_88_3', 'Action Button', '', '', 0, 0, 3, '\"{}\"', '\"{}\"', '2025-11-07 20:04:53', '2025-11-14 18:46:37'),
(600, 52, 1, 'text_field_52_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(601, 53, 1, 'text_field_53_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(602, 54, 1, 'text_field_54_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(603, 56, 1, 'text_field_56_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(604, 57, 1, 'text_field_57_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(605, 66, 1, 'text_field_66_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(606, 68, 1, 'text_field_68_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(607, 86, 1, 'text_field_86_4', 'Input Field', 'Enter text', NULL, 0, 0, 4, NULL, NULL, '2025-11-07 20:04:53', '2025-11-07 20:04:53'),
(608, 88, 1, 'text_field_88_4', 'Input Field', 'Enter text', '', 0, 0, 4, '\"{}\"', '\"{}\"', '2025-11-07 20:04:53', '2025-11-14 18:46:37');

-- --------------------------------------------------------

--
-- Table structure for table `screen_menu_assignments`
--

CREATE TABLE `screen_menu_assignments` (
  `id` int NOT NULL,
  `screen_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `screen_menu_assignments`
--

INSERT INTO `screen_menu_assignments` (`id`, `screen_id`, `menu_id`, `created_at`) VALUES
(2, 75, 1, '2025-11-14 17:05:50'),
(5, 95, 2, '2025-11-14 17:33:39'),
(6, 65, 2, '2025-11-14 17:33:44'),
(7, 88, 2, '2025-11-14 17:34:04'),
(11, 94, 2, '2025-11-14 17:36:50'),
(13, 62, 3, '2025-11-14 17:43:57'),
(14, 89, 3, '2025-11-14 17:44:00'),
(20, 58, 1, '2025-11-14 17:54:22'),
(21, 58, 2, '2025-11-14 17:54:22'),
(22, 58, 3, '2025-11-14 17:54:22'),
(23, 80, 2, '2025-11-14 17:54:29');

-- --------------------------------------------------------

--
-- Table structure for table `screen_module_assignments`
--

CREATE TABLE `screen_module_assignments` (
  `id` int NOT NULL,
  `screen_id` int NOT NULL,
  `module_id` int NOT NULL,
  `config` json DEFAULT NULL COMMENT 'Screen-specific module configuration',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `screen_module_assignments`
--

INSERT INTO `screen_module_assignments` (`id`, `screen_id`, `module_id`, `config`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 75, 1, '{}', 1, '2025-11-14 19:34:59', '2025-11-14 19:34:59'),
(2, 77, 1, '{}', 1, '2025-11-14 19:35:05', '2025-11-14 19:35:05'),
(3, 78, 1, '{}', 1, '2025-11-14 19:35:08', '2025-11-14 19:35:08'),
(4, 80, 1, '{}', 1, '2025-11-14 19:35:15', '2025-11-14 19:35:15'),
(5, 79, 2, '{}', 1, '2025-11-14 19:35:19', '2025-11-14 19:35:19'),
(6, 58, 1, '{}', 1, '2025-11-14 19:35:25', '2025-11-14 19:35:25'),
(7, 59, 1, '{}', 1, '2025-11-14 19:35:38', '2025-11-14 19:35:38'),
(8, 94, 1, '{}', 1, '2025-11-14 19:35:41', '2025-11-14 19:35:41'),
(9, 95, 1, '{}', 1, '2025-11-14 19:35:44', '2025-11-14 19:35:44'),
(10, 65, 1, '{}', 1, '2025-11-14 19:35:49', '2025-11-14 19:35:49'),
(11, 62, 1, '{}', 1, '2025-11-14 19:35:59', '2025-11-14 19:35:59'),
(12, 89, 1, '{}', 1, '2025-11-14 19:36:02', '2025-11-14 19:36:02'),
(13, 88, 1, '{}', 1, '2025-11-14 19:36:05', '2025-11-14 19:36:05');

-- --------------------------------------------------------

--
-- Table structure for table `screen_role_access`
--

CREATE TABLE `screen_role_access` (
  `id` int NOT NULL,
  `screen_id` int NOT NULL,
  `role_id` int NOT NULL,
  `app_id` int NOT NULL,
  `can_access` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `screen_submissions`
--

CREATE TABLE `screen_submissions` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `submission_data` json NOT NULL,
  `device_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `screen_templates`
--

CREATE TABLE `screen_templates` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `screen_templates`
--

INSERT INTO `screen_templates` (`id`, `name`, `description`, `category`, `icon`, `is_active`, `created_at`) VALUES
(1, 'Contact Form', 'A simple contact form with name, email, phone, and message fields', 'Forms', 'mail', 1, '2025-11-03 17:12:27'),
(2, 'User Profile', 'User profile screen with personal information fields', 'User', 'user', 1, '2025-11-03 17:12:27'),
(3, 'Login Screen', 'Standard login screen with email and password fields', 'Authentication', 'log-in', 1, '2025-11-03 17:12:27'),
(4, 'Sign Up', 'User registration form with email, password, and personal information', 'Authentication', 'user-plus', 1, '2025-11-03 17:35:25'),
(5, 'Forgot Password', 'Password recovery screen with email input', 'Authentication', 'key', 1, '2025-11-03 17:35:25'),
(6, 'Reset Password', 'Enter new password after recovery', 'Authentication', 'lock', 1, '2025-11-03 17:35:25'),
(7, 'Email Verification', 'Verify email address with code input', 'Authentication', 'mail-check', 1, '2025-11-03 17:35:25'),
(8, 'Settings', 'App settings and preferences screen', 'Settings', 'settings', 1, '2025-11-03 17:35:25'),
(9, 'Notifications List', 'Display all user notifications', 'Notifications', 'bell', 1, '2025-11-03 17:35:25'),
(10, 'Search', 'Search functionality with results', 'Navigation', 'search', 1, '2025-11-03 17:35:25'),
(11, 'About Us', 'Company information and description', 'Information', 'info', 1, '2025-11-03 17:35:25'),
(12, 'FAQ', 'Frequently asked questions', 'Support', 'help-circle', 1, '2025-11-03 17:35:25'),
(13, 'Product Details', 'E-commerce product information page', 'E-Commerce', 'shopping-bag', 1, '2025-11-03 17:35:25'),
(14, 'Shopping Cart', 'View and manage items in shopping cart', 'E-Commerce', 'shopping-cart', 1, '2025-11-03 17:38:15'),
(15, 'Checkout', 'Complete purchase with payment and shipping', 'E-Commerce', 'credit-card', 1, '2025-11-03 17:38:15'),
(16, 'Order Confirmation', 'Order success and details screen', 'E-Commerce', 'check-circle', 1, '2025-11-03 17:38:15'),
(17, 'Dashboard', 'Main dashboard with overview and stats', 'Navigation', 'layout-dashboard', 1, '2025-11-03 17:38:15'),
(18, 'Chat Message', 'One-on-one messaging screen', 'Communication', 'message-circle', 1, '2025-11-03 17:38:15'),
(19, 'Write Review', 'Submit product or service review', 'Communication', 'star', 1, '2025-11-03 17:38:15'),
(20, 'Privacy Policy', 'Privacy policy and data usage information', 'Legal', 'shield', 1, '2025-11-03 17:38:15'),
(21, 'Terms of Service', 'Terms and conditions of use', 'Legal', 'file-text', 1, '2025-11-03 17:38:15'),
(22, 'Booking Form', 'Schedule appointment or reservation', 'Booking', 'calendar', 1, '2025-11-03 17:38:15'),
(23, 'Payment Method', 'Add or select payment method', 'Payment', 'credit-card', 1, '2025-11-03 17:38:15'),
(24, 'Splash Screen', 'App logo and branding while loading', 'Onboarding', 'zap', 1, '2025-11-03 18:08:12'),
(25, 'Onboarding', 'Welcome tutorial slides introducing the app', 'Onboarding', 'book-open', 1, '2025-11-03 18:08:12'),
(26, 'Edit Profile', 'Update user profile information including name, email, phone, bio, and profile photo', 'User Profile & Account', NULL, 1, '2025-11-03 19:05:03');

-- --------------------------------------------------------

--
-- Table structure for table `screen_versions`
--

CREATE TABLE `screen_versions` (
  `id` int NOT NULL,
  `screen_id` int NOT NULL,
  `version_number` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `snapshot_data` json NOT NULL COMMENT 'Full snapshot of screen and elements at this version',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `template_elements`
--

CREATE TABLE `template_elements` (
  `id` int NOT NULL,
  `template_id` int NOT NULL,
  `element_id` int NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `field_key` varchar(100) DEFAULT NULL,
  `placeholder` text,
  `default_value` text,
  `is_required` tinyint(1) DEFAULT '0',
  `is_readonly` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `config` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `template_elements`
--

INSERT INTO `template_elements` (`id`, `template_id`, `element_id`, `label`, `field_key`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`) VALUES
(1, 1, 27, 'Contact Us', 'contact_heading', NULL, NULL, 0, 0, 0, NULL),
(2, 1, 28, 'We would love to hear from you. Please fill out the form below.', 'contact_description', NULL, NULL, 0, 0, 1, NULL),
(3, 1, 1, 'Full Name', 'full_name', 'Enter your full name', NULL, 1, 0, 2, NULL),
(4, 1, 4, 'Email Address', 'email', 'your.email@example.com', NULL, 1, 0, 3, NULL),
(5, 1, 5, 'Phone Number', 'phone', '(555) 123-4567', NULL, 0, 0, 4, NULL),
(6, 1, 2, 'Message', 'message', 'Type your message here...', NULL, 1, 0, 5, NULL),
(7, 1, 33, 'Send Message', 'submit_button', NULL, NULL, 0, 0, 6, NULL),
(8, 2, 27, 'My Profile', 'profile_heading', NULL, NULL, 0, 0, 0, NULL),
(9, 2, 28, 'Update your personal information below.', 'profile_description', NULL, NULL, 0, 0, 1, NULL),
(10, 2, 1, 'First Name', 'first_name', 'Enter your first name', NULL, 1, 0, 2, NULL),
(11, 2, 1, 'Last Name', 'last_name', 'Enter your last name', NULL, 1, 0, 3, NULL),
(12, 2, 4, 'Email', 'email', 'your.email@example.com', NULL, 1, 0, 4, NULL),
(13, 2, 5, 'Phone', 'phone', '(555) 123-4567', NULL, 0, 0, 5, NULL),
(14, 2, 2, 'Bio', 'bio', 'Tell us about yourself...', NULL, 0, 0, 6, NULL),
(15, 2, 33, 'Save Changes', 'save_button', NULL, NULL, 0, 0, 7, NULL),
(16, 3, 27, 'Welcome Back', 'login_heading', NULL, NULL, 0, 0, 0, NULL),
(17, 3, 28, 'Please sign in to continue.', 'login_description', NULL, NULL, 0, 0, 1, NULL),
(18, 3, 4, 'Email Address', 'email', 'your.email@example.com', NULL, 1, 0, 2, NULL),
(19, 3, 1, 'Password', 'password', 'Enter your password', NULL, 1, 0, 3, NULL),
(20, 3, 33, 'Sign In', 'login_button', NULL, NULL, 0, 0, 4, NULL),
(21, 3, 28, 'Forgot your password?', 'forgot_password_link', NULL, NULL, 0, 0, 5, NULL),
(22, 4, 27, 'Create Account', 'signup_heading', NULL, NULL, 0, 0, 0, NULL),
(23, 4, 28, 'Join us today and get started!', 'signup_description', NULL, NULL, 0, 0, 1, NULL),
(24, 4, 1, 'First Name', 'first_name', 'Enter your first name', NULL, 1, 0, 2, NULL),
(25, 4, 1, 'Last Name', 'last_name', 'Enter your last name', NULL, 1, 0, 3, NULL),
(26, 4, 4, 'Email Address', 'email', 'your.email@example.com', NULL, 1, 0, 4, NULL),
(27, 4, 5, 'Phone Number', 'phone', '(555) 123-4567', NULL, 0, 0, 5, NULL),
(28, 4, 1, 'Password', 'password', 'Create a strong password', NULL, 1, 0, 6, NULL),
(29, 4, 1, 'Confirm Password', 'confirm_password', 'Re-enter your password', NULL, 1, 0, 7, NULL),
(30, 4, 33, 'Sign Up', 'signup_button', NULL, NULL, 0, 0, 8, NULL),
(31, 4, 28, 'Already have an account? Login', 'login_link', NULL, NULL, 0, 0, 9, NULL),
(32, 5, 27, 'Forgot Password?', 'forgot_heading', NULL, NULL, 0, 0, 0, NULL),
(33, 5, 28, 'Enter your email address and we will send you a link to reset your password.', 'forgot_description', NULL, NULL, 0, 0, 1, NULL),
(34, 5, 4, 'Email Address', 'email', 'your.email@example.com', NULL, 1, 0, 2, NULL),
(35, 5, 33, 'Send Reset Link', 'send_button', NULL, NULL, 0, 0, 3, NULL),
(36, 5, 28, 'Remember your password? Login', 'login_link', NULL, NULL, 0, 0, 4, NULL),
(37, 6, 27, 'Reset Password', 'reset_heading', NULL, NULL, 0, 0, 0, NULL),
(38, 6, 28, 'Please enter your new password below.', 'reset_description', NULL, NULL, 0, 0, 1, NULL),
(39, 6, 1, 'New Password', 'new_password', 'Enter new password', NULL, 1, 0, 2, NULL),
(40, 6, 1, 'Confirm Password', 'confirm_password', 'Re-enter new password', NULL, 1, 0, 3, NULL),
(41, 6, 33, 'Reset Password', 'reset_button', NULL, NULL, 0, 0, 4, NULL),
(42, 7, 27, 'Verify Your Email', 'verify_heading', NULL, NULL, 0, 0, 0, NULL),
(43, 7, 28, 'We sent a verification code to your email address. Please enter it below.', 'verify_description', NULL, NULL, 0, 0, 1, NULL),
(44, 7, 1, 'Verification Code', 'verification_code', 'Enter 6-digit code', NULL, 1, 0, 2, NULL),
(45, 7, 33, 'Verify Email', 'verify_button', NULL, NULL, 0, 0, 3, NULL),
(46, 7, 28, 'Did not receive code? Resend', 'resend_link', NULL, NULL, 0, 0, 4, NULL),
(47, 8, 27, 'Settings', 'settings_heading', NULL, NULL, 0, 0, 0, NULL),
(48, 8, 28, 'Manage your app preferences', 'settings_description', NULL, NULL, 0, 0, 1, NULL),
(49, 8, 27, 'Account', 'account_section', NULL, NULL, 0, 0, 2, NULL),
(50, 8, 28, 'Edit Profile', 'edit_profile_link', NULL, NULL, 0, 0, 3, NULL),
(51, 8, 28, 'Change Password', 'change_password_link', NULL, NULL, 0, 0, 4, NULL),
(52, 8, 27, 'Notifications', 'notifications_section', NULL, NULL, 0, 0, 5, NULL),
(53, 8, 28, 'Push Notifications', 'push_notifications_toggle', NULL, NULL, 0, 0, 6, NULL),
(54, 8, 28, 'Email Notifications', 'email_notifications_toggle', NULL, NULL, 0, 0, 7, NULL),
(55, 8, 27, 'Privacy', 'privacy_section', NULL, NULL, 0, 0, 8, NULL),
(56, 8, 28, 'Privacy Policy', 'privacy_policy_link', NULL, NULL, 0, 0, 9, NULL),
(57, 8, 28, 'Terms of Service', 'terms_link', NULL, NULL, 0, 0, 10, NULL),
(58, 8, 33, 'Logout', 'logout_button', NULL, NULL, 0, 0, 11, NULL),
(59, 9, 27, 'Notifications', 'notifications_heading', NULL, NULL, 0, 0, 0, NULL),
(60, 9, 28, 'Stay updated with your latest activities', 'notifications_description', NULL, NULL, 0, 0, 1, NULL),
(61, 9, 28, 'You have a new message', 'notification_1', NULL, NULL, 0, 0, 2, NULL),
(62, 9, 28, 'Your order has been shipped', 'notification_2', NULL, NULL, 0, 0, 3, NULL),
(63, 9, 28, 'New friend request', 'notification_3', NULL, NULL, 0, 0, 4, NULL),
(64, 9, 33, 'Mark All as Read', 'mark_read_button', NULL, NULL, 0, 0, 5, NULL),
(65, 10, 27, 'Search', 'search_heading', NULL, NULL, 0, 0, 0, NULL),
(66, 10, 1, 'Search', 'search_input', 'What are you looking for?', NULL, 0, 0, 1, NULL),
(67, 10, 28, 'Popular Searches', 'popular_section', NULL, NULL, 0, 0, 2, NULL),
(68, 10, 28, 'Products', 'popular_1', NULL, NULL, 0, 0, 3, NULL),
(69, 10, 28, 'Services', 'popular_2', NULL, NULL, 0, 0, 4, NULL),
(70, 10, 28, 'Articles', 'popular_3', NULL, NULL, 0, 0, 5, NULL),
(71, 10, 33, 'Search', 'search_button', NULL, NULL, 0, 0, 6, NULL),
(72, 11, 27, 'About Us', 'about_heading', NULL, NULL, 0, 0, 0, NULL),
(73, 11, 28, 'Learn more about our company and mission', 'about_subtitle', NULL, NULL, 0, 0, 1, NULL),
(74, 11, 27, 'Our Story', 'story_heading', NULL, NULL, 0, 0, 2, NULL),
(75, 11, 28, 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', 'story_text', NULL, NULL, 0, 0, 3, NULL),
(76, 11, 27, 'Our Mission', 'mission_heading', NULL, NULL, 0, 0, 4, NULL),
(77, 11, 28, 'To deliver innovative solutions that make a difference in people lives.', 'mission_text', NULL, NULL, 0, 0, 5, NULL),
(78, 11, 27, 'Contact Information', 'contact_heading', NULL, NULL, 0, 0, 6, NULL),
(79, 11, 4, 'Email', 'contact_email', 'info@company.com', NULL, 0, 0, 7, NULL),
(80, 11, 5, 'Phone', 'contact_phone', '(555) 123-4567', NULL, 0, 0, 8, NULL),
(81, 11, 33, 'Contact Us', 'contact_button', NULL, NULL, 0, 0, 9, NULL),
(82, 12, 27, 'Frequently Asked Questions', 'faq_heading', NULL, NULL, 0, 0, 0, NULL),
(83, 12, 28, 'Find answers to common questions', 'faq_description', NULL, NULL, 0, 0, 1, NULL),
(84, 12, 27, 'How do I create an account?', 'faq_q1', NULL, NULL, 0, 0, 2, NULL),
(85, 12, 28, 'Click on the Sign Up button and fill in your details to create a new account.', 'faq_a1', NULL, NULL, 0, 0, 3, NULL),
(86, 12, 27, 'How do I reset my password?', 'faq_q2', NULL, NULL, 0, 0, 4, NULL),
(87, 12, 28, 'Click on Forgot Password on the login screen and follow the instructions sent to your email.', 'faq_a2', NULL, NULL, 0, 0, 5, NULL),
(88, 12, 27, 'How do I contact support?', 'faq_q3', NULL, NULL, 0, 0, 6, NULL),
(89, 12, 28, 'You can reach our support team through the Contact Us page or email us at support@company.com', 'faq_a3', NULL, NULL, 0, 0, 7, NULL),
(90, 12, 33, 'Contact Support', 'contact_support_button', NULL, NULL, 0, 0, 8, NULL),
(91, 13, 27, 'Product Name', 'product_name', NULL, NULL, 0, 0, 0, NULL),
(92, 13, 28, 'Premium Quality Product', 'product_subtitle', NULL, NULL, 0, 0, 1, NULL),
(93, 13, 27, 'Price', 'price_label', NULL, NULL, 0, 0, 2, NULL),
(94, 13, 28, '$99.99', 'product_price', NULL, NULL, 0, 0, 3, NULL),
(95, 13, 27, 'Description', 'description_label', NULL, NULL, 0, 0, 4, NULL),
(96, 13, 28, 'This is a high-quality product designed to meet your needs. Made with premium materials and built to last.', 'product_description', NULL, NULL, 0, 0, 5, NULL),
(97, 13, 27, 'Features', 'features_label', NULL, NULL, 0, 0, 6, NULL),
(98, 13, 28, 'â€¢ Premium quality materials\nâ€¢ Durable construction\nâ€¢ Easy to use\nâ€¢ 1-year warranty', 'product_features', NULL, NULL, 0, 0, 7, NULL),
(99, 13, 27, 'Quantity', 'quantity_label', NULL, NULL, 0, 0, 8, NULL),
(100, 13, 11, 'Quantity', 'quantity', '1', NULL, 0, 0, 9, NULL),
(101, 13, 33, 'Add to Cart', 'add_to_cart_button', NULL, NULL, 0, 0, 10, NULL),
(102, 13, 33, 'Buy Now', 'buy_now_button', NULL, NULL, 0, 0, 11, NULL),
(103, 14, 27, 'Shopping Cart', 'cart_heading', NULL, NULL, 0, 0, 0, NULL),
(104, 14, 28, 'Review your items before checkout', 'cart_description', NULL, NULL, 0, 0, 1, NULL),
(105, 14, 28, 'Cart Items (3)', 'cart_items_label', NULL, NULL, 0, 0, 2, NULL),
(106, 14, 27, 'Order Summary', 'summary_heading', NULL, NULL, 0, 0, 3, NULL),
(107, 14, 28, 'Subtotal: $299.97', 'subtotal', NULL, NULL, 0, 0, 4, NULL),
(108, 14, 28, 'Shipping: $10.00', 'shipping', NULL, NULL, 0, 0, 5, NULL),
(109, 14, 28, 'Tax: $24.00', 'tax', NULL, NULL, 0, 0, 6, NULL),
(110, 14, 27, 'Total: $333.97', 'total', NULL, NULL, 0, 0, 7, NULL),
(111, 14, 33, 'Proceed to Checkout', 'checkout_button', NULL, NULL, 0, 0, 8, NULL),
(112, 14, 33, 'Continue Shopping', 'continue_shopping_button', NULL, NULL, 0, 0, 9, NULL),
(113, 15, 27, 'Checkout', 'checkout_heading', NULL, NULL, 0, 0, 0, NULL),
(114, 15, 27, 'Shipping Address', 'shipping_heading', NULL, NULL, 0, 0, 1, NULL),
(115, 15, 1, 'Full Name', 'shipping_name', 'Enter full name', NULL, 1, 0, 2, NULL),
(116, 15, 1, 'Address Line 1', 'address_line1', 'Street address', NULL, 1, 0, 3, NULL),
(117, 15, 1, 'Address Line 2', 'address_line2', 'Apt, suite, etc. (optional)', NULL, 0, 0, 4, NULL),
(118, 15, 1, 'City', 'city', 'City', NULL, 1, 0, 5, NULL),
(119, 15, 1, 'State/Province', 'state', 'State', NULL, 1, 0, 6, NULL),
(120, 15, 1, 'ZIP/Postal Code', 'zip', 'ZIP code', NULL, 1, 0, 7, NULL),
(121, 15, 5, 'Phone', 'phone', '(555) 123-4567', NULL, 1, 0, 8, NULL),
(122, 15, 27, 'Payment Method', 'payment_heading', NULL, NULL, 0, 0, 9, NULL),
(123, 15, 28, 'Credit/Debit Card', 'payment_method', NULL, NULL, 0, 0, 10, NULL),
(124, 15, 33, 'Place Order', 'place_order_button', NULL, NULL, 0, 0, 11, NULL),
(125, 16, 27, 'Order Confirmed!', 'confirmation_heading', NULL, NULL, 0, 0, 0, NULL),
(126, 16, 28, 'Thank you for your purchase. Your order has been successfully placed.', 'confirmation_message', NULL, NULL, 0, 0, 1, NULL),
(127, 16, 27, 'Order Number', 'order_number_label', NULL, NULL, 0, 0, 2, NULL),
(128, 16, 28, '#ORD-123456', 'order_number', NULL, NULL, 0, 0, 3, NULL),
(129, 16, 27, 'Estimated Delivery', 'delivery_label', NULL, NULL, 0, 0, 4, NULL),
(130, 16, 28, '3-5 business days', 'delivery_time', NULL, NULL, 0, 0, 5, NULL),
(131, 16, 27, 'Order Total', 'total_label', NULL, NULL, 0, 0, 6, NULL),
(132, 16, 28, '$333.97', 'order_total', NULL, NULL, 0, 0, 7, NULL),
(133, 16, 33, 'Track Order', 'track_button', NULL, NULL, 0, 0, 8, NULL),
(134, 16, 33, 'Continue Shopping', 'continue_button', NULL, NULL, 0, 0, 9, NULL),
(135, 17, 27, 'Dashboard', 'dashboard_heading', NULL, NULL, 0, 0, 0, NULL),
(136, 17, 28, 'Welcome back! Here is your overview', 'dashboard_subtitle', NULL, NULL, 0, 0, 1, NULL),
(137, 17, 27, 'Quick Stats', 'stats_heading', NULL, NULL, 0, 0, 2, NULL),
(138, 17, 28, 'Total Orders: 24', 'stat_orders', NULL, NULL, 0, 0, 3, NULL),
(139, 17, 28, 'Active Projects: 5', 'stat_projects', NULL, NULL, 0, 0, 4, NULL),
(140, 17, 28, 'Messages: 12', 'stat_messages', NULL, NULL, 0, 0, 5, NULL),
(141, 17, 27, 'Recent Activity', 'activity_heading', NULL, NULL, 0, 0, 6, NULL),
(142, 17, 28, 'New order received', 'activity_1', NULL, NULL, 0, 0, 7, NULL),
(143, 17, 28, 'Profile updated', 'activity_2', NULL, NULL, 0, 0, 8, NULL),
(144, 17, 28, 'Payment processed', 'activity_3', NULL, NULL, 0, 0, 9, NULL),
(145, 18, 27, 'Chat', 'chat_heading', NULL, NULL, 0, 0, 0, NULL),
(146, 18, 28, 'John Doe', 'contact_name', NULL, NULL, 0, 0, 1, NULL),
(147, 18, 28, 'Online', 'contact_status', NULL, NULL, 0, 0, 2, NULL),
(148, 18, 28, 'Message history will appear here', 'messages_placeholder', NULL, NULL, 0, 0, 3, NULL),
(149, 18, 2, 'Type a message', 'message_input', 'Type your message...', NULL, 0, 0, 4, NULL),
(150, 18, 33, 'Send', 'send_button', NULL, NULL, 0, 0, 5, NULL),
(151, 19, 27, 'Write a Review', 'review_heading', NULL, NULL, 0, 0, 0, NULL),
(152, 19, 28, 'Share your experience with others', 'review_description', NULL, NULL, 0, 0, 1, NULL),
(153, 19, 27, 'Rating', 'rating_label', NULL, NULL, 0, 0, 2, NULL),
(154, 19, 28, 'â˜…â˜…â˜…â˜…â˜… (5 stars)', 'rating_display', NULL, NULL, 0, 0, 3, NULL),
(155, 19, 1, 'Review Title', 'review_title', 'Summarize your experience', NULL, 1, 0, 4, NULL),
(156, 19, 2, 'Your Review', 'review_text', 'Tell us about your experience...', NULL, 1, 0, 5, NULL),
(157, 19, 33, 'Submit Review', 'submit_button', NULL, NULL, 0, 0, 6, NULL),
(158, 20, 27, 'Privacy Policy', 'privacy_heading', NULL, NULL, 0, 0, 0, NULL),
(159, 20, 28, 'Last updated: November 2025', 'last_updated', NULL, NULL, 0, 0, 1, NULL),
(160, 20, 27, 'Information We Collect', 'section1_heading', NULL, NULL, 0, 0, 2, NULL),
(161, 20, 28, 'We collect information you provide directly to us, including name, email, and usage data.', 'section1_text', NULL, NULL, 0, 0, 3, NULL),
(162, 20, 27, 'How We Use Your Information', 'section2_heading', NULL, NULL, 0, 0, 4, NULL),
(163, 20, 28, 'We use your information to provide, maintain, and improve our services.', 'section2_text', NULL, NULL, 0, 0, 5, NULL),
(164, 20, 27, 'Data Security', 'section3_heading', NULL, NULL, 0, 0, 6, NULL),
(165, 20, 28, 'We implement appropriate security measures to protect your personal information.', 'section3_text', NULL, NULL, 0, 0, 7, NULL),
(166, 21, 27, 'Terms of Service', 'terms_heading', NULL, NULL, 0, 0, 0, NULL),
(167, 21, 28, 'Last updated: November 2025', 'last_updated', NULL, NULL, 0, 0, 1, NULL),
(168, 21, 27, 'Acceptance of Terms', 'section1_heading', NULL, NULL, 0, 0, 2, NULL),
(169, 21, 28, 'By accessing our service, you agree to be bound by these terms.', 'section1_text', NULL, NULL, 0, 0, 3, NULL),
(170, 21, 27, 'User Responsibilities', 'section2_heading', NULL, NULL, 0, 0, 4, NULL),
(171, 21, 28, 'You are responsible for maintaining the confidentiality of your account.', 'section2_text', NULL, NULL, 0, 0, 5, NULL),
(172, 21, 27, 'Termination', 'section3_heading', NULL, NULL, 0, 0, 6, NULL),
(173, 21, 28, 'We may terminate or suspend access to our service immediately, without prior notice.', 'section3_text', NULL, NULL, 0, 0, 7, NULL),
(174, 22, 27, 'Book Appointment', 'booking_heading', NULL, NULL, 0, 0, 0, NULL),
(175, 22, 28, 'Schedule your appointment', 'booking_description', NULL, NULL, 0, 0, 1, NULL),
(176, 22, 1, 'Full Name', 'full_name', 'Enter your name', NULL, 1, 0, 2, NULL),
(177, 22, 4, 'Email', 'email', 'your.email@example.com', NULL, 1, 0, 3, NULL),
(178, 22, 5, 'Phone', 'phone', '(555) 123-4567', NULL, 1, 0, 4, NULL),
(179, 22, 12, 'Preferred Date', 'booking_date', NULL, NULL, 1, 0, 5, NULL),
(180, 22, 1, 'Preferred Time', 'booking_time', 'Select time', NULL, 1, 0, 6, NULL),
(181, 22, 2, 'Additional Notes', 'notes', 'Any special requests...', NULL, 0, 0, 7, NULL),
(182, 22, 33, 'Confirm Booking', 'confirm_button', NULL, NULL, 0, 0, 8, NULL),
(183, 23, 27, 'Payment Method', 'payment_heading', NULL, NULL, 0, 0, 0, NULL),
(184, 23, 28, 'Add a payment method to your account', 'payment_description', NULL, NULL, 0, 0, 1, NULL),
(185, 23, 1, 'Cardholder Name', 'cardholder_name', 'Name on card', NULL, 1, 0, 2, NULL),
(186, 23, 1, 'Card Number', 'card_number', '1234 5678 9012 3456', NULL, 1, 0, 3, NULL),
(187, 23, 1, 'Expiry Date', 'expiry_date', 'MM/YY', NULL, 1, 0, 4, NULL),
(188, 23, 1, 'CVV', 'cvv', '123', NULL, 1, 0, 5, NULL),
(189, 23, 1, 'Billing ZIP Code', 'billing_zip', 'ZIP code', NULL, 1, 0, 6, NULL),
(190, 23, 33, 'Save Payment Method', 'save_button', NULL, NULL, 0, 0, 7, NULL),
(191, 24, 47, 'App Logo', 'app_logo', NULL, NULL, 0, 0, 0, '{\"width\": \"200px\", \"height\": \"200px\", \"altText\": \"App Logo\", \"imageUrl\": \"https://placehold.co/200x200?text=Logo\", \"alignment\": \"center\"}'),
(192, 24, 27, 'App Name', 'app_name', NULL, NULL, 0, 0, 1, NULL),
(193, 24, 28, 'Version 1.0', 'app_version', NULL, NULL, 0, 0, 2, NULL),
(194, 24, 28, 'Loading...', 'loading_text', NULL, NULL, 0, 0, 3, NULL),
(195, 25, 27, 'Welcome!', 'onboarding_heading', NULL, NULL, 0, 0, 0, NULL),
(196, 25, 47, 'Feature Image 1', 'feature_image_1', NULL, NULL, 0, 0, 1, '{\"width\": \"100%\", \"height\": \"auto\", \"altText\": \"Feature 1\", \"imageUrl\": \"https://placehold.co/300x200?text=Feature+1\", \"alignment\": \"center\"}'),
(197, 25, 27, 'Easy to Use', 'feature_1_title', NULL, NULL, 0, 0, 2, NULL),
(198, 25, 28, 'Our app is designed with simplicity in mind. Get started in seconds!', 'feature_1_description', NULL, NULL, 0, 0, 3, NULL),
(199, 25, 47, 'Feature Image 2', 'feature_image_2', NULL, NULL, 0, 0, 4, '{\"width\": \"100%\", \"height\": \"auto\", \"altText\": \"Feature 2\", \"imageUrl\": \"https://placehold.co/300x200?text=Feature+2\", \"alignment\": \"center\"}'),
(200, 25, 27, 'Powerful Features', 'feature_2_title', NULL, NULL, 0, 0, 5, NULL),
(201, 25, 28, 'Access all the tools you need to be productive and efficient.', 'feature_2_description', NULL, NULL, 0, 0, 6, NULL),
(202, 25, 47, 'Feature Image 3', 'feature_image_3', NULL, NULL, 0, 0, 7, '{\"width\": \"100%\", \"height\": \"auto\", \"altText\": \"Feature 3\", \"imageUrl\": \"https://placehold.co/300x200?text=Feature+3\", \"alignment\": \"center\"}'),
(203, 25, 27, 'Secure & Private', 'feature_3_title', NULL, NULL, 0, 0, 8, NULL),
(204, 25, 28, 'Your data is protected with industry-standard security measures.', 'feature_3_description', NULL, NULL, 0, 0, 9, NULL),
(205, 25, 33, 'Get Started', 'get_started_button', NULL, NULL, 0, 0, 10, NULL),
(206, 25, 28, 'Skip', 'skip_link', NULL, NULL, 0, 0, 11, NULL),
(207, 26, 47, 'Profile Photo', 'profile_photo', 'Upload profile photo', '', 0, 0, 1, '{\"width\": \"150px\", \"height\": \"150px\", \"altText\": \"Profile Photo\", \"imageUrl\": \"https://placehold.co/150x150?text=Photo\", \"alignment\": \"center\"}'),
(208, 26, 1, 'First Name', 'first_name', 'Enter your first name', '', 1, 0, 2, NULL),
(209, 26, 1, 'Last Name', 'last_name', 'Enter your last name', '', 1, 0, 3, NULL),
(210, 26, 4, 'Email Address', 'email', 'your.email@example.com', '', 1, 0, 4, NULL),
(211, 26, 5, 'Phone Number', 'phone', '+1 (555) 123-4567', '', 0, 0, 5, NULL),
(212, 26, 2, 'Bio', 'bio', 'Tell us about yourself...', '', 0, 0, 6, NULL),
(213, 26, 17, 'Date of Birth', 'date_of_birth', 'Select your date of birth', '', 0, 0, 7, NULL),
(214, 26, 10, 'Gender', 'gender', 'Select your gender', '', 0, 0, 8, '{\"options\": [{\"label\": \"Male\", \"value\": \"male\"}, {\"label\": \"Female\", \"value\": \"female\"}, {\"label\": \"Non-binary\", \"value\": \"non_binary\"}, {\"label\": \"Prefer not to say\", \"value\": \"prefer_not_to_say\"}]}'),
(215, 26, 33, 'Save Changes', 'save_button', '', '', 0, 0, 9, NULL),
(216, 26, 34, 'Change Password', 'change_password_link', '', '', 0, 0, 10, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role_id`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin@knoxweb.com', '$2a$10$9mPSeZHQr04vZKsSBF7JOOuxy7GpXAf.2FTMTpmeFRpZbx7wqZ2au', 'Master', 'Administrator', 1, 1, '2025-11-17 13:10:48', '2025-10-31 13:21:45', '2025-11-17 13:10:48'),
(2, 'user1@knoxweb.com', '$2a$10$fcr9XkWwxN5RPWGDTmleCOtCTsecALyN1XOGQh/CLhamx64xvAU7u', 'John', 'Smith', 2, 1, '2025-11-10 18:30:57', '2025-10-31 13:21:45', '2025-11-10 18:30:57'),
(3, 'user2@knoxweb.com', '$2a$10$eLW2E6JKL/5xfwwv4ktQIegPxQD0A8tGQ5fAIPyY1GGP1dz7/8kQ.', 'Sarah', 'Johnson', 2, 1, '2025-10-31 15:40:41', '2025-10-31 13:21:45', '2025-10-31 15:40:41'),
(4, 'user3@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Mike', 'Davis', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(5, 'user4@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Emily', 'Wilson', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(6, 'user5@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'David', 'Brown', 2, 1, NULL, '2025-10-31 13:21:45', '2025-11-06 19:17:03');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity_log`
--

CREATE TABLE `user_activity_log` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `app_id` int NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resource_id` int DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_activity_log`
--

INSERT INTO `user_activity_log` (`id`, `user_id`, `app_id`, `action`, `resource_type`, `resource_id`, `ip_address`, `user_agent`, `metadata`, `created_at`) VALUES
(1, 9, 1, 'register', NULL, NULL, '::ffff:172.217.215.95', 'curl/8.7.1', NULL, '2025-11-03 20:34:07'),
(2, 9, 1, 'login', NULL, NULL, '::ffff:172.217.215.95', 'curl/8.7.1', NULL, '2025-11-03 20:34:49'),
(13, 19, 1, 'register', NULL, NULL, '::ffff:192.168.65.1', 'curl/8.7.1', NULL, '2025-11-07 19:52:49'),
(14, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 18:49:18'),
(15, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 19:06:42'),
(16, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 19:10:28'),
(17, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 19:16:37'),
(18, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 19:21:24'),
(19, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 19:45:02'),
(20, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 20:13:40'),
(21, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 20:44:21'),
(22, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 21:08:06'),
(23, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 21:15:09'),
(24, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 21:29:18'),
(25, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-13 21:38:10'),
(26, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-14 17:51:06'),
(27, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-14 18:54:18'),
(28, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-14 19:40:41'),
(29, 21, 28, 'login', NULL, NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', NULL, '2025-11-17 14:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `user_app_permissions`
--

CREATE TABLE `user_app_permissions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `app_id` int NOT NULL,
  `can_view` tinyint(1) DEFAULT '1',
  `can_edit` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  `can_publish` tinyint(1) DEFAULT '0',
  `can_manage_users` tinyint(1) DEFAULT '0',
  `can_manage_settings` tinyint(1) DEFAULT '0',
  `custom_permissions` json DEFAULT NULL COMMENT 'Store additional custom permissions as JSON',
  `granted_by` int NOT NULL COMMENT 'User ID who granted these permissions',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_app_permissions`
--

INSERT INTO `user_app_permissions` (`id`, `user_id`, `app_id`, `can_view`, `can_edit`, `can_delete`, `can_publish`, `can_manage_users`, `can_manage_settings`, `custom_permissions`, `granted_by`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, 1, 1, 1, 1, 1, NULL, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(5, 4, 1, 1, 1, 0, 0, 0, 0, NULL, 2, '2025-10-31 13:21:45', '2025-11-04 15:34:52'),
(9, 6, 4, 1, 1, 0, 0, 0, 0, NULL, 3, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(16, 6, 28, 1, 1, 1, 1, 1, 1, NULL, 1, '2025-11-13 18:47:23', '2025-11-13 18:47:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int NOT NULL,
  `app_id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `app_id`, `name`, `display_name`, `description`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 'user', 'User', 'Default user role with basic permissions', 1, '2025-11-03 20:52:20', '2025-11-03 20:52:20'),
(2, 1, 'moderator', 'Moderator', 'Can moderate content and comments', 0, '2025-11-03 20:52:20', '2025-11-03 20:52:20'),
(3, 1, 'premium', 'Premium User', 'Premium subscription with enhanced features', 0, '2025-11-03 20:52:20', '2025-11-03 20:52:20'),
(4, 1, 'admin', 'Administrator', 'Full access to all features', 0, '2025-11-03 20:52:20', '2025-11-03 20:52:20');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `app_id` int NOT NULL,
  `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_info` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `expires_at` datetime NOT NULL,
  `refresh_expires_at` datetime DEFAULT NULL,
  `last_activity_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `app_id`, `token_hash`, `refresh_token_hash`, `device_info`, `ip_address`, `user_agent`, `expires_at`, `refresh_expires_at`, `last_activity_at`, `created_at`) VALUES
(1, 9, 1, '76ed1f216afe66e893a8d1406b286a926ba932da274179a220deeea600b45f46', 'ebfbff84dc80c708c02efa51e19f92c6a54b018bc80507e845c693e461ae0bba', NULL, '::ffff:172.217.215.95', 'curl/8.7.1', '2025-11-10 20:34:08', '2025-12-03 20:34:08', '2025-11-03 20:34:07', '2025-11-03 20:34:07'),
(2, 9, 1, '5e36cfca0f2bbdf90e0cf8a92517c6e886936d3b90b11ec7af4c8216b41d8e55', '6118067ddaeefc03fe1b44076b995eb74b034fc98e092c1ae90484e715b7885e', NULL, '::ffff:172.217.215.95', 'curl/8.7.1', '2025-11-10 20:34:49', '2025-12-03 20:34:49', '2025-11-03 20:40:24', '2025-11-03 20:34:49'),
(14, 19, 1, 'cce3e823ddb03180e09d699104a1ce2825083b8d3b1bc5c15044100480b6c85b', 'f2ba3848c77e442f06c16af3ded5ee2ba9b8c22ef569e29ea171bb8606436f12', NULL, '::ffff:192.168.65.1', 'curl/8.7.1', '2025-11-14 19:52:50', '2025-12-07 19:52:50', '2025-11-07 19:52:49', '2025-11-07 19:52:49'),
(15, 21, 28, 'e8522b4a976d7c430cafa30d528d53125cbd7ebd76b13884dd59e18a5359ad4e', 'bb33e1097a5d341e2c9fc0cbea3411224ecbc0d1d21480c72c936bd5bb696a7c', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 18:49:18', '2025-12-13 18:49:18', '2025-11-13 18:49:18', '2025-11-13 18:49:18'),
(16, 21, 28, '2e44e15ec3f43a3e574a78c648eeeaad4595565218c12a7121b3fd7e6c7be255', 'efc12e713b83af681ceb305d387624a7edfc5aa08e7fee7bf5f8f6be1ae6c7e1', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 19:06:43', '2025-12-13 19:06:43', '2025-11-13 19:06:42', '2025-11-13 19:06:42'),
(17, 21, 28, 'fd0e469225c46c9e0b5b282b54ab5110bf69a17a5cb3fff5186a1f9f24bfccfe', 'cae448efc3475fae127fe89fca70f4b84802f275c1270e52225adfaa620b3937', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 19:10:29', '2025-12-13 19:10:29', '2025-11-13 19:10:28', '2025-11-13 19:10:28'),
(18, 21, 28, '8255697d3af618947c567092e41d01b1e0e0f72e4e993d95d7a04b3817cbd9ba', '9b8bd31d7f3608e64862937195db826bb2b07d26fa00b569c72dd2e2baf6bd0f', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 19:16:37', '2025-12-13 19:16:37', '2025-11-13 19:16:37', '2025-11-13 19:16:37'),
(19, 21, 28, '25e02c2abb3f4162960d45f27b3cf863550b24f8a65ea2f555ab6bd2c378dc4b', '043b3703f4201494b66a68e15176f27aecd1478483c2430a0889cf7c81588fe0', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 19:21:24', '2025-12-13 19:21:24', '2025-11-13 19:21:24', '2025-11-13 19:21:24'),
(20, 21, 28, '1afa900ad1f50137e2ffb26419392d3d123cf5919a0a47b683988f333eaf49c6', '8984d56ac470323c79558140c039cd9b4f19bb9e729f48bc5ed66608e8e9deab', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 19:45:03', '2025-12-13 19:45:03', '2025-11-13 19:45:02', '2025-11-13 19:45:02'),
(21, 21, 28, '3dbd9a1727ef1aa3d5c37b1c022eeea2eb535e0005967d1140f57bd738644be3', 'e1d71848f90b32cba99d95919fae6729346bf2d4c6b59bd8acf0f86e69cd6af8', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 20:13:41', '2025-12-13 20:13:41', '2025-11-13 20:13:40', '2025-11-13 20:13:40'),
(22, 21, 28, '3ec1d94e8b44c4bfef6a8eb7e5096e432cd018cb541b57675df89c5b6a00802a', '898d16e011a97c9e4e6fdd0f8a053204948ca840c0b0a9dd2cc55a79005bf6fe', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 20:44:21', '2025-12-13 20:44:21', '2025-11-13 20:44:21', '2025-11-13 20:44:21'),
(23, 21, 28, '5fae24de7f51d7dafcc043c3eb6d5e7f5957be9ff1cfc0c5b026e50d5e43848f', 'd212a7584cf046c9762dbe96d8a07c78722f7f5e5ff244afb6f02413e024bf26', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 21:08:06', '2025-12-13 21:08:06', '2025-11-13 21:08:09', '2025-11-13 21:08:06'),
(24, 21, 28, '7ca0d49b1177c37ca1658e234577d9cf2cc289463df32c0e7ecf4e667f905746', '99ec7f4cdc8783ab296ec27dc9fe060ade64e12a05f8aaa0788eca9d96cb3083', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 21:15:10', '2025-12-13 21:15:10', '2025-11-13 21:19:08', '2025-11-13 21:15:09'),
(25, 21, 28, '5cee1f2da932e310d6ce0cf27e811b64750542710ee7acf4c2ccdb9e75dab7ee', 'ce48df1e40f9c9ff0af706582bf861415af3df80fb979f9635c56aca8060e969', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 21:29:19', '2025-12-13 21:29:19', '2025-11-13 21:29:22', '2025-11-13 21:29:18'),
(26, 21, 28, '42e3afd8114f527794fad14f842849113489fbcd4e6a9be1e4a2ddb324ed9ddd', '730d72cc2f479344780d38e6c5febf1583c8b0089e2b026afd319cdb749c505e', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-20 21:38:10', '2025-12-13 21:38:10', '2025-11-14 16:34:39', '2025-11-13 21:38:10'),
(27, 21, 28, '06069347340455202f34a01d6641fedb6594fcb88af34dbc7b92096c681f6e6b', '79feeff9937a19375bbe72ceaa2a229b48f9a242c0ec9556f2a4efc9cf999c87', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-21 17:51:06', '2025-12-14 17:51:06', '2025-11-14 18:43:41', '2025-11-14 17:51:06'),
(28, 21, 28, '60542b9ad6742caa481be1f2192bb7723da895476e15b69274904e1a3aae4d72', '91fd8a542cbc7183e7ddff96b8b1e9f55ad1c968a4b341928fafef174a89debc', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-21 18:54:19', '2025-12-14 18:54:19', '2025-11-14 18:54:24', '2025-11-14 18:54:18'),
(29, 21, 28, 'e3d3a006c988b7606d8444af6a7a9b58fefedfcf9371b8f6a3f856709eec266d', '987579a558511943970f654789889292ed87f7681f79357d222e3532362f1dd2', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-21 19:40:42', '2025-12-14 19:40:42', '2025-11-14 19:42:04', '2025-11-14 19:40:41'),
(30, 21, 28, '9f0971a7058c9e4ef8989819eba4386b9e1255264474f899390e4df8598ed7b8', 'e65dc10ef44e66d5c0cfdd5e4c4358ec512fa1c3bb4fde3e2334c54d8cf6696f', NULL, '::ffff:142.250.105.94', 'PropertyListings/1 CFNetwork/1568.200.51 Darwin/24.6.0', '2025-11-24 14:02:24', '2025-12-17 14:02:24', '2025-11-17 14:03:03', '2025-11-17 14:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `notifications_enabled` tinyint(1) DEFAULT '1',
  `email_notifications` tinyint(1) DEFAULT '1',
  `push_notifications` tinyint(1) DEFAULT '1',
  `sms_notifications` tinyint(1) DEFAULT '0',
  `language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `theme` enum('light','dark','auto') COLLATE utf8mb4_unicode_ci DEFAULT 'auto',
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'UTC',
  `privacy_settings` json DEFAULT NULL,
  `custom_settings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_settings`
--

INSERT INTO `user_settings` (`id`, `user_id`, `notifications_enabled`, `email_notifications`, `push_notifications`, `sms_notifications`, `language`, `theme`, `timezone`, `privacy_settings`, `custom_settings`, `created_at`, `updated_at`) VALUES
(1, 9, 1, 1, 1, 0, 'en', 'auto', 'UTC', NULL, NULL, '2025-11-03 20:34:07', '2025-11-03 20:34:07'),
(11, 19, 1, 1, 1, 0, 'en', 'auto', 'UTC', NULL, NULL, '2025-11-07 19:52:49', '2025-11-07 19:52:49'),
(12, 21, 1, 1, 1, 0, 'en', 'auto', 'UTC', NULL, NULL, '2025-11-13 18:11:29', '2025-11-13 18:11:29');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_app_overview`
-- (See below for the actual view)
--
CREATE TABLE `v_app_overview` (
`created_at` timestamp
,`created_by_name` varchar(201)
,`domain` varchar(255)
,`id` int
,`is_active` tinyint(1)
,`name` varchar(255)
,`total_users` bigint
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_user_permissions`
-- (See below for the actual view)
--
CREATE TABLE `v_user_permissions` (
`app_domain` varchar(255)
,`app_id` int
,`app_name` varchar(255)
,`can_delete` tinyint(1)
,`can_edit` tinyint(1)
,`can_manage_settings` tinyint(1)
,`can_manage_users` tinyint(1)
,`can_publish` tinyint(1)
,`can_view` tinyint(1)
,`custom_permissions` json
,`email` varchar(255)
,`first_name` varchar(100)
,`last_name` varchar(100)
,`role_level` int
,`role_name` varchar(50)
,`user_id` int
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_app` (`app_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `apps`
--
ALTER TABLE `apps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_domain` (`domain`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_apps_template_id` (`template_id`);

--
-- Indexes for table `app_custom_screen_elements`
--
ALTER TABLE `app_custom_screen_elements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_app_screen_field` (`app_id`,`screen_id`,`field_key`),
  ADD KEY `screen_id` (`screen_id`),
  ADD KEY `element_id` (`element_id`),
  ADD KEY `idx_custom_element_app_screen` (`app_id`,`screen_id`),
  ADD KEY `idx_custom_element_display_order` (`display_order`);

--
-- Indexes for table `app_menus`
--
ALTER TABLE `app_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_app_id` (`app_id`),
  ADD KEY `idx_menu_type` (`menu_type`);

--
-- Indexes for table `app_modules`
--
ALTER TABLE `app_modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_module_type` (`module_type`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `app_roles`
--
ALTER TABLE `app_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_name` (`app_id`,`name`),
  ADD KEY `idx_app` (`app_id`),
  ADD KEY `idx_default` (`is_default`);

--
-- Indexes for table `app_screens`
--
ALTER TABLE `app_screens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_screen_key` (`screen_key`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `fk_screen_created_by` (`created_by`);

--
-- Indexes for table `app_screen_assignments`
--
ALTER TABLE `app_screen_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_app_screen` (`app_id`,`screen_id`),
  ADD KEY `idx_app` (`app_id`),
  ADD KEY `idx_screen` (`screen_id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `fk_assignment_assigned_by` (`assigned_by`),
  ADD KEY `idx_assignment_app_active` (`app_id`,`is_active`),
  ADD KEY `idx_is_published` (`is_published`),
  ADD KEY `idx_app_screen_auto_sync` (`app_id`,`screen_id`,`auto_sync_enabled`),
  ADD KEY `idx_menu_placements` (`app_id`,`show_in_tabbar`,`tabbar_order`),
  ADD KEY `idx_sidebar` (`app_id`,`show_in_sidebar`,`sidebar_order`);

--
-- Indexes for table `app_screen_content`
--
ALTER TABLE `app_screen_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_app_screen_element` (`app_id`,`screen_id`,`element_instance_id`),
  ADD KEY `idx_app_screen` (`app_id`,`screen_id`),
  ADD KEY `idx_element_instance` (`element_instance_id`),
  ADD KEY `fk_content_updated_by` (`updated_by`),
  ADD KEY `fk_content_screen` (`screen_id`),
  ADD KEY `idx_content_app_screen` (`app_id`,`screen_id`);

--
-- Indexes for table `app_screen_element_overrides`
--
ALTER TABLE `app_screen_element_overrides`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_app_element_override` (`app_id`,`element_instance_id`),
  ADD KEY `screen_id` (`screen_id`),
  ADD KEY `idx_override_app_screen` (`app_id`,`screen_id`),
  ADD KEY `idx_override_element` (`element_instance_id`);

--
-- Indexes for table `app_screen_version_assignments`
--
ALTER TABLE `app_screen_version_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_app_screen` (`app_id`,`screen_id`),
  ADD KEY `screen_id` (`screen_id`),
  ADD KEY `version_id` (`version_id`),
  ADD KEY `locked_by` (`locked_by`),
  ADD KEY `idx_preview` (`is_preview_mode`),
  ADD KEY `idx_locked` (`locked`);

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_app_setting` (`app_id`,`setting_key`),
  ADD KEY `idx_app_key` (`app_id`,`setting_key`);

--
-- Indexes for table `app_templates`
--
ALTER TABLE `app_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `app_template_screens`
--
ALTER TABLE `app_template_screens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_template_id` (`template_id`),
  ADD KEY `idx_display_order` (`display_order`),
  ADD KEY `screen_id` (`screen_id`);

--
-- Indexes for table `app_template_screen_elements`
--
ALTER TABLE `app_template_screen_elements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `element_id` (`element_id`),
  ADD KEY `idx_template_screen_id` (`template_screen_id`),
  ADD KEY `idx_display_order` (`display_order`);

--
-- Indexes for table `app_users`
--
ALTER TABLE `app_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email_per_app` (`app_id`,`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_app_id` (`app_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_email_verification_token` (`email_verification_token`),
  ADD KEY `idx_password_reset_token` (`password_reset_token`);

--
-- Indexes for table `app_user_role_assignments`
--
ALTER TABLE `app_user_role_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_role` (`user_id`,`role_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_role_id` (`role_id`),
  ADD KEY `fk_app_user_role_assignments_app_role` (`app_role_id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_menu_screen` (`menu_id`,`screen_id`),
  ADD KEY `idx_menu_id` (`menu_id`),
  ADD KEY `idx_screen_id` (`screen_id`),
  ADD KEY `idx_display_order` (`display_order`);

--
-- Indexes for table `property_amenities`
--
ALTER TABLE `property_amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_amenity_name` (`name`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `property_availability`
--
ALTER TABLE `property_availability`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_listing_date` (`listing_id`,`date`),
  ADD KEY `idx_listing` (`listing_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_available` (`listing_id`,`date`,`is_available`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_listing` (`listing_id`),
  ADD KEY `idx_primary` (`listing_id`,`is_primary`),
  ADD KEY `idx_order` (`listing_id`,`display_order`);

--
-- Indexes for table `property_listings`
--
ALTER TABLE `property_listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_app_id` (`app_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_location` (`city`,`state`,`country`),
  ADD KEY `idx_coordinates` (`latitude`,`longitude`),
  ADD KEY `idx_status` (`status`,`is_published`),
  ADD KEY `idx_price` (`price_per_night`);

--
-- Indexes for table `property_listing_amenities`
--
ALTER TABLE `property_listing_amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_listing_amenity` (`listing_id`,`amenity_id`),
  ADD KEY `idx_listing` (`listing_id`),
  ADD KEY `idx_amenity` (`amenity_id`);

--
-- Indexes for table `publish_history`
--
ALTER TABLE `publish_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `screen_id` (`screen_id`),
  ADD KEY `version_id` (`version_id`),
  ADD KEY `published_by` (`published_by`),
  ADD KEY `idx_app_screen` (`app_id`,`screen_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_level` (`level`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `role_permission_assignments`
--
ALTER TABLE `role_permission_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  ADD KEY `idx_role_id` (`role_id`),
  ADD KEY `idx_permission_id` (`permission_id`);

--
-- Indexes for table `screen_elements`
--
ALTER TABLE `screen_elements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_element_type` (`element_type`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `screen_element_instances`
--
ALTER TABLE `screen_element_instances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_screen_field` (`screen_id`,`field_key`),
  ADD KEY `idx_screen` (`screen_id`),
  ADD KEY `idx_element` (`element_id`),
  ADD KEY `idx_display_order` (`display_order`),
  ADD KEY `idx_instance_screen_order` (`screen_id`,`display_order`);

--
-- Indexes for table `screen_menu_assignments`
--
ALTER TABLE `screen_menu_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_screen_menu` (`screen_id`,`menu_id`),
  ADD KEY `idx_screen_id` (`screen_id`),
  ADD KEY `idx_menu_id` (`menu_id`);

--
-- Indexes for table `screen_module_assignments`
--
ALTER TABLE `screen_module_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_screen_module` (`screen_id`,`module_id`),
  ADD KEY `idx_screen` (`screen_id`),
  ADD KEY `idx_module` (`module_id`);

--
-- Indexes for table `screen_role_access`
--
ALTER TABLE `screen_role_access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_screen_role` (`screen_id`,`role_id`,`app_id`),
  ADD KEY `idx_screen` (`screen_id`),
  ADD KEY `idx_role` (`role_id`),
  ADD KEY `idx_app` (`app_id`);

--
-- Indexes for table `screen_submissions`
--
ALTER TABLE `screen_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `screen_id` (`screen_id`),
  ADD KEY `idx_app_screen` (`app_id`,`screen_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `screen_templates`
--
ALTER TABLE `screen_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `screen_versions`
--
ALTER TABLE `screen_versions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_screen_version` (`screen_id`,`version_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_screen_version` (`screen_id`,`version_number`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `template_elements`
--
ALTER TABLE `template_elements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `element_id` (`element_id`),
  ADD KEY `idx_template_id` (`template_id`),
  ADD KEY `idx_display_order` (`display_order`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `user_activity_log`
--
ALTER TABLE `user_activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_app_id` (`app_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `user_app_permissions`
--
ALTER TABLE `user_app_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_app` (`user_id`,`app_id`),
  ADD KEY `granted_by` (`granted_by`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_app` (`app_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_per_app` (`app_id`,`name`),
  ADD KEY `idx_app_id` (`app_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_token` (`token_hash`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_app_id` (`app_id`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_token_hash` (`token_hash`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_settings` (`user_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `apps`
--
ALTER TABLE `apps`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `app_custom_screen_elements`
--
ALTER TABLE `app_custom_screen_elements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `app_menus`
--
ALTER TABLE `app_menus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `app_modules`
--
ALTER TABLE `app_modules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `app_roles`
--
ALTER TABLE `app_roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `app_screens`
--
ALTER TABLE `app_screens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `app_screen_assignments`
--
ALTER TABLE `app_screen_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;

--
-- AUTO_INCREMENT for table `app_screen_content`
--
ALTER TABLE `app_screen_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `app_screen_element_overrides`
--
ALTER TABLE `app_screen_element_overrides`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `app_screen_version_assignments`
--
ALTER TABLE `app_screen_version_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `app_templates`
--
ALTER TABLE `app_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `app_template_screens`
--
ALTER TABLE `app_template_screens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=575;

--
-- AUTO_INCREMENT for table `app_template_screen_elements`
--
ALTER TABLE `app_template_screen_elements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3092;

--
-- AUTO_INCREMENT for table `app_users`
--
ALTER TABLE `app_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `app_user_role_assignments`
--
ALTER TABLE `app_user_role_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `property_amenities`
--
ALTER TABLE `property_amenities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `property_availability`
--
ALTER TABLE `property_availability`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_listings`
--
ALTER TABLE `property_listings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_listing_amenities`
--
ALTER TABLE `property_listing_amenities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `publish_history`
--
ALTER TABLE `publish_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `role_permission_assignments`
--
ALTER TABLE `role_permission_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `screen_elements`
--
ALTER TABLE `screen_elements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `screen_element_instances`
--
ALTER TABLE `screen_element_instances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=618;

--
-- AUTO_INCREMENT for table `screen_menu_assignments`
--
ALTER TABLE `screen_menu_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `screen_module_assignments`
--
ALTER TABLE `screen_module_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `screen_role_access`
--
ALTER TABLE `screen_role_access`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `screen_submissions`
--
ALTER TABLE `screen_submissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `screen_templates`
--
ALTER TABLE `screen_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `screen_versions`
--
ALTER TABLE `screen_versions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `template_elements`
--
ALTER TABLE `template_elements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=217;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_activity_log`
--
ALTER TABLE `user_activity_log`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `user_app_permissions`
--
ALTER TABLE `user_app_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

-- --------------------------------------------------------

--
-- Structure for view `v_app_overview`
--
DROP TABLE IF EXISTS `v_app_overview`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_app_overview`  AS SELECT `a`.`id` AS `id`, `a`.`name` AS `name`, `a`.`domain` AS `domain`, `a`.`is_active` AS `is_active`, count(distinct `uap`.`user_id`) AS `total_users`, `a`.`created_at` AS `created_at`, concat(`u`.`first_name`,' ',`u`.`last_name`) AS `created_by_name` FROM ((`apps` `a` left join `user_app_permissions` `uap` on((`a`.`id` = `uap`.`app_id`))) left join `users` `u` on((`a`.`created_by` = `u`.`id`))) GROUP BY `a`.`id`, `a`.`name`, `a`.`domain`, `a`.`is_active`, `a`.`created_at`, `u`.`first_name`, `u`.`last_name` ;

-- --------------------------------------------------------

--
-- Structure for view `v_user_permissions`
--
DROP TABLE IF EXISTS `v_user_permissions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_permissions`  AS SELECT `u`.`id` AS `user_id`, `u`.`email` AS `email`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `r`.`name` AS `role_name`, `r`.`level` AS `role_level`, `a`.`id` AS `app_id`, `a`.`name` AS `app_name`, `a`.`domain` AS `app_domain`, `uap`.`can_view` AS `can_view`, `uap`.`can_edit` AS `can_edit`, `uap`.`can_delete` AS `can_delete`, `uap`.`can_publish` AS `can_publish`, `uap`.`can_manage_users` AS `can_manage_users`, `uap`.`can_manage_settings` AS `can_manage_settings`, `uap`.`custom_permissions` AS `custom_permissions` FROM (((`users` `u` join `roles` `r` on((`u`.`role_id` = `r`.`id`))) left join `user_app_permissions` `uap` on((`u`.`id` = `uap`.`user_id`))) left join `apps` `a` on((`uap`.`app_id` = `a`.`id`))) WHERE (`u`.`is_active` = true) ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_logs_ibfk_2` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `apps`
--
ALTER TABLE `apps`
  ADD CONSTRAINT `apps_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_apps_template` FOREIGN KEY (`template_id`) REFERENCES `app_templates` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `app_custom_screen_elements`
--
ALTER TABLE `app_custom_screen_elements`
  ADD CONSTRAINT `app_custom_screen_elements_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_custom_screen_elements_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_custom_screen_elements_ibfk_3` FOREIGN KEY (`element_id`) REFERENCES `screen_elements` (`id`);

--
-- Constraints for table `app_menus`
--
ALTER TABLE `app_menus`
  ADD CONSTRAINT `app_menus_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_roles`
--
ALTER TABLE `app_roles`
  ADD CONSTRAINT `app_roles_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_screens`
--
ALTER TABLE `app_screens`
  ADD CONSTRAINT `fk_screen_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `app_screen_assignments`
--
ALTER TABLE `app_screen_assignments`
  ADD CONSTRAINT `fk_assignment_app` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignment_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_assignment_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_screen_content`
--
ALTER TABLE `app_screen_content`
  ADD CONSTRAINT `fk_content_app` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_content_element_instance` FOREIGN KEY (`element_instance_id`) REFERENCES `screen_element_instances` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_content_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_content_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `app_screen_element_overrides`
--
ALTER TABLE `app_screen_element_overrides`
  ADD CONSTRAINT `app_screen_element_overrides_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_screen_element_overrides_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_screen_element_overrides_ibfk_3` FOREIGN KEY (`element_instance_id`) REFERENCES `screen_element_instances` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_screen_version_assignments`
--
ALTER TABLE `app_screen_version_assignments`
  ADD CONSTRAINT `app_screen_version_assignments_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_screen_version_assignments_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_screen_version_assignments_ibfk_3` FOREIGN KEY (`version_id`) REFERENCES `screen_versions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `app_screen_version_assignments_ibfk_4` FOREIGN KEY (`locked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD CONSTRAINT `app_settings_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_templates`
--
ALTER TABLE `app_templates`
  ADD CONSTRAINT `app_templates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `app_template_screens`
--
ALTER TABLE `app_template_screens`
  ADD CONSTRAINT `app_template_screens_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `app_templates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_template_screens_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `app_template_screen_elements`
--
ALTER TABLE `app_template_screen_elements`
  ADD CONSTRAINT `app_template_screen_elements_ibfk_1` FOREIGN KEY (`template_screen_id`) REFERENCES `app_template_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_template_screen_elements_ibfk_2` FOREIGN KEY (`element_id`) REFERENCES `screen_elements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_users`
--
ALTER TABLE `app_users`
  ADD CONSTRAINT `app_users_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_user_role_assignments`
--
ALTER TABLE `app_user_role_assignments`
  ADD CONSTRAINT `app_user_role_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_user_role_assignments_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_app_user_role_assignments_app_role` FOREIGN KEY (`app_role_id`) REFERENCES `app_roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `app_menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `menu_items_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_availability`
--
ALTER TABLE `property_availability`
  ADD CONSTRAINT `property_availability_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `property_listings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `property_listings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_listings`
--
ALTER TABLE `property_listings`
  ADD CONSTRAINT `property_listings_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_listings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_listing_amenities`
--
ALTER TABLE `property_listing_amenities`
  ADD CONSTRAINT `property_listing_amenities_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `property_listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_listing_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `property_amenities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `publish_history`
--
ALTER TABLE `publish_history`
  ADD CONSTRAINT `publish_history_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `publish_history_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `publish_history_ibfk_3` FOREIGN KEY (`version_id`) REFERENCES `screen_versions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `publish_history_ibfk_4` FOREIGN KEY (`published_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_permission_assignments`
--
ALTER TABLE `role_permission_assignments`
  ADD CONSTRAINT `role_permission_assignments_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_assignments_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `role_permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `screen_element_instances`
--
ALTER TABLE `screen_element_instances`
  ADD CONSTRAINT `fk_instance_element` FOREIGN KEY (`element_id`) REFERENCES `screen_elements` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_instance_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `screen_menu_assignments`
--
ALTER TABLE `screen_menu_assignments`
  ADD CONSTRAINT `screen_menu_assignments_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `screen_menu_assignments_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `app_menus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `screen_module_assignments`
--
ALTER TABLE `screen_module_assignments`
  ADD CONSTRAINT `fk_screen_module_module` FOREIGN KEY (`module_id`) REFERENCES `app_modules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_screen_module_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `screen_role_access`
--
ALTER TABLE `screen_role_access`
  ADD CONSTRAINT `screen_role_access_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `screen_role_access_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `app_roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `screen_role_access_ibfk_3` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `screen_submissions`
--
ALTER TABLE `screen_submissions`
  ADD CONSTRAINT `screen_submissions_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `screen_submissions_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `screen_submissions_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `screen_versions`
--
ALTER TABLE `screen_versions`
  ADD CONSTRAINT `screen_versions_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `screen_versions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `template_elements`
--
ALTER TABLE `template_elements`
  ADD CONSTRAINT `template_elements_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `screen_templates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `template_elements_ibfk_2` FOREIGN KEY (`element_id`) REFERENCES `screen_elements` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `user_activity_log`
--
ALTER TABLE `user_activity_log`
  ADD CONSTRAINT `user_activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_activity_log_ibfk_2` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_app_permissions`
--
ALTER TABLE `user_app_permissions`
  ADD CONSTRAINT `user_app_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_app_permissions_ibfk_2` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_app_permissions_ibfk_3` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_sessions_ibfk_2` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
