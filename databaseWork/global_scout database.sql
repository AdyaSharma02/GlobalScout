-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2024 at 03:43 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `global_scout`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `country_region` varchar(255) NOT NULL,
  `mobile_number` varchar(10) NOT NULL,
  `country_of_travel` varchar(255) NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `number_of_guests` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `hotel` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `user_id`, `username`, `email`, `country_region`, `mobile_number`, `country_of_travel`, `check_in_date`, `check_out_date`, `number_of_guests`, `created_at`, `hotel`) VALUES
(3, 27, 'mahak_jain', 'mahak.jain@example.com', 'Australia', '9876543210', 'South Korea', '2024-08-15', '2024-08-31', 2, '2024-08-12 14:48:54', 'The Park Hyatt Busan'),
(4, 8, 'khyati_singh', 'khyati.singh@example.com', 'India', '1234567890', 'Japan', '2024-09-01', '2024-09-05', 3, '2024-08-13 03:47:41', 'Nest Hotel Hiroshima'),
(5, 21, 'arya_sharma', 'arya.sharma@example.com', 'Australia', '9988776655', 'Vietnam', '2024-11-08', '2024-11-16', 5, '2024-08-13 05:32:08', 'Labar Hotel Saigon'),
(6, 24, 'alok_bhardwaj', 'alok.bhardwaj@example.com', 'Canada', '1122334455', 'Indonesia', '2024-08-15', '2024-08-20', 1, '2024-08-13 05:34:46', 'Adhidrawa Ubud'),
(7, 4, 'emily_davis', 'emily.davis@example.com', 'France', '6677889900', 'South Korea', '2024-08-25', '2024-08-31', 4, '2024-08-13 05:42:05', 'Commodore Hotel');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 'John Doe', 'john.doe@example.com', 'Inquiry about services', 'I would like to know more about your services.', '2024-08-11 13:36:09'),
(2, 'Jane Smith', 'jane.smith@example.com', 'Feedback on website', 'Your website is very user-friendly and informative.', '2024-08-11 13:36:09'),
(3, 'Michael Brown', 'michael.brown@example.com', 'Support request', 'I need help with accessing my account.', '2024-08-11 13:36:09'),
(4, 'Emily Davis', 'emily.davis@example.com', 'Job opportunity', 'Are there any job openings available at your company?', '2024-08-11 13:36:09'),
(8, 'khyati_singh', 'khyati.singh@example.com', 'Inquiry about Travel Packages', 'I am interested in learning more about your travel packages and destinations. Specifically, I would like to inquire about your guided tours in Japan and South Korea. Could you provide more details on the available packages, pricing, and itinerary options?\r\nAdditionally, I would like to know if there are any ongoing promotions or discounts that I could take advantage of.\r\nThank you for your assistance. I look forward to your response.\r\n', '2024-08-12 05:03:14');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `feedback_type` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `feedback_type`, `message`, `rating`, `created_at`) VALUES
(1, 'Website Issues', 'The contact form does not submit properly.', 3, '2024-08-19 06:12:08'),
(2, 'Service Experience', 'The service was quick and efficient. Highly satisfied!', 5, '2024-08-19 06:12:08'),
(3, 'Suggestions', 'It would be useful to add a live chat support feature.', 4, '2024-08-19 06:12:08'),
(4, 'General Feedback', 'I love the new layout of the homepage.', 5, '2024-08-19 06:12:08'),
(5, 'Website Issues', 'The website takes too long to load on mobile devices.', 2, '2024-08-19 06:12:08'),
(6, 'Service Experience', 'The support team was not very responsive to my queries.', 2, '2024-08-19 06:12:08'),
(7, 'Suggestions', 'Consider adding a feature to save favorite items.', 4, '2024-08-19 06:12:08'),
(19, 'Suggestions', 'Try to add more places.', 3, '2024-08-19 11:57:49'),
(20, 'Suggestions', 'hello', 4, '2024-08-20 13:24:07');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `hotel_id` int(11) NOT NULL,
  `hotel_name` varchar(255) NOT NULL,
  `country_of_travel` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`hotel_id`, `hotel_name`, `country_of_travel`) VALUES
(1, 'HotelLeo Yu Capsule', 'Japan'),
(2, 'Hotel Yu Shu Osaka', 'Japan'),
(3, 'Hotel New Wakasa Nara', 'Japan'),
(4, 'Kyoto Takasegawa Bettei', 'Japan'),
(5, 'Ryukyu Onsen Okinawa', 'Japan'),
(6, 'Nest Hotel Hiroshima', 'Japan'),
(7, 'Acoustic Hotel & Spa', 'Vietnam'),
(8, 'Lan home', 'Vietnam'),
(9, 'Vina Center Hotel', 'Vietnam'),
(10, 'Muong Hoa Eco Villa', 'Vietnam'),
(11, 'Labar Hotel Saigon', 'Vietnam'),
(12, 'Paddington Hotel', 'Vietnam'),
(13, 'Lotte Hotel', 'South Korea'),
(14, 'Commodore Hotel', 'South Korea'),
(15, 'The Shilla Seoul', 'South Korea'),
(16, 'The Park Hyatt Busan', 'South Korea'),
(17, 'Four Seasons Hotel Seoul', 'South Korea'),
(18, 'Conrad Seoul', 'South Korea'),
(19, 'Light Blue Villa', 'Indonesia'),
(20, 'Holiday Inn Resort Bali', 'Indonesia'),
(21, 'Orchardz Jayakarta', 'Indonesia'),
(22, 'Adhidrawa Ubud', 'Indonesia'),
(23, 'Salili Bungalow', 'Indonesia'),
(24, 'Vanilla Garden', 'Indonesia');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'john_doe', 'john.doe@example.com', 'john', '2024-08-09 04:04:45'),
(2, 'jane_smith', 'jane.smith@example.com', 'jane', '2024-08-09 04:04:45'),
(3, 'michael_brown', 'michael.brown@example.com', 'michael', '2024-08-09 04:39:50'),
(4, 'emily_davis', 'emily.davis@example.com', 'emily', '2024-08-09 04:42:03'),
(8, 'khyati_singh', 'khyati.singh@example.com', 'khyati', '2024-08-09 05:09:34'),
(12, 'sophia_wilson', 'sophia.wilson@example.com', 'sophia', '2024-08-09 12:03:23'),
(21, 'arya_sharma', 'arya.sharma@example.com', 'arya', '2024-08-10 02:34:32'),
(23, 'adya_sharma', 'adya.sharma@example.com', 'adya', '2024-08-10 02:43:45'),
(24, 'alok_bhardwaj', 'alok.bhardwaj@example.com', 'alok', '2024-08-10 02:54:54'),
(25, 'swati_agarwal', 'swati.agarwal@example.com', 'swati', '2024-08-10 05:10:45'),
(27, 'mahak_jain', 'mahak.jain@example.com', 'mahak', '2024-08-12 11:56:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `username` (`username`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`hotel_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `hotel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`email`) REFERENCES `users` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
