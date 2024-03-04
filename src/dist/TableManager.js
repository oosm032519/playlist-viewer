import { PlaylistManager } from './playlistManager';
import { TrackTable } from './trackTable';
import { ElementManager } from './elementManager';
export class TableManager {
    constructor() {
        this.elementManager = new ElementManager();
    }
    // テーブルの幅をチェックする関数
    checkTableWidth() {
        // 全てのテーブルを取得
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
            // テーブルの幅がウィンドウの幅より大きい場合
            if (table.offsetWidth > window.innerWidth) {
                // スクロールバーを表示
                table.style.overflowX = 'scroll';
            }
            else {
                // スクロールバーを非表示
                table.style.overflowX = 'auto';
            }
        });
    }
    // テーブルヘッダーを作成する関数
    createTableHeader() {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "参照履歴";
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);
        return thead;
    }
    // テーブルボディを作成する関数
    createTableBody(table, data) {
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        data.forEach((playlist) => {
            const row = this.createTableRow(playlist);
            row.classList.add('border', 'border-gray-300', 'odd:bg-white', 'even:bg-gray-100', 'hover:bg-gray-200', 'transition-colors', 'duration-300', 'ease-in-out');
            tableBody.appendChild(row);
        });
        return tableBody;
    }
    // テーブル行を作成する関数
    createTableRow(playlist) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = playlist.name;
        row.appendChild(nameCell);
        const playlistManager = new PlaylistManager();
        row.addEventListener('click', () => playlistManager.fetchAndDisplayPlaylistDetails(playlist));
        return row;
    }
    // すべてのテーブルをクリアする
    clearAllTables() {
        const elementManager = new ElementManager();
        elementManager.playlistTracksDiv.innerHTML = '';
        elementManager.searchResultsDiv.innerHTML = '';
    }
    // テーブルを作成する
    createDomTable(tracks) {
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.elementManager.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    createSearchResultsTable(results) {
        this.clearAllTables();
        if (!Array.isArray(results)) {
            console.error('Expected results to be an array but received', results);
            return;
        }
        const table = this.createTableFromResults(results);
        this.elementManager.searchResultsDiv.appendChild(table);
    }
    createTableFromResults(results) {
        const table = document.createElement('table');
        table.classList.add('min-w-full', 'divide-y', 'divide-gray-200', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        results.forEach((result) => {
            const row = this.createDomTableRow(result);
            table.appendChild(row);
        });
        return table;
    }
    // 検索結果の各行を作成する
    createDomTableRow(result) {
        const row = document.createElement('tr');
        row.classList.add('odd:bg-white', 'even:bg-gray-100', 'hover:bg-gray-200', 'transition-colors', 'duration-300', 'ease-in-out');
        const td = this.createTableCell(result.name);
        const playlistManager = new PlaylistManager();
        this.elementManager.addClickListener(td, () => playlistManager.fetchAndDisplayPlaylistDetailsUI(result));
        row.appendChild(td);
        return row;
    }
    createTableCell(text) {
        const td = document.createElement('td');
        td.textContent = text;
        td.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium', 'text-gray-900');
        return td;
    }
    // 参照履歴テーブルを作成するメソッド
    createUITable(visitedPlaylistsDiv, data) {
        // 既存のテーブルを取得または作成
        let table = this.getTable(visitedPlaylistsDiv);
        // 既存のテーブルがある場合は削除
        if (table) {
            visitedPlaylistsDiv.removeChild(table);
        }
        // 新しいテーブルを作成
        table = document.createElement('table');
        table.classList.add('divide-y', 'divide-gray-200', 'w-full', 'mx-auto', 'mt-6', 'text-center', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        visitedPlaylistsDiv.appendChild(table);
        // テーブルヘッダーを作成して追加
        const thead = this.createTableHeader();
        thead.classList.add('bg-green-500', 'text-white', 'hover:bg-green-600', 'transition-colors', 'duration-300', 'ease-in-out');
        table.appendChild(thead);
        // テーブルボディを作成して追加
        const tbody = this.createTableBody(table, data);
        tbody.classList.add('divide-y', 'divide-gray-200');
        table.appendChild(tbody);
        // visitedPlaylistsDivを非表示に設定
        visitedPlaylistsDiv.classList.add('hidden');
    }
    // visitedPlaylistsDivからテーブルを取得する関数
    getTable(visitedPlaylistsDiv) {
        let table = visitedPlaylistsDiv.querySelector('table');
        if (!table) {
            table = document.createElement('table');
            visitedPlaylistsDiv.appendChild(table);
        }
        return table;
    }
}
//# sourceMappingURL=tableManager.js.map