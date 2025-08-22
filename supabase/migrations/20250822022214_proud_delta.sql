-- USERS
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STOPS
CREATE TABLE stops (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(120),
  state VARCHAR(120),
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ROUTES
CREATE TABLE routes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  source_stop_id BIGINT NOT NULL,
  destination_stop_id BIGINT NOT NULL,
  total_distance_km DECIMAL(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_stop_id) REFERENCES stops(id),
  FOREIGN KEY (destination_stop_id) REFERENCES stops(id)
);

-- ROUTE SEGMENTS
CREATE TABLE route_segments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_id BIGINT NOT NULL,
  from_stop_id BIGINT NOT NULL,
  to_stop_id BIGINT NOT NULL,
  sequence_no INT NOT NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id),
  FOREIGN KEY (from_stop_id) REFERENCES stops(id),
  FOREIGN KEY (to_stop_id) REFERENCES stops(id),
  UNIQUE(route_id, sequence_no)
);

-- BUSES
CREATE TABLE buses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(30) NOT NULL, -- AC_SEATER/NONAC_SEATER/AC_SLEEPER/NONAC_SLEEPER
  total_seats INT NOT NULL,
  price_per_km DECIMAL(6,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- SEATS (static layout per bus)
CREATE TABLE seats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bus_id BIGINT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  deck VARCHAR(10), -- optional
  row_no INT,
  col_no INT,
  FOREIGN KEY (bus_id) REFERENCES buses(id),
  UNIQUE (bus_id, seat_number)
);

-- TRIPS (a bus on a date)
CREATE TABLE trips (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bus_id BIGINT NOT NULL,
  travel_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id),
  UNIQUE(bus_id, travel_date, departure_time)
);

-- BOOKINGS
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  trip_id BIGINT NOT NULL,
  from_stop_id BIGINT NOT NULL,
  to_stop_id BIGINT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  fare_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL, -- CONFIRMED/CANCELLED
  ticket_code VARCHAR(40) NOT NULL UNIQUE,
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  from_seq INT NOT NULL,
  to_seq INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (trip_id) REFERENCES trips(id),
  FOREIGN KEY (from_stop_id) REFERENCES stops(id),
  FOREIGN KEY (to_stop_id) REFERENCES stops(id)
);

-- PAYMENTS (optional mock)
CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL,
  txn_ref VARCHAR(60),
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);