CREATE SCHEMA IF NOT EXISTS `hotel_back` DEFAULT CHARACTER SET utf8 ;
USE `hotel_back` ;

CREATE TABLE IF NOT EXISTS `hotel_back`.`guests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `organization` varchar(50) DEFAULT NULL,
  `age` smallint DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  PRIMARY KEY (`id`)
)

CREATE TABLE IF NOT EXISTS `hotel_back`.`bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `checkin` datetime NOT NULL,
  `checkout` datetime NOT NULL,
  `adults` int DEFAULT '1',
  `children` int DEFAULT '0',
  `type` enum('online','phone','agency','desk') DEFAULT 'desk',
  `comments` text,
  `confirmed` tinyint DEFAULT '0',
  `guest_id` int NOT NULL,
  `checked_in` tinyint DEFAULT '0',
  `checked_out` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_bookings_guest_id` (`guest_id`)
)

CREATE TABLE IF NOT EXISTS `hotel_back`.`rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(20) NOT NULL,
  `price_night` decimal(6,2) NOT NULL DEFAULT '0.00',
  `type` enum('standard','double','suite') NOT NULL DEFAULT 'standard',
  `max_guests` int DEFAULT '1',
  `available` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) 

CREATE TABLE IF NOT EXISTS `hotel_back`.`bookings_has_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `room_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bookings_has_rooms_room_id` (`room_id`),
  KEY `fk_bookings_has_rooms_booking_id` (`booking_id`)
)

CREATE TABLE IF NOT EXISTS `hotel_back`.`room_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `old_status` tinyint DEFAULT NULL,
  `new_status` tinyint DEFAULT NULL,
  `room_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_room_status_guest_id` (`room_id`)
) 

DELIMITER //
CREATE TRIGGER AddRoomStatus AFTER UPDATE ON hotel_back.rooms
FOR EACH ROW
BEGIN
   IF NEW.available <> OLD.available THEN
		INSERT INTO hotel_back.room_status (old_status, new_status, room_id) values (OLD.available, NEW.available, NEW.id);
   END IF;
END;//
DELIMITER ;

DELIMITER //
CREATE TRIGGER CheckedIn AFTER UPDATE ON hotel_back.bookings
FOR EACH ROW
BEGIN
   IF NEW.checked_in <> OLD.checked_in THEN
		update hotel_back.rooms set available = 0 where id in (select room_id from hotel_back.bookings_has_rooms where booking_id = new.id);
   END IF;
END;//
DELIMITER ;

DELIMITER //
CREATE TRIGGER CheckedOut AFTER UPDATE ON hotel_back.bookings
FOR EACH ROW
BEGIN
   IF NEW.checked_out <> OLD.checked_out THEN
		update hotel_back.rooms set available = 1 where id in (select room_id from hms.bookings_has_rooms where booking_id = new.id);
   END IF;
END;//
DELIMITER ;