package org.example.playlistinfo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PlaylistViewerApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlaylistViewerApplication.class, args);
    }
}
