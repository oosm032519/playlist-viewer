package org.example.playlistinfo.security;

import org.example.playlistinfo.entity.AppUser;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class UserDetailsConverter {

    public UserDetails convert(AppUser appUser) {
        return new org.springframework.security.core.userdetails.User(appUser.getUsername(), appUser.getPassword(), new ArrayList<>());
    }
}
