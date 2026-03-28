package com.euphrosyne.service;

import com.euphrosyne.dto.CatalogueItemDto;
import com.euphrosyne.model.*;
import com.euphrosyne.repository.CatalogueItemRepository;
import com.euphrosyne.repository.CategoryRepository;
import com.euphrosyne.repository.LabelRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CatalogueServiceTest {

    @Mock
    private CatalogueItemRepository catalogueItemRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private LabelRepository labelRepository;

    @InjectMocks
    private CatalogueService catalogueService;

    @Test
    void shouldReturnAllItems() {
        // given
        when(catalogueItemRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(CatalogueItem.builder().id(1L).build()));

        // when
        List<CatalogueItem> result = catalogueService.findAll();

        // then
        assertThat(result).hasSize(1);
    }

    @Test
    void shouldReturnOnlyPublishedItems() {
        // given
        when(catalogueItemRepository.findByStatusOrderByCreatedAtDesc(ItemStatus.PUBLISHED))
                .thenReturn(List.of(CatalogueItem.builder().id(1L).status(ItemStatus.PUBLISHED).build()));

        // when
        List<CatalogueItem> result = catalogueService.findPublished();

        // then
        assertThat(result).allMatch(i -> i.getStatus() == ItemStatus.PUBLISHED);
    }

    @Test
    void shouldCreateItemWithDraftStatus_whenValidDto() {
        // given
        CatalogueItemDto dto = new CatalogueItemDto();
        dto.setName("Décoration florale");
        dto.setImageUrl("/uploads/fleurs.jpg");
        dto.setDescription("Belle décoration");
        dto.setCategoryId(null);
        dto.setLabelIds(List.of());

        CatalogueItem saved = CatalogueItem.builder().id(1L).name("Décoration florale").status(ItemStatus.DRAFT).build();
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(saved);

        // when
        CatalogueItem result = catalogueService.create(dto);

        // then
        assertThat(result.getStatus()).isEqualTo(ItemStatus.DRAFT);
        assertThat(result.getName()).isEqualTo("Décoration florale");
    }

    @Test
    void shouldResolveCategoryAndLabels_whenCreatingItem() {
        // given
        Category category = Category.builder().id(1L).name("Fleurs").build();
        Label label = Label.builder().id(2L).name("Premium").build();

        CatalogueItemDto dto = new CatalogueItemDto();
        dto.setName("Item");
        dto.setCategoryId(1L);
        dto.setLabelIds(List.of(2L));

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(labelRepository.findAllById(List.of(2L))).thenReturn(List.of(label));
        when(catalogueItemRepository.save(any(CatalogueItem.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // when
        CatalogueItem result = catalogueService.create(dto);

        // then
        assertThat(result.getCategory()).isEqualTo(category);
        assertThat(result.getLabels()).contains(label);
    }

    @Test
    void shouldUpdateItem_whenItemExists() {
        // given
        CatalogueItem existing = CatalogueItem.builder().id(1L).name("Ancien nom").status(ItemStatus.DRAFT).build();
        CatalogueItemDto dto = new CatalogueItemDto();
        dto.setName("Nouveau nom");
        dto.setLabelIds(List.of());

        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(existing);

        // when
        CatalogueItem result = catalogueService.update(1L, dto);

        // then
        assertThat(result.getName()).isEqualTo("Nouveau nom");
    }

    @Test
    void shouldThrowException_whenUpdatingNonExistentItem() {
        // given
        CatalogueItemDto dto = new CatalogueItemDto();
        dto.setName("X");
        dto.setLabelIds(List.of());
        when(catalogueItemRepository.findById(99L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> catalogueService.update(99L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldToggleStatusFromDraftToPublished() {
        // given
        CatalogueItem item = CatalogueItem.builder().id(1L).status(ItemStatus.DRAFT).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(item);

        // when
        CatalogueItem result = catalogueService.toggleStatus(1L);

        // then
        assertThat(result.getStatus()).isEqualTo(ItemStatus.PUBLISHED);
    }

    @Test
    void shouldToggleStatusFromPublishedToDraft() {
        // given
        CatalogueItem item = CatalogueItem.builder().id(1L).status(ItemStatus.PUBLISHED).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(item);

        // when
        CatalogueItem result = catalogueService.toggleStatus(1L);

        // then
        assertThat(result.getStatus()).isEqualTo(ItemStatus.DRAFT);
    }

    @Test
    void shouldDeleteItem_whenIdExists() {
        // when
        catalogueService.delete(1L);

        // then
        verify(catalogueItemRepository).deleteById(1L);
    }
}
