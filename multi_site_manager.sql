-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql_db:3306
-- Generation Time: Nov 06, 2025 at 06:19 PM
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
(4, 5, 2, 'product.create', 'Added new product to store', '192.168.1.103', NULL, NULL, '2025-10-31 13:21:45'),
(5, 6, 3, 'post.publish', 'Published new blog post', '192.168.1.104', NULL, NULL, '2025-10-31 13:21:45'),
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
(22, 1, 2, 'permission.assign', 'Assigned user 2 to app 2', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:53:58'),
(23, 1, 3, 'permission.assign', 'Assigned user 2 to app 3', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:53:58'),
(24, 1, 1, 'permission.assign', 'Assigned user 4 to app 1', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:59:40'),
(25, 1, 2, 'permission.assign', 'Assigned user 4 to app 2', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 13:59:40'),
(26, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:20:45'),
(27, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:23:25'),
(28, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:26:23'),
(29, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:29:15'),
(30, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:31:08'),
(31, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:34:35'),
(32, 1, NULL, 'auth.login', 'User logged in', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 14:42:59'),
(33, 1, 4, 'permission.assign', 'Assigned user 3 to app 4', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:05:40'),
(34, 1, 3, 'permission.remove', 'Removed user 3 from app 3', '::ffff:173.194.219.95', NULL, NULL, '2025-10-31 15:05:40'),
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
(86, 1, NULL, 'auth.login', 'User logged in', '::ffff:172.217.215.95', NULL, NULL, '2025-11-06 16:14:32');

-- --------------------------------------------------------

--
-- Table structure for table `apps`
--

CREATE TABLE `apps` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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

INSERT INTO `apps` (`id`, `name`, `domain`, `description`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Ubler', 'ubler.com', 'Ubler Ridesharing app', 1, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(2, 'AirPnP', 'airpnp.com', 'AirPnP App to find the perfect home for any trip.', 1, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(3, 'SnapCrap', 'snapcrap.com', 'Share images, videos with friends and family.', 1, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(4, 'YouNube', 'younube.com', 'Teach and entertain with your own video channel.', 1, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(15, 'DoorBash', 'doorbash-1762291809667.app', 'Restaurant discovery and food ordering platform', 1, 1, '2025-11-04 21:30:09', '2025-11-04 21:30:09');

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
(3, 'Terms and Service', 'terms_and_service', NULL, 'Shield', NULL, 1, 1, '2025-10-31 21:30:32', '2025-10-31 21:54:05'),
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
(63, 'Terms of Service', 'terms_of_service_10_1762287416948', 'Terms and conditions', 'FileText', 'Legal', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(64, 'Contact Form', 'contact_10_1762287416961', 'Contact support', 'MessageSquare', 'Support', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(65, 'About Us', 'about_10_1762287416974', 'About the app', 'Info', 'Support', 1, 1, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(66, 'Products', 'products_13_1762289506066', 'Browse all products', 'ShoppingCart', 'Main', 1, 1, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(67, 'Product Details', 'product_details_13_1762289506072', 'Detailed product information', 'Package', 'Main', 1, 1, '2025-11-04 20:51:46', '2025-11-04 20:51:46'),
(68, 'Orders', 'orders_13_1762289506108', 'Order history', 'Package', 'Account', 1, 1, '2025-11-04 20:51:46', '2025-11-04 20:51:46');

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
  `published_at` timestamp NULL DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_screen_assignments`
--

INSERT INTO `app_screen_assignments` (`id`, `app_id`, `screen_id`, `is_active`, `is_published`, `published_at`, `display_order`, `assigned_at`, `assigned_by`) VALUES
(1, 2, 65, 1, 0, NULL, 0, '2025-10-31 19:24:53', 1),
(2, 1, 65, 1, 0, NULL, 0, '2025-10-31 21:13:34', 1),
(3, 2, 3, 1, 0, NULL, 1, '2025-10-31 21:30:44', 1),
(6, 1, 17, 1, 0, NULL, 1, '2025-11-03 18:46:54', 1),
(7, 2, 18, 1, 0, NULL, 2, '2025-11-04 18:11:00', 1),
(97, 15, 46, 1, 0, NULL, 1, '2025-11-04 21:30:09', 1),
(98, 15, 18, 1, 0, NULL, 2, '2025-11-04 21:30:09', 1),
(99, 15, 48, 1, 0, NULL, 3, '2025-11-04 21:30:09', 1),
(100, 15, 49, 1, 0, NULL, 4, '2025-11-04 21:30:09', 1),
(101, 15, 50, 1, 0, NULL, 5, '2025-11-04 21:30:09', 1),
(102, 15, 51, 1, 0, NULL, 6, '2025-11-04 21:30:09', 1),
(103, 15, 52, 1, 0, NULL, 7, '2025-11-04 21:30:09', 1),
(104, 15, 53, 1, 0, NULL, 8, '2025-11-04 21:30:09', 1),
(105, 15, 54, 1, 0, NULL, 9, '2025-11-04 21:30:09', 1),
(106, 15, 55, 1, 0, NULL, 10, '2025-11-04 21:30:09', 1),
(107, 15, 56, 1, 0, NULL, 11, '2025-11-04 21:30:09', 1),
(108, 15, 57, 1, 0, NULL, 12, '2025-11-04 21:30:09', 1),
(109, 15, 58, 1, 0, NULL, 13, '2025-11-04 21:30:09', 1),
(110, 15, 59, 1, 0, NULL, 14, '2025-11-04 21:30:09', 1),
(111, 15, 60, 1, 0, NULL, 15, '2025-11-04 21:30:09', 1),
(112, 15, 61, 1, 0, NULL, 16, '2025-11-04 21:30:09', 1),
(113, 15, 62, 1, 0, NULL, 17, '2025-11-04 21:30:09', 1),
(114, 15, 63, 1, 0, NULL, 18, '2025-11-04 21:30:09', 1),
(115, 15, 64, 1, 0, NULL, 19, '2025-11-04 21:30:09', 1),
(116, 15, 65, 1, 0, NULL, 20, '2025-11-04 21:30:09', 1);

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
(7, 2, 3, 4, 'About AirPnP', NULL, 1, '2025-10-31 21:55:05', '2025-10-31 21:55:05'),
(8, 2, 3, 5, 'This is the About AirPnP page.', NULL, 1, '2025-10-31 21:55:05', '2025-10-31 21:55:05'),
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
(4, 2, 'theme', 'shop-modern', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(5, 2, 'currency', 'USD', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(6, 2, 'payment_gateway', 'stripe', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(7, 2, 'maintenance_mode', 'false', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(8, 3, 'theme', 'blog-minimal', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(9, 3, 'posts_per_page', '10', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(10, 3, 'allow_comments', 'true', '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
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
(8, 'Finance & Banking App', 'Complete banking and finance management app with account dashboard, transactions, transfers, bill payments, and card management', 'Finance & Banking', 'DollarSign', NULL, 1, NULL, '2025-11-06 15:47:20', '2025-11-06 15:47:20'),
(9, 'Property Rental App', 'Complete property rental and booking platform similar to Airbnb with property listings, detailed views, booking system, host profiles, and reviews', 'Real Estate & Rental', 'Home', NULL, 1, NULL, '2025-11-06 15:49:34', '2025-11-06 15:49:34'),
(10, 'Video Streaming Platform', 'Complete video streaming and content platform similar to YouTube with video feed, player, channels, comments, subscriptions, and upload functionality', 'Media & Entertainment', 'Video', NULL, 1, NULL, '2025-11-06 15:54:53', '2025-11-06 15:54:53');

-- --------------------------------------------------------

--
-- Table structure for table `app_template_screens`
--

CREATE TABLE `app_template_screens` (
  `id` int NOT NULL,
  `template_id` int NOT NULL,
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

INSERT INTO `app_template_screens` (`id`, `template_id`, `screen_name`, `screen_key`, `screen_description`, `screen_icon`, `screen_category`, `display_order`, `is_home_screen`, `created_at`) VALUES
(1, 1, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, 0, '2025-11-04 20:00:21'),
(2, 1, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(3, 1, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, 0, '2025-11-04 20:00:21'),
(4, 1, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(5, 1, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(6, 1, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(7, 1, 'Home', 'home', 'Main landing page with featured products', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(8, 1, 'Products', 'products', 'Browse all products', 'ShoppingCart', 'Main', 8, 0, '2025-11-04 20:00:21'),
(9, 1, 'Product Details', 'product_details', 'Detailed product information', 'Package', 'Main', 9, 0, '2025-11-04 20:00:21'),
(10, 1, 'Cart', 'cart', 'Shopping cart', 'ShoppingCart', 'Main', 10, 0, '2025-11-04 20:00:21'),
(11, 1, 'Checkout', 'checkout', 'Order checkout and payment', 'CreditCard', 'Main', 11, 0, '2025-11-04 20:00:21'),
(12, 1, 'Orders', 'orders', 'Order history', 'Package', 'Account', 12, 0, '2025-11-04 20:00:21'),
(13, 1, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 13, 0, '2025-11-04 20:00:21'),
(14, 1, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 14, 0, '2025-11-04 20:00:21'),
(15, 1, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 15, 0, '2025-11-04 20:00:21'),
(16, 1, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 16, 0, '2025-11-04 20:00:21'),
(17, 1, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 17, 0, '2025-11-04 20:00:21'),
(18, 1, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 18, 0, '2025-11-04 20:00:21'),
(19, 1, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 19, 0, '2025-11-04 20:00:21'),
(20, 1, 'About Us', 'about', 'About the app', 'Info', 'Support', 20, 0, '2025-11-04 20:00:21'),
(21, 2, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, 0, '2025-11-04 20:00:21'),
(22, 2, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(23, 2, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, 0, '2025-11-04 20:00:21'),
(24, 2, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(25, 2, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(26, 2, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(27, 2, 'Feed', 'feed', 'Social media feed', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(28, 2, 'Search', 'search', 'Search users and posts', 'Search', 'Main', 8, 0, '2025-11-04 20:00:21'),
(29, 2, 'Messages', 'messages', 'Direct messages', 'MessageSquare', 'Main', 9, 0, '2025-11-04 20:00:21'),
(30, 2, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 10, 0, '2025-11-04 20:00:21'),
(31, 2, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 11, 0, '2025-11-04 20:00:21'),
(32, 2, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 12, 0, '2025-11-04 20:00:21'),
(33, 2, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 13, 0, '2025-11-04 20:00:21'),
(34, 2, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 14, 0, '2025-11-04 20:00:21'),
(35, 2, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 15, 0, '2025-11-04 20:00:21'),
(36, 2, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 16, 0, '2025-11-04 20:00:21'),
(37, 2, 'About Us', 'about', 'About the app', 'Info', 'Support', 17, 0, '2025-11-04 20:00:21'),
(38, 3, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, 0, '2025-11-04 20:00:21'),
(39, 3, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(40, 3, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, 0, '2025-11-04 20:00:21'),
(41, 3, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(42, 3, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(43, 3, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(44, 3, 'Home', 'home', 'Restaurant discovery', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(45, 3, 'Restaurant Menu', 'restaurant_menu', 'Browse restaurant menu', 'UtensilsCrossed', 'Main', 8, 0, '2025-11-04 20:00:21'),
(46, 3, 'Cart', 'cart', 'Food cart', 'ShoppingCart', 'Main', 9, 0, '2025-11-04 20:00:21'),
(47, 3, 'Checkout', 'checkout', 'Order checkout', 'CreditCard', 'Main', 10, 0, '2025-11-04 20:00:21'),
(48, 3, 'Track Order', 'track_order', 'Live order tracking', 'MapPin', 'Main', 11, 0, '2025-11-04 20:00:21'),
(49, 3, 'Order History', 'order_history', 'Past orders', 'Clock', 'Account', 12, 0, '2025-11-04 20:00:21'),
(50, 3, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 13, 0, '2025-11-04 20:00:21'),
(51, 3, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 14, 0, '2025-11-04 20:00:21'),
(52, 3, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 15, 0, '2025-11-04 20:00:21'),
(53, 3, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 16, 0, '2025-11-04 20:00:21'),
(54, 3, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 17, 0, '2025-11-04 20:00:21'),
(55, 3, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 18, 0, '2025-11-04 20:00:21'),
(56, 3, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 19, 0, '2025-11-04 20:00:21'),
(57, 3, 'About Us', 'about', 'About the app', 'Info', 'Support', 20, 0, '2025-11-04 20:00:21'),
(58, 4, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, 0, '2025-11-04 20:00:21'),
(59, 4, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(60, 4, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, 0, '2025-11-04 20:00:21'),
(61, 4, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(62, 4, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(63, 4, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(64, 4, 'Dashboard', 'dashboard', 'Fitness dashboard', 'LayoutDashboard', 'Main', 7, 1, '2025-11-04 20:00:21'),
(65, 4, 'Workouts', 'workouts', 'Workout library', 'Activity', 'Main', 8, 0, '2025-11-04 20:00:21'),
(66, 4, 'Nutrition', 'nutrition', 'Meal tracking', 'Apple', 'Main', 9, 0, '2025-11-04 20:00:21'),
(67, 4, 'Progress', 'progress', 'Track your progress', 'TrendingUp', 'Main', 10, 0, '2025-11-04 20:00:21'),
(68, 4, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 11, 0, '2025-11-04 20:00:21'),
(69, 4, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 12, 0, '2025-11-04 20:00:21'),
(70, 4, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 13, 0, '2025-11-04 20:00:21'),
(71, 4, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 14, 0, '2025-11-04 20:00:21'),
(72, 4, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 15, 0, '2025-11-04 20:00:21'),
(73, 4, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 16, 0, '2025-11-04 20:00:21'),
(74, 4, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 17, 0, '2025-11-04 20:00:21'),
(75, 4, 'About Us', 'about', 'About the app', 'Info', 'Support', 18, 0, '2025-11-04 20:00:21'),
(76, 5, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, 0, '2025-11-04 20:00:21'),
(77, 5, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, 0, '2025-11-04 20:00:21'),
(78, 5, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, 0, '2025-11-04 20:00:21'),
(79, 5, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, 0, '2025-11-04 20:00:21'),
(80, 5, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, 0, '2025-11-04 20:00:21'),
(81, 5, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, 0, '2025-11-04 20:00:21'),
(82, 5, 'Home', 'home', 'Property search', 'Home', 'Main', 7, 1, '2025-11-04 20:00:21'),
(83, 5, 'Property Listings', 'property_listings', 'Browse properties', 'Building', 'Main', 8, 0, '2025-11-04 20:00:21'),
(84, 5, 'Property Details', 'property_details', 'Property information', 'Building2', 'Main', 9, 0, '2025-11-04 20:00:21'),
(85, 5, 'Favorites', 'favorites', 'Saved properties', 'Heart', 'Main', 10, 0, '2025-11-04 20:00:21'),
(86, 5, 'Map View', 'map_view', 'Properties on map', 'MapPin', 'Main', 11, 0, '2025-11-04 20:00:21'),
(87, 5, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 12, 0, '2025-11-04 20:00:21'),
(88, 5, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 13, 0, '2025-11-04 20:00:21'),
(89, 5, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 14, 0, '2025-11-04 20:00:21'),
(90, 5, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 15, 0, '2025-11-04 20:00:21'),
(91, 5, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 16, 0, '2025-11-04 20:00:21'),
(92, 5, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 17, 0, '2025-11-04 20:00:21'),
(93, 5, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 18, 0, '2025-11-04 20:00:21'),
(94, 5, 'About Us', 'about', 'About the app', 'Info', 'Support', 19, 0, '2025-11-04 20:00:21'),
(115, 8, 'Account Dashboard', 'account_dashboard', 'Main dashboard showing account balance, recent transactions, and quick actions', 'LayoutDashboard', 'Finance', 1, 1, '2025-11-06 15:47:20'),
(116, 8, 'Transaction History', 'transaction_history', 'Complete list of all account transactions with search and filter options', 'Receipt', 'Finance', 2, 0, '2025-11-06 15:47:20'),
(117, 8, 'Transfer Money', 'transfer_money', 'Send money to another account or contact', 'Send', 'Finance', 3, 0, '2025-11-06 15:47:20'),
(118, 8, 'Bill Payment', 'bill_payment', 'Pay utility bills, credit cards, and other recurring payments', 'FileText', 'Finance', 4, 0, '2025-11-06 15:47:20'),
(119, 8, 'Cards Management', 'cards_management', 'Manage debit and credit cards, view limits, and control card settings', 'CreditCard', 'Finance', 5, 0, '2025-11-06 15:47:20'),
(120, 8, 'Account Statements', 'account_statements', 'View and download monthly account statements', 'FileBarChart', 'Finance', 6, 0, '2025-11-06 15:47:20'),
(121, 9, 'Property Listings', 'property_listings', 'Browse available properties with filters and search', 'Building', 'Property', 1, 1, '2025-11-06 15:49:34'),
(122, 9, 'Property Details', 'property_details', 'Detailed view of a specific property with photos, amenities, and booking options', 'HomeIcon', 'Property', 2, 0, '2025-11-06 15:49:34'),
(123, 9, 'Booking Form', 'booking_form', 'Complete booking form with dates, guests, and payment information', 'Calendar', 'Booking', 3, 0, '2025-11-06 15:49:34'),
(124, 9, 'Host Profile', 'host_profile', 'View host information, ratings, and other properties', 'User', 'Profile', 4, 0, '2025-11-06 15:49:34'),
(125, 9, 'Reviews & Ratings', 'reviews_ratings', 'View and submit property reviews and ratings', 'Star', 'Reviews', 5, 0, '2025-11-06 15:49:34'),
(126, 9, 'Advanced Search', 'advanced_search', 'Advanced search with detailed filters for finding the perfect property', 'Search', 'Search', 6, 0, '2025-11-06 15:49:34'),
(127, 10, 'Video Feed', 'video_feed', 'Main feed showing recommended and trending videos', 'PlayCircle', 'Content', 1, 1, '2025-11-06 15:54:53'),
(128, 10, 'Video Player', 'video_player', 'Full video player with controls, description, and engagement options', 'Play', 'Content', 2, 0, '2025-11-06 15:54:53'),
(129, 10, 'Channel Page', 'channel_page', 'Channel profile with videos, playlists, and about information', 'Tv', 'Profile', 3, 0, '2025-11-06 15:54:53'),
(130, 10, 'Comments', 'comments', 'View and post comments on videos', 'MessageSquare', 'Engagement', 4, 0, '2025-11-06 15:54:53'),
(131, 10, 'Subscriptions', 'subscriptions', 'View videos from subscribed channels', 'Bell', 'Content', 5, 0, '2025-11-06 15:54:53'),
(132, 10, 'Upload Video', 'upload_video', 'Upload and publish new videos to your channel', 'Upload', 'Content', 6, 0, '2025-11-06 15:54:53');

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
(1, 1, 47, 'app_logo', 'App Logo', '', '', 0, 0, 1, '{\"width\": \"200px\", \"height\": \"200px\", \"altText\": \"App Logo\", \"imageUrl\": \"https://placehold.co/200x200?text=Logo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(2, 1, 27, 'app_name', 'App Name', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(3, 1, 28, 'app_version', 'Version 1.0', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(4, 1, 28, 'loading_text', 'Loading...', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(5, 2, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(6, 2, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(7, 2, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(8, 2, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(9, 2, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(10, 2, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(11, 3, 27, 'signup_heading', 'Create Account', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(12, 3, 28, 'signup_description', 'Join us today and get started!', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(13, 3, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(14, 3, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(15, 3, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(16, 3, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(17, 3, 1, 'password', 'Password', 'Create a strong password', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(18, 3, 1, 'confirm_password', 'Confirm Password', 'Re-enter your password', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(19, 3, 33, 'signup_button', 'Sign Up', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(20, 3, 28, 'login_link', 'Already have an account? Login', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
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
(112, 19, 27, 'contact_heading', 'Contact Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(113, 19, 28, 'contact_description', 'We would love to hear from you. Please fill out the form below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(114, 19, 1, 'full_name', 'Full Name', 'Enter your full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(115, 19, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(116, 19, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(117, 19, 2, 'message', 'Message', 'Type your message here...', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(118, 19, 33, 'submit_button', 'Send Message', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(119, 20, 27, 'about_heading', 'About Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(120, 20, 28, 'about_subtitle', 'Learn more about our company and mission', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(121, 20, 27, 'story_heading', 'Our Story', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(122, 20, 28, 'story_text', 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(123, 20, 27, 'mission_heading', 'Our Mission', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(124, 20, 28, 'mission_text', 'To deliver innovative solutions that make a difference in people lives.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(125, 20, 27, 'contact_heading', 'Contact Information', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(126, 20, 4, 'contact_email', 'Email', 'info@company.com', NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(127, 20, 5, 'contact_phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(128, 20, 33, 'contact_button', 'Contact Us', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(129, 21, 47, 'app_logo', 'App Logo', NULL, NULL, 0, 0, 0, '{\"width\": \"200px\", \"height\": \"200px\", \"altText\": \"App Logo\", \"imageUrl\": \"https://placehold.co/200x200?text=Logo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(130, 21, 27, 'app_name', 'App Name', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(131, 21, 28, 'app_version', 'Version 1.0', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(132, 21, 28, 'loading_text', 'Loading...', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(133, 22, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(134, 22, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(135, 22, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(136, 22, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(137, 22, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(138, 22, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(139, 23, 27, 'signup_heading', 'Create Account', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(140, 23, 28, 'signup_description', 'Join us today and get started!', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(141, 23, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(142, 23, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(143, 23, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(144, 23, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(145, 23, 1, 'password', 'Password', 'Create a strong password', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(146, 23, 1, 'confirm_password', 'Confirm Password', 'Re-enter your password', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(147, 23, 33, 'signup_button', 'Sign Up', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(148, 23, 28, 'login_link', 'Already have an account? Login', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
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
(223, 36, 27, 'contact_heading', 'Contact Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(224, 36, 28, 'contact_description', 'We would love to hear from you. Please fill out the form below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(225, 36, 1, 'full_name', 'Full Name', 'Enter your full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(226, 36, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(227, 36, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(228, 36, 2, 'message', 'Message', 'Type your message here...', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(229, 36, 33, 'submit_button', 'Send Message', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(230, 37, 27, 'about_heading', 'About Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(231, 37, 28, 'about_subtitle', 'Learn more about our company and mission', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(232, 37, 27, 'story_heading', 'Our Story', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(233, 37, 28, 'story_text', 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(234, 37, 27, 'mission_heading', 'Our Mission', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(235, 37, 28, 'mission_text', 'To deliver innovative solutions that make a difference in people lives.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(236, 37, 27, 'contact_heading', 'Contact Information', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(237, 37, 4, 'contact_email', 'Email', 'info@company.com', NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(238, 37, 5, 'contact_phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(239, 37, 33, 'contact_button', 'Contact Us', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(240, 38, 47, 'app_logo', 'App Logo', NULL, NULL, 0, 0, 0, '{\"width\": \"200px\", \"height\": \"200px\", \"altText\": \"App Logo\", \"imageUrl\": \"https://placehold.co/200x200?text=Logo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(241, 38, 27, 'app_name', 'App Name', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(242, 38, 28, 'app_version', 'Version 1.0', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(243, 38, 28, 'loading_text', 'Loading...', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(244, 39, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(245, 39, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(246, 39, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(247, 39, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(248, 39, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(249, 39, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(250, 40, 27, 'signup_heading', 'Create Account', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(251, 40, 28, 'signup_description', 'Join us today and get started!', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(252, 40, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(253, 40, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(254, 40, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(255, 40, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(256, 40, 1, 'password', 'Password', 'Create a strong password', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(257, 40, 1, 'confirm_password', 'Confirm Password', 'Re-enter your password', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(258, 40, 33, 'signup_button', 'Sign Up', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(259, 40, 28, 'login_link', 'Already have an account? Login', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
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
(339, 56, 27, 'contact_heading', 'Contact Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(340, 56, 28, 'contact_description', 'We would love to hear from you. Please fill out the form below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(341, 56, 1, 'full_name', 'Full Name', 'Enter your full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(342, 56, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(343, 56, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(344, 56, 2, 'message', 'Message', 'Type your message here...', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(345, 56, 33, 'submit_button', 'Send Message', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(346, 57, 27, 'about_heading', 'About Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(347, 57, 28, 'about_subtitle', 'Learn more about our company and mission', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(348, 57, 27, 'story_heading', 'Our Story', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(349, 57, 28, 'story_text', 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(350, 57, 27, 'mission_heading', 'Our Mission', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(351, 57, 28, 'mission_text', 'To deliver innovative solutions that make a difference in people lives.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(352, 57, 27, 'contact_heading', 'Contact Information', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(353, 57, 4, 'contact_email', 'Email', 'info@company.com', NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(354, 57, 5, 'contact_phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(355, 57, 33, 'contact_button', 'Contact Us', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(356, 58, 47, 'app_logo', 'App Logo', NULL, NULL, 0, 0, 0, '{\"width\": \"200px\", \"height\": \"200px\", \"altText\": \"App Logo\", \"imageUrl\": \"https://placehold.co/200x200?text=Logo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(357, 58, 27, 'app_name', 'App Name', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(358, 58, 28, 'app_version', 'Version 1.0', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(359, 58, 28, 'loading_text', 'Loading...', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(360, 59, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(361, 59, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(362, 59, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(363, 59, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(364, 59, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(365, 59, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(366, 60, 27, 'signup_heading', 'Create Account', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(367, 60, 28, 'signup_description', 'Join us today and get started!', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(368, 60, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(369, 60, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(370, 60, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(371, 60, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(372, 60, 1, 'password', 'Password', 'Create a strong password', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(373, 60, 1, 'confirm_password', 'Confirm Password', 'Re-enter your password', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(374, 60, 33, 'signup_button', 'Sign Up', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(375, 60, 28, 'login_link', 'Already have an account? Login', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
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
(415, 69, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18');
INSERT INTO `app_template_screen_elements` (`id`, `template_screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`) VALUES
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
(453, 74, 27, 'contact_heading', 'Contact Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(454, 74, 28, 'contact_description', 'We would love to hear from you. Please fill out the form below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(455, 74, 1, 'full_name', 'Full Name', 'Enter your full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(456, 74, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(457, 74, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(458, 74, 2, 'message', 'Message', 'Type your message here...', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(459, 74, 33, 'submit_button', 'Send Message', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(460, 75, 27, 'about_heading', 'About Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(461, 75, 28, 'about_subtitle', 'Learn more about our company and mission', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(462, 75, 27, 'story_heading', 'Our Story', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(463, 75, 28, 'story_text', 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(464, 75, 27, 'mission_heading', 'Our Mission', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(465, 75, 28, 'mission_text', 'To deliver innovative solutions that make a difference in people lives.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(466, 75, 27, 'contact_heading', 'Contact Information', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(467, 75, 4, 'contact_email', 'Email', 'info@company.com', NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(468, 75, 5, 'contact_phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(469, 75, 33, 'contact_button', 'Contact Us', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
(470, 76, 47, 'app_logo', 'App Logo', NULL, NULL, 0, 0, 0, '{\"width\": \"200px\", \"height\": \"200px\", \"altText\": \"App Logo\", \"imageUrl\": \"https://placehold.co/200x200?text=Logo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:15:18'),
(471, 76, 27, 'app_name', 'App Name', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(472, 76, 28, 'app_version', 'Version 1.0', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(473, 76, 28, 'loading_text', 'Loading...', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(474, 77, 27, 'login_heading', 'Welcome Back', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(475, 77, 28, 'login_description', 'Please sign in to continue.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(476, 77, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(477, 77, 1, 'password', 'Password', 'Enter your password', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(478, 77, 33, 'login_button', 'Sign In', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(479, 77, 28, 'forgot_password_link', 'Forgot your password?', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(480, 78, 27, 'signup_heading', 'Create Account', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(481, 78, 28, 'signup_description', 'Join us today and get started!', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(482, 78, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(483, 78, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(484, 78, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(485, 78, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(486, 78, 1, 'password', 'Password', 'Create a strong password', NULL, 1, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(487, 78, 1, 'confirm_password', 'Confirm Password', 'Re-enter your password', NULL, 1, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(488, 78, 33, 'signup_button', 'Sign Up', NULL, NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(489, 78, 28, 'login_link', 'Already have an account? Login', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
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
(551, 92, 27, 'section1_heading', 'Acceptance of Terms', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(552, 92, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(553, 92, 27, 'section2_heading', 'User Responsibilities', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(554, 92, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(555, 92, 27, 'section3_heading', 'Termination', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(556, 92, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(557, 93, 27, 'contact_heading', 'Contact Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(558, 93, 28, 'contact_description', 'We would love to hear from you. Please fill out the form below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(559, 93, 1, 'full_name', 'Full Name', 'Enter your full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(560, 93, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(561, 93, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(562, 93, 2, 'message', 'Message', 'Type your message here...', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(563, 93, 33, 'submit_button', 'Send Message', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(564, 94, 27, 'about_heading', 'About Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:15:18'),
(565, 94, 28, 'about_subtitle', 'Learn more about our company and mission', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:15:18'),
(566, 94, 27, 'story_heading', 'Our Story', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:15:18'),
(567, 94, 28, 'story_text', 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:15:18'),
(568, 94, 27, 'mission_heading', 'Our Mission', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:15:18'),
(569, 94, 28, 'mission_text', 'To deliver innovative solutions that make a difference in people lives.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:15:18'),
(570, 94, 27, 'contact_heading', 'Contact Information', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:15:18'),
(571, 94, 4, 'contact_email', 'Email', 'info@company.com', NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:15:18'),
(572, 94, 5, 'contact_phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:15:18'),
(573, 94, 33, 'contact_button', 'Contact Us', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:15:18'),
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
(1361, 130, 10, 'comments_sort', 'Sort By', 'Sort comments', 'top', 0, 0, 3, '{\"options\": [{\"label\": \"Top Comments\", \"value\": \"top\"}, {\"label\": \"Newest First\", \"value\": \"newest\"}, {\"label\": \"Oldest First\", \"value\": \"oldest\"}]}', NULL, '2025-11-06 15:54:53');
INSERT INTO `app_template_screen_elements` (`id`, `template_screen_id`, `element_id`, `field_key`, `label`, `placeholder`, `default_value`, `is_required`, `is_readonly`, `display_order`, `config`, `validation_rules`, `created_at`) VALUES
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
(1403, 132, 33, 'cancel_upload_button', 'Cancel', '', 'Cancel', 0, 0, 22, '{\"action\": \"cancel\", \"variant\": \"secondary\"}', NULL, '2025-11-06 15:54:53');

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
(1, 1, 'larry@bluestoneapps.com', '$2a$10$V90eQv9T/Z0DQSm7jLf/n.vYBO3iTGiXTjX1pG73O4h3cbShTDE2y', 'Larry', 'Allen', '8655882465', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 'active', NULL, '2025-11-03 19:57:44', '2025-11-03 19:57:44'),
(8, 1, 'testuser@example.com', '$2a$10$yelEv1/vQKDYMXTdfxdFneBWmGbZxcdI3GM3tsRBQGyW40pP0LdGK', 'Test', 'User', NULL, NULL, NULL, NULL, NULL, 0, '701651111d415abc54da8651593838980905fe3c0fa762ef53af67db9aefad57', '2025-11-04 20:31:28', NULL, NULL, 'active', NULL, '2025-11-03 20:31:28', '2025-11-03 20:31:28'),
(9, 1, 'john.doe@example.com', '$2a$10$Yxr1X1VlvUzEx2jpxRP8d.0U12Tb0GE7wnQMetoD7d924Mnhp3vy2', 'John', 'Doe', NULL, NULL, NULL, NULL, NULL, 0, 'ae2ce72332a53f84bd43a14adf2f13be5dfe515529372230b782a849f2b07a90', '2025-11-04 20:34:08', NULL, NULL, 'active', '2025-11-03 20:34:49', '2025-11-03 20:34:07', '2025-11-03 20:34:49');

-- --------------------------------------------------------

--
-- Table structure for table `app_user_role_assignments`
--

CREATE TABLE `app_user_role_assignments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `assigned_by` int DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_user_role_assignments`
--

INSERT INTO `app_user_role_assignments` (`id`, `user_id`, `role_id`, `assigned_by`, `assigned_at`) VALUES
(1, 9, 1, NULL, '2025-11-03 20:52:47');

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
(47, 'Image Display', 'image_display', 'Media', 'image', 'Display a static image (logo, banner, photo)', 1, 0, 1, 0, '{\"width\": \"100%\", \"height\": \"auto\", \"altText\": \"Image\", \"imageUrl\": \"\", \"alignment\": \"center\"}', NULL, 1, 0, '2025-11-03 18:07:47', '2025-11-03 18:07:47');

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
(4, 3, 27, 'heading', 'Page Title', '', '', 1, 0, 0, '\"{}\"', '\"{}\"', '2025-10-31 21:30:32', '2025-10-31 21:54:05'),
(5, 3, 29, 'rich_text_display', 'Content', '', '', 0, 0, 1, '\"{}\"', '\"{}\"', '2025-10-31 21:30:32', '2025-10-31 21:33:36'),
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
(221, 58, 27, 'profile_heading', 'My Profile', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(222, 58, 28, 'profile_description', 'Update your personal information below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(223, 58, 1, 'first_name', 'First Name', 'Enter your first name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(224, 58, 1, 'last_name', 'Last Name', 'Enter your last name', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(225, 58, 4, 'email', 'Email', 'your.email@example.com', NULL, 1, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(226, 58, 5, 'phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(227, 58, 2, 'bio', 'Bio', 'Tell us about yourself...', NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(228, 58, 33, 'save_button', 'Save Changes', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(229, 59, 47, 'profile_photo', 'Profile Photo', 'Upload profile photo', '', 0, 0, 1, '{\"width\": \"150px\", \"height\": \"150px\", \"altText\": \"Profile Photo\", \"imageUrl\": \"https://placehold.co/150x150?text=Photo\", \"alignment\": \"center\"}', NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(230, 59, 1, 'first_name', 'First Name', 'Enter your first name', '', 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(231, 59, 1, 'last_name', 'Last Name', 'Enter your last name', '', 1, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(232, 59, 4, 'email', 'Email Address', 'your.email@example.com', '', 1, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(233, 59, 5, 'phone', 'Phone Number', '+1 (555) 123-4567', '', 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(234, 59, 2, 'bio', 'Bio', 'Tell us about yourself...', '', 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(235, 59, 17, 'date_of_birth', 'Date of Birth', 'Select your date of birth', '', 0, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(236, 59, 10, 'gender', 'Gender', 'Select your gender', '', 0, 0, 8, '{\"options\": [{\"label\": \"Male\", \"value\": \"male\"}, {\"label\": \"Female\", \"value\": \"female\"}, {\"label\": \"Non-binary\", \"value\": \"non_binary\"}, {\"label\": \"Prefer not to say\", \"value\": \"prefer_not_to_say\"}]}', NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(237, 59, 33, 'save_button', 'Save Changes', '', '', 0, 0, 9, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(238, 59, 34, 'change_password_link', 'Change Password', '', '', 0, 0, 10, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
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
(257, 62, 27, 'privacy_heading', 'Privacy Policy', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(258, 62, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(259, 62, 27, 'section1_heading', 'Information We Collect', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(260, 62, 28, 'section1_text', 'We collect information you provide directly to us, including name, email, and usage data.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(261, 62, 27, 'section2_heading', 'How We Use Your Information', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(262, 62, 28, 'section2_text', 'We use your information to provide, maintain, and improve our services.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(263, 62, 27, 'section3_heading', 'Data Security', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(264, 62, 28, 'section3_text', 'We implement appropriate security measures to protect your personal information.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(265, 63, 27, 'terms_heading', 'Terms of Service', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(266, 63, 28, 'last_updated', 'Last updated: November 2025', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(267, 63, 27, 'section1_heading', 'Acceptance of Terms', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(268, 63, 28, 'section1_text', 'By accessing our service, you agree to be bound by these terms.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(269, 63, 27, 'section2_heading', 'User Responsibilities', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(270, 63, 28, 'section2_text', 'You are responsible for maintaining the confidentiality of your account.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(271, 63, 27, 'section3_heading', 'Termination', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(272, 63, 28, 'section3_text', 'We may terminate or suspend access to our service immediately, without prior notice.', NULL, NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(273, 64, 27, 'contact_heading', 'Contact Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(274, 64, 28, 'contact_description', 'We would love to hear from you. Please fill out the form below.', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(275, 64, 1, 'full_name', 'Full Name', 'Enter your full name', NULL, 1, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(276, 64, 4, 'email', 'Email Address', 'your.email@example.com', NULL, 1, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(277, 64, 5, 'phone', 'Phone Number', '(555) 123-4567', NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(278, 64, 2, 'message', 'Message', 'Type your message here...', NULL, 1, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(279, 64, 33, 'submit_button', 'Send Message', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(280, 65, 27, 'about_heading', 'About Us', NULL, NULL, 0, 0, 0, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(281, 65, 28, 'about_subtitle', 'Learn more about our company and mission', NULL, NULL, 0, 0, 1, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(282, 65, 27, 'story_heading', 'Our Story', NULL, NULL, 0, 0, 2, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(283, 65, 28, 'story_text', 'We are a company dedicated to providing the best service to our customers. Founded in 2020, we have grown to serve thousands of users worldwide.', NULL, NULL, 0, 0, 3, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(284, 65, 27, 'mission_heading', 'Our Mission', NULL, NULL, 0, 0, 4, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(285, 65, 28, 'mission_text', 'To deliver innovative solutions that make a difference in people lives.', NULL, NULL, 0, 0, 5, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(286, 65, 27, 'contact_heading', 'Contact Information', NULL, NULL, 0, 0, 6, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(287, 65, 4, 'contact_email', 'Email', 'info@company.com', NULL, 0, 0, 7, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(288, 65, 5, 'contact_phone', 'Phone', '(555) 123-4567', NULL, 0, 0, 8, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
(289, 65, 33, 'contact_button', 'Contact Us', NULL, NULL, 0, 0, 9, NULL, NULL, '2025-11-04 20:16:56', '2025-11-04 20:16:56'),
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
(304, 49, 43, 'tags_input', 'Tags Input', '', '', 0, 0, 5, '\"{}\"', '\"{}\"', '2025-11-04 21:33:34', '2025-11-04 21:33:34');

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
(1, 'admin@knoxweb.com', '$2a$10$9mPSeZHQr04vZKsSBF7JOOuxy7GpXAf.2FTMTpmeFRpZbx7wqZ2au', 'Master', 'Administrator', 1, 1, '2025-11-06 16:14:32', '2025-10-31 13:21:45', '2025-11-06 16:14:32'),
(2, 'user1@knoxweb.com', '$2a$10$fcr9XkWwxN5RPWGDTmleCOtCTsecALyN1XOGQh/CLhamx64xvAU7u', 'John', 'Smith', 2, 1, '2025-10-31 15:49:46', '2025-10-31 13:21:45', '2025-10-31 15:49:46'),
(3, 'user2@knoxweb.com', '$2a$10$eLW2E6JKL/5xfwwv4ktQIegPxQD0A8tGQ5fAIPyY1GGP1dz7/8kQ.', 'Sarah', 'Johnson', 2, 1, '2025-10-31 15:40:41', '2025-10-31 13:21:45', '2025-10-31 15:40:41'),
(4, 'user3@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Mike', 'Davis', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(5, 'user4@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Emily', 'Wilson', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(6, 'user5@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'David', 'Brown', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45');

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
(2, 9, 1, 'login', NULL, NULL, '::ffff:172.217.215.95', 'curl/8.7.1', NULL, '2025-11-03 20:34:49');

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
(2, 2, 2, 1, 1, 1, 1, 1, 1, NULL, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(4, 3, 4, 1, 1, 1, 1, 1, 1, NULL, 1, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(5, 4, 1, 1, 1, 0, 0, 0, 0, NULL, 2, '2025-10-31 13:21:45', '2025-11-04 15:34:52'),
(6, 5, 2, 1, 1, 0, 1, 0, 0, NULL, 2, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(7, 5, 3, 1, 1, 0, 0, 0, 0, NULL, 3, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(8, 6, 3, 1, 1, 0, 1, 0, 0, NULL, 3, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(9, 6, 4, 1, 1, 0, 0, 0, 0, NULL, 3, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(10, 2, 3, 1, 1, 1, 1, 1, 1, NULL, 1, '2025-10-31 13:53:58', '2025-10-31 13:53:58'),
(11, 4, 2, 1, 1, 0, 0, 0, 0, NULL, 1, '2025-10-31 13:59:40', '2025-10-31 13:59:40');

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
(2, 9, 1, '5e36cfca0f2bbdf90e0cf8a92517c6e886936d3b90b11ec7af4c8216b41d8e55', '6118067ddaeefc03fe1b44076b995eb74b034fc98e092c1ae90484e715b7885e', NULL, '::ffff:172.217.215.95', 'curl/8.7.1', '2025-11-10 20:34:49', '2025-12-03 20:34:49', '2025-11-03 20:40:24', '2025-11-03 20:34:49');

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
(1, 9, 1, 1, 1, 0, 'en', 'auto', 'UTC', NULL, NULL, '2025-11-03 20:34:07', '2025-11-03 20:34:07');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_app_overview`
-- (See below for the actual view)
--
CREATE TABLE `v_app_overview` (
`id` int
,`name` varchar(255)
,`domain` varchar(255)
,`is_active` tinyint(1)
,`total_users` bigint
,`created_at` timestamp
,`created_by_name` varchar(201)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_user_permissions`
-- (See below for the actual view)
--
CREATE TABLE `v_user_permissions` (
`user_id` int
,`email` varchar(255)
,`first_name` varchar(100)
,`last_name` varchar(100)
,`role_name` varchar(50)
,`role_level` int
,`app_id` int
,`app_name` varchar(255)
,`app_domain` varchar(255)
,`can_view` tinyint(1)
,`can_edit` tinyint(1)
,`can_delete` tinyint(1)
,`can_publish` tinyint(1)
,`can_manage_users` tinyint(1)
,`can_manage_settings` tinyint(1)
,`custom_permissions` json
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
  ADD KEY `idx_active` (`is_active`);

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
  ADD KEY `idx_is_published` (`is_published`);

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
  ADD KEY `idx_display_order` (`display_order`);

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
  ADD KEY `idx_role_id` (`role_id`);

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
-- Indexes for table `screen_templates`
--
ALTER TABLE `screen_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_is_active` (`is_active`);

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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `apps`
--
ALTER TABLE `apps`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `app_screens`
--
ALTER TABLE `app_screens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `app_screen_assignments`
--
ALTER TABLE `app_screen_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `app_screen_content`
--
ALTER TABLE `app_screen_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `app_templates`
--
ALTER TABLE `app_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `app_template_screens`
--
ALTER TABLE `app_template_screens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `app_template_screen_elements`
--
ALTER TABLE `app_template_screen_elements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1404;

--
-- AUTO_INCREMENT for table `app_users`
--
ALTER TABLE `app_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `app_user_role_assignments`
--
ALTER TABLE `app_user_role_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `screen_elements`
--
ALTER TABLE `screen_elements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `screen_element_instances`
--
ALTER TABLE `screen_element_instances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=305;

--
-- AUTO_INCREMENT for table `screen_templates`
--
ALTER TABLE `screen_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_app_permissions`
--
ALTER TABLE `user_app_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  ADD CONSTRAINT `apps_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

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
  ADD CONSTRAINT `app_template_screens_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `app_templates` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `app_user_role_assignments_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE CASCADE;

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
