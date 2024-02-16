package org.example.playlistinfo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"authorization.client_credentials", "data.playlists"})
public class PlaylistInfoApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlaylistInfoApplication.class, args);
    }

}
