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

@Service
public class GetRecommendations {
    private static final Logger logger = LoggerFactory.getLogger(GetRecommendations.class);

    private static SpotifyApiService spotifyApiService;

    @Autowired
    public GetRecommendations(SpotifyApiService spotifyApiService) {
        GetRecommendations.spotifyApiService = spotifyApiService;
    }

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

    public static Recommendations getRecommendationsBasedOnTrackFeatures(float tempo, int key, float danceability, float energy, float acousticness, float liveness, float speechiness, float valence, List<String> modeArtistNames) throws IOException, SpotifyWebApiException, ParseException {
        SpotifyApi spotifyApi = spotifyApiService.getSpotifyApi();
        List<String> modeArtistIds = getTopFiveArtistIdsFromNames(modeArtistNames);
        String seedArtists = String.join(",", modeArtistIds);
        logger.info("Seed artists: " + seedArtists);
        return spotifyApi.getRecommendations()
                .limit(10)
                .seed_artists(seedArtists)
                .target_tempo(tempo)
                .target_key(key)
                .target_danceability(danceability)
                .target_valence(valence)
                .target_energy(energy)
                .target_acousticness(acousticness)
                .target_speechiness(speechiness)
                .target_liveness(liveness)
                .build()
                .execute();
    }
}
