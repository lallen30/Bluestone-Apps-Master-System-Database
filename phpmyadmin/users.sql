-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql_db:3306
-- Generation Time: Oct 31, 2025 at 03:12 PM
-- Server version: 8.0.44
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `multi_site_manager`
--

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
(1, 'admin@knoxweb.com', '$2a$10$9mPSeZHQr04vZKsSBF7JOOuxy7GpXAf.2FTMTpmeFRpZbx7wqZ2au', 'Master', 'Administrator', 1, 1, '2025-10-31 15:07:14', '2025-10-31 13:21:45', '2025-10-31 15:07:14'),
(2, 'user1@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'John', 'Smith', 2, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(3, 'user2@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Sarah', 'Johnson', 2, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(4, 'user3@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Mike', 'Davis', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(5, 'user4@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Emily', 'Wilson', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45'),
(6, 'user5@knoxweb.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'David', 'Brown', 3, 1, NULL, '2025-10-31 13:21:45', '2025-10-31 13:21:45');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT;
COMMIT;
