package org.example.playlistinfo.service;

import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.entity.repository.VisitedPlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserPlaylistService {
    private static VisitedPlaylistRepository visitedPlaylistRepository;

    @Autowired
    public UserPlaylistService(VisitedPlaylistRepository visitedPlaylistRepository) {
        UserPlaylistService.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    public static void saveUserPlaylist(String username, String playlistId, String playlistName) {
        if (playlistName != null) {
            List<UserVisitedPlaylist> existingPlaylists = visitedPlaylistRepository.findByUsernameAndPlaylistId(username, playlistId);
            if (existingPlaylists.isEmpty()) {
                UserVisitedPlaylist userVisitedPlaylist = new UserVisitedPlaylist();
                userVisitedPlaylist.setUsername(username);
                userVisitedPlaylist.setPlaylistId(playlistId);
                userVisitedPlaylist.setPlaylistName(playlistName);
                visitedPlaylistRepository.save(userVisitedPlaylist);
            }
        }
    }

    public static void deletePlaylistsWithNullNames() {
        List<UserVisitedPlaylist> playlistsWithNullNames = visitedPlaylistRepository.findByPlaylistNameIsNull();
        visitedPlaylistRepository.deleteAll(playlistsWithNullNames);
    }
}
