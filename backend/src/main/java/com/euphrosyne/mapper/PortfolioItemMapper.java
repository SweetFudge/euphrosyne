package com.euphrosyne.mapper;

import com.euphrosyne.dto.PortfolioItemResponseDto;
import com.euphrosyne.model.PortfolioItem;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = CategoryMapper.class)
public interface PortfolioItemMapper {
    PortfolioItemResponseDto toResponse(PortfolioItem item);
    List<PortfolioItemResponseDto> toResponseList(List<PortfolioItem> items);
}
