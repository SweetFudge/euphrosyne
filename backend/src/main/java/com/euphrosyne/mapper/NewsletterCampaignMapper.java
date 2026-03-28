package com.euphrosyne.mapper;

import com.euphrosyne.dto.NewsletterCampaignResponseDto;
import com.euphrosyne.model.NewsletterCampaign;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NewsletterCampaignMapper {
    NewsletterCampaignResponseDto toResponse(NewsletterCampaign campaign);
    List<NewsletterCampaignResponseDto> toResponseList(List<NewsletterCampaign> campaigns);
}
