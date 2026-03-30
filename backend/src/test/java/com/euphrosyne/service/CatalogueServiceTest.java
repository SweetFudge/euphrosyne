package com.euphrosyne.service;

import com.euphrosyne.dto.CatalogueItemDto;
import com.euphrosyne.exception.ForbiddenException;
import com.euphrosyne.exception.ResourceNotFoundException;
import com.euphrosyne.model.*;
import com.euphrosyne.repository.CatalogueItemRepository;
import com.euphrosyne.repository.CataloguePhotoRepository;
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
    private CataloguePhotoRepository cataloguePhotoRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private LabelRepository labelRepository;

    @InjectMocks
    private CatalogueService catalogueService;

    @Test
    void shouldReturnAllItems() {
        when(catalogueItemRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(CatalogueItem.builder().id(1L).build()));

        List<CatalogueItem> result = catalogueService.findAll();

        assertThat(result).hasSize(1);
    }

    @Test
    void shouldReturnOnlyPublishedItems() {
        when(catalogueItemRepository.findByStatusOrderByCreatedAtDesc(ItemStatus.PUBLISHED))
                .thenReturn(List.of(CatalogueItem.builder().id(1L).status(ItemStatus.PUBLISHED).build()));

        List<CatalogueItem> result = catalogueService.findPublished();

        assertThat(result).allMatch(i -> i.getStatus() == ItemStatus.PUBLISHED);
    }

    @Test
    void shouldReturnItem_whenFindById_andExists() {
        CatalogueItem item = CatalogueItem.builder().id(1L).status(ItemStatus.DRAFT).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));

        CatalogueItem result = catalogueService.findById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void shouldThrowException_whenFindById_andNotFound() {
        when(catalogueItemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> catalogueService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldReturnPublishedItem_whenFindPublishedById() {
        CatalogueItem item = CatalogueItem.builder().id(1L).status(ItemStatus.PUBLISHED).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));

        CatalogueItem result = catalogueService.findPublishedById(1L);

        assertThat(result.getStatus()).isEqualTo(ItemStatus.PUBLISHED);
    }

    @Test
    void shouldThrowException_whenFindPublishedById_andItemIsDraft() {
        CatalogueItem item = CatalogueItem.builder().id(1L).status(ItemStatus.DRAFT).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));

        assertThatThrownBy(() -> catalogueService.findPublishedById(1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldReturnPhotos_whenFindPhotos() {
        CataloguePhoto photo = CataloguePhoto.builder().id(1L).imageUrl("/uploads/a.jpg").build();
        when(cataloguePhotoRepository.findByCatalogueItemIdOrderByDisplayOrderAscCreatedAtAsc(1L))
                .thenReturn(List.of(photo));

        List<CataloguePhoto> result = catalogueService.findPhotos(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    void shouldCreateItemWithDraftStatus_whenValidDto() {
        CatalogueItemDto dto = new CatalogueItemDto();
        dto.setName("Décoration florale");
        dto.setImageUrl("/uploads/fleurs.jpg");
        dto.setDescription("Belle décoration");
        dto.setCategoryId(null);
        dto.setLabelIds(List.of());

        CatalogueItem saved = CatalogueItem.builder().id(1L).name("Décoration florale").status(ItemStatus.DRAFT).build();
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(saved);

        CatalogueItem result = catalogueService.create(dto);

        assertThat(result.getStatus()).isEqualTo(ItemStatus.DRAFT);
        assertThat(result.getName()).isEqualTo("Décoration florale");
    }

    @Test
    void shouldResolveCategoryAndLabels_whenCreatingItem() {
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

        CatalogueItem result = catalogueService.create(dto);

        assertThat(result.getCategory()).isEqualTo(category);
        assertThat(result.getLabels()).contains(label);
    }

    @Test
    void shouldUpdateItem_whenItemExists() {
        CatalogueItem existing = CatalogueItem.builder().id(1L).name("Ancien nom").status(ItemStatus.DRAFT).build();
        CatalogueItemDto dto = new CatalogueItemDto();
        dto.setName("Nouveau nom");
        dto.setLabelIds(List.of());

        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(existing);

        CatalogueItem result = catalogueService.update(1L, dto);

        assertThat(result.getName()).isEqualTo("Nouveau nom");
    }

    @Test
    void shouldThrowException_whenUpdatingNonExistentItem() {
        CatalogueItemDto dto = new CatalogueItemDto();
        dto.setName("X");
        dto.setLabelIds(List.of());
        when(catalogueItemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> catalogueService.update(99L, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldToggleStatusFromDraftToPublished() {
        CatalogueItem item = CatalogueItem.builder().id(1L).status(ItemStatus.DRAFT).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(item);

        CatalogueItem result = catalogueService.toggleStatus(1L);

        assertThat(result.getStatus()).isEqualTo(ItemStatus.PUBLISHED);
    }

    @Test
    void shouldToggleStatusFromPublishedToDraft() {
        CatalogueItem item = CatalogueItem.builder().id(1L).status(ItemStatus.PUBLISHED).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(catalogueItemRepository.save(any(CatalogueItem.class))).thenReturn(item);

        CatalogueItem result = catalogueService.toggleStatus(1L);

        assertThat(result.getStatus()).isEqualTo(ItemStatus.DRAFT);
    }

    @Test
    void shouldDeleteItem_whenIdExists() {
        catalogueService.delete(1L);

        verify(catalogueItemRepository).deleteById(1L);
    }

    @Test
    void shouldAddPhoto_whenItemExists() {
        CatalogueItem item = CatalogueItem.builder().id(1L).build();
        when(catalogueItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(cataloguePhotoRepository.findByCatalogueItemIdOrderByDisplayOrderAscCreatedAtAsc(1L))
                .thenReturn(List.of());
        CataloguePhoto saved = CataloguePhoto.builder().id(1L).imageUrl("/uploads/photo.jpg").displayOrder(0).build();
        when(cataloguePhotoRepository.save(any(CataloguePhoto.class))).thenReturn(saved);

        CataloguePhoto result = catalogueService.addPhoto(1L, "/uploads/photo.jpg");

        assertThat(result.getImageUrl()).isEqualTo("/uploads/photo.jpg");
        assertThat(result.getDisplayOrder()).isEqualTo(0);
    }

    @Test
    void shouldThrowException_whenAddPhoto_andItemNotFound() {
        when(catalogueItemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> catalogueService.addPhoto(99L, "/img.jpg"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldDeletePhoto_whenPhotoExists_andBelongsToItem() {
        CatalogueItem item = CatalogueItem.builder().id(1L).build();
        CataloguePhoto photo = CataloguePhoto.builder().id(10L).catalogueItem(item).build();
        when(cataloguePhotoRepository.findById(10L)).thenReturn(Optional.of(photo));

        catalogueService.deletePhoto(1L, 10L);

        verify(cataloguePhotoRepository).delete(photo);
    }

    @Test
    void shouldThrowForbiddenException_whenDeletePhoto_andPhotoDoesNotBelongToItem() {
        CatalogueItem otherItem = CatalogueItem.builder().id(2L).build();
        CataloguePhoto photo = CataloguePhoto.builder().id(10L).catalogueItem(otherItem).build();
        when(cataloguePhotoRepository.findById(10L)).thenReturn(Optional.of(photo));

        assertThatThrownBy(() -> catalogueService.deletePhoto(1L, 10L))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void shouldThrowException_whenDeletePhoto_andPhotoNotFound() {
        when(cataloguePhotoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> catalogueService.deletePhoto(1L, 99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}