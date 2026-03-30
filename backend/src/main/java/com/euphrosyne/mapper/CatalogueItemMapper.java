package com.euphrosyne.mapper;

import com.euphrosyne.dto.CatalogueItemResponseDto;
import com.euphrosyne.model.CatalogueItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, LabelMapper.class, CataloguePhotoMapper.class})
public interface CatalogueItemMapper {
    @Mapping(target = "photos", ignore = true)
    CatalogueItemResponseDto toResponse(CatalogueItem item);

    @Mapping(target = "photos", ignore = true)
    List<CatalogueItemResponseDto> toResponseList(List<CatalogueItem> items);

    CatalogueItemResponseDto toResponseWithPhotos(CatalogueItem item);
}
