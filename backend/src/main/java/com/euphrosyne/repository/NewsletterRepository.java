package com.euphrosyne.repository;

import com.euphrosyne.model.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    boolean existsByEmail(String email);
    Optional<Newsletter> findByEmail(String email);
    List<Newsletter> findAllByOrderBySubscribedAtDesc();
    long countByActive(boolean active);
    List<Newsletter> findAllByActiveTrue();
}
