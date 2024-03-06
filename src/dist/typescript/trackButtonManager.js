var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TrackFetcher } from './trackFetcher';
import { MessageManager } from './MessageManager';
export class TrackButtonManager {
    constructor() {
        this.messageManager = new MessageManager();
    }
    // 追加ボタンを作成する関数
    createAddButton(track, playlistId, cell) {
        return this.createTrackButton(track, playlistId, cell, null, true);
    }
    // 削除ボタンを作成する関数
    createRemoveButton(track, playlistId, cell, row) {
        return this.createTrackButton(track, playlistId, cell, row, false);
    }
    // ボタンを作成する関数
    createButton(isAddButton) {
        const button = document.createElement('button');
        button.textContent = isAddButton ? '+' : '-';
        button.className = 'track-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center text-lg w-10 h-10 flex items-center justify-center';
        return button;
    }
    // メッセージを生成するメソッド
    getMessages(isAddButton) {
        const successMessage = isAddButton ? '楽曲を追加しました！' : '楽曲を削除しました！';
        const errorMessage = isAddButton ? '楽曲を追加できませんでした' : '楽曲を削除できませんでした';
        return { successMessage, errorMessage };
    }
    // エンドポイントを生成するメソッド
    getEndpoint(isAddButton) {
        return isAddButton ? 'addTrack' : 'removeTrack';
    }
    // イベントリスナーのコールバック関数
    handleButtonClick({ track, playlistId, cell, row, isAddButton }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!playlistId) {
                console.error('Playlist ID is not set.');
                return;
            }
            const endpoint = this.getEndpoint(isAddButton);
            const { successMessage, errorMessage } = this.getMessages(isAddButton);
            try {
                const trackFetcher = new TrackFetcher();
                yield trackFetcher.fetchTrack(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`);
                this.messageManager.showMessage(successMessage);
                if (isAddButton) {
                    cell.classList.add('bg-green-100');
                }
                else {
                    if (row.sectionRowIndex % 2 === 0) {
                        cell.classList.add('bg-white');
                    }
                    else {
                        cell.classList.add('bg-gray-100');
                    }
                }
            }
            catch (error) {
                console.error('There was a problem with the fetch operation: ', error);
                this.messageManager.showMessage(errorMessage);
            }
        });
    }
    // トラックボタンを作成する関数
    createTrackButton(track, playlistId, cell, row, isAddButton) {
        const button = this.createButton(isAddButton);
        button.classList.add('bg-green-500', 'text-white', 'w-12', 'h-12', 'm-2', 'rounded', 'px-5', 'py-2.5', 'cursor-pointer', 'transition-colors', 'duration-300', 'ease-in-out');
        button.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            return this.handleButtonClick({
                track: track,
                playlistId: playlistId,
                cell: cell,
                row: row,
                isAddButton: isAddButton
            });
        }));
        return button;
    }
}
//# sourceMappingURL=trackButtonManager.js.map