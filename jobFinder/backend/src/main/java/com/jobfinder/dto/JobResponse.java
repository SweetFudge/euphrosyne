package com.jobfinder.dto;

import java.time.Instant;

public record JobResponse(
        Long id,
        String title,
        String company,
        String location,
        String description,
        String url,
        Instant createdAt
) {
}
