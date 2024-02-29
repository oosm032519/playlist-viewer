package org.example.playlistinfo.security;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository appUserRepository;
    private final UserDetailsConverter userDetailsConverter;

    public UserDetailsServiceImpl(AppUserRepository appUserRepository, UserDetailsConverter userDetailsConverter) {
        this.appUserRepository = appUserRepository;
        this.userDetailsConverter = userDetailsConverter;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> optionalAppUser = Optional.ofNullable(appUserRepository.findByUsername(username));

        return optionalAppUser.map(userDetailsConverter::convert)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
