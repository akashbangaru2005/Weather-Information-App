package com.weatherapp.dto;

public record LocationResponse(
        String id,
        String name,
        String region,
        String country,
        double latitude,
        double longitude
) {}