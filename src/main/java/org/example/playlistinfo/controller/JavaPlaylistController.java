package org.example.playlistinfo.controller;

import org.example.playlistinfo.security.User;
import org.example.playlistinfo.security.UserPlaylist;
import org.example.playlistinfo.security.UserPlaylistRepository;
import org.example.playlistinfo.servise.GetPlaylistsItems;
import org.example.playlistinfo.servise.SearchPlaylistsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;

import java.util.HashMap;
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
        this.userPlaylistRepository = userPlaylistRepository;
    }

    @GetMapping("/java/playlist/{playlistId}")
    public Map<String, Object> getPlaylistItems(@PathVariable String playlistId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();

        Map<String, Object> playlistItems = getPlaylistsItems.getPlaylistItems(playlistId).getBody();

        if (principal != null) {
            UserPlaylist userPlaylist = new UserPlaylist();
            userPlaylist.setPlaylistId(playlistId);
            userPlaylist.setUsername(principal.getUsername());  // ユーザー名を設定
            userPlaylistRepository.save(userPlaylist);
        }

        return playlistItems;
    }

    @GetMapping("/java/search/{query}")
    public List<PlaylistSimplified> searchPlaylists(@PathVariable String query) {
        return searchPlaylistsService.searchPlaylists(query);
    }

    @GetMapping("/java/user/playlists")
    public ResponseEntity<List<UserPlaylist>> getUserPlaylists(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserPlaylist> userPlaylists = userPlaylistRepository.findByUsername(user.getUsername());
        return ResponseEntity.ok(userPlaylists);
    }

    @GetMapping("/java/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("id", user.getId());
            response.put("username", user.getUsername());
        } else {
            response.put("message", "未ログイン");
        }
        return ResponseEntity.ok(response);
    }
}
