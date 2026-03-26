package com.euphrosyne.config;

import com.euphrosyne.model.*;
import com.euphrosyne.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PortfolioItemRepository portfolioItemRepository;
    private final CatalogueItemRepository catalogueItemRepository;
    private final LabelRepository labelRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        createAdminIfNotExists();
        seedCategoriesIfEmpty();
        seedLabelsIfEmpty();
        createSamplePortfolioIfEmpty();
        createSampleCatalogueIfEmpty();
    }

    private void createAdminIfNotExists() {
        if (!userRepository.existsByUsername(adminUsername)) {
            userRepository.save(User.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(User.Role.ADMIN)
                    .build());
            log.info("Compte admin créé : {}", adminUsername);
        }
    }

    private void seedCategoriesIfEmpty() {
        if (categoryRepository.count() > 0) return;

        // Catégories Catalogue
        List.of(
                new String[]{"arches-structures",     "Arches & Structures",   "CATALOGUE"},
                new String[]{"decoration-de-table",   "Décoration de table",   "CATALOGUE"},
                new String[]{"fleurs-vegetaux",       "Fleurs & Végétaux",     "CATALOGUE"},
                new String[]{"linge-de-table",        "Linge de table",        "CATALOGUE"},
                // Catégories Portfolio
                new String[]{"mariage-classique",     "Mariage Classique",     "PORTFOLIO"},
                new String[]{"mariage-boheme",        "Mariage Bohème",        "PORTFOLIO"},
                new String[]{"mariage-atypique",      "Mariage Atypique",      "PORTFOLIO"},
                new String[]{"anniversaire-enfants",  "Anniversaire Enfants",  "PORTFOLIO"},
                new String[]{"anniversaire-adultes",  "Anniversaire Adultes",  "PORTFOLIO"},
                new String[]{"fete-privee",           "Fête Privée",           "PORTFOLIO"}
        ).forEach(row -> categoryRepository.save(Category.builder()
                .key(row[0])
                .name(row[1])
                .scope(CategoryScope.valueOf(row[2]))
                .build()));

        log.info("Catégories initiales créées.");
    }

    private void seedLabelsIfEmpty() {
        if (labelRepository.count() > 0) return;

        List.of(
                new String[]{"mariage",       "Mariage"},
                new String[]{"fete-privee",   "Fête Privée"},
                new String[]{"anniversaire",  "Anniversaire"}
        ).forEach(row -> labelRepository.save(Label.builder()
                .key(row[0])
                .name(row[1])
                .build()));

        log.info("Labels initiaux créés.");
    }

    private void createSamplePortfolioIfEmpty() {
        if (portfolioItemRepository.count() > 0) return;

        Category mariageClassique  = categoryRepository.findByKey("mariage-classique").orElse(null);
        Category mariageBoheme     = categoryRepository.findByKey("mariage-boheme").orElse(null);
        Category mariageAtypique   = categoryRepository.findByKey("mariage-atypique").orElse(null);
        Category annivEnfants      = categoryRepository.findByKey("anniversaire-enfants").orElse(null);
        Category annivAdultes      = categoryRepository.findByKey("anniversaire-adultes").orElse(null);
        Category fetePrivee        = categoryRepository.findByKey("fete-privee").orElse(null);

        portfolioItemRepository.saveAll(List.of(
                PortfolioItem.builder()
                        .title("Mariage Champêtre Chic")
                        .location("Provence")
                        .imageUrl("https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800")
                        .category(mariageClassique)
                        .description("Un mariage intime sous les oliviers en Provence avec une décoration florale sobre et élégante.")
                        .status(ItemStatus.PUBLISHED).build(),

                PortfolioItem.builder()
                        .title("Mariage Bohème")
                        .location("Château de Loire")
                        .imageUrl("https://images.unsplash.com/photo-1478145787956-f6a649ac34b9?w=800")
                        .category(mariageBoheme)
                        .description("Un mariage bohème dans un cadre naturel et romantique, avec arches en bois flotté et guirlandes de verdure.")
                        .status(ItemStatus.PUBLISHED).build(),

                PortfolioItem.builder()
                        .title("Mariage Industriel Chic")
                        .location("Paris, Loft des Arts")
                        .imageUrl("https://images.unsplash.com/photo-1519741497674-611481863552?w=800")
                        .category(mariageAtypique)
                        .description("Un mariage dans un loft parisien au décor industriel, revisité avec des touches dorées et végétales.")
                        .status(ItemStatus.PUBLISHED).build(),

                PortfolioItem.builder()
                        .title("Anniversaire Féérique")
                        .location("Lyon")
                        .imageUrl("https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800")
                        .category(annivEnfants)
                        .description("Un anniversaire haut en couleurs pour les 7 ans d'Inès, avec arche florale pastel et table de douceurs.")
                        .status(ItemStatus.PUBLISHED).build(),

                PortfolioItem.builder()
                        .title("Dîner d'Anniversaire Prestige")
                        .location("Monaco")
                        .imageUrl("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800")
                        .category(annivAdultes)
                        .description("Un dîner d'exception pour les 50 ans d'un client, orchestré dans un espace panoramique avec vue sur mer.")
                        .status(ItemStatus.PUBLISHED).build(),

                PortfolioItem.builder()
                        .title("Le Gala du Crillon")
                        .location("Paris")
                        .imageUrl("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800")
                        .category(fetePrivee)
                        .description("Une soirée de prestige au cœur de Paris avec 300 convives, nappes satin et chandeliers en cristal.")
                        .status(ItemStatus.PUBLISHED).build(),

                PortfolioItem.builder()
                        .title("Soirée Blanche")
                        .location("Côte d'Azur")
                        .imageUrl("https://images.unsplash.com/photo-1490750967868-88df5691cc13?w=800")
                        .category(fetePrivee)
                        .description("Une soirée blanche exclusive sur la Côte d'Azur avec décoration immaculée et fleurs blanches à profusion.")
                        .status(ItemStatus.PUBLISHED).build()
        ));

        log.info("Données portfolio de démonstration créées.");
    }

    private void createSampleCatalogueIfEmpty() {
        if (catalogueItemRepository.count() > 0) return;

        Category arches     = categoryRepository.findByKey("arches-structures").orElse(null);
        Category decoTable  = categoryRepository.findByKey("decoration-de-table").orElse(null);
        Category fleurs     = categoryRepository.findByKey("fleurs-vegetaux").orElse(null);
        Category linge      = categoryRepository.findByKey("linge-de-table").orElse(null);

        Label mariage       = labelRepository.findByKey("mariage").orElse(null);
        Label fetePrivee    = labelRepository.findByKey("fete-privee").orElse(null);
        Label anniversaire  = labelRepository.findByKey("anniversaire").orElse(null);

        catalogueItemRepository.saveAll(List.of(
                CatalogueItem.builder()
                        .name("Arche en bois flotté")
                        .category(arches)
                        .imageUrl("https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800")
                        .description("Arche rustique en bois flotté, idéale pour un mariage champêtre ou bohème.")
                        .labels(nullSafe(mariage))
                        .status(ItemStatus.PUBLISHED).build(),

                CatalogueItem.builder()
                        .name("Arche métallique dorée")
                        .category(arches)
                        .imageUrl("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800")
                        .description("Structure en métal doré élégante, adaptable à tout type d'événement.")
                        .labels(nullSafe(mariage, fetePrivee))
                        .status(ItemStatus.PUBLISHED).build(),

                CatalogueItem.builder()
                        .name("Centres de table dorés")
                        .category(decoTable)
                        .imageUrl("https://images.unsplash.com/photo-1478145787956-f6a649ac34b9?w=800")
                        .description("Ensemble de centres de table aux finitions dorées, disponibles en plusieurs hauteurs.")
                        .labels(nullSafe(mariage, fetePrivee, anniversaire))
                        .status(ItemStatus.PUBLISHED).build(),

                CatalogueItem.builder()
                        .name("Chandeliers en cristal")
                        .category(decoTable)
                        .imageUrl("https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800")
                        .description("Chandeliers en cristal soufflé, pour une ambiance lumineuse et raffinée.")
                        .labels(nullSafe(mariage, fetePrivee))
                        .status(ItemStatus.PUBLISHED).build(),

                CatalogueItem.builder()
                        .name("Bouquets floraux artificiels")
                        .category(fleurs)
                        .imageUrl("https://images.unsplash.com/photo-1490750967868-88df5691cc13?w=800")
                        .description("Bouquets en fleurs artificielles haut de gamme — rendu naturel, conservation garantie.")
                        .labels(nullSafe(mariage, anniversaire))
                        .status(ItemStatus.PUBLISHED).build(),

                CatalogueItem.builder()
                        .name("Guirlandes de verdure")
                        .category(fleurs)
                        .imageUrl("https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800")
                        .description("Guirlandes de feuillage artificiel pour habiller tables, arches et murs.")
                        .labels(nullSafe(mariage, fetePrivee, anniversaire))
                        .status(ItemStatus.PUBLISHED).build(),

                CatalogueItem.builder()
                        .name("Nappes satin blanc")
                        .category(linge)
                        .imageUrl("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800")
                        .description("Nappes en satin blanc pur, disponibles en toutes dimensions. Repassées et prêtes à poser.")
                        .labels(nullSafe(mariage, fetePrivee, anniversaire))
                        .status(ItemStatus.PUBLISHED).build(),

                CatalogueItem.builder()
                        .name("Chemins de table dorés")
                        .category(linge)
                        .imageUrl("https://images.unsplash.com/photo-1519741497674-611481863552?w=800")
                        .description("Chemins de table en organza doré pour apporter éclat et raffinement à chaque couvert.")
                        .labels(nullSafe(mariage, fetePrivee))
                        .status(ItemStatus.PUBLISHED).build()
        ));

        log.info("Données catalogue de démonstration créées.");
    }

    @SafeVarargs
    private static <T> java.util.List<T> nullSafe(T... items) {
        java.util.List<T> list = new java.util.ArrayList<>();
        for (T item : items) {
            if (item != null) list.add(item);
        }
        return list;
    }
}
