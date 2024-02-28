package org.example.playlistinfo.entity.repository;

import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitedPlaylistRepository extends JpaRepository<UserVisitedPlaylist, Long> {
    List<UserVisitedPlaylist> findByUsername(String username);

    List<UserVisitedPlaylist> findByUsernameAndPlaylistId(String username, String playlistId);

    List<UserVisitedPlaylist> findByPlaylistNameIsNull();
}
