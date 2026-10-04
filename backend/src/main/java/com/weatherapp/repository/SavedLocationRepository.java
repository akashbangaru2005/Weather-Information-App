package com.weatherapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherapp.model.SavedLocation;

public interface SavedLocationRepository
        extends JpaRepository<SavedLocation, Long> {

    List<SavedLocation> findAllByOrderByCreatedAtDesc();
}