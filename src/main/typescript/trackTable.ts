import {Track} from './track'
import {DescriptionManager} from './descriptionManager'

export class TrackTable {
    tracks: Track[];  // トラックの配列を保持するプロパティ

    constructor(tracks: Track[]) {  // コンストラクタでトラックの配列を受け取る
        this.tracks = tracks;
    }
    
    static handleResponse(response: Response) {  // レスポンスのハンドリングを行う静的メソッド
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    
    static handleError(error: Error) {  // エラーハンドリングを行う静的メソッド
        console.error('There was a problem with the fetch operation: ', error);
    }
    
    createTableHeader(): HTMLTableSectionElement {  // テーブルのヘッダーを作成するメソッド
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach((text, index) => {
            const th = this.createHeaderCell(text, index);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
    }
    
    createHeaderCell(text: string, index: number): HTMLTableHeaderCellElement {  // ヘッダーセルを作成するメソッド
        const th = document.createElement('th');
        th.textContent = text;
        const descriptions = new DescriptionManager();
        if (descriptions.descriptions[text]) {
            th.title = descriptions.descriptions[text];
        }
        th.addEventListener('click', (event) => this.handleHeaderCellClick(event, index));
        return th;
    }
    
    handleHeaderCellClick(event: Event, index: number): void {  // ヘッダーセルがクリックされたときのハンドラ
        const element = event.target as HTMLElement;
        this.toggleSortOrder(element);
        this.resetSortOrderForOtherColumns(element);
        this.sortRows(element, index);
    }
    
    toggleSortOrder(element: HTMLElement): void {  // ソート順を切り替えるメソッド
        if (element.classList.contains('asc')) {
            element.classList.replace('asc', 'desc');
        } else if (element.classList.contains('desc')) {
            element.classList.replace('desc', 'asc');
        } else {
            element.classList.add('asc');
        }
    }
    
    resetSortOrderForOtherColumns(element: HTMLElement): void {  // 他の列のソート順をリセットするメソッド
        Array.from(element.parentNode.children)
            .filter(e => e !== element)
            .forEach(e => e.classList.remove('asc', 'desc'));
    }
    
    sortRows(element: HTMLElement, index: number): void {  // 行をソートするメソッド
        const table = element.closest('table') as HTMLTableElement;
        const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
        const sortOrder = element.classList.contains('asc') ? -1 : 1;
        
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => TrackTable.sortRows(a, b, index, sortOrder));
        
        rows.forEach(row => tbody.appendChild(row));
    }
    
    static sortRows(a: HTMLTableRowElement, b: HTMLTableRowElement, columnIndex: number, sortOrder: number): number {  // 行をソートする静的メソッド
        const cellA = TrackTable.getSortValue(a.cells[columnIndex].textContent, columnIndex);
        const cellB = TrackTable.getSortValue(b.cells[columnIndex].textContent, columnIndex);
        
        return (cellA > cellB ? 1 : -1) * sortOrder;
    }
    
    private createTableBody(): HTMLTableSectionElement {  // テーブルボディを作成するメソッド
        const tbody = document.createElement('tbody');
        this.tracks.forEach(track => {
            const row = this.createRow(track);
            tbody.appendChild(row);
        });
        return tbody;
    }
    
    private createRow(track: Track): HTMLTableRowElement {  // 行を作成するメソッド
        const row = document.createElement('tr');
        [track.name, track.artists[0].name, track.audioFeatures.tempo, this.keyToNote(track.audioFeatures.key), track.audioFeatures.mode, track.audioFeatures.acousticness, track.audioFeatures.danceability, track.audioFeatures.energy, /* track.audioFeatures.instrumentalness, */ track.audioFeatures.liveness, track.audioFeatures.speechiness, track.audioFeatures.valence].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text.toString();
            row.appendChild(td);
        });
        return row;
    }
    
    private keyToNote(key: number): string {  // キーを音符に変換するメソッド
        const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return NOTES[key];
    }
    
    static getSortValue(cell: string | number, columnIndex: number): string | number {  // ソート値を取得する静的メソッド
        const COLUMN_INDEX_NAME_ARTIST = 0;
        const COLUMN_INDEX_OTHERS = 1;
        const COLUMN_INDEX_KEY = 3;
        const COLUMN_INDEX_MODE = 4;
        if (columnIndex === COLUMN_INDEX_NAME_ARTIST || columnIndex === COLUMN_INDEX_OTHERS || columnIndex === COLUMN_INDEX_KEY || columnIndex === COLUMN_INDEX_MODE) {
            return cell;
        } else {
            return parseFloat(cell as string);
        }
    }
    
    createTable(): HTMLTableElement {  // テーブルを作成するメソッド
        const table = document.createElement('table');
        table.classList.add('playlist-table');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}
