# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Règle obligatoire — Tests unitaires

Pour chaque méthode `public` créée ou modifiée dans ce projet, tu dois **automatiquement** écrire le test unitaire correspondant dans `src/test/java/com/euphrosyne/`.
### Structure des tests

- Un fichier de test par classe : `MonService.java` → `MonServiceTest.java`
- Respecter le même package que la classe testée
- Utiliser **JUnit 5** + **Mockito** (déjà disponibles via `spring-boot-starter-test`)

### Exemple de structure

```java
@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReservationService reservationService;

    @Test
    void shouldSaveReservation_whenValidInput() {
        // given
        ...
        // when
        ...
        // then
        ...
    }
}
```

### Conventions

- Nommer les tests : `should<Comportement>_when<Condition>`
- Toujours couvrir : le cas nominal, les cas d'erreur (exception, null, not found)
- Mocker les dépendances (`@Mock`) — ne jamais instancier de vraie base de données dans un test unitaire
- Pour les controllers, utiliser `@WebMvcTest` + `MockMvc`

## Règle obligatoire — Types de date/heure

Tout champ qui inclut une notion de temps (horodatage) doit être de type `Instant`, jamais `LocalDateTime`.

- **Models** : `private Instant createdAt = Instant.now();`
- **DTOs de réponse** : `private Instant createdAt;`
- Le backend renvoie toujours des `Instant` (UTC) — c'est le **frontend** qui convertit dans la timezone du navigateur client (`new Date(instant).toLocaleString(...)`)
- `LocalDate` reste autorisé pour les dates sans heure (ex : date d'événement)

## Règle obligatoire — Nommage des DTOs

Tout DTO créé dans `dto/` doit obligatoirement se terminer par `Dto`.

- Correct : `ReservationRequestDto`, `AuthResponseDto`, `CatalogueItemDto`
- Incorrect : `ReservationRequest`, `AuthResponse`, `CatalogueItem` (ce dernier est un model, pas un DTO)

### Commande pour lancer les tests

```bash
./mvnw test                         # tous les tests
./mvnw test -Dtest=NomDeLaClasseTest  # un seul fichier
```
