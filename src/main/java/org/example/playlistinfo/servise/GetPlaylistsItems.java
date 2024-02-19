package org.example.playlistinfo.servise;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.model.PlaylistTrackWithFeatures;
import org.example.playlistinfo.security.ClientCredentials;
import org.example.playlistinfo.security.User;
import org.example.playlistinfo.security.UserPlaylistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Playlist;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistsItemsRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class GetPlaylistsItems {

    private static final Logger logger = LoggerFactory.getLogger(GetPlaylistsItems.class);

    private final SpotifyApi spotifyApi;
    private final UserPlaylistRepository userPlaylistRepository;

    public GetPlaylistsItems(final ClientCredentials clientCredentials, UserPlaylistRepository userPlaylistRepository) {
        String accessToken = clientCredentials.clientCredentials();
        this.spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        this.userPlaylistRepository = userPlaylistRepository;
    }

    @GetMapping("/playlist/{playlistId}")
    public ResponseEntity<Map<String, Object>> getPlaylistItems(@PathVariable String playlistId, @AuthenticationPrincipal User user) {
        try {
            List<PlaylistTrackWithFeatures> playlistTracks = fetchPlaylistTracks(playlistId);
            Playlist playlist = spotifyApi.getPlaylist(playlistId).build().execute();
            Map<String, Object> response = new HashMap<>();
            response.put("tracks", playlistTracks);
            response.put("name", playlist.getName());
            // ログインユーザーがいれば、そのユーザーが参照したプレイリストを保存
            if (user != null) {
                UserPlaylist userPlaylist = new UserPlaylist();
                userPlaylist.setUser(user);
                userPlaylist.setPlaylistId(playlistId);
                userPlaylistRepository.save(userPlaylist);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("プレイリストの曲の取得中にエラーが発生しました: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    private List<PlaylistTrackWithFeatures> fetchPlaylistTracks(String playlistId) {
        List<PlaylistTrackWithFeatures> playlistTracks = new ArrayList<>();
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
                    playlistTracks.add(new PlaylistTrackWithFeatures(playlistTrack, audioFeatures));
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
