import {TrackManager} from './trackManager'
import {PlaylistIdManager} from './playlistIdManager'
import {TrackTableManager} from './trackTableManager'

export class TrackDisplayManager {
    private trackTableManager = new TrackTableManager()
    
    displayRecommendedTracks(tracks: any[]) {
        const table = document.createElement('table');
        table.classList.add('recommendations-table', 'divide-x', 'divide-y', 'divide-gray-200', 'w-full', 'mx-auto', 'mt-6', 'text-center', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        const trackManager = new TrackManager();
        table.appendChild(this.trackTableManager.createHeaderRow());
        
        const playlistIdManager = PlaylistIdManager.getInstance();
        const trackPairs = trackManager.createTrackPairs(tracks);
        const rows = this.trackTableManager.createRowsForTrackPairs(trackPairs, playlistIdManager.playlistId);
        rows.forEach((row: HTMLTableRowElement) => {
            row.classList.add('hover:bg-gray-200', 'h-20', 'border', 'border-gray-300', 'odd:bg-white', 'even:bg-gray-100', 'transition-colors', 'duration-300', 'ease-in-out');
            table.appendChild(row);
        });
        
        this.trackTableManager.appendTableToDOM(table);
    }
}
