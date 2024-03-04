import {PlaylistManager} from './playlistManager'

export class TableManager {
    // テーブルの幅をチェックする関数
    checkTableWidth() {
        // 全てのテーブルを取得
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
            // テーブルの幅がウィンドウの幅より大きい場合
            if (table.offsetWidth > window.innerWidth) {
                // スクロールバーを表示
                table.style.overflowX = 'scroll';
            } else {
                // スクロールバーを非表示
                table.style.overflowX = 'auto';
            }
        });
    }
    
    // テーブルヘッダーを作成する関数
    createTableHeader(): HTMLTableSectionElement {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "参照履歴";
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);
        return thead;
    }
    
    // テーブルボディを作成する関数
    createTableBody(table: HTMLTableElement, data: any): HTMLTableSectionElement {
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        
        data.forEach((playlist: any) => {
            const row = this.createTableRow(playlist);
            row.classList.add('border', 'border-gray-300', 'odd:bg-white', 'even:bg-gray-100', 'hover:bg-gray-200', 'transition-colors', 'duration-300', 'ease-in-out');
            tableBody.appendChild(row);
        });
        
        return tableBody;
    }
    
    // テーブル行を作成する関数
    createTableRow(playlist: any) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = playlist.name;
        row.appendChild(nameCell);
        const playlistManager = new PlaylistManager();
        row.addEventListener('click', () => playlistManager.fetchAndDisplayPlaylistDetails(playlist));
        return row;
    }
}
