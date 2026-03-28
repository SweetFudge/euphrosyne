package com.euphrosyne.repository;

import com.euphrosyne.model.NewsletterTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsletterTemplateRepository extends JpaRepository<NewsletterTemplate, Long> {
    List<NewsletterTemplate> findAllByOrderByCreatedAtDesc();
}
