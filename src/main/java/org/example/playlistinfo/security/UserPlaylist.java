package org.example.playlistinfo.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_playlists")
public class UserPlaylist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String playlistId;

    private String username;

    // 新しいフィールドを追加
    private String playlistName;
}
