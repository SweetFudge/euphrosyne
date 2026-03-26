package com.euphrosyne.service;

import com.euphrosyne.dto.CategoryDto;
import com.euphrosyne.model.Category;
import com.euphrosyne.model.CategoryScope;
import com.euphrosyne.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> findByScope(CategoryScope scope) {
        return categoryRepository.findByScopeOrderByNameAsc(scope);
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category create(CategoryDto dto) {
        String key = generateKey(dto.getName());
        String baseKey = key;
        int suffix = 1;
        while (categoryRepository.existsByKey(key)) {
            key = baseKey + "-" + suffix++;
        }
        return categoryRepository.save(Category.builder()
                .key(key)
                .name(dto.getName())
                .description(dto.getDescription())
                .scope(dto.getScope())
                .build());
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    private String generateKey(String name) {
        return Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}
