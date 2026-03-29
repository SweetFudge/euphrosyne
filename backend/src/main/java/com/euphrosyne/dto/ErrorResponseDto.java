package com.euphrosyne.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ErrorResponseDto {
    private int status;
    private String message;
    private Instant timestamp;

    public static ErrorResponseDto of(int status, String message) {
        return new ErrorResponseDto(status, message, Instant.now());
    }
}
