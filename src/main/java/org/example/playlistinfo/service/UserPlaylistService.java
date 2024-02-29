package org.example.playlistinfo.service;

import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.entity.repository.VisitedPlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserPlaylistService {
    private final VisitedPlaylistRepository visitedPlaylistRepository;

    @Autowired
    public UserPlaylistService(VisitedPlaylistRepository visitedPlaylistRepository) {
        this.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    public void saveUserPlaylist(String username, String playlistId, String playlistName) {
        if (playlistName == null) {
            return;
        }

        List<UserVisitedPlaylist> existingPlaylists = findPlaylistsByUsernameAndPlaylistId(username, playlistId);
        if (!existingPlaylists.isEmpty()) {
            return;
        }

        UserVisitedPlaylist userVisitedPlaylist = new UserVisitedPlaylist();
        userVisitedPlaylist.setUsername(username);
        userVisitedPlaylist.setPlaylistId(playlistId);
        userVisitedPlaylist.setPlaylistName(playlistName);
        visitedPlaylistRepository.save(userVisitedPlaylist);
    }

    public void deletePlaylistsWithNullNames() {
        List<UserVisitedPlaylist> playlistsWithNullNames = findPlaylistsByNullName();
        visitedPlaylistRepository.deleteAll(playlistsWithNullNames);
    }

    public List<UserVisitedPlaylist> findPlaylistsByUsernameAndPlaylistId(String username, String playlistId) {
        return visitedPlaylistRepository.findByUsernameAndPlaylistId(username, playlistId);
    }

    public List<UserVisitedPlaylist> findPlaylistsByNullName() {
        return visitedPlaylistRepository.findByPlaylistNameIsNull();
    }
}
