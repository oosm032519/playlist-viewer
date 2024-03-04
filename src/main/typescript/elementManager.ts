export class ElementManager {
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
    
    addClickListener(element: HTMLElement, listener: () => void): void {
        element.addEventListener('click', listener);
    }
    
}
