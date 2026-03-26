package com.euphrosyne.service;

import com.euphrosyne.dto.LabelDto;
import com.euphrosyne.model.Label;
import com.euphrosyne.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;

    public List<Label> findAll() {
        return labelRepository.findAll();
    }

    public Label create(LabelDto dto) {
        String key = generateKey(dto.getName());
        String baseKey = key;
        int suffix = 1;
        while (labelRepository.existsByKey(key)) {
            key = baseKey + "-" + suffix++;
        }
        return labelRepository.save(Label.builder()
                .key(key)
                .name(dto.getName())
                .description(dto.getDescription())
                .build());
    }

    public void delete(Long id) {
        labelRepository.deleteById(id);
    }

    private String generateKey(String name) {
        return Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}
