package com.euphrosyne.service;

import com.euphrosyne.model.Newsletter;
import com.euphrosyne.exception.ConflictException;
import com.euphrosyne.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;

    public Newsletter subscribe(String email) {
        if (newsletterRepository.existsByEmail(email)) {
            throw new ConflictException("Cet email est déjà inscrit.");
        }
        Newsletter subscriber = Newsletter.builder()
                .email(email)
                .build();
        return newsletterRepository.save(subscriber);
    }

    public List<Newsletter> findAll() {
        return newsletterRepository.findAllByOrderBySubscribedAtDesc();
    }

    public long countActive() {
        return newsletterRepository.countByActive(true);
    }
}
