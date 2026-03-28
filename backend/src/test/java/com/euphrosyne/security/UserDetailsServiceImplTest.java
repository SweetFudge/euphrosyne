package com.euphrosyne.security;

import com.euphrosyne.model.User;
import com.euphrosyne.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void shouldLoadUserByUsername_whenUserExists() {
        // given
        User user = User.builder()
                .id(1L)
                .username("admin")
                .password("encodedPassword")
                .role(User.Role.ADMIN)
                .build();
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        // when
        UserDetails result = userDetailsService.loadUserByUsername("admin");

        // then
        assertThat(result.getUsername()).isEqualTo("admin");
        assertThat(result.getPassword()).isEqualTo("encodedPassword");
        assertThat(result.getAuthorities()).anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @Test
    void shouldThrowUsernameNotFoundException_whenUserDoesNotExist() {
        // given
        when(userRepository.findByUsername("inconnu")).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("inconnu"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("inconnu");
    }
}
