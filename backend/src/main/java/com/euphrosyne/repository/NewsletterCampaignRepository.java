package com.euphrosyne.repository;

import com.euphrosyne.model.NewsletterCampaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsletterCampaignRepository extends JpaRepository<NewsletterCampaign, Long> {
    List<NewsletterCampaign> findAllByOrderBySentAtDesc();
}
