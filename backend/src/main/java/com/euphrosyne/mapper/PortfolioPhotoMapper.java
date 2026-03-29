package com.euphrosyne.mapper;

import com.euphrosyne.dto.PortfolioPhotoResponseDto;
import com.euphrosyne.model.PortfolioPhoto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PortfolioPhotoMapper {
    PortfolioPhotoResponseDto toResponse(PortfolioPhoto photo);
    List<PortfolioPhotoResponseDto> toResponseList(List<PortfolioPhoto> photos);
}
