package org.example.playlistinfo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "music_information")
public class MusicInformation {
    @Id
    private String trackId;
    private String trackName;
    private String artistName;
    private double bpm;
    private String keyvalue;
    private String mode;
    private double acousticness;
    private double danceability;
    private double energy;
    private double liveness;
    private double speechiness;
    private double valence;

}
