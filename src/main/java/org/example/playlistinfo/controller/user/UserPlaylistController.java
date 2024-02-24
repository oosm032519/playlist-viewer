package org.example.playlistinfo.controller.user;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.repository.VisitedPlaylistRepository;
import org.example.playlistinfo.service.GetPlaylistsItems;
import org.example.playlistinfo.service.SearchPlaylistsService;
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
public class UserPlaylistController {

    private final GetPlaylistsItems getPlaylistsItems;
    private final SearchPlaylistsService searchPlaylistsService;

    private final VisitedPlaylistRepository visitedPlaylistRepository;

    public UserPlaylistController(GetPlaylistsItems getPlaylistsItems, SearchPlaylistsService searchPlaylistsService, VisitedPlaylistRepository visitedPlaylistRepository) {
        this.getPlaylistsItems = getPlaylistsItems;
        this.searchPlaylistsService = searchPlaylistsService;
        this.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    @GetMapping("/java/playlist/{playlistId}")
    public Map<String, Object> getPlaylistItems(@PathVariable String playlistId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();

        Map<String, Object> playlistItems = getPlaylistsItems.getPlaylistItems(playlistId).getBody();

        if (principal != null) {
            UserVisitedPlaylist userVisitedPlaylist = new UserVisitedPlaylist();
            userVisitedPlaylist.setPlaylistId(playlistId);
            userVisitedPlaylist.setUsername(principal.getUsername());  // ユーザー名を設定
            visitedPlaylistRepository.save(userVisitedPlaylist);
        }

        return playlistItems;
    }

    @GetMapping("/java/search/{query}")
    public List<PlaylistSimplified> searchPlaylists(@PathVariable String query) {
        return searchPlaylistsService.searchPlaylists(query);
    }

    @GetMapping("/java/user/playlists")
    public ResponseEntity<List<UserVisitedPlaylist>> getUserPlaylists(@AuthenticationPrincipal AppUser appUser) {
        if (appUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserVisitedPlaylist> userVisitedPlaylists = visitedPlaylistRepository.findByUsername(appUser.getUsername());
        return ResponseEntity.ok(userVisitedPlaylists);
    }

    @GetMapping("/java/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal AppUser appUser) {
        Map<String, Object> response = new HashMap<>();
        if (appUser != null) {
            response.put("id", appUser.getId());
            response.put("username", appUser.getUsername());
        } else {
            response.put("message", "未ログイン");
        }
        return ResponseEntity.ok(response);
    }
}
