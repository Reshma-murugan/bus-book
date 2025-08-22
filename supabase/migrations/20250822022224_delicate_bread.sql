INSERT INTO stops (id,name,city,state) VALUES
(1,'Chennai CMBT','Chennai','TN'),
(2,'Villupuram','Villupuram','TN'),
(3,'Trichy','Tiruchirappalli','TN'),
(4,'Dindigul','Dindigul','TN'),
(5,'Madurai MIBT','Madurai','TN'),
(6,'Coimbatore','Coimbatore','TN'),
(7,'Salem','Salem','TN'),
(8,'Erode','Erode','TN');

INSERT INTO routes (id,name,source_stop_id,destination_stop_id,total_distance_km)
VALUES 
(1,'Chennai-Madurai',1,5,450),
(2,'Chennai-Coimbatore',1,6,500);

INSERT INTO route_segments (route_id,from_stop_id,to_stop_id,sequence_no,distance_km) VALUES
(1,1,2,1,160),
(1,2,3,2,110),
(1,3,4,3,60),
(1,4,5,4,120),
(2,1,7,1,340),
(2,7,8,2,60),
(2,8,6,3,100);

INSERT INTO buses (id,route_id,name,category,total_seats,price_per_km)
VALUES
(1,1,'TN Express','AC_SEATER',40,2.00),
(2,1,'TN Sleeper','AC_SLEEPER',30,2.20),
(3,2,'CBE Express','NONAC_SEATER',45,1.50),
(4,2,'CBE Deluxe','AC_SEATER',35,2.10);

-- seats for bus 1 (AC_SEATER - 40 seats)
INSERT INTO seats (bus_id, seat_number, row_no, col_no) VALUES
(1,'1A',1,1),(1,'1B',1,2),(1,'1C',1,3),(1,'1D',1,4),
(1,'2A',2,1),(1,'2B',2,2),(1,'2C',2,3),(1,'2D',2,4),
(1,'3A',3,1),(1,'3B',3,2),(1,'3C',3,3),(1,'3D',3,4),
(1,'4A',4,1),(1,'4B',4,2),(1,'4C',4,3),(1,'4D',4,4),
(1,'5A',5,1),(1,'5B',5,2),(1,'5C',5,3),(1,'5D',5,4),
(1,'6A',6,1),(1,'6B',6,2),(1,'6C',6,3),(1,'6D',6,4),
(1,'7A',7,1),(1,'7B',7,2),(1,'7C',7,3),(1,'7D',7,4),
(1,'8A',8,1),(1,'8B',8,2),(1,'8C',8,3),(1,'8D',8,4),
(1,'9A',9,1),(1,'9B',9,2),(1,'9C',9,3),(1,'9D',9,4),
(1,'10A',10,1),(1,'10B',10,2),(1,'10C',10,3),(1,'10D',10,4);

-- seats for bus 2 (AC_SLEEPER - 30 seats)
INSERT INTO seats (bus_id, seat_number, deck, row_no, col_no) VALUES
(2,'L1A','LOWER',1,1),(2,'L1B','LOWER',1,2),(2,'U1A','UPPER',1,1),(2,'U1B','UPPER',1,2),
(2,'L2A','LOWER',2,1),(2,'L2B','LOWER',2,2),(2,'U2A','UPPER',2,1),(2,'U2B','UPPER',2,2),
(2,'L3A','LOWER',3,1),(2,'L3B','LOWER',3,2),(2,'U3A','UPPER',3,1),(2,'U3B','UPPER',3,2),
(2,'L4A','LOWER',4,1),(2,'L4B','LOWER',4,2),(2,'U4A','UPPER',4,1),(2,'U4B','UPPER',4,2),
(2,'L5A','LOWER',5,1),(2,'L5B','LOWER',5,2),(2,'U5A','UPPER',5,1),(2,'U5B','UPPER',5,2),
(2,'L6A','LOWER',6,1),(2,'L6B','LOWER',6,2),(2,'U6A','UPPER',6,1),(2,'U6B','UPPER',6,2),
(2,'L7A','LOWER',7,1),(2,'L7B','LOWER',7,2),(2,'U7A','UPPER',7,1),(2,'U7B','UPPER',7,2),
(2,'L8A','LOWER',8,1),(2,'L8B','LOWER',8,2);

-- seats for bus 3 (NONAC_SEATER - 45 seats)
INSERT INTO seats (bus_id, seat_number, row_no, col_no) VALUES
(3,'1A',1,1),(3,'1B',1,2),(3,'1C',1,3),(3,'1D',1,4),(3,'1E',1,5),
(3,'2A',2,1),(3,'2B',2,2),(3,'2C',2,3),(3,'2D',2,4),(3,'2E',2,5),
(3,'3A',3,1),(3,'3B',3,2),(3,'3C',3,3),(3,'3D',3,4),(3,'3E',3,5),
(3,'4A',4,1),(3,'4B',4,2),(3,'4C',4,3),(3,'4D',4,4),(3,'4E',4,5),
(3,'5A',5,1),(3,'5B',5,2),(3,'5C',5,3),(3,'5D',5,4),(3,'5E',5,5),
(3,'6A',6,1),(3,'6B',6,2),(3,'6C',6,3),(3,'6D',6,4),(3,'6E',6,5),
(3,'7A',7,1),(3,'7B',7,2),(3,'7C',7,3),(3,'7D',7,4),(3,'7E',7,5),
(3,'8A',8,1),(3,'8B',8,2),(3,'8C',8,3),(3,'8D',8,4),(3,'8E',8,5),
(3,'9A',9,1),(3,'9B',9,2),(3,'9C',9,3),(3,'9D',9,4),(3,'9E',9,5);

-- seats for bus 4 (AC_SEATER - 35 seats)
INSERT INTO seats (bus_id, seat_number, row_no, col_no) VALUES
(4,'1A',1,1),(4,'1B',1,2),(4,'1C',1,3),(4,'1D',1,4),
(4,'2A',2,1),(4,'2B',2,2),(4,'2C',2,3),(4,'2D',2,4),
(4,'3A',3,1),(4,'3B',3,2),(4,'3C',3,3),(4,'3D',3,4),
(4,'4A',4,1),(4,'4B',4,2),(4,'4C',4,3),(4,'4D',4,4),
(4,'5A',5,1),(4,'5B',5,2),(4,'5C',5,3),(4,'5D',5,4),
(4,'6A',6,1),(4,'6B',6,2),(4,'6C',6,3),(4,'6D',6,4),
(4,'7A',7,1),(4,'7B',7,2),(4,'7C',7,3),(4,'7D',7,4),
(4,'8A',8,1),(4,'8B',8,2),(4,'8C',8,3),(4,'8D',8,4),
(4,'9A',9,1),(4,'9B',9,2),(4,'9C',9,3);

-- trips for next few days
INSERT INTO trips (bus_id, travel_date, departure_time, arrival_time)
VALUES 
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00','04:00'),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '18:00','04:00'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00','06:00'),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '20:00','06:00'),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '16:00','02:00'),
(3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00','02:00'),
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00','03:00'),
(4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:00','03:00');

-- Sample user for testing
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Test User', 'test@example.com', '9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER');