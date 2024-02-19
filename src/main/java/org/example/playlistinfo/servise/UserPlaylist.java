package org.example.playlistinfo.servise;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.playlistinfo.security.User;

@Getter
@Entity
@Table(name = "user_playlists")
public class UserPlaylist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // setUser メソッドを追加
    @Setter
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // setPlaylistId メソッドを追加
    @Setter
    @Column(name = "playlist_id")
    private String playlistId;

}
