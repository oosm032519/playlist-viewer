"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionManager = void 0;
const formManager_1 = require("./formManager");
class OptionManager {
    constructor() {
        this.formManager = new formManager_1.FormManager();
    }
    // プレイリスト検索オプションを切り替えるメソッド
    togglePlaylistSearchOption() {
        this.toggleOption('playlistIdOption', 'playlistForm', 'searchForm');
        this.toggleOption('searchQueryOption', 'searchForm', 'playlistForm');
    }
    // オプションの切り替えを行うメソッド
    toggleOption(optionId, showFormId, hideFormId) {
        const option = document.getElementById(optionId);
        const showForm = document.getElementById(showFormId);
        const hideForm = document.getElementById(hideFormId);
        const labelForOption = document.querySelector(`label[for="${optionId}"]`);
        this.formManager.addChangeEventToOption(option, showForm, hideForm);
        // すべてのラジオボタンを取得
        const allOptions = document.querySelectorAll(`input[name="${option.name}"]`);
        allOptions.forEach((otherOption) => {
            otherOption.addEventListener('change', () => {
                if (otherOption !== option) {
                    // 他のラジオボタンが選択されたとき、このラジオボタンのスタイルをデフォルトに戻す
                    labelForOption.classList.remove('bg-green-500', 'text-white');
                    labelForOption.classList.add('bg-white', 'text-green-500');
                }
            });
        });
        option.addEventListener('change', () => {
            if (option.checked) {
                // ラジオボタンが選択されたとき、スタイルを変更
                labelForOption.classList.remove('bg-white', 'text-green-500');
                labelForOption.classList.add('bg-green-500', 'text-white');
            }
        });
    }
}
exports.OptionManager = OptionManager;
//# sourceMappingURL=optionManager.js.map