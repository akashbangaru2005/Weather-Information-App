package com.weatherapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weatherapp.dto.LocationResponse;
import com.weatherapp.model.SavedLocation;
import com.weatherapp.service.LocationService;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    private final LocationService locationService;

    public LocationController(
            LocationService locationService) {

        this.locationService = locationService;
    }

    @GetMapping("/search")
    public List<LocationResponse> searchLocation(
            @RequestParam String q) {

        return locationService.search(q);
    }

    @PostMapping("/saved")
    public SavedLocation saveLocation(
            @RequestParam String name,
            @RequestParam(required = false, defaultValue = "") String region,
            @RequestParam(required = false, defaultValue = "") String country,
            @RequestParam double latitude,
            @RequestParam double longitude) {

        return locationService.saveLocation(
                name,
                region,
                country,
                latitude,
                longitude
        );
    }

    @GetMapping("/saved")
    public List<SavedLocation> getSavedLocations() {
        return locationService.getSavedLocations();
    }

    @DeleteMapping("/saved/{id}")
    public void deleteSavedLocation(
            @PathVariable Long id) {

        locationService.deleteSavedLocation(id);
    }
}