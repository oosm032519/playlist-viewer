"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormManager = void 0;
class FormManager {
    // フォームの表示を切り替えるメソッド
    toggleFormVisibility(showForm, hideForm) {
        showForm.classList.remove('hidden');
        hideForm.classList.add('hidden');
    }
    // オプションの変更イベントを監視するメソッド
    addChangeEventToOption(option, showForm, hideForm) {
        option.addEventListener('change', () => {
            if (option.checked) {
                this.toggleFormVisibility(showForm, hideForm);
            }
        });
    }
    // フォームに送信イベントを追加する
    addSubmitEventToForm(formId, handler) {
        const form = document.getElementById(formId);
        form.addEventListener('submit', handler.bind(this));
    }
}
exports.FormManager = FormManager;
//# sourceMappingURL=formManager.js.map