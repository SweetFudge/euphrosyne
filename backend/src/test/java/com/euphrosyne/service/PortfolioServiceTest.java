package com.euphrosyne.service;

import com.euphrosyne.dto.PortfolioItemDto;
import com.euphrosyne.model.*;
import com.euphrosyne.repository.CategoryRepository;
import com.euphrosyne.repository.PortfolioItemRepository;
import com.euphrosyne.repository.PortfolioPhotoRepository;
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
class PortfolioServiceTest {

    @Mock
    private PortfolioItemRepository portfolioItemRepository;

    @Mock
    private PortfolioPhotoRepository portfolioPhotoRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private PortfolioService portfolioService;

    @Test
    void shouldReturnAllItems() {
        // given
        when(portfolioItemRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(PortfolioItem.builder().id(1L).build()));

        // when
        List<PortfolioItem> result = portfolioService.findAll();

        // then
        assertThat(result).hasSize(1);
    }

    @Test
    void shouldReturnOnlyPublishedItems() {
        // given
        when(portfolioItemRepository.findByStatusOrderByCreatedAtDesc(ItemStatus.PUBLISHED))
                .thenReturn(List.of(PortfolioItem.builder().id(1L).status(ItemStatus.PUBLISHED).build()));

        // when
        List<PortfolioItem> result = portfolioService.findPublished();

        // then
        assertThat(result).allMatch(i -> i.getStatus() == ItemStatus.PUBLISHED);
    }

    @Test
    void shouldCreateItemWithDraftStatus_whenValidDto() {
        // given
        PortfolioItemDto dto = new PortfolioItemDto();
        dto.setTitle("Mariage Dupont");
        dto.setLocation("Paris");
        dto.setImageUrl("/uploads/mariage.jpg");

        PortfolioItem saved = PortfolioItem.builder().id(1L).title("Mariage Dupont").status(ItemStatus.DRAFT).build();
        when(portfolioItemRepository.save(any(PortfolioItem.class))).thenReturn(saved);

        // when
        PortfolioItem result = portfolioService.create(dto);

        // then
        assertThat(result.getStatus()).isEqualTo(ItemStatus.DRAFT);
        assertThat(result.getTitle()).isEqualTo("Mariage Dupont");
    }

    @Test
    void shouldUpdateItem_whenItemExists() {
        // given
        PortfolioItem existing = PortfolioItem.builder().id(1L).title("Ancien titre").build();
        PortfolioItemDto dto = new PortfolioItemDto();
        dto.setTitle("Nouveau titre");
        dto.setLocation("Lyon");

        when(portfolioItemRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(portfolioItemRepository.save(any(PortfolioItem.class))).thenReturn(existing);

        // when
        PortfolioItem result = portfolioService.update(1L, dto);

        // then
        assertThat(result.getTitle()).isEqualTo("Nouveau titre");
        assertThat(result.getLocation()).isEqualTo("Lyon");
    }

    @Test
    void shouldThrowException_whenUpdatingNonExistentItem() {
        // given
        PortfolioItemDto dto = new PortfolioItemDto();
        dto.setTitle("X");
        dto.setLocation("Y");
        when(portfolioItemRepository.findById(99L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> portfolioService.update(99L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldToggleStatusFromDraftToPublished() {
        // given
        PortfolioItem item = PortfolioItem.builder().id(1L).status(ItemStatus.DRAFT).build();
        when(portfolioItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(portfolioItemRepository.save(any(PortfolioItem.class))).thenReturn(item);

        // when
        PortfolioItem result = portfolioService.toggleStatus(1L);

        // then
        assertThat(result.getStatus()).isEqualTo(ItemStatus.PUBLISHED);
    }

    @Test
    void shouldToggleStatusFromPublishedToDraft() {
        // given
        PortfolioItem item = PortfolioItem.builder().id(1L).status(ItemStatus.PUBLISHED).build();
        when(portfolioItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(portfolioItemRepository.save(any(PortfolioItem.class))).thenReturn(item);

        // when
        PortfolioItem result = portfolioService.toggleStatus(1L);

        // then
        assertThat(result.getStatus()).isEqualTo(ItemStatus.DRAFT);
    }

    @Test
    void shouldDeleteItem_whenIdExists() {
        // when
        portfolioService.delete(1L);

        // then
        verify(portfolioItemRepository).deleteById(1L);
    }

    @Test
    void shouldGetById_whenExists() {
        // given
        PortfolioItem item = PortfolioItem.builder().id(1L).title("Mariage Dupont").build();
        when(portfolioItemRepository.findById(1L)).thenReturn(Optional.of(item));

        // when
        PortfolioItem result = portfolioService.findById(1L);

        // then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Mariage Dupont");
    }

    @Test
    void shouldThrow_whenPortfolioNotFound() {
        // given
        when(portfolioItemRepository.findById(99L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> portfolioService.findById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldReturnPublishedItem_whenFindPublishedById() {
        // given
        PortfolioItem item = PortfolioItem.builder().id(1L).status(ItemStatus.PUBLISHED).build();
        when(portfolioItemRepository.findById(1L)).thenReturn(Optional.of(item));

        // when
        PortfolioItem result = portfolioService.findPublishedById(1L);

        // then
        assertThat(result.getStatus()).isEqualTo(ItemStatus.PUBLISHED);
    }

    @Test
    void shouldThrow_whenFindPublishedById_andItemIsDraft() {
        // given
        PortfolioItem item = PortfolioItem.builder().id(1L).status(ItemStatus.DRAFT).build();
        when(portfolioItemRepository.findById(1L)).thenReturn(Optional.of(item));

        // when / then
        assertThatThrownBy(() -> portfolioService.findPublishedById(1L))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void shouldAddPhoto_whenValidInput() {
        // given
        PortfolioItem item = PortfolioItem.builder().id(1L).build();
        when(portfolioItemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(portfolioPhotoRepository.findByPortfolioItemIdOrderByDisplayOrderAscCreatedAtAsc(1L))
                .thenReturn(List.of());
        PortfolioPhoto saved = PortfolioPhoto.builder().id(10L).imageUrl("/uploads/photo.jpg").displayOrder(0).build();
        when(portfolioPhotoRepository.save(any(PortfolioPhoto.class))).thenReturn(saved);

        // when
        PortfolioPhoto result = portfolioService.addPhoto(1L, "/uploads/photo.jpg");

        // then
        assertThat(result.getImageUrl()).isEqualTo("/uploads/photo.jpg");
        assertThat(result.getDisplayOrder()).isEqualTo(0);
    }

    @Test
    void shouldDeletePhoto_whenExists() {
        // given
        PortfolioItem item = PortfolioItem.builder().id(1L).build();
        PortfolioPhoto photo = PortfolioPhoto.builder().id(10L).portfolioItem(item).build();
        when(portfolioPhotoRepository.findById(10L)).thenReturn(Optional.of(photo));

        // when
        portfolioService.deletePhoto(1L, 10L);

        // then
        verify(portfolioPhotoRepository).delete(photo);
    }

    @Test
    void shouldThrow_whenDeletingPhotoFromWrongPortfolio() {
        // given
        PortfolioItem otherItem = PortfolioItem.builder().id(99L).build();
        PortfolioPhoto photo = PortfolioPhoto.builder().id(10L).portfolioItem(otherItem).build();
        when(portfolioPhotoRepository.findById(10L)).thenReturn(Optional.of(photo));

        // when / then
        assertThatThrownBy(() -> portfolioService.deletePhoto(1L, 10L))
                .isInstanceOf(RuntimeException.class);
    }
}
