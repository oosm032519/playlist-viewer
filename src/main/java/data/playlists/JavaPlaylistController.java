package data.playlists;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class JavaPlaylistController {

    private final GetPlaylistsItems getPlaylistsItems;

    public JavaPlaylistController(GetPlaylistsItems getPlaylistsItems) {
        this.getPlaylistsItems = getPlaylistsItems;
    }

    @GetMapping("/java/playlist/{playlistId}")
    public List<PlaylistTrackWithFeatures> getPlaylistItems(@PathVariable String playlistId) {
        return getPlaylistsItems.getPlaylistItems(playlistId).getBody();
    }
}
