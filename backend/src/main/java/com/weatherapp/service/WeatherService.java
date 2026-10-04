package com.weatherapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.weatherapp.client.WeatherApiClient;
import com.weatherapp.dto.WeatherResponse;
import com.weatherapp.model.SearchHistory;
import com.weatherapp.repository.SearchHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    private final WeatherApiClient weatherApiClient;
    private final SearchHistoryRepository searchHistoryRepository;

    public WeatherService(
            WeatherApiClient weatherApiClient,
            SearchHistoryRepository searchHistoryRepository) {

        this.weatherApiClient = weatherApiClient;
        this.searchHistoryRepository = searchHistoryRepository;
    }

    public WeatherResponse getWeather(String location, int days) {

        if (location == null || location.isBlank()) {
            throw new IllegalArgumentException(
                    "Location cannot be empty."
            );
        }

        int safeDays = Math.min(Math.max(days, 1), 14);

        JsonNode root =
                weatherApiClient.getForecast(location, safeDays);

        SearchHistory history = new SearchHistory();
        history.setLocation(location.trim());

        searchHistoryRepository.save(history);

        return mapWeatherResponse(root);
    }

    private WeatherResponse mapWeatherResponse(JsonNode root) {

        JsonNode locationNode = root.path("location");
        JsonNode currentNode = root.path("current");

        WeatherResponse.LocationData location =
                new WeatherResponse.LocationData(
                        locationNode.path("name").asText(),
                        locationNode.path("region").asText(),
                        locationNode.path("country").asText(),
                        locationNode.path("lat").asDouble(),
                        locationNode.path("lon").asDouble(),
                        locationNode.path("localtime").asText()
                );

        JsonNode conditionNode =
                currentNode.path("condition");

        WeatherResponse.CurrentWeather current =
                new WeatherResponse.CurrentWeather(
                        currentNode.path("temp_c").asDouble(),
                        currentNode.path("feelslike_c").asDouble(),
                        conditionNode.path("text").asText(),
                        normalizeIcon(conditionNode.path("icon").asText()),
                        currentNode.path("humidity").asInt(),
                        currentNode.path("wind_kph").asDouble(),
                        currentNode.path("wind_dir").asText(),
                        currentNode.path("pressure_mb").asDouble(),
                        currentNode.path("vis_km").asDouble(),
                        currentNode.path("uv").asDouble()
                );

        JsonNode airQualityNode =
                currentNode.path("air_quality");

        WeatherResponse.AirQuality airQuality =
                new WeatherResponse.AirQuality(
                        airQualityNode.path("us-epa-index").asDouble(),
                        airQualityNode.path("pm2_5").asDouble(),
                        airQualityNode.path("pm10").asDouble(),
                        airQualityNode.path("co").asDouble(),
                        airQualityNode.path("no2").asDouble(),
                        airQualityNode.path("so2").asDouble(),
                        airQualityNode.path("o3").asDouble()
                );

        JsonNode forecastDays =
                root.path("forecast").path("forecastday");

        List<WeatherResponse.HourlyWeather> hourly =
                new ArrayList<>();

        List<WeatherResponse.DailyWeather> daily =
                new ArrayList<>();

        if (forecastDays.isArray()) {

            for (JsonNode dayNode : forecastDays) {

                JsonNode day =
                        dayNode.path("day");

                JsonNode astro =
                        dayNode.path("astro");

                JsonNode condition =
                        day.path("condition");

                WeatherResponse.DailyWeather dailyWeather =
                        new WeatherResponse.DailyWeather(
                                dayNode.path("date").asText(),
                                day.path("mintemp_c").asDouble(),
                                day.path("maxtemp_c").asDouble(),
                                day.path("avgtemp_c").asDouble(),
                                condition.path("text").asText(),
                                normalizeIcon(condition.path("icon").asText()),
                                day.path("daily_chance_of_rain").asDouble(),
                                astro.path("sunrise").asText(),
                                astro.path("sunset").asText(),
                                astro.path("moonrise").asText(),
                                astro.path("moonset").asText()
                        );

                daily.add(dailyWeather);

                JsonNode hours =
                        dayNode.path("hour");

                if (hours.isArray()) {

                    for (JsonNode hour : hours) {

                        if (hourly.size() >= 24) {
                            break;
                        }

                        JsonNode hourCondition =
                                hour.path("condition");

                        WeatherResponse.HourlyWeather
                                hourlyWeather =
                                new WeatherResponse.HourlyWeather(
                                        hour.path("time").asText(),
                                        hour.path("temp_c").asDouble(),
                                        hour.path("feelslike_c").asDouble(),
                                        hourCondition.path("text").asText(),
                                        normalizeIcon(
                                                hourCondition
                                                        .path("icon")
                                                        .asText()
                                        ),
                                        hour.path("humidity").asInt(),
                                        hour.path("wind_kph").asDouble(),
                                        hour.path("chance_of_rain").asDouble()
                                );

                        hourly.add(hourlyWeather);
                    }
                }
            }
        }

        WeatherResponse.Astronomy astronomy;

        if (!daily.isEmpty()) {

            WeatherResponse.DailyWeather today =
                    daily.get(0);

            JsonNode firstDay =
                    forecastDays.get(0).path("astro");

            astronomy =
                    new WeatherResponse.Astronomy(
                            today.sunrise(),
                            today.sunset(),
                            today.moonrise(),
                            today.moonset(),
                            firstDay.path("moon_phase").asText(),
                            firstDay.path("moon_illumination")
                                    .asDouble()
                    );

        } else {

            astronomy =
                    new WeatherResponse.Astronomy(
                            "N/A",
                            "N/A",
                            "N/A",
                            "N/A",
                            "Unknown",
                            0
                    );
        }

        List<WeatherResponse.WeatherAlert> alerts =
                mapAlerts(root.path("alerts").path("alert"));

        return new WeatherResponse(
                location,
                current,
                airQuality,
                astronomy,
                hourly,
                daily,
                alerts
        );
    }

    private List<WeatherResponse.WeatherAlert> mapAlerts(
            JsonNode alertsNode) {

        List<WeatherResponse.WeatherAlert> alerts =
                new ArrayList<>();

        if (!alertsNode.isArray()) {
            return alerts;
        }

        for (JsonNode alert : alertsNode) {

            alerts.add(
                    new WeatherResponse.WeatherAlert(
                            alert.path("headline").asText(),
                            alert.path("severity").asText(),
                            alert.path("desc").asText()
                    )
            );
        }

        return alerts;
    }

    private String normalizeIcon(String icon) {

        if (icon == null || icon.isBlank()) {
            return "";
        }

        if (icon.startsWith("//")) {
            return "https:" + icon;
        }

        return icon;
    }
}