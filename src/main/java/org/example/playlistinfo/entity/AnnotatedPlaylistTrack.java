package org.example.playlistinfo.entity;

import lombok.Getter;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;

@Getter
public class AnnotatedPlaylistTrack {
    private final PlaylistTrack playlistTrack;
    private final AudioFeatures audioFeatures;

    public AnnotatedPlaylistTrack(PlaylistTrack playlistTrack, AudioFeatures audioFeatures) {
        this.playlistTrack = playlistTrack;
        this.audioFeatures = audioFeatures;
    }

}
