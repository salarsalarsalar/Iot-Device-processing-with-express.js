-- USERS (one-to-many with DEVICES, many-to-many with ROLES via USER_ROLES)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ROLES (many-to-many with USERS via USER_ROLES)
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- USER_ROLES (many-to-many between USERS and ROLES)
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- DEVICES (one-to-many with IOT_FLOWS, one-to-one with USERS via user_id)
CREATE TABLE devices (
    device_id INT PRIMARY KEY AUTO_INCREMENT,
    device_name VARCHAR(100),
    user_id INT NULL 
    -- user_id INT NULL,
    -- FOREIGN KEY (user_id) REFERENCES users(id)
);

-- -- Add the user_id column (nullable to avoid breaking existing inserts)
-- ALTER TABLE devices
-- ADD COLUMN user_id INT NULL;

-- -- Add the foreign key constraint to reference the users table
-- ALTER TABLE devices
-- ADD CONSTRAINT fk_user_device
-- FOREIGN KEY (user_id) REFERENCES users(id);


-- TIME (one-to-many with IOT_FLOWS)
CREATE TABLE time (
    time_id INT PRIMARY KEY AUTO_INCREMENT,
    full_timestamp DATETIME,
    year INT,
    month INT,
    day INT,
    hour INT,
    minute INT,
    second INT
);

-- IOT_FLOWS (many-to-one with DEVICES and TIME)
CREATE TABLE iot_flows (
    id INT PRIMARY KEY,
    packet_size_avg FLOAT,
    packet_size_sum INT,
    timestamp DATETIME,
    device_id INT,
    time_id INT,
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    FOREIGN KEY (time_id) REFERENCES time(time_id)
);


SELECT * FROM iot_flows;
SELECT * FROM iot_flows WHERE id = 1;

