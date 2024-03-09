"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackDisplayManager = void 0;
const trackManager_1 = require("./trackManager");
const playlistIdManager_1 = require("./playlistIdManager");
const trackTableManager_1 = require("./trackTableManager");
class TrackDisplayManager {
    constructor() {
        this.trackTableManager = new trackTableManager_1.TrackTableManager();
    }
    displayRecommendedTracks(tracks) {
        const table = document.createElement('table');
        table.classList.add('recommendations-table', 'divide-x', 'divide-y', 'divide-gray-200', 'w-full', 'mx-auto', 'mt-6', 'text-center', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        const trackManager = new trackManager_1.TrackManager();
        table.appendChild(this.trackTableManager.createHeaderRow());
        const playlistIdManager = playlistIdManager_1.PlaylistIdManager.getInstance();
        const trackPairs = trackManager.createTrackPairs(tracks);
        const rows = this.trackTableManager.createRowsForTrackPairs(trackPairs, playlistIdManager.playlistId);
        rows.forEach((row) => {
            row.classList.add('hover:bg-gray-200', 'h-20', 'border', 'border-gray-300', 'odd:bg-white', 'even:bg-gray-100', 'transition-colors', 'duration-300', 'ease-in-out');
            table.appendChild(row);
        });
        this.trackTableManager.appendTableToDOM(table);
    }
}
exports.TrackDisplayManager = TrackDisplayManager;
//# sourceMappingURL=trackDisplayManager.js.map