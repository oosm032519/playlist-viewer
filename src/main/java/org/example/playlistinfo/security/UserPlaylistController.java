package org.example.playlistinfo.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
