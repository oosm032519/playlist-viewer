export class FormManager {
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
//# sourceMappingURL=formManager.js.map