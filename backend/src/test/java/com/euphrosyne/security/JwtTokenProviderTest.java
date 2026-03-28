package com.euphrosyne.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        // Clé d'au moins 32 caractères pour HMAC-SHA
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret",
                "TestSecretKeyForJWTUnitTestsAtLeast32Chars!!");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", 3600000L);
    }

    @Test
    void shouldGenerateToken_fromAuthentication() {
        // given
        User userDetails = new User("admin", "password", List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // when
        String token = jwtTokenProvider.generateToken(authentication);

        // then
        assertThat(token).isNotBlank();
    }

    @Test
    void shouldGenerateToken_fromUsername() {
        // when
        String token = jwtTokenProvider.generateToken("admin");

        // then
        assertThat(token).isNotBlank();
    }

    @Test
    void shouldExtractUsername_fromToken() {
        // given
        String token = jwtTokenProvider.generateToken("admin");

        // when
        String username = jwtTokenProvider.getUsernameFromToken(token);

        // then
        assertThat(username).isEqualTo("admin");
    }

    @Test
    void shouldReturnTrue_whenTokenIsValid() {
        // given
        String token = jwtTokenProvider.generateToken("admin");

        // when
        boolean valid = jwtTokenProvider.validateToken(token);

        // then
        assertThat(valid).isTrue();
    }

    @Test
    void shouldReturnFalse_whenTokenIsInvalid() {
        // when
        boolean valid = jwtTokenProvider.validateToken("token.invalide.xxx");

        // then
        assertThat(valid).isFalse();
    }

    @Test
    void shouldReturnFalse_whenTokenIsEmpty() {
        // when
        boolean valid = jwtTokenProvider.validateToken("");

        // then
        assertThat(valid).isFalse();
    }
}
