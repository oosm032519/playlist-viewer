package org.example.playlistinfo.service;

import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.entity.repository.VisitedPlaylistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitedPlaylistService {

    private final VisitedPlaylistRepository visitedPlaylistRepository;

    public VisitedPlaylistService(VisitedPlaylistRepository visitedPlaylistRepository) {
        this.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    public void saveVisitedPlaylist(String playlistId, String username) {
        UserVisitedPlaylist userVisitedPlaylist = new UserVisitedPlaylist();
        userVisitedPlaylist.setPlaylistId(playlistId);
        userVisitedPlaylist.setUsername(username);
        visitedPlaylistRepository.save(userVisitedPlaylist);
    }

    public List<UserVisitedPlaylist> findByUsername(String username) {
        return visitedPlaylistRepository.findByUsername(username);
    }
}
