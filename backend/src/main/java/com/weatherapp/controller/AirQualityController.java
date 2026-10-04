package com.weatherapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weatherapp.dto.AirQualityResponse;
import com.weatherapp.service.AirQualityService;

@RestController
@RequestMapping("/api/air-quality")
public class AirQualityController {

    private final AirQualityService airQualityService;

    public AirQualityController(
            AirQualityService airQualityService) {

        this.airQualityService = airQualityService;
    }

    @GetMapping
    public AirQualityResponse getAirQuality(
            @RequestParam String location) {

        return airQualityService.getAirQuality(location);
    }
}