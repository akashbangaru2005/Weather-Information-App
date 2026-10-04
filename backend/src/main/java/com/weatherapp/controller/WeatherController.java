package com.weatherapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weatherapp.dto.WeatherResponse;
import com.weatherapp.service.WeatherService;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(
            WeatherService weatherService) {

        this.weatherService = weatherService;
    }

    @GetMapping
    public WeatherResponse getWeather(
            @RequestParam String location,
            @RequestParam(defaultValue = "7") int days) {

        return weatherService.getWeather(
                location,
                days
        );
    }
}