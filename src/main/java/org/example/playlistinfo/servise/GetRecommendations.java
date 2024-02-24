package org.example.playlistinfo.servise;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.authorization.SpotifyAccessTokenService;
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
import java.util.ArrayList;
import java.util.List;

@Service
public class GetRecommendations {
    private static final Logger logger = LoggerFactory.getLogger(GetRecommendations.class);

    private static SpotifyAccessTokenService spotifyAccessTokenService;

    @Autowired
    public GetRecommendations(SpotifyAccessTokenService spotifyAccessTokenService) {
        GetRecommendations.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    public static List<String> getTopFiveArtistIdsFromNames(List<String> artistNames) throws IOException, SpotifyWebApiException, ParseException {
        SpotifyApi spotifyApi = spotifyAccessTokenService.getSpotifyApi();
        List<String> artistIds = new ArrayList<>();
        for (String artistName : artistNames) {
            if (artistIds.size() >= 5) {
                break;
            }
            Artist[] artists = spotifyApi.searchArtists(artistName).build().execute().getItems();
            if (artists.length > 0) {
                artistIds.add(artists[0].getId());
            }
        }
        return artistIds;
    }

    public static Recommendations getRecommendationsBasedOnTrackFeatures(float tempo, int key, float danceability, float energy, float acousticness, float liveness, float speechiness, float valence, List<String> modeArtistNames) {
        try {
            SpotifyApi spotifyApi = spotifyAccessTokenService.getSpotifyApi();
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
        } catch (BadRequestException e) {
            logger.error("Invalid request: " + e.getMessage(), e);
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            logger.error("Error: " + e.getMessage(), e);
        }
        return null;
    }
}
