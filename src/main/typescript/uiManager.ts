import {PlaylistIdManager} from './playlistIdManager'
import {Track} from './track'
import {TrackManager} from './trackManager'
import {TableManager} from './tableManager'

export class UIManager {
    private tableManager = new TableManager();

// 推奨曲を表示する関数
    displayRecommendedTracks(tracks: any[]) {
        const table = document.createElement('table');
        // Tailwind CSS classes for styling the table
        table.classList.add('recommendations-table', 'divide-x', 'divide-y', 'divide-gray-200', 'w-full', 'mx-auto', 'mt-6', 'text-center', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        const trackManager = new TrackManager();
        table.appendChild(trackManager.createHeaderRow());
        
        const playlistIdManager = PlaylistIdManager.getInstance();
        const trackPairs = trackManager.createTrackPairs(tracks);
        const rows = trackManager.createRowsForTrackPairs(trackPairs, playlistIdManager.playlistId);
        rows.forEach((row: HTMLTableRowElement) => {
            row.classList.add('hover:bg-gray-200', 'h-20', 'border', 'border-gray-300', 'odd:bg-white', 'even:bg-gray-100', 'transition-colors', 'duration-300', 'ease-in-out');
            table.appendChild(row);
        });
        
        trackManager.appendTableToDOM(table);
    }
    
    // IDに基づいてHTML要素を取得する
    getElementById(id: string): HTMLElement {
        return document.getElementById(id);
    }
    
    // プレイリストフォームを取得する
    get playlistForm(): HTMLFormElement {
        return this.getElementById('playlistForm') as HTMLFormElement;
    }
    
    // プレイリストトラックDivを取得する
    get playlistTracksDiv(): HTMLDivElement {
        return this.getElementById('playlistTracks') as HTMLDivElement;
    }
    
    // 検索フォームを取得する
    get searchForm(): HTMLFormElement {
        return this.getElementById('searchForm') as HTMLFormElement;
    }
    
    // 検索結果Divを取得する
    get searchResultsDiv(): HTMLDivElement {
        return this.getElementById('searchResults') as HTMLDivElement;
    }
    
    // データが有効かどうかを確認する
    isValidData(data: any): boolean {
        return data && Array.isArray(data.tracks);
    }

// プレイリスト名を表示する
    displayPlaylistName(name: string): void {
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            playlistNameElement.classList.add('text-4xl', 'font-bold', 'text-green-500', 'mt-4', 'font-sans', 'font-semibold', 'w-full', 'text-center', 'border-b-2', 'border-green-500');
            this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
        }
    }
    
    addClickListener(element: HTMLElement, listener: () => void): void {
        element.addEventListener('click', listener);
    }
    
    validateData(data: any): void {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
    
    displayPlaylistDetails(playlist: any, data: any): void {
        this.playlistTracksDiv.innerHTML = '';
        const trackManager = new TrackManager();
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${playlist.name}`;
        this.playlistTracksDiv.appendChild(playlistNameElement);
        
        if (data && Array.isArray(data.tracks)) {
            const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
            this.tableManager.createDomTable(tracks);
            trackManager.calculateTrackAverageAndMode(tracks);
        } else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    
    // プレイリストを表示する
    displayPlaylists(data: any) {
        this.playlistTracksDiv.innerHTML = '';
        if (data && Array.isArray(data)) {
            this.tableManager.createSearchResultsTable(data);
        } else {
            console.error(`Expected data to be an array but received data of type ${typeof data}`, data);
        }
    }
    
}

export interface PlaylistSimplified {
    id: string;
    name: string;
}
