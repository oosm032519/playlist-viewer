package org.example.playlistinfo.security;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPlaylistRepository extends JpaRepository<UserPlaylist, Long> {
    List<UserPlaylist> findByUsername(String username);

    List<UserPlaylist> findByUsernameAndPlaylistId(String username, String playlistId);

    List<UserPlaylist> findByPlaylistNameIsNull();  // 新しいメソッド
}
