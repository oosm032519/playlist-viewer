"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ;
function formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
}
function keyToNote(key) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return notes[key];
}
function timeSignatureToString(timeSignature) {
    return timeSignature + "/4";
}
exports.default = helperFunction;
Function;
//# sourceMappingURL=helperFunction.js.map