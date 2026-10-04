package com.weatherapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDateTime searchedAt;

    @PrePersist
    public void prePersist() {
        if (searchedAt == null) {
            searchedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getSearchedAt() {
        return searchedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setSearchedAt(LocalDateTime searchedAt) {
        this.searchedAt = searchedAt;
    }
}