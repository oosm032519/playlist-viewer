import {TrackFetcher} from './trackFetcher'
import {MessageManager} from './MessageManager'

export class TrackButtonManager {
    private messageManager = new MessageManager();
    
    // 追加ボタンを作成する関数
    createAddButton(track: any, playlistId: string, cell: HTMLElement) {
        return this.createTrackButton(track, playlistId, cell, null, true);
    }
    
    // 削除ボタンを作成する関数
    createRemoveButton(track: any, playlistId: string, cell: HTMLElement, row: HTMLTableRowElement) {
        return this.createTrackButton(track, playlistId, cell, row, false);
    }

// ボタンを作成する関数
    createButton(isAddButton: boolean): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = isAddButton ? '+' : '-';
        button.className = 'track-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center text-lg w-10 h-10 flex items-center justify-center'
        return button;
    }

// メッセージを生成するメソッド
    getMessages(isAddButton: boolean) {
        const successMessage = isAddButton ? '楽曲を追加しました！' : '楽曲を削除しました！';
        const errorMessage = isAddButton ? '楽曲を追加できませんでした' : '楽曲を削除できませんでした';
        return {successMessage, errorMessage};
    }

// エンドポイントを生成するメソッド
    getEndpoint(isAddButton: boolean) {
        return isAddButton ? 'addTrack' : 'removeTrack';
    }

// イベントリスナーのコールバック関数
    async handleButtonClick({track, playlistId, cell, row, isAddButton}: {
        track: any,
        playlistId: string,
        cell: HTMLElement,
        row: HTMLTableRowElement,
        isAddButton: boolean
    }) {
        if (!playlistId) {
            console.error('Playlist ID is not set.');
            return;
        }
        const endpoint = this.getEndpoint(isAddButton);
        const {successMessage, errorMessage} = this.getMessages(isAddButton);
        
        try {
            const trackFetcher = new TrackFetcher();
            await trackFetcher.fetchTrack(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`);
            this.messageManager.showMessage(successMessage);
            if (isAddButton) {
                cell.classList.add('bg-green-100');
            } else {
                if (row.sectionRowIndex % 2 === 0) {
                    cell.classList.add('bg-white');
                } else {
                    cell.classList.add('bg-gray-100');
                }
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
            this.messageManager.showMessage(errorMessage);
        }
    }

// トラックボタンを作成する関数
    createTrackButton(track: any, playlistId: string, cell: HTMLElement, row: HTMLTableRowElement, isAddButton: boolean) {
        const button = this.createButton(isAddButton);
        button.classList.add(
            'bg-green-500', 'text-white', 'w-12', 'h-12', 'm-2', 'rounded', 'px-5', 'py-2.5',
            'cursor-pointer', 'transition-colors', 'duration-300', 'ease-in-out'
        );
        button.addEventListener('click', async () => this.handleButtonClick({
            track: track,
            playlistId: playlistId,
            cell: cell,
            row: row,
            isAddButton: isAddButton
        }));
        return button;
    }
}
