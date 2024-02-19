package org.example.playlistinfo.security;

import org.example.playlistinfo.servise.UserPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPlaylistRepository extends JpaRepository<UserPlaylist, Long> {
    List<UserPlaylist> findByUser(User user);
}
