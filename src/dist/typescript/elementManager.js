export class ElementManager {
    // IDに基づいてHTML要素を取得する
    getElementById(id) {
        return document.getElementById(id);
    }
    // プレイリストフォームを取得する
    get playlistForm() {
        return this.getElementById('playlistForm');
    }
    // プレイリストトラックDivを取得する
    get playlistTracksDiv() {
        return this.getElementById('playlistTracks');
    }
    // 検索フォームを取得する
    get searchForm() {
        return this.getElementById('searchForm');
    }
    // 検索結果Divを取得する
    get searchResultsDiv() {
        return this.getElementById('searchResults');
    }
    addClickListener(element, listener) {
        element.addEventListener('click', listener);
    }
}
//# sourceMappingURL=elementManager.js.map