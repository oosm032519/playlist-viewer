package org.example.playlistinfo.model;

import lombok.Getter;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;

@Getter
public class PlaylistTrackWithFeatures {
    private final PlaylistTrack playlistTrack;
    private final AudioFeatures audioFeatures;

    public PlaylistTrackWithFeatures(PlaylistTrack playlistTrack, AudioFeatures audioFeatures) {
        this.playlistTrack = playlistTrack;
        this.audioFeatures = audioFeatures;
    }

}
