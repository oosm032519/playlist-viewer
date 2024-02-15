class DomElements {
    playlistForm: HTMLFormElement;
    playlistIdInput: HTMLInputElement;
    playlistTracksDiv: HTMLDivElement;
    
    constructor() {
        this.playlistForm = document.getElementById('playlistForm') as HTMLFormElement;
        this.playlistIdInput = document.getElementById('playlistId') as HTMLInputElement;
        this.playlistTracksDiv = document.getElementById('playlistTracks') as HTMLDivElement;
    }
    
    fetchData(): void {
        this.playlistForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const playlistId = this.playlistIdInput.value;
            
            fetch(`/java/playlist/${playlistId}`)
                .then(TrackTable.handleResponse)
                .then(data => {
                    this.playlistTracksDiv.innerHTML = '';
                    const tracks = data.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
                    this.createTable(tracks);
                })
                .catch(TrackTable.handleError);
        });
    }
    
    createTable(tracks: Track[]): void {
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
}

class Track {
    name: string;
    artists: { name: string }[];
    audioFeatures: {
        tempo: number;
        key: number;
        mode: number;
        acousticness: number;
        danceability: number;
        energy: number;
        liveness: number;
        speechiness: number;
        valence: number;
    };
    
    constructor(track: any, audioFeatures: any) {
        this.name = track.name;
        this.artists = track.artists;
        this.audioFeatures = audioFeatures;
    }
}

class TrackTable {
    tracks: Track[];
    
    constructor(tracks: Track[]) {
        this.tracks = tracks;
    }
    
    static handleResponse(response: Response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    
    static handleError(error: Error) {
        console.error('There was a problem with the fetch operation: ', error);
    }
    
    createTableHeader(): HTMLTableSectionElement {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach((text, index) => {
            const th = document.createElement('th');
            th.textContent = text;
            
            // Add click listener to the header cell
            th.addEventListener('click', (event) => {
                const element = event.target as HTMLElement;
                
                if (element.classList.contains('asc')) {
                    element.classList.replace('asc', 'desc');
                } else if (element.classList.contains('desc')) {
                    element.classList.replace('desc', 'asc');
                } else {
                    element.classList.add('asc');
                }
                
                Array.from(element.parentNode.children)
                    .filter(e => e !== element)
                    .forEach(e => e.classList.remove('asc', 'desc'));
                
                const table = th.closest('table') as HTMLTableElement;
                const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
                const sortOrder = th.classList.contains('asc') ? -1 : 1;
                
                // Convert HTMLCollection to Array and sort
                const rows = Array.from(tbody.rows);
                rows.sort((a, b) => TrackTable.sortRows(a, b, index, sortOrder));
                
                // Append sorted rows to tbody
                rows.forEach(row => tbody.appendChild(row));
            });
            
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
    }
    
    static sortRows(a: HTMLTableRowElement, b: HTMLTableRowElement, columnIndex: number, sortOrder: number): number {
        const cellA = TrackTable.getSortValue(a.cells[columnIndex].textContent, columnIndex);
        const cellB = TrackTable.getSortValue(b.cells[columnIndex].textContent, columnIndex);
        
        return (cellA > cellB ? 1 : -1) * sortOrder;
    }
    
    private createTableBody(): HTMLTableSectionElement {
        const tbody = document.createElement('tbody');
        this.tracks.forEach(track => {
            const row = this.createRow(track);
            tbody.appendChild(row);
        });
        return tbody;
    }
    
    private createRow(track: Track): HTMLTableRowElement {
        const row = document.createElement('tr');
        [track.name, track.artists[0].name, track.audioFeatures.tempo, this.keyToNote(track.audioFeatures.key), track.audioFeatures.mode, track.audioFeatures.acousticness, track.audioFeatures.danceability, track.audioFeatures.energy, /* track.audioFeatures.instrumentalness, */ track.audioFeatures.liveness, track.audioFeatures.speechiness, track.audioFeatures.valence].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text.toString();
            row.appendChild(td);
        });
        return row;
    }
    
    private keyToNote(key: number): string {
        const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return NOTES[key];
    }
    
    static getSortValue(cell: string | number, columnIndex: number): string | number {
        const COLUMN_INDEX_NAME_ARTIST = 0;
        const COLUMN_INDEX_OTHERS = 1;
        return columnIndex === COLUMN_INDEX_NAME_ARTIST || columnIndex === COLUMN_INDEX_OTHERS ? cell : parseFloat(cell as string);
    }
    
    createTable(): HTMLTableElement {
        const table = document.createElement('table');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}

const domElements = new DomElements();
domElements.fetchData();