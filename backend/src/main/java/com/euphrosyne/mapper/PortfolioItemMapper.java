package com.euphrosyne.mapper;

import com.euphrosyne.dto.PortfolioItemResponseDto;
import com.euphrosyne.model.PortfolioItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, PortfolioPhotoMapper.class})
public interface PortfolioItemMapper {
    @Mapping(target = "photos", ignore = true)
    PortfolioItemResponseDto toResponse(PortfolioItem item);

    @Mapping(target = "photos", ignore = true)
    List<PortfolioItemResponseDto> toResponseList(List<PortfolioItem> items);

    PortfolioItemResponseDto toResponseWithPhotos(PortfolioItem item);
}
