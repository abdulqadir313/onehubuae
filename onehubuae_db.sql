-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2026 at 11:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `onehubuae_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `campaign_id` bigint(20) NOT NULL,
  `brand_id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `status` enum('draft','active','completed','paused') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_slug` varchar(120) DEFAULT NULL,
  `category_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `category_slug`, `category_image`, `is_active`, `created_at`) VALUES
(1, 'Fashion', 'fashion', 'https://images.unsplash.com/photo-1605403806790-03de8c07b7c1', 1, '2026-02-05 17:45:25'),
(2, 'Travel', 'travel', 'https://images.unsplash.com/photo-1761852771079-1abd6d5a4440', 1, '2026-02-05 17:45:25'),
(3, 'Food', 'food', 'https://images.unsplash.com/photo-1765278797879-47c9f88cf1c3', 1, '2026-02-05 17:45:25'),
(4, 'Beauty', 'beauty', 'https://images.unsplash.com/photo-1653640869615-e9878a2c8344', 1, '2026-02-05 17:47:15'),
(5, 'Lifestyle', 'lifestyle', 'https://images.unsplash.com/photo-1653640869615-e9878a2c8344', 1, '2026-02-05 17:47:15'),
(6, 'Health & Fitness', 'health-fitness', 'https://images.unsplash.com/photo-1653640869615-e9878a2c8344', 1, '2026-02-05 17:47:15'),
(7, 'Food & Drink', 'food-drink', 'https://images.unsplash.com/photo-1653640869615-e9878a2c8344', 1, '2026-02-05 17:47:15'),
(8, 'Family & Children', 'family-children', 'https://images.unsplash.com/photo-1653640869615-e9878a2c8344', 1, '2026-02-05 17:47:15'),
(9, 'Comedy & Entertainment', 'comedy-entertainment', 'https://images.unsplash.com/photo-1653640869615-e9878a2c8344', 1, '2026-02-05 17:47:15'),
(10, 'Art & Photography', 'art-photography', NULL, 1, '2026-02-07 11:55:29'),
(11, 'Music & Dance', 'music-dance', NULL, 1, '2026-02-07 11:55:29'),
(12, 'Model', 'model', NULL, 1, '2026-02-07 11:56:15'),
(13, 'Animals & Pets', 'animals-pets', NULL, 1, '2026-02-07 11:56:15'),
(14, 'Adventure & Outdoors', 'adventure-outdoors', NULL, 1, '2026-02-07 11:56:44'),
(15, 'Entrepreneur & Business', 'entrepreneur-business', NULL, 1, '2026-02-07 11:57:10'),
(16, 'Education', 'education', NULL, 1, '2026-02-07 11:58:13'),
(17, 'Athlete & Sports', 'athlete-sports', NULL, 1, '2026-02-07 11:58:13'),
(18, 'Gaming', 'gaming', NULL, 1, '2026-02-07 11:59:14'),
(19, 'Technology', 'technology', NULL, 1, '2026-02-07 11:59:14'),
(20, 'Healthcare', 'healthcare', NULL, 1, '2026-02-07 11:59:55'),
(21, 'Actor', 'actor', NULL, 1, '2026-02-07 11:59:55'),
(22, 'Automotive', 'automotive', NULL, 1, '2026-02-07 12:00:14');

-- --------------------------------------------------------

--
-- Table structure for table `content_types`
--

