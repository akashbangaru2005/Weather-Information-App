USE weather_app;

-- Sample data will be added during the database integration phase.
USE weather_app;

INSERT INTO saved_locations
(name, region, country, latitude, longitude, created_at)
VALUES
(
    'Hyderabad',
    'Telangana',
    'India',
    17.3850,
    78.4867,
    NOW()
);

INSERT INTO search_history
(location, searched_at)
VALUES
(
    'Hyderabad',
    NOW()
);