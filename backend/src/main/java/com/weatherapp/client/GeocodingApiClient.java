package com.weatherapp.client;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;

@Component
public class GeocodingApiClient {

    private final WeatherApiClient weatherApiClient;

    public GeocodingApiClient(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
    }

    public JsonNode search(String query) {
        return weatherApiClient.searchLocation(query);
    }
}