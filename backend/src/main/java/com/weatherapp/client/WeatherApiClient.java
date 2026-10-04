package com.weatherapp.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.weatherapp.exception.WeatherApiException;

@Component
public class WeatherApiClient {

    private final RestTemplate restTemplate;

    @Value("${weather.api.base-url:https://api.weatherapi.com/v1}")
    private String baseUrl;

    @Value("${weather.api.key:}")
    private String apiKey;

    public WeatherApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public JsonNode getForecast(String location, int days) {

        validateApiKey();

        try {
            String url = UriComponentsBuilder
                    .fromUriString(baseUrl + "/forecast.json")
                    .queryParam("key", apiKey)
                    .queryParam("q", location)
                    .queryParam("days", days)
                    .queryParam("aqi", "yes")
                    .queryParam("alerts", "yes")
                    .build()
                    .toUriString();

            ResponseEntity<JsonNode> response =
                    restTemplate.getForEntity(url, JsonNode.class);

            if (!response.getStatusCode().is2xxSuccessful()
                    || response.getBody() == null) {

                throw new WeatherApiException(
                        "Weather API returned an empty response."
                );
            }

            return response.getBody();

        } catch (WeatherApiException exception) {
            throw exception;

        } catch (RestClientException | IllegalArgumentException exception) {
            throw new WeatherApiException(
                    "Unable to connect to WeatherAPI.com.",
                    exception
            );
        }
    }

    public JsonNode getCurrentWeather(String location) {

        validateApiKey();

        try {
            String url = UriComponentsBuilder
                    .fromUriString(baseUrl + "/current.json")
                    .queryParam("key", apiKey)
                    .queryParam("q", location)
                    .queryParam("aqi", "yes")
                    .build()
                    .toUriString();

            ResponseEntity<JsonNode> response =
                    restTemplate.getForEntity(url, JsonNode.class);

            if (!response.getStatusCode().is2xxSuccessful()
                    || response.getBody() == null) {

                throw new WeatherApiException(
                        "Weather API returned an empty response."
                );
            }

            return response.getBody();

        } catch (WeatherApiException exception) {
            throw exception;

        } catch (RestClientException | IllegalArgumentException exception) {
            throw new WeatherApiException(
                    "Unable to retrieve current weather.",
                    exception
            );
        }
    }

    public JsonNode searchLocation(String query) {

        validateApiKey();

        try {
            String url = UriComponentsBuilder
                    .fromUriString(baseUrl + "/search.json")
                    .queryParam("key", apiKey)
                    .queryParam("q", query)
                    .build()
                    .toUriString();

            ResponseEntity<JsonNode> response =
                    restTemplate.getForEntity(url, JsonNode.class);

            if (!response.getStatusCode().is2xxSuccessful()
                    || response.getBody() == null) {

                throw new WeatherApiException(
                        "Location search returned an empty response."
                );
            }

            return response.getBody();

        } catch (WeatherApiException exception) {
            throw exception;

        } catch (RestClientException | IllegalArgumentException exception) {
            throw new WeatherApiException(
                    "Unable to search locations.",
                    exception
            );
        }
    }

    private void validateApiKey() {

        if (apiKey == null || apiKey.isBlank()) {

            throw new WeatherApiException(
                    "WEATHER_API_KEY is not configured."
            );
        }
    }
}