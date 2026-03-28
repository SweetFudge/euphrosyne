package com.euphrosyne.service;

import com.euphrosyne.dto.LabelDto;
import com.euphrosyne.model.Label;
import com.euphrosyne.repository.LabelRepository;
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
class LabelServiceTest {

    @Mock
    private LabelRepository labelRepository;

    @InjectMocks
    private LabelService labelService;

    @Test
    void shouldReturnAllLabels() {
        // given
        when(labelRepository.findAll()).thenReturn(List.of(
                Label.builder().id(1L).name("Premium").build()
        ));

        // when
        List<Label> result = labelService.findAll();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Premium");
    }

    @Test
    void shouldCreateLabel_withGeneratedKey() {
        // given
        LabelDto dto = new LabelDto();
        dto.setName("Haut de gamme");
        dto.setDescription("Prestations luxe");

        when(labelRepository.existsByKey(anyString())).thenReturn(false);
        when(labelRepository.save(any(Label.class))).thenAnswer(inv -> inv.getArgument(0));

        // when
        Label result = labelService.create(dto);

        // then
        assertThat(result.getKey()).isEqualTo("haut-de-gamme");
        assertThat(result.getName()).isEqualTo("Haut de gamme");
        assertThat(result.getDescription()).isEqualTo("Prestations luxe");
    }

    @Test
    void shouldCreateLabelWithSuffix_whenKeyAlreadyExists() {
        // given
        LabelDto dto = new LabelDto();
        dto.setName("Bio");

        when(labelRepository.existsByKey("bio")).thenReturn(true);
        when(labelRepository.existsByKey("bio-1")).thenReturn(false);
        when(labelRepository.save(any(Label.class))).thenAnswer(inv -> inv.getArgument(0));

        // when
        Label result = labelService.create(dto);

        // then
        assertThat(result.getKey()).isEqualTo("bio-1");
    }

    @Test
    void shouldDeleteLabel_whenIdExists() {
        // when
        labelService.delete(1L);

        // then
        verify(labelRepository).deleteById(1L);
    }
}
