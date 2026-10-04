package com.weatherapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weatherapp.model.SearchHistory;

public interface SearchHistoryRepository
        extends JpaRepository<SearchHistory, Long> {

    List<SearchHistory> findAllByOrderBySearchedAtDesc();
}