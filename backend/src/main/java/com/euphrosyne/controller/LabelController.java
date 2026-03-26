package com.euphrosyne.controller;

import com.euphrosyne.dto.LabelDto;
import com.euphrosyne.mapper.LabelMapper;
import com.euphrosyne.service.LabelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;
    private final LabelMapper labelMapper;

    @GetMapping
    public ResponseEntity<List<LabelDto>> getAll() {
        return ResponseEntity.ok(labelMapper.toDtoList(labelService.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LabelDto> create(@Valid @RequestBody LabelDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(labelMapper.toDto(labelService.create(dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        labelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
