package org.example.playlistinfo.controller.user;

import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.entity.repository.VisitedPlaylistRepository;
import org.example.playlistinfo.service.GetRecommendations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.model_objects.specification.Recommendations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// ユーザーのプレイリスト情報を管理するコントローラー
@RestController
public class UserPlaylistRecommendationController {

    // 訪問したプレイリストのリポジトリ
    private final VisitedPlaylistRepository visitedPlaylistRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserPlaylistRecommendationController.class);

    // コンストラクタ
    public UserPlaylistRecommendationController(VisitedPlaylistRepository visitedPlaylistRepository) {
        this.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    // ユーザーのプレイリストを取得するエンドポイント
    @GetMapping("/user/playlists")
    public List<UserVisitedPlaylist> getUserPlaylists(@AuthenticationPrincipal AppUser appUser) {
        return visitedPlaylistRepository.findByUsername(appUser.getUsername());
    }

    // ユーザーが訪問したプレイリストを取得するエンドポイント
    @GetMapping("/java/user/visited-playlists")
    public ResponseEntity<List<Map<String, String>>> getVisitedPlaylists() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        List<UserVisitedPlaylist> userVisitedPlaylists = visitedPlaylistRepository.findByUsername(username);
        List<Map<String, String>> response = new ArrayList<>();

        for (UserVisitedPlaylist userVisitedPlaylist : userVisitedPlaylists) {
            if (userVisitedPlaylist.getPlaylistName() != null) {
                Map<String, String> playlistData = new HashMap<>();
                playlistData.put("id", userVisitedPlaylist.getPlaylistId());
                playlistData.put("name", userVisitedPlaylist.getPlaylistName());
                response.add(playlistData);
            }
        }

        return ResponseEntity.ok(response);
    }

    // ユーザーのプレイリストに基づいて推奨曲を取得するエンドポイント
    @GetMapping("/java/recommendations")
    public ResponseEntity<Recommendations> getRecommendations(@RequestParam float tempo, @RequestParam int key, @RequestParam float danceability, @RequestParam float energy, @RequestParam float acousticness, @RequestParam float liveness, @RequestParam float speechiness, @RequestParam float valence, @RequestParam List<String> modeArtistNames) {
        try {
            logger.info("modeArtistNames: " + modeArtistNames);
            Recommendations recommendations = GetRecommendations.getRecommendationsBasedOnTrackFeatures(tempo, key, danceability, energy, acousticness, liveness, speechiness, valence, modeArtistNames);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
