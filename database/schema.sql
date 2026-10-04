CREATE DATABASE IF NOT EXISTS weather_app;
USE weather_app;

-- Tables will be added during the MySQL integration phase.
CREATE DATABASE IF NOT EXISTS weather_app;

USE weather_app;

CREATE TABLE IF NOT EXISTS saved_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    country VARCHAR(255),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS search_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    searched_at DATETIME NOT NULL
);