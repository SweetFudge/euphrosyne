package com.euphrosyne.mapper;

import com.euphrosyne.dto.ContactMessageResponseDto;
import com.euphrosyne.model.ContactMessage;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContactMessageMapper {
    ContactMessageResponseDto toResponse(ContactMessage message);
    List<ContactMessageResponseDto> toResponseList(List<ContactMessage> messages);
}
