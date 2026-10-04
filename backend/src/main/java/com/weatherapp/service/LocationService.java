package com.weatherapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.weatherapp.client.GeocodingApiClient;
import com.weatherapp.dto.LocationResponse;
import com.weatherapp.model.SavedLocation;
import com.weatherapp.repository.SavedLocationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LocationService {

    private final GeocodingApiClient geocodingApiClient;
    private final SavedLocationRepository savedLocationRepository;

    public LocationService(
            GeocodingApiClient geocodingApiClient,
            SavedLocationRepository savedLocationRepository) {

        this.geocodingApiClient = geocodingApiClient;
        this.savedLocationRepository = savedLocationRepository;
    }

    public List<LocationResponse> search(String query) {

        if (query == null || query.isBlank()) {
            return List.of();
        }

        JsonNode response =
                geocodingApiClient.search(query);

        List<LocationResponse> results =
                new ArrayList<>();

        if (!response.isArray()) {
            return results;
        }

        for (JsonNode node : response) {

            results.add(
                    new LocationResponse(
                            node.path("id").asText(),
                            node.path("name").asText(),
                            node.path("region").asText(),
                            node.path("country").asText(),
                            node.path("lat").asDouble(),
                            node.path("lon").asDouble()
                    )
            );
        }

        return results;
    }

    public SavedLocation saveLocation(
            String name,
            String region,
            String country,
            double latitude,
            double longitude) {

        SavedLocation saved =
                new SavedLocation();

        saved.setName(name);
        saved.setRegion(region);
        saved.setCountry(country);
        saved.setLatitude(latitude);
        saved.setLongitude(longitude);

        return savedLocationRepository.save(saved);
    }

    public List<SavedLocation> getSavedLocations() {
        return savedLocationRepository
                .findAllByOrderByCreatedAtDesc();
    }

    public void deleteSavedLocation(Long id) {
        savedLocationRepository.deleteById(id);
    }
}