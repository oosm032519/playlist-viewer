package org.example.playlistinfo.servise;

import org.example.playlistinfo.security.User;
import org.example.playlistinfo.security.UserPlaylistRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;

import java.util.List;
import java.util.Map;

@RestController
public class JavaPlaylistController {

    private final GetPlaylistsItems getPlaylistsItems;
    private final SearchPlaylistsService searchPlaylistsService;

    private final UserPlaylistRepository userPlaylistRepository;

    public JavaPlaylistController(GetPlaylistsItems getPlaylistsItems, SearchPlaylistsService searchPlaylistsService, UserPlaylistRepository userPlaylistRepository) {
        this.getPlaylistsItems = getPlaylistsItems;
        this.searchPlaylistsService = searchPlaylistsService;
        this.userPlaylistRepository = userPlaylistRepository; // UserPlaylistRepositoryをセット
    }

    @GetMapping("/java/playlist/{playlistId}")
    public Map<String, Object> getPlaylistItems(@PathVariable String playlistId, @AuthenticationPrincipal User user) {
        return getPlaylistsItems.getPlaylistItems(playlistId, user).getBody();
    }

    @GetMapping("/java/search/{query}")
    public List<PlaylistSimplified> searchPlaylists(@PathVariable String query) {
        return searchPlaylistsService.searchPlaylists(query);
    }

    @GetMapping("/java/user/playlists")
    public List<UserPlaylist> getUserPlaylists(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw new RuntimeException("User is not logged in");
        }
        return userPlaylistRepository.findByUser(user);
    }
}
