var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UIManager } from './UIManager';
export class FetchManager {
    fetchVisitedPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            fetch('/java/user/visited-playlists', { credentials: 'include' })
                .then(response => response.json())
                .then(data => {
                const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
                const uiManager = new UIManager();
                uiManager.createTable(visitedPlaylistsDiv, data);
            });
        });
    }
}
//# sourceMappingURL=FetchManager.js.map