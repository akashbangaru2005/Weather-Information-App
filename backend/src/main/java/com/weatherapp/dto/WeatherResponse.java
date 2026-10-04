package com.weatherapp.dto;

import java.util.List;

public record WeatherResponse(
        LocationData location,
        CurrentWeather current,
        AirQuality airQuality,
        Astronomy astronomy,
        List<HourlyWeather> hourly,
        List<DailyWeather> daily,
        List<WeatherAlert> alerts
) {

    public record LocationData(
            String name,
            String region,
            String country,
            double latitude,
            double longitude,
            String localTime
    ) {}

    public record CurrentWeather(
            double temperature,
            double feelsLike,
            String condition,
            String icon,
            int humidity,
            double windSpeed,
            String windDirection,
            double pressure,
            double visibility,
            double uvIndex
    ) {}

    public record AirQuality(
            double aqi,
            double pm25,
            double pm10,
            double co,
            double no2,
            double so2,
            double o3
    ) {}

    public record Astronomy(
            String sunrise,
            String sunset,
            String moonrise,
            String moonset,
            String moonPhase,
            double moonIllumination
    ) {}

    public record HourlyWeather(
            String time,
            double temperature,
            double feelsLike,
            String condition,
            String icon,
            int humidity,
            double windSpeed,
            double precipitationChance
    ) {}

    public record DailyWeather(
            String date,
            double minTemperature,
            double maxTemperature,
            double averageTemperature,
            String condition,
            String icon,
            double precipitationChance,
            String sunrise,
            String sunset,
            String moonrise,
            String moonset
    ) {}

    public record WeatherAlert(
            String headline,
            String severity,
            String description
    ) {}
}