package com.euphrosyne.mapper;

import com.euphrosyne.dto.CataloguePhotoResponseDto;
import com.euphrosyne.model.CataloguePhoto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CataloguePhotoMapper {
    CataloguePhotoResponseDto toResponse(CataloguePhoto photo);
    List<CataloguePhotoResponseDto> toResponseList(List<CataloguePhoto> photos);
}