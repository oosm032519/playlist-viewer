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
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            logger.error("プレイリストの検索中にエラーが発生しました: ", e);
            throw new RuntimeException(e);
        }
    }
}
