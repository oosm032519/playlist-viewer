package org.example.playlistinfo.service;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.security.SpotifyClientAuthenticator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.requests.data.search.simplified.SearchPlaylistsRequest;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Arrays;
import java.util.List;

@Service // このクラスをSpringのサービスとして登録
public class SearchPlaylistsService {

    private static final Logger logger = LoggerFactory.getLogger(SearchPlaylistsService.class);

    private final SpotifyApi spotifyApi;

    // SpotifyClientAuthenticatorを利用してSpotifyApiを初期化
    public SearchPlaylistsService(final SpotifyClientAuthenticator spotifyClientAuthenticator) {
        String accessToken = spotifyClientAuthenticator.clientCredentials();
        this.spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
    }

    // Spotifyでプレイリストを検索するメソッド
    public List<PlaylistSimplified> searchPlaylists(String query) {
        try {
            SearchPlaylistsRequest searchPlaylistsRequest = spotifyApi.searchPlaylists(query).build();
            Paging<PlaylistSimplified> playlistSimplifiedPaging = searchPlaylistsRequest.execute();
            return Arrays.asList(playlistSimplifiedPaging.getItems());
        } catch (IOException e) {
            logger.error("An I/O error occurred while searching for playlists: ", e);
            throw new UncheckedIOException(e);
        } catch (SpotifyWebApiException e) {
            logger.error("An error occurred with the Spotify Web API while searching for playlists: ", e);
            throw new IllegalStateException("An error occurred with the Spotify Web API", e);
        } catch (ParseException e) {
            logger.error("An error occurred while parsing the response from the Spotify Web API: ", e);
            throw new IllegalArgumentException("An error occurred while parsing the response from the Spotify Web API", e);
        }
    }
}
