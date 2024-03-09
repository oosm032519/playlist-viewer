"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingAnimationManager = void 0;
class LoadingAnimationManager {
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
exports.LoadingAnimationManager = LoadingAnimationManager;
//# sourceMappingURL=loadingAnimationManager.js.map