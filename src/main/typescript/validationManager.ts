export class ValidationManager {
    isValidData(data: any): boolean {
        return data && Array.isArray(data.tracks);
    }
    
    validateData(data: any): void {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
}
