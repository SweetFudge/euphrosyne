package com.euphrosyne.service;

import com.euphrosyne.dto.CategoryDto;
import com.euphrosyne.model.Category;
import com.euphrosyne.model.CategoryScope;
import com.euphrosyne.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void shouldReturnCategoriesByScope() {
        // given
        List<Category> categories = List.of(
                Category.builder().id(1L).scope(CategoryScope.CATALOGUE).build()
        );
        when(categoryRepository.findByScopeOrderByNameAsc(CategoryScope.CATALOGUE)).thenReturn(categories);

        // when
        List<Category> result = categoryService.findByScope(CategoryScope.CATALOGUE);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getScope()).isEqualTo(CategoryScope.CATALOGUE);
    }

    @Test
    void shouldReturnAllCategories() {
        // given
        when(categoryRepository.findAll()).thenReturn(List.of(
                Category.builder().id(1L).build(),
                Category.builder().id(2L).build()
        ));

        // when
        List<Category> result = categoryService.findAll();

        // then
        assertThat(result).hasSize(2);
    }

    @Test
    void shouldCreateCategory_withGeneratedKey() {
        // given
        CategoryDto dto = new CategoryDto();
        dto.setName("Mariage & Fêtes");
        dto.setScope(CategoryScope.CATALOGUE);

        when(categoryRepository.existsByKey(anyString())).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

        // when
        Category result = categoryService.create(dto);

        // then
        assertThat(result.getKey()).isEqualTo("mariage-fetes");
        assertThat(result.getName()).isEqualTo("Mariage & Fêtes");
        assertThat(result.getScope()).isEqualTo(CategoryScope.CATALOGUE);
    }

    @Test
    void shouldCreateCategoryWithSuffix_whenKeyAlreadyExists() {
        // given
        CategoryDto dto = new CategoryDto();
        dto.setName("Fleurs");
        dto.setScope(CategoryScope.CATALOGUE);

        // "fleurs" exists, "fleurs-1" does not
        when(categoryRepository.existsByKey("fleurs")).thenReturn(true);
        when(categoryRepository.existsByKey("fleurs-1")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

        // when
        Category result = categoryService.create(dto);

        // then
        assertThat(result.getKey()).isEqualTo("fleurs-1");
    }

    @Test
    void shouldDeleteCategory_whenIdExists() {
        // when
        categoryService.delete(1L);

        // then
        verify(categoryRepository).deleteById(1L);
    }
}
