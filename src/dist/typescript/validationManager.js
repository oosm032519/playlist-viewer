"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationManager = void 0;
class ValidationManager {
    isValidData(data) {
        return data && Array.isArray(data.tracks);
    }
    validateData(data) {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
}
exports.ValidationManager = ValidationManager;
//# sourceMappingURL=validationManager.js.map