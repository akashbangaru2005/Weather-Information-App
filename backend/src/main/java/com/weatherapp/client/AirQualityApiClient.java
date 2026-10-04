package com.weatherapp.client;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.weatherapp.exception.WeatherApiException;

@Component
public class AirQualityApiClient {

    private final WeatherApiClient weatherApiClient;

    public AirQualityApiClient(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
    }

    public JsonNode getAirQuality(String location) {

        JsonNode response =
                weatherApiClient.getCurrentWeather(location);

        if (!response.has("current")) {
            throw new WeatherApiException(
                    "Air quality data is unavailable."
            );
        }

        return response.get("current");
    }
}