package com.euphrosyne.mapper;

import com.euphrosyne.dto.CatalogueItemResponseDto;
import com.euphrosyne.model.CatalogueItem;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, LabelMapper.class})
public interface CatalogueItemMapper {
    CatalogueItemResponseDto toResponse(CatalogueItem item);
    List<CatalogueItemResponseDto> toResponseList(List<CatalogueItem> items);
}
