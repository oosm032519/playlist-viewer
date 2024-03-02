import {TableManager} from './TableManager'

export class UIManager {
    showMessage(message: string) {
        const uiManager = new UIManager();
        const messageDiv = uiManager.createMessageElement(message);
        
        const styles = {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            backgroundColor: '#2EBD59',
            color: 'white',
            borderRadius: '5px'
        };
        
        uiManager.applyStylesToElement(messageDiv, styles);
        
        document.body.appendChild(messageDiv);
        
        uiManager.removeElementAfterDelay(messageDiv, 3000);
    }
    
    // ローディングアニメーションを表示する関数
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }

// ローディングアニメーションを非表示にする関数
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    
    createTable(visitedPlaylistsDiv: HTMLElement, data: any) {
        const tableManager = new TableManager();
        let table = tableManager.getTable(visitedPlaylistsDiv);
        table.appendChild(tableManager.createTableHeader());
        table.appendChild(tableManager.createTableBody(table, data));
        visitedPlaylistsDiv.classList.add('hidden');
    }
    
    toggleDarkLightMode() {
        const sunIcon = document.getElementById('sun-icon');
        sunIcon.style.transition = 'transform 0.5s';
        sunIcon.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
            const rotationDegree = document.body.classList.contains('dark-mode') ? 180 : 0;
            sunIcon.style.transform = `rotate(${rotationDegree}deg)`;
        });
    }
    
    togglePlaylistSearchOption() {
        const playlistIdOption = document.getElementById('playlistIdOption') as HTMLInputElement;
        const searchQueryOption = document.getElementById('searchQueryOption') as HTMLInputElement;
        const playlistForm = document.getElementById('playlistForm');
        const searchForm = document.getElementById('searchForm');
        playlistIdOption.addEventListener('change', () => {
            if (playlistIdOption.checked) {
                playlistForm.classList.remove('hidden');
                searchForm.classList.add('hidden');
            }
        });
        searchQueryOption.addEventListener('change', () => {
            if (searchQueryOption.checked) {
                searchForm.classList.remove('hidden');
                playlistForm.classList.add('hidden');
            }
        });
    }
    
    toggleSideMenu() {
        const openButton = document.getElementById('open');
        const closeButton = document.getElementById('close');
        const sideMenu = document.querySelector('.side-menu');
        
        openButton.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
        });
        closeButton.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
        });
    }
    
    displayLoginResultMessage() {
        const urlParams = new URLSearchParams(window.location.search);
        const loginResult = urlParams.get('loginResult');
        
        if (loginResult) {
            let message;
            if (loginResult === 'success') {
                message = 'Spotifyログインに成功しました';
            } else if (loginResult === 'failure') {
                message = 'Spotifyログインに失敗しました';
            }
            if (message) {
                const uiManager = new UIManager();
                uiManager.showMessage(message);
            }
        }
    }
    
    createMessageElement(message: string): HTMLDivElement {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        return messageDiv;
    }
    
    applyStylesToElement(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
        Object.assign(element.style, styles);
    }
    
    removeElementAfterDelay(element: HTMLElement, delay: number) {
        setTimeout(() => {
            document.body.removeChild(element);
        }, delay);
    }
}
