CREATE TABLE devices (
    device_id INT PRIMARY KEY AUTO_INCREMENT,
    device_name VARCHAR(100)
);


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

