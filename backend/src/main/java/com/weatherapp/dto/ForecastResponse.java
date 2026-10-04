package com.weatherapp.dto;

import java.util.List;

public record ForecastResponse(
        String location,
        List<WeatherResponse.DailyWeather> daily
) {}