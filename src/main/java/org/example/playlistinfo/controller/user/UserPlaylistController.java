package org.example.playlistinfo.controller.user;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.controller.spotify.GetPlaylistsItemsController;
import org.example.playlistinfo.entity.AppUser;
import org.example.playlistinfo.entity.UserVisitedPlaylist;
import org.example.playlistinfo.service.SearchPlaylistsService;
import org.example.playlistinfo.service.VisitedPlaylistService;
import org.example.playlistinfo.utils.AuthenticationUtil;
import org.example.playlistinfo.utils.ResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController  // RESTコントローラ
@RequestMapping("/java")  // ルートパス
public class UserPlaylistController {

    private final GetPlaylistsItemsController getPlaylistsItemsController;  // プレイリストアイテム取得コントローラ
    private final SearchPlaylistsService searchPlaylistsService;  // プレイリスト検索サービス
    private final VisitedPlaylistService visitedPlaylistService;  // 訪問したプレイリストサービス

    // コンストラクタ
    public UserPlaylistController(GetPlaylistsItemsController getPlaylistsItemsController, SearchPlaylistsService searchPlaylistsService, VisitedPlaylistService visitedPlaylistService) {
        this.getPlaylistsItemsController = getPlaylistsItemsController;
        this.searchPlaylistsService = searchPlaylistsService;
        this.visitedPlaylistService = visitedPlaylistService;
    }

    // プレイリストアイテム取得エンドポイント
    @GetMapping("/playlist/{playlistId}")
    public ResponseEntity<Map<String, Object>> getPlaylistItems(@PathVariable String playlistId) throws ParseException, SpotifyWebApiException, IOException {
        ResponseEntity<Map<String, Object>> playlistItems = getPlaylistsItemsController.getPlaylistItems(playlistId);
        if (playlistItems.getStatusCode() == HttpStatus.OK) {
            saveUserVisitedPlaylist(playlistId);  // プレイリスト訪問を保存
        }
        return playlistItems;
    }

    // プレイリスト検索エンドポイント
    @GetMapping("/search/{query}")
    public List<PlaylistSimplified> searchPlaylists(@PathVariable String query) {
        return searchPlaylistsService.searchPlaylists(query);
    }

    // ユーザーの訪問したプレイリスト取得エンドポイント
    @GetMapping("/user/playlists")
    public ResponseEntity<List<UserVisitedPlaylist>> getUserPlaylists(@AuthenticationPrincipal AppUser appUser) {
        if (appUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();  // ユーザーが認証されていない場合
        }
        List<UserVisitedPlaylist> userVisitedPlaylists = visitedPlaylistService.findByUsername(appUser.getUsername());
        return ResponseEntity.ok(userVisitedPlaylists);
    }

    // 現在のユーザー情報取得エンドポイント
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal AppUser appUser) {
        return createUserResponse(appUser);
    }

    // ユーザーが訪問したプレイリストを保存
    private void saveUserVisitedPlaylist(String playlistId) {
        String username = AuthenticationUtil.getAuthenticatedUsername();
        if (username != null) {
            visitedPlaylistService.saveVisitedPlaylist(playlistId, username);
        }
    }

    // ユーザー情報レスポンスを作成
    private ResponseEntity<Map<String, Object>> createUserResponse(AppUser appUser) {
        Map<String, Object> response = ResponseUtil.createResponse(appUser);
        return ResponseEntity.ok(response);
    }
}
