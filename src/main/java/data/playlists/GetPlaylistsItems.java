package data.playlists;

import authorization.client_credentials.ClientCredentials;
import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistsItemsRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class GetPlaylistsItems {

    private static final Logger logger = LoggerFactory.getLogger(GetPlaylistsItems.class);

    private final SpotifyApi spotifyApi;

    public GetPlaylistsItems(final ClientCredentials clientCredentials) {
        String accessToken = clientCredentials.clientCredentials();
        this.spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
    }

    @GetMapping("/playlist/{playlistId}")
    public ResponseEntity<List<PlaylistTrackWithFeatures>> getPlaylistItems(@PathVariable String playlistId) {
        try {
            List<PlaylistTrackWithFeatures> playlistTracks = fetchPlaylistTracks(playlistId);
            return ResponseEntity.ok(playlistTracks);
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
