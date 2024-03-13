"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSignatureToString = exports.keyToNote = exports.formatDuration = void 0;
function formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
}
exports.formatDuration = formatDuration;
function keyToNote(key) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return notes[key];
}
exports.keyToNote = keyToNote;
function timeSignatureToString(timeSignature) {
    return timeSignature + "/4";
}
exports.timeSignatureToString = timeSignatureToString;
//# sourceMappingURL=utils.js.map