package org.example.playlistinfo.service;

import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.entity.repository.VisitedPlaylistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitedPlaylistService {

    private final VisitedPlaylistRepository visitedPlaylistRepository;  // リポジトリの参照

    // コンストラクタ
    public VisitedPlaylistService(VisitedPlaylistRepository visitedPlaylistRepository) {
        this.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    // プレイリストの訪問情報を保存する
    public void saveVisitedPlaylist(String playlistId, String username) {
        UserVisitedPlaylist userVisitedPlaylist = new UserVisitedPlaylist();
        userVisitedPlaylist.setPlaylistId(playlistId);  // プレイリストIDを設定
        userVisitedPlaylist.setUsername(username);  // ユーザー名を設定
        visitedPlaylistRepository.save(userVisitedPlaylist);  // リポジトリに保存
    }

    // ユーザー名により訪問したプレイリストを検索する
    public List<UserVisitedPlaylist> findByUsername(String username) {
        return visitedPlaylistRepository.findByUsername(username);  // ユーザー名で検索
    }
}
