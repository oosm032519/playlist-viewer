package org.example.playlistinfo.controller;

import org.example.playlistinfo.security.User;
import org.example.playlistinfo.security.UserPlaylist;
import org.example.playlistinfo.security.UserPlaylistRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserPlaylistController {

    private final UserPlaylistRepository userPlaylistRepository;

    public UserPlaylistController(UserPlaylistRepository userPlaylistRepository) {
        this.userPlaylistRepository = userPlaylistRepository;
    }

    @GetMapping("/user/playlists")
    public List<UserPlaylist> getUserPlaylists(@AuthenticationPrincipal User user) {
        return userPlaylistRepository.findByUsername(user.getUsername());
    }

    @GetMapping("/java/user/visited-playlists")
    public ResponseEntity<List<Map<String, String>>> getVisitedPlaylists() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        List<UserPlaylist> userPlaylists = userPlaylistRepository.findByUsername(username);
        List<Map<String, String>> response = new ArrayList<>();

        for (UserPlaylist userPlaylist : userPlaylists) {
            if (userPlaylist.getPlaylistName() != null) {
                Map<String, String> playlistData = new HashMap<>();
                playlistData.put("id", userPlaylist.getPlaylistId());
                playlistData.put("name", userPlaylist.getPlaylistName());
                response.add(playlistData);
            }
        }

        return ResponseEntity.ok(response);
    }

}