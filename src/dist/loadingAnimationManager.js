export class LoadingAnimationManager {
    // ローディングアニメーションを表示するメソッド
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }
    // ローディングアニメーションを非表示にするメソッド
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    toggleLoadingAnimation() {
        const loadingElement = document.getElementById('loading');
        loadingElement.classList.toggle('hidden');
    }
}
//# sourceMappingURL=loadingAnimationManager.js.map