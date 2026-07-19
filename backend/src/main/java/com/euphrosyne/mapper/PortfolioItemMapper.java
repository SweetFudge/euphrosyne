package com.euphrosyne.mapper;

import com.euphrosyne.dto.PortfolioItemResponseDto;
import com.euphrosyne.model.PortfolioItem;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, PortfolioPhotoMapper.class})
public interface PortfolioItemMapper {

    @Named("withoutPhotos")
    @Mapping(target = "photos", ignore = true)
    PortfolioItemResponseDto toResponse(PortfolioItem item);

    @IterableMapping(qualifiedByName = "withoutPhotos")
    List<PortfolioItemResponseDto> toResponseList(List<PortfolioItem> items);

    PortfolioItemResponseDto toResponseWithPhotos(PortfolioItem item);
}
