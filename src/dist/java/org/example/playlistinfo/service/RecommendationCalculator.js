export const calculateMode = (tracks) => {
    const modeCounts = {};
    let maxCount = 0;
    let mode = '';
    tracks.forEach(track => {
        let currentMode = track.audioFeatures.mode;
        modeCounts[currentMode] = (modeCounts[currentMode] || 0) + 1;
        if (modeCounts[currentMode] > maxCount) {
            maxCount = modeCounts[currentMode];
            mode = currentMode;
        }
    });
    // modeがメジャーであれば1を、マイナーであれば0を返す
    return mode === 'MAJOR' ? 1 : 0;
};
export const calculateModeArtistNames = (tracks) => {
    const artistFrequency = {};
    tracks.forEach(track => {
        const artistName = track.playlistTrack.track.artists[0].name;
        if (artistFrequency[artistName]) {
            artistFrequency[artistName]++;
        }
        else {
            artistFrequency[artistName] = 1;
        }
    });
    let modeArtistName = '';
    let maxCount = 0;
    for (const artistName in artistFrequency) {
        if (artistFrequency[artistName] > maxCount) {
            modeArtistName = artistName;
            maxCount = artistFrequency[artistName];
        }
    }
    return modeArtistName;
};
export const calculateAverageValues = (tracks) => {
    let totalTempo = 0;
    let totalKey = 0;
    let totalDanceability = 0;
    let totalEnergy = 0;
    let totalAcousticness = 0;
    let totalLiveness = 0;
    let totalSpeechiness = 0;
    let totalValence = 0;
    let totalTimeSignature = 0;
    let totalDurationMs = 0;
    let totalInstrumentalness = 0;
    let totalLoudness = 0;
    tracks.forEach(track => {
        totalTempo += track.audioFeatures.tempo;
        totalKey += track.audioFeatures.key;
        totalDanceability += track.audioFeatures.danceability;
        totalEnergy += track.audioFeatures.energy;
        totalAcousticness += track.audioFeatures.acousticness;
        totalLiveness += track.audioFeatures.liveness;
        totalSpeechiness += track.audioFeatures.speechiness;
        totalValence += track.audioFeatures.valence;
        totalTimeSignature += track.audioFeatures.timeSignature;
        totalDurationMs += track.audioFeatures.durationMs;
        totalInstrumentalness += track.audioFeatures.instrumentalness;
        totalLoudness += track.audioFeatures.loudness;
    });
    const trackCount = tracks.length;
    return {
        averageTempo: totalTempo / trackCount,
        modeKey: Math.round(totalKey / trackCount),
        averageDanceability: totalDanceability / trackCount,
        averageEnergy: totalEnergy / trackCount,
        averageAcousticness: totalAcousticness / trackCount,
        averageLiveness: totalLiveness / trackCount,
        averageSpeechiness: totalSpeechiness / trackCount,
        averageValence: totalValence / trackCount,
        timeSignature: Math.round(totalTimeSignature / trackCount),
        durationMs: Math.round(totalDurationMs / trackCount),
        instrumentalness: totalInstrumentalness / trackCount,
        loudness: totalLoudness / trackCount
    };
};
//# sourceMappingURL=RecommendationCalculator.js.map