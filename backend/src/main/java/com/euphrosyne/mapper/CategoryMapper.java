package com.euphrosyne.mapper;

import com.euphrosyne.dto.CategoryDto;
import com.euphrosyne.model.Category;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);
    List<CategoryDto> toDtoList(List<Category> categories);
}