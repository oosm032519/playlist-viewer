package org.example.playlistinfo.service;

import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.entity.repository.VisitedPlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service  // サービスクラスの宣言
public class UserPlaylistService {
    private final VisitedPlaylistRepository visitedPlaylistRepository;  // リポジトリの宣言

    @Autowired  // リポジトリの自動注入
    public UserPlaylistService(VisitedPlaylistRepository visitedPlaylistRepository) {
        this.visitedPlaylistRepository = visitedPlaylistRepository;
    }

    // ユーザーのプレイリストを保存するメソッド
    public void saveUserPlaylist(String username, String playlistId, String playlistName) {
        if (playlistName == null) {  // プレイリスト名がnullの場合は処理を終了
            return;
        }

        List<UserVisitedPlaylist> existingPlaylists = findPlaylistsByUsernameAndPlaylistId(username, playlistId);
        if (!existingPlaylists.isEmpty()) {  // 既に存在するプレイリストの場合は処理を終了
            return;
        }

        UserVisitedPlaylist userVisitedPlaylist = new UserVisitedPlaylist();
        userVisitedPlaylist.setUsername(username);
        userVisitedPlaylist.setPlaylistId(playlistId);
        userVisitedPlaylist.setPlaylistName(playlistName);
        visitedPlaylistRepository.save(userVisitedPlaylist);  // プレイリストの保存
    }

    // プレイリスト名がnullのプレイリストを削除するメソッド
    public void deletePlaylistsWithNullNames() {
        List<UserVisitedPlaylist> playlistsWithNullNames = findPlaylistsByNullName();
        visitedPlaylistRepository.deleteAll(playlistsWithNullNames);  // プレイリストの削除
    }

    // ユーザー名とプレイリストIDによるプレイリストの検索メソッド
    public List<UserVisitedPlaylist> findPlaylistsByUsernameAndPlaylistId(String username, String playlistId) {
        return visitedPlaylistRepository.findByUsernameAndPlaylistId(username, playlistId);
    }

    // プレイリスト名がnullのプレイリストを検索するメソッド
    public List<UserVisitedPlaylist> findPlaylistsByNullName() {
        return visitedPlaylistRepository.findByPlaylistNameIsNull();
    }
}
