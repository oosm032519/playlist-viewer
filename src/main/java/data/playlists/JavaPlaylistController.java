package data.playlists;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;

import java.util.List;
import java.util.Map;

@RestController
public class JavaPlaylistController {

    private final GetPlaylistsItems getPlaylistsItems;
    private final SearchPlaylistsService searchPlaylistsService;

    public JavaPlaylistController(GetPlaylistsItems getPlaylistsItems, SearchPlaylistsService searchPlaylistsService) {
        this.getPlaylistsItems = getPlaylistsItems;
        this.searchPlaylistsService = searchPlaylistsService;
    }

    @GetMapping("/java/playlist/{playlistId}")
    public Map<String, Object> getPlaylistItems(@PathVariable String playlistId) {
        return getPlaylistsItems.getPlaylistItems(playlistId).getBody();
    }

    @GetMapping("/java/search/{query}")
    public List<PlaylistSimplified> searchPlaylists(@PathVariable String query) {
        return searchPlaylistsService.searchPlaylists(query);
    }
}
