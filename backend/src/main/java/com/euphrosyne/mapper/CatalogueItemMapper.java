package com.euphrosyne.mapper;

import com.euphrosyne.dto.CatalogueItemResponseDto;
import com.euphrosyne.model.CatalogueItem;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, LabelMapper.class, CataloguePhotoMapper.class})
public interface CatalogueItemMapper {

    @Named("withoutPhotos")
    @Mapping(target = "photos", ignore = true)
    CatalogueItemResponseDto toResponse(CatalogueItem item);

    @IterableMapping(qualifiedByName = "withoutPhotos")
    List<CatalogueItemResponseDto> toResponseList(List<CatalogueItem> items);

    CatalogueItemResponseDto toResponseWithPhotos(CatalogueItem item);
}
