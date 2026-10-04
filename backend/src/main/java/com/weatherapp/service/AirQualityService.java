package com.weatherapp.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.weatherapp.client.AirQualityApiClient;
import com.weatherapp.dto.AirQualityResponse;

@Service
public class AirQualityService {

    private final AirQualityApiClient airQualityApiClient;

    public AirQualityService(
            AirQualityApiClient airQualityApiClient) {

        this.airQualityApiClient = airQualityApiClient;
    }

    public AirQualityResponse getAirQuality(String location) {

        JsonNode current =
                airQualityApiClient.getAirQuality(location);

        JsonNode airQuality =
                current.path("air_quality");

        double aqi =
                airQuality.path("us-epa-index").asDouble();

        return new AirQualityResponse(
                location,
                aqi,
                getStatus(aqi),
                airQuality.path("pm2_5").asDouble(),
                airQuality.path("pm10").asDouble(),
                airQuality.path("co").asDouble(),
                airQuality.path("no2").asDouble(),
                airQuality.path("so2").asDouble(),
                airQuality.path("o3").asDouble()
        );
    }

    private String getStatus(double aqi) {

        if (aqi <= 1) {
            return "Good";
        }

        if (aqi <= 2) {
            return "Moderate";
        }

        if (aqi <= 3) {
            return "Unhealthy for sensitive groups";
        }

        if (aqi <= 4) {
            return "Unhealthy";
        }

        return "Very Unhealthy";
    }
}