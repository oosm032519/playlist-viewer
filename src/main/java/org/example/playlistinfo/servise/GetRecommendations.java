package org.example.playlistinfo.servise;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.authorization.SpotifyAuthorizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.exceptions.detailed.BadRequestException;
import se.michaelthelin.spotify.model_objects.specification.Artist;
import se.michaelthelin.spotify.model_objects.specification.Recommendations;

import java.io.IOException;

@Service
public class GetRecommendations {
    private static final Logger logger = LoggerFactory.getLogger(GetRecommendations.class);

    private static SpotifyAuthorizationService spotifyAuthorizationService;

    @Autowired
    public GetRecommendations(SpotifyAuthorizationService spotifyAuthorizationService) {
        GetRecommendations.spotifyAuthorizationService = spotifyAuthorizationService;
    }

    public static String getArtistIdFromName(String artistName) throws IOException, SpotifyWebApiException, ParseException {
        SpotifyApi spotifyApi = spotifyAuthorizationService.getSpotifyApi();
        Artist[] artists = spotifyApi.searchArtists(artistName).build().execute().getItems();
        if (artists.length > 0) {
            return artists[0].getId();
        } else {
            throw new RuntimeException("No artist found with name: " + artistName);
        }
    }


    public static Recommendations getRecommendationsBasedOnTrackFeatures(float tempo, int key, float danceability, float energy, float acousticness, float liveness, float speechiness, float valence, String modeArtistId) {
        try {
            SpotifyApi spotifyApi = spotifyAuthorizationService.getSpotifyApi();
            return spotifyApi.getRecommendations()
                    .seed_artists(modeArtistId)
                    .target_key(key)
                    .target_tempo(tempo)
                    .target_danceability(danceability)
                    .target_energy(energy)
                    .target_acousticness(acousticness)
                    .target_liveness(liveness)
                    .target_speechiness(speechiness)
                    .target_valence(valence)
                    .build()
                    .execute();
        } catch (BadRequestException e) {
            logger.error("Invalid request: " + e.getMessage(), e);
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            logger.error("Error: " + e.getMessage(), e);
        }
        return null;
    }
}
