package org.example.playlistinfo.service;

import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Artist;
import se.michaelthelin.spotify.model_objects.specification.Recommendations;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service  // サービスクラスを表すアノテーション
public class GetRecommendations {
    private static final Logger logger = LoggerFactory.getLogger(GetRecommendations.class);

    private static SpotifyApiService spotifyApiService;  // Spotify APIサービス

    @Autowired  // 依存性注入
    public GetRecommendations(SpotifyApiService spotifyApiService) {
        GetRecommendations.spotifyApiService = spotifyApiService;
    }

    // アーティスト名からトップ5のアーティストIDを取得
    private static List<String> getTopFiveArtistIdsFromNames(List<String> artistNames) throws IOException, SpotifyWebApiException, ParseException {
        SpotifyApi spotifyApi = spotifyApiService.getSpotifyApi();
        List<String> artistIds = new ArrayList<>();

        logger.info("Received artist names: " + artistNames);

        for (String artistName : artistNames) {
            Artist[] artists = spotifyApi.searchArtists(artistName).build().execute().getItems();
            if (artists.length > 0) {
                String artistId = artists[0].getId();
                artistIds.add(artistId);
                logger.info("Added artist: " + artistName + " with ID: " + artistId);
            }
            if (artistIds.size() >= 5) {
                break;
            }
        }
        return artistIds;
    }

    // トラックの特徴に基づいておすすめを取得
    public static Recommendations getRecommendationsBasedOnTrackFeatures(float tempo, int key, float danceability, float energy, float acousticness, float liveness, float speechiness, float valence, int timeSignature, int durationMs, int mode, float instrumentalness, float loudness, List<String> modeArtistNames) throws IOException, SpotifyWebApiException, ParseException {
        SpotifyApi spotifyApi = spotifyApiService.getSpotifyApi();
        List<String> modeArtistIds = getTopFiveArtistIdsFromNames(modeArtistNames);
        String seedArtists = String.join(",", modeArtistIds);
        logger.info("Seed artists: " + seedArtists);
        return spotifyApi.getRecommendations()
                .limit(10)
                .seed_artists(seedArtists)
                .target_acousticness(acousticness)
                .target_danceability(danceability)
                .target_duration_ms(durationMs)
                .target_energy(energy)
                .target_instrumentalness(instrumentalness)
                .target_key(key)
                .target_liveness(liveness)
                .target_loudness(loudness)
                .target_mode(mode)
                .target_speechiness(speechiness)
                .target_tempo(tempo)
                .target_time_signature(timeSignature)
                .target_valence(valence)
                .build()
                .execute();
    }
}
