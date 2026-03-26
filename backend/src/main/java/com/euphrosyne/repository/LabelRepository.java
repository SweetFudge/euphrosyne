package com.euphrosyne.repository;

import com.euphrosyne.model.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {
    boolean existsByKey(String key);
    Optional<Label> findByKey(String key);
}
