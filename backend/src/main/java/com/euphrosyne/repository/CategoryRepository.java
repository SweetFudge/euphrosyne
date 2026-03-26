package com.euphrosyne.repository;

import com.euphrosyne.model.Category;
import com.euphrosyne.model.CategoryScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByScopeOrderByNameAsc(CategoryScope scope);
    boolean existsByKey(String key);
    Optional<Category> findByKey(String key);
}
