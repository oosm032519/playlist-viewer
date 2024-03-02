var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SpotifyAuthorizer {
    authorize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/java/authorize');
                const uri = yield response.text();
                console.log("認証が完了しました");
                console.log(uri);
                window.location.href = uri;
            }
            catch (error) {
                console.error('There was a problem with the fetch operation: ', error);
            }
        });
    }
}
//# sourceMappingURL=spotifyAuthorizer.js.map