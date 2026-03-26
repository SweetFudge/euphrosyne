package com.euphrosyne.mapper;

import com.euphrosyne.dto.NewsletterResponseDto;
import com.euphrosyne.model.Newsletter;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NewsletterMapper {
    NewsletterResponseDto toResponse(Newsletter newsletter);
    List<NewsletterResponseDto> toResponseList(List<Newsletter> newsletters);
}
