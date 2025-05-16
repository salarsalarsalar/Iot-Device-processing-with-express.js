-- USERS (one-to-many with DEVICES, many-to-many with ROLES via USER_ROLES)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Add the email column (nullable to avoid breaking existing inserts)
ALTER TABLE users
ADD COLUMN email VARCHAR(255) NOT NULL;

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
    -- user_id INT NULL,
    -- FOREIGN KEY (user_id) REFERENCES users(id)
);


