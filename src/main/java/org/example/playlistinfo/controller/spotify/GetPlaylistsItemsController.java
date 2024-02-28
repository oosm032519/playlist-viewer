package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.entity.AnnotatedPlaylistTrack;
import org.example.playlistinfo.security.SpotifyClientAuthenticator;
import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.entity.repository.VisitedPlaylistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.*;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistsItemsRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController // このクラスをRESTコントローラとして登録
public class GetPlaylistsItemsController {
    private static final Logger logger = LoggerFactory.getLogger(GetPlaylistsItemsController.class);

    private final SpotifyApi spotifyApi;
    private final VisitedPlaylistRepository visitedPlaylistRepository;

    // コンストラクタ
    public GetPlaylistsItemsController(final SpotifyClientAuthenticator spotifyClientAuthenticator, VisitedPlaylistRepository visitedPlaylistRepository) {
        String accessToken = spotifyClientAuthenticator.clientCredentials();
        this.spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        this.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    // プレイリストのアイテムを取得するエンドポイント
    @GetMapping("/playlist/{playlistId}")
    public ResponseEntity<Map<String, Object>> getPlaylistItems(@PathVariable String playlistId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = (authentication != null && authentication.getPrincipal() instanceof UserDetails) ? ((UserDetails) authentication.getPrincipal()).getUsername() : null;
            logger.info("Username from SecurityContextHolder: {}", username);

            List<AnnotatedPlaylistTrack> playlistTracks = fetchPlaylistTracks(playlistId);
            Playlist playlist = spotifyApi.getPlaylist(playlistId).build().execute();
            Map<String, Object> response = new HashMap<>();
            response.put("tracks", playlistTracks);
            response.put("name", playlist.getName());

            // ユーザーがログインしている場合、訪問したプレイリストを保存
            if (username != null) {
                saveUserPlaylist(username, playlistId, playlist.getName());
            }
            deletePlaylistsWithNullNames();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("プレイリストの曲の取得中にエラーが発生しました: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // プレイリスト名がnullのプレイリストを削除
    private void deletePlaylistsWithNullNames() {
        List<UserVisitedPlaylist> playlistsWithNullNames = visitedPlaylistRepository.findByPlaylistNameIsNull();
        visitedPlaylistRepository.deleteAll(playlistsWithNullNames);
    }

    // ユーザーが訪問したプレイリストを保存
    private void saveUserPlaylist(String username, String playlistId, String playlistName) {
        if (playlistName != null) {
            List<UserVisitedPlaylist> existingPlaylists = visitedPlaylistRepository.findByUsernameAndPlaylistId(username, playlistId);
            if (existingPlaylists.isEmpty()) {
                UserVisitedPlaylist userVisitedPlaylist = new UserVisitedPlaylist();
                userVisitedPlaylist.setUsername(username);
                userVisitedPlaylist.setPlaylistId(playlistId);
                userVisitedPlaylist.setPlaylistName(playlistName);
                visitedPlaylistRepository.save(userVisitedPlaylist);
            }
        }
    }

    // プレイリストのトラックを取得
    private List<AnnotatedPlaylistTrack> fetchPlaylistTracks(String playlistId) {
        List<AnnotatedPlaylistTrack> playlistTracks = new ArrayList<>();
        int offset = 0;
        Paging<PlaylistTrack> playlistTrackPaging;

        do {
            try {
                GetPlaylistsItemsRequest getPlaylistsItemsRequest = spotifyApi
                        .getPlaylistsItems(playlistId)
                        .limit(100)
                        .offset(offset)
                        .build();

                playlistTrackPaging = getPlaylistsItemsRequest.execute();

                for (PlaylistTrack playlistTrack : playlistTrackPaging.getItems()) {
                    String trackId = playlistTrack.getTrack().getId();
                    GetAudioFeaturesForTrackRequest getAudioFeaturesForTrackRequest = spotifyApi.getAudioFeaturesForTrack(trackId)
                            .build();
                    AudioFeatures audioFeatures = getAudioFeaturesForTrackRequest.execute();

                    playlistTracks.add(new AnnotatedPlaylistTrack(playlistTrack, audioFeatures));
                }

                offset = playlistTrackPaging.getOffset() + playlistTrackPaging.getItems().length;
            } catch (IOException | SpotifyWebApiException | ParseException e) {
                logger.error("プレイリストのページ取得中にエラーが発生しました: ", e);
                break;
            }

        } while (playlistTrackPaging.getNext() != null);

        return playlistTracks;
    }
}
