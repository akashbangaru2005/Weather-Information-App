package com.weatherapp.dto;

public record AirQualityResponse(
        String location,
        double aqi,
        String status,
        double pm25,
        double pm10,
        double co,
        double no2,
        double so2,
        double o3
) {}