export class FormManager {
    // フォームの表示を切り替えるメソッド
    toggleFormVisibility(showForm: HTMLElement, hideForm: HTMLElement) {
        showForm.classList.remove('hidden');
        hideForm.classList.add('hidden');
    }
    
    // オプションの変更イベントを監視するメソッド
    addChangeEventToOption(option: HTMLInputElement, showForm: HTMLElement, hideForm: HTMLElement) {
        option.addEventListener('change', () => {
            if (option.checked) {
                this.toggleFormVisibility(showForm, hideForm);
            }
        });
    }
    
    // フォームに送信イベントを追加する
    addSubmitEventToForm(formId: string, handler: (event: Event) => void): void {
        const form = document.getElementById(formId) as HTMLFormElement;
        form.addEventListener('submit', handler.bind(this));
    }
}
