package com.euphrosyne.mapper;

import com.euphrosyne.dto.LabelDto;
import com.euphrosyne.model.Label;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LabelMapper {
    LabelDto toDto(Label label);
    List<LabelDto> toDtoList(List<Label> labels);
}