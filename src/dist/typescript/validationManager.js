export class ValidationManager {
    isValidData(data) {
        return data && Array.isArray(data.tracks);
    }
    validateData(data) {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
}
//# sourceMappingURL=validationManager.js.map