CREATE TABLE `content_types` (
  `content_type_id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `influencers`
--

CREATE TABLE `influencers` (
  `influencer_id` bigint(20) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `influencers`
--

INSERT INTO `influencers` (`influencer_id`, `full_name`, `email`, `phone`, `country`, `city`, `profile_pic`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'Houra Mirhashemi', 'hulya_dxb@gmail.com', NULL, 'United Arab Emirates', 'Dubai', 'https://onehub.ae/wp-content/uploads/2025/10/hulya_dxb.jpg', 'ʙᴜꜱɪɴᴇꜱꜱ ᴏᴡɴᴇʀ | ᴀʀᴄʜɪᴛᴇᴄᴛ | ɪɴᴛᴇʀɪᴏʀ ᴅᴇꜱɪɢɴᴇʀ', '2026-02-06 17:01:37', '2026-02-06 17:01:37'),
(2, 'APARNA', 'workwithaparna03@gmail.com', '9899899898', 'UAE', 'Dubai', 'https://instagram.fpgh2-1.fna.fbcdn.net/v/t51.2885-19/610682319_17905761282317076_6789158323520136508_n.jpg', 'Sharing pretty much everything that I love and creating the life I once dreamed', '2026-02-06 17:11:30', '2026-02-06 17:11:30');

-- --------------------------------------------------------

--
-- Table structure for table `influencer_campaigns`
--

CREATE TABLE `influencer_campaigns` (
  `id` bigint(20) NOT NULL,
  `influencer_id` bigint(20) NOT NULL,
  `campaign_id` bigint(20) NOT NULL,
  `status` enum('invited','accepted','declined','completed') DEFAULT NULL,
  `agreed_fee` decimal(12,2) DEFAULT NULL,
  `date_joined` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `influencer_categories`
--

CREATE TABLE `influencer_categories` (
  `influencer_id` bigint(20) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `influencer_categories`
--

INSERT INTO `influencer_categories` (`influencer_id`, `category_id`) VALUES
(1, 4),
(2, 2),
(2, 3),
(2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` bigint(20) NOT NULL,
  `influencer_campaign_id` bigint(20) NOT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` bigint(20) NOT NULL,
  `reviewer_id` bigint(20) NOT NULL,
  `reviewed_id` bigint(20) NOT NULL,
  `influencer_campaign_id` bigint(20) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_profiles`
--

CREATE TABLE `social_profiles` (
  `profile_id` bigint(20) NOT NULL,
  `influencer_id` bigint(20) NOT NULL,
  `platform` enum('instagram','tiktok','youtube','other') DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `profile_url` varchar(255) DEFAULT NULL,
  `followers` bigint(20) DEFAULT 0,
  `engagement_rate` decimal(5,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `social_profiles`
--

INSERT INTO `social_profiles` (`profile_id`, `influencer_id`, `platform`, `username`, `profile_url`, `followers`, `engagement_rate`, `category`, `last_updated`) VALUES
(1, 1, 'instagram', '@hulya_dxb', 'https://www.instagram.com/hulya_dxb/', 4200000, NULL, NULL, NULL),
(2, 2, 'instagram', '@aparna._.abhishek', 'https://www.instagram.com/aparna._.abhishek', 6934, NULL, NULL, NULL),
(3, 2, 'youtube', '@aparna._.abhishek', 'https://www.instagram.com/aparna._.abhishek', 6934, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`campaign_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`),
  ADD UNIQUE KEY `category_slug` (`category_slug`);

--
-- Indexes for table `content_types`
--
ALTER TABLE `content_types`
  ADD PRIMARY KEY (`content_type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- Indexes for table `influencers`
--
ALTER TABLE `influencers`
  ADD PRIMARY KEY (`influencer_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `influencer_campaigns`
--
ALTER TABLE `influencer_campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `influencer_id` (`influencer_id`),
  ADD KEY `campaign_id` (`campaign_id`);

--
-- Indexes for table `influencer_categories`
--
ALTER TABLE `influencer_categories`
  ADD PRIMARY KEY (`influencer_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `influencer_campaign_id` (`influencer_campaign_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `influencer_campaign_id` (`influencer_campaign_id`);

--
-- Indexes for table `social_profiles`
--
ALTER TABLE `social_profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD KEY `influencer_id` (`influencer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `campaign_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `content_types`
--
ALTER TABLE `content_types`
  MODIFY `content_type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `influencers`
--
ALTER TABLE `influencers`
  MODIFY `influencer_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `influencer_campaigns`
--
ALTER TABLE `influencer_campaigns`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_profiles`
--
ALTER TABLE `social_profiles`
  MODIFY `profile_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `influencer_campaigns`
--
ALTER TABLE `influencer_campaigns`
  ADD CONSTRAINT `influencer_campaigns_ibfk_1` FOREIGN KEY (`influencer_id`) REFERENCES `influencers` (`influencer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `influencer_campaigns_ibfk_2` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE;

--
-- Constraints for table `influencer_categories`
--
ALTER TABLE `influencer_categories`
  ADD CONSTRAINT `influencer_categories_ibfk_1` FOREIGN KEY (`influencer_id`) REFERENCES `influencers` (`influencer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `influencer_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`influencer_campaign_id`) REFERENCES `influencer_campaigns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`influencer_campaign_id`) REFERENCES `influencer_campaigns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `social_profiles`
--
ALTER TABLE `social_profiles`
  ADD CONSTRAINT `social_profiles_ibfk_1` FOREIGN KEY (`influencer_id`) REFERENCES `influencers` (`influencer_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
