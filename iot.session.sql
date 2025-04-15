CREATE TABLE iot_flows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  packet_size_avg FLOAT,
  packet_size_sum FLOAT,
  timestamp DATETIME
);

SELECT * FROM iot_flows;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
