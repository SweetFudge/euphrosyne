package com.euphrosyne.mapper;

import com.euphrosyne.dto.NewsletterTemplateResponseDto;
import com.euphrosyne.model.NewsletterTemplate;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NewsletterTemplateMapper {
    NewsletterTemplateResponseDto toResponse(NewsletterTemplate template);
    List<NewsletterTemplateResponseDto> toResponseList(List<NewsletterTemplate> templates);
}